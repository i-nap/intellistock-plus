package com.intellistock.backend.inventory.dto;

import com.intellistock.backend.common.constants.InventoryStatus;
import com.intellistock.backend.product.dto.ProductResponse;

import java.time.LocalDateTime;

public record InventoryItemResponse(
        Long id,
        ProductResponse product,
        Integer quantity,
        Integer reorderThreshold,
        Integer leadTimeInDays,
        String location,
        InventoryStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
