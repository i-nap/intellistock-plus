package com.intellistock.backend.inventory.dto;

import com.intellistock.backend.common.constants.InventoryMovementType;
import jakarta.validation.constraints.NotNull;

public record AdjustStockRequest(
        @NotNull(message = "Quantity change is required") Integer quantityChange,
        @NotNull(message = "Movement type is required") InventoryMovementType movementType,
        String note
) {}
