package com.intellistock.backend.product.dto;

import com.intellistock.backend.product.ProductUnit;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record UpdateProductRequest(
        @NotBlank(message = "Name is required") String name,
        @NotBlank(message = "SKU is required") String sku,
        String description,
        @NotBlank(message = "Category is required") String category,
        @NotNull(message = "Unit is required") ProductUnit unit,
        @NotNull(message = "Unit price is required") @DecimalMin(value = "0.00", message = "Price must be non-negative") BigDecimal unitPrice
) {}
