package com.intellistock.backend.supplier.dto;

import java.time.LocalDateTime;

public record SupplierResponse(
        Long id,
        String name,
        String email,
        String phone,
        String address,
        String contactPerson,
        String website,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
