package com.intellistock.backend.reports.dto;

public record StockMovementEntry(
        Long id,
        String date,
        String productName,
        String sku,
        String movementType,
        int quantityChange,
        int previousQuantity,
        int newQuantity,
        String note,
        String performedBy
) {}
