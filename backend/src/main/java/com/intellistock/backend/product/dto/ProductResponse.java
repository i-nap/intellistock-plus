package com.intellistock.backend.product.dto;

import com.intellistock.backend.product.ProductUnit;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String name,
        String sku,
        String description,
        String category,
        ProductUnit unit,
        BigDecimal unitPrice,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
