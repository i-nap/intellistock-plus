package com.intellistock.backend.dashboard;

import com.intellistock.backend.common.constants.InventoryStatus;
import com.intellistock.backend.common.tenant.TenantContext;
import com.intellistock.backend.dashboard.dto.DashboardChartsResponse;
import com.intellistock.backend.dashboard.dto.DashboardMetricsResponse;
import com.intellistock.backend.dashboard.dto.DashboardMetricsResponse.SparklinePoint;
import com.intellistock.backend.dashboard.dto.RecentOrderSummary;
import com.intellistock.backend.inventory.InventoryLogRepository;
import com.intellistock.backend.inventory.InventoryRepository;
import com.intellistock.backend.order.OrderRepository;
import com.intellistock.backend.order.OrderStatus;
import com.intellistock.backend.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final OrderRepository orderRepository;

    private static final DateTimeFormatter CHART_DATE_FMT = DateTimeFormatter.ofPattern("MMM d");

    public DashboardMetricsResponse getMetrics() {
        Long wid = TenantContext.get();
        long totalProducts = productRepository.countByWarehouseId(wid);
        long lowStockItems = inventoryRepository.findByStatusInAndProductWarehouseId(
                List.of(InventoryStatus.LOW_STOCK, InventoryStatus.OUT_OF_STOCK), wid).size();
        long pendingOrders = orderRepository.countByStatusAndWarehouseId(OrderStatus.PENDING, wid);
        double inventoryValue = inventoryRepository.findByProductWarehouseId(wid).stream()
                .mapToDouble(i -> i.getQuantity() * i.getProduct().getUnitPrice().doubleValue())
                .sum();

        List<SparklinePoint> productSparkline = new ArrayList<>();
        List<SparklinePoint> lowStockSparkline = new ArrayList<>();
        List<SparklinePoint> pendingSparkline = new ArrayList<>();
        List<SparklinePoint> valueSparkline = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDateTime cutoff = LocalDate.now().minusDays(i).atTime(23, 59, 59);
            long productsOnDay = productRepository.countByWarehouseIdAndCreatedAtLessThanEqual(wid, cutoff);
            productSparkline.add(new SparklinePoint((int) productsOnDay));
            lowStockSparkline.add(new SparklinePoint((int) lowStockItems));
            pendingSparkline.add(new SparklinePoint((int) pendingOrders));
            valueSparkline.add(new SparklinePoint((int) (inventoryValue / 1000)));
        }

        return new DashboardMetricsResponse(
                totalProducts, lowStockItems, pendingOrders, inventoryValue,
                new DashboardMetricsResponse.Sparklines(
                        productSparkline, lowStockSparkline, pendingSparkline, valueSparkline));
    }

    public DashboardChartsResponse getCharts() {
        Long wid = TenantContext.get();
        long currentTotal = inventoryRepository.findByProductWarehouseId(wid).stream()
                .mapToLong(i -> i.getQuantity())
                .sum();

        List<DashboardChartsResponse.StockTrendPoint> trend = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = LocalDate.now().minusDays(i);
            LocalDateTime endOfDay = day.atTime(23, 59, 59);
            long changesAfter = inventoryLogRepository.sumQuantityChangesAfterInWarehouse(endOfDay, wid);
            long totalOnDay = Math.max(currentTotal - changesAfter, 0);
            trend.add(new DashboardChartsResponse.StockTrendPoint(day.format(CHART_DATE_FMT), totalOnDay));
        }

        List<DashboardChartsResponse.CategoryStockPoint> categories = inventoryRepository
                .findCategoryStockByWarehouse(wid)
                .stream()
                .map(p -> new DashboardChartsResponse.CategoryStockPoint(
                        p.getCategory() != null ? p.getCategory() : "Other",
                        p.getStock() != null ? p.getStock() : 0L))
                .toList();

        return new DashboardChartsResponse(trend, categories);
    }

    public List<RecentOrderSummary> getRecentOrders() {
        Long wid = TenantContext.get();
        return orderRepository.findByWarehouseIdOrderByCreatedAtDesc(wid).stream()
                .limit(5)
                .map(order -> new RecentOrderSummary(
                        order.getOrderNumber() != null ? order.getOrderNumber() : "#" + order.getId(),
                        order.getSupplier().getName(),
                        order.getItems().size(),
                        order.getTotalAmount().doubleValue(),
                        order.getStatus().name(),
                        order.getOrderedAt().toLocalDate().format(CHART_DATE_FMT)))
                .toList();
    }
}
