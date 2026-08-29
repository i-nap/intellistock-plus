package com.intellistock.backend.reorder;

import com.intellistock.backend.common.constants.InventoryMovementType;
import com.intellistock.backend.common.constants.InventoryStatus;
import com.intellistock.backend.common.exception.ResourceNotFoundException;
import com.intellistock.backend.common.tenant.TenantContext;
import com.intellistock.backend.inventory.InventoryItem;
import com.intellistock.backend.inventory.InventoryLogRepository;
import com.intellistock.backend.inventory.InventoryRepository;
import com.intellistock.backend.inventory.ItemUsageProjection;
import com.intellistock.backend.notification.NotificationService;
import com.intellistock.backend.notification.NotificationType;
import com.intellistock.backend.order.OrderService;
import com.intellistock.backend.order.dto.CreateOrderRequest;
import com.intellistock.backend.order.dto.OrderItemRequest;
import com.intellistock.backend.order.dto.OrderResponse;
import com.intellistock.backend.reorder.dto.GenerateOrderRequest;
import com.intellistock.backend.reorder.dto.ReorderRecommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReorderService {

    private final InventoryRepository inventoryRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final OrderService orderService;
    private final NotificationService notificationService;

    private static final String REORDER_LINK = "/reorder";

    public List<ReorderRecommendation> listRecommendations() {
        Long wid = TenantContext.get();
        List<InventoryItem> items = inventoryRepository.findByStatusInAndProductWarehouseId(
                List.of(InventoryStatus.LOW_STOCK, InventoryStatus.OUT_OF_STOCK), wid);
        if (items.isEmpty()) {
            return List.of();
        }

        Map<Long, Long> usageByItem = recentUsage(items);
        return items.stream()
                .sorted(Comparator.comparingInt(item -> item.getQuantity() - item.getReorderThreshold()))
                .map(item -> toRecommendation(item, usageByItem.getOrDefault(item.getId(), 0L)))
                .toList();
    }

    /** Units sold per item over the demand window, keyed by inventory item id. */
    private Map<Long, Long> recentUsage(List<InventoryItem> items) {
        List<Long> ids = items.stream().map(InventoryItem::getId).toList();
        LocalDateTime from = LocalDateTime.now().minusDays(DemandCalculator.USAGE_WINDOW_DAYS);
        return inventoryLogRepository
                .sumUsageByItem(InventoryMovementType.SALE, from, ids)
                .stream()
                .collect(Collectors.toMap(ItemUsageProjection::getItemId, ItemUsageProjection::getUsage));
    }

    public OrderResponse generateOrder(GenerateOrderRequest request, String createdBy) {
        List<OrderItemRequest> items = request.items().stream()
                .map(item -> {
                    InventoryItem inv = inventoryRepository.findById(item.inventoryItemId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Inventory item not found: " + item.inventoryItemId()));
                    return new OrderItemRequest(
                            inv.getProduct().getId(),
                            item.quantity(),
                            inv.getProduct().getUnitPrice()
                    );
                })
                .toList();

        return orderService.createOrder(
                new CreateOrderRequest(request.supplierId(), items, null, null),
                createdBy
        );
    }

    @Scheduled(fixedRate = 21_600_000)
    @Transactional
    public void checkAndLogLowStock() {
        // Scheduled job runs globally across all warehouses
        List<InventoryItem> lowItems = inventoryRepository.findByStatusIn(
                List.of(InventoryStatus.LOW_STOCK, InventoryStatus.OUT_OF_STOCK));
        if (lowItems.isEmpty()) {
            log.info("[Reorder Engine] All stock levels are healthy.");
            return;
        }
        long raised = lowItems.stream().filter(this::notifyLowStock).count();
        log.warn("[Reorder Engine] {} item(s) need restocking across all warehouses, {} new alert(s).",
                lowItems.size(), raised);
    }

    /** Raises a stock alert for an item, unless an unread one is already outstanding. */
    private boolean notifyLowStock(InventoryItem item) {
        boolean out = item.getStatus() == InventoryStatus.OUT_OF_STOCK;
        String message = out
                ? "%s (%s) is out of stock.".formatted(item.getProduct().getName(), item.getProduct().getSku())
                : "%s (%s) is low: %d left, threshold %d.".formatted(
                        item.getProduct().getName(), item.getProduct().getSku(),
                        item.getQuantity(), item.getReorderThreshold());

        return notificationService.create(
                item.getProduct().getWarehouse().getId(),
                out ? NotificationType.OUT_OF_STOCK : NotificationType.LOW_STOCK,
                message,
                REORDER_LINK,
                item.getStatus().name() + ":" + item.getId());
    }

    private ReorderRecommendation toRecommendation(InventoryItem item, long unitsUsed) {
        double averageDailyUsage = DemandCalculator.averageDailyUsage(
                (int) unitsUsed, DemandCalculator.USAGE_WINDOW_DAYS);
        int leadTime = item.getLeadTimeInDays() == null
                ? DemandCalculator.DEFAULT_LEAD_TIME_DAYS
                : item.getLeadTimeInDays();
        int reorderLevel = DemandCalculator.reorderLevel(averageDailyUsage, leadTime);
        int suggested = DemandCalculator.suggestedQuantity(
                reorderLevel, item.getQuantity(), item.getReorderThreshold());

        return new ReorderRecommendation(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getSku(),
                item.getProduct().getCategory(),
                item.getQuantity(),
                item.getReorderThreshold(),
                Math.round(averageDailyUsage * 100) / 100d,
                leadTime,
                reorderLevel,
                suggested,
                item.getStatus().name()
        );
    }
}
