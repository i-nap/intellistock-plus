package com.intellistock.backend.reports;

import com.intellistock.backend.common.constants.InventoryStatus;
import com.intellistock.backend.common.tenant.TenantContext;
import com.intellistock.backend.inventory.InventoryItem;
import com.intellistock.backend.inventory.InventoryLogRepository;
import com.intellistock.backend.inventory.InventoryRepository;
import com.intellistock.backend.order.OrderRepository;
import com.intellistock.backend.order.OrderStatus;
import com.intellistock.backend.reports.dto.InventorySummaryReport;
import com.intellistock.backend.reports.dto.OrderSummaryReport;
import com.intellistock.backend.reports.dto.StockMovementEntry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportsService {

    private final InventoryRepository inventoryRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final OrderRepository orderRepository;

    private static final DateTimeFormatter DISPLAY_FMT = DateTimeFormatter.ofPattern("MMM d, yyyy HH:mm");
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("MMM d, yyyy");

    public InventorySummaryReport getInventorySummary() {
        Long wid = TenantContext.get();
        List<InventoryItem> items = inventoryRepository.findByProductWarehouseId(wid);

        long totalProducts = items.size();
        long totalUnits = items.stream().mapToLong(InventoryItem::getQuantity).sum();
        double totalValue = items.stream()
                .mapToDouble(i -> i.getQuantity() * i.getProduct().getUnitPrice().doubleValue())
                .sum();

        long inStock = items.stream().filter(i -> i.getStatus() == InventoryStatus.IN_STOCK).count();
        long lowStock = items.stream().filter(i -> i.getStatus() == InventoryStatus.LOW_STOCK).count();
        long outOfStock = items.stream().filter(i -> i.getStatus() == InventoryStatus.OUT_OF_STOCK).count();

        List<InventorySummaryReport.TopProduct> topProducts = items.stream()
                .sorted(Comparator.comparingDouble(
                        (InventoryItem i) -> i.getQuantity() * i.getProduct().getUnitPrice().doubleValue())
                        .reversed())
                .limit(5)
                .map(i -> new InventorySummaryReport.TopProduct(
                        i.getProduct().getName(),
                        i.getProduct().getSku(),
                        i.getQuantity(),
                        i.getQuantity() * i.getProduct().getUnitPrice().doubleValue()))
                .toList();

        Map<String, List<InventoryItem>> byCategory = items.stream()
                .collect(Collectors.groupingBy(i ->
                        i.getProduct().getCategory() != null ? i.getProduct().getCategory() : "Uncategorized"));

        List<InventorySummaryReport.CategoryBreakdown> categoryBreakdown = byCategory.entrySet().stream()
                .map(e -> {
                    List<InventoryItem> group = e.getValue();
                    long qty = group.stream().mapToLong(InventoryItem::getQuantity).sum();
                    double val = group.stream()
                            .mapToDouble(i -> i.getQuantity() * i.getProduct().getUnitPrice().doubleValue())
                            .sum();
                    return new InventorySummaryReport.CategoryBreakdown(e.getKey(), group.size(), qty, val);
                })
                .sorted(Comparator.comparingDouble(InventorySummaryReport.CategoryBreakdown::totalValue).reversed())
                .toList();

        return new InventorySummaryReport(
                totalProducts, totalUnits, totalValue,
                new InventorySummaryReport.StatusBreakdown(inStock, lowStock, outOfStock),
                topProducts, categoryBreakdown);
    }

    public List<StockMovementEntry> getStockMovements(int days) {
        Long wid = TenantContext.get();
        LocalDateTime from = LocalDate.now().minusDays(days).atStartOfDay();
        return inventoryLogRepository.findRecentWithProductsInWarehouse(from, wid).stream()
                .map(l -> new StockMovementEntry(
                        l.getId(),
                        l.getCreatedAt().format(DISPLAY_FMT),
                        l.getInventoryItem().getProduct().getName(),
                        l.getInventoryItem().getProduct().getSku(),
                        l.getMovementType().name(),
                        l.getQuantityChange(),
                        l.getPreviousQuantity(),
                        l.getNewQuantity(),
                        l.getNote(),
                        l.getCreatedBy()))
                .toList();
    }

    public OrderSummaryReport getOrderSummary() {
        Long wid = TenantContext.get();
        long total = orderRepository.findByWarehouseIdOrderByCreatedAtDesc(wid).size();
        long pending = orderRepository.countByStatusAndWarehouseId(OrderStatus.PENDING, wid);
        long processing = orderRepository.countByStatusAndWarehouseId(OrderStatus.PROCESSING, wid);
        long delivered = orderRepository.countByStatusAndWarehouseId(OrderStatus.DELIVERED, wid);
        long cancelled = orderRepository.countByStatusAndWarehouseId(OrderStatus.CANCELLED, wid);

        double totalSpend = orderRepository.findByStatusAndWarehouseId(OrderStatus.DELIVERED, wid).stream()
                .mapToDouble(o -> o.getTotalAmount().doubleValue())
                .sum();

        List<OrderSummaryReport.SupplierSummary> supplierBreakdown =
                orderRepository.findSupplierOrderSummaryByWarehouse(wid).stream()
                        .map(p -> new OrderSummaryReport.SupplierSummary(
                                p.getSupplierName(),
                                p.getOrderCount(),
                                p.getTotalSpend() != null ? p.getTotalSpend().doubleValue() : 0.0,
                                p.getLastOrderDate() != null ? p.getLastOrderDate().toLocalDate().format(DATE_FMT) : "—"))
                        .toList();

        return new OrderSummaryReport(total, pending, processing, delivered, cancelled, totalSpend, supplierBreakdown);
    }
}
