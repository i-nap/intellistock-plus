package com.intellistock.backend.dashboard.dto;

import java.util.List;

public record DashboardChartsResponse(
        List<StockTrendPoint> stockTrend,
        List<CategoryStockPoint> categoryStock
) {
    public record StockTrendPoint(String date, long value) {}
    public record CategoryStockPoint(String category, long stock) {}
}
