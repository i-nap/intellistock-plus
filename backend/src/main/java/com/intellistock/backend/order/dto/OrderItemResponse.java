package com.intellistock.backend.order.dto;

import com.intellistock.backend.product.dto.ProductResponse;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        ProductResponse product,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) {}
