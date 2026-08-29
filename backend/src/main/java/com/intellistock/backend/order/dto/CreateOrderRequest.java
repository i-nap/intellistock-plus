package com.intellistock.backend.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record CreateOrderRequest(
        @NotNull(message = "Supplier is required") Long supplierId,
        @NotEmpty(message = "At least one item is required") @Valid List<OrderItemRequest> items,
        String notes,
        LocalDate expectedDelivery
) {}
