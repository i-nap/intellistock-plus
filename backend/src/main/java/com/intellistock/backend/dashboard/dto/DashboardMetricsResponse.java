package com.intellistock.backend.dashboard.dto;

import java.util.List;

public record DashboardMetricsResponse(
        long totalProducts,
        long lowStockItems,
        long pendingOrders,
        double inventoryValue,
        Sparklines sparklines
) {
    public record SparklinePoint(int v) {}

    public record Sparklines(
            List<SparklinePoint> totalProducts,
            List<SparklinePoint> lowStockItems,
            List<SparklinePoint> pendingOrders,
            List<SparklinePoint> inventoryValue
    ) {}
}
