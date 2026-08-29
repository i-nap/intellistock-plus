package com.intellistock.backend.reorder.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record GenerateOrderRequest(
        @NotNull(message = "Supplier is required") Long supplierId,
        @NotEmpty(message = "At least one item is required") @Valid List<GenerateOrderItem> items
) {
    public record GenerateOrderItem(
            @NotNull Long inventoryItemId,
            @NotNull @Min(value = 1, message = "Quantity must be at least 1") Integer quantity
    ) {}
}
