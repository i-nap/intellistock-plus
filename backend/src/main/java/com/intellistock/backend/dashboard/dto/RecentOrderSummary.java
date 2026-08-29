package com.intellistock.backend.dashboard.dto;

public record RecentOrderSummary(
        String id,
        String supplier,
        int items,
        double total,
        String status,
        String date
) {}
