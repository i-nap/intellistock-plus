package com.intellistock.backend.reorder.dto;

public record ReorderRecommendation(
        Long inventoryItemId,
        Long productId,
        String productName,
        String sku,
        String category,
        int currentQuantity,
        int reorderThreshold,
        double averageDailyUsage,
        int leadTimeInDays,
        int reorderLevel,
        int suggestedQuantity,
        String urgency
) {}
