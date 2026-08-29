package com.intellistock.backend.product.dto;

import com.intellistock.backend.product.ProductUnit;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateProductRequest(
        @NotBlank(message = "Name is required") String name,
        @NotBlank(message = "SKU is required") String sku,
        String description,
        @NotBlank(message = "Category is required") String category,
        @NotNull(message = "Unit is required") ProductUnit unit,
        @NotNull(message = "Unit price is required") @DecimalMin(value = "0.00", message = "Price must be non-negative") BigDecimal unitPrice,
        @NotNull(message = "Initial quantity is required") @Min(value = 0, message = "Quantity must be non-negative") Integer initialQuantity,
        @NotNull(message = "Reorder threshold is required") @Min(value = 0, message = "Threshold must be non-negative") Integer reorderThreshold,
        @Min(value = 1, message = "Lead time must be at least 1 day") Integer leadTimeInDays,
        String location
) {}
