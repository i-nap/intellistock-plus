package com.intellistock.backend.reports.dto;

import java.util.List;

public record InventorySummaryReport(
        long totalProducts,
        long totalUnits,
        double totalValue,
        StatusBreakdown statusBreakdown,
        List<TopProduct> topProductsByValue,
        List<CategoryBreakdown> categoryBreakdown
) {
    public record StatusBreakdown(long inStock, long lowStock, long outOfStock) {}

    public record TopProduct(String name, String sku, int quantity, double value) {}

    public record CategoryBreakdown(
            String category,
            long itemCount,
            long totalQuantity,
            double totalValue
    ) {}
}
