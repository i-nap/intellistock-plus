package com.intellistock.backend.order.dto;

import com.intellistock.backend.order.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
        @NotNull(message = "Status is required") OrderStatus status
) {}
