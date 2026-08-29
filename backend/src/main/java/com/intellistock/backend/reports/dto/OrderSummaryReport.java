package com.intellistock.backend.reports.dto;

import java.util.List;

public record OrderSummaryReport(
        long totalOrders,
        long pendingOrders,
        long processingOrders,
        long deliveredOrders,
        long cancelledOrders,
        double totalSpend,
        List<SupplierSummary> supplierBreakdown
) {
    public record SupplierSummary(
            String supplier,
            long orderCount,
            double totalSpend,
            String lastOrderDate
    ) {}
}
