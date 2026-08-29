package com.intellistock.backend.order.dto;

import com.intellistock.backend.order.OrderStatus;
import com.intellistock.backend.supplier.dto.SupplierResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        SupplierResponse supplier,
        OrderStatus status,
        List<OrderItemResponse> items,
        BigDecimal totalAmount,
        String notes,
        LocalDate expectedDelivery,
        LocalDateTime orderedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String createdBy
) {}
