package com.intellistock.backend.supplier.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateSupplierRequest(
        @NotBlank(message = "Supplier name is required") String name,
        @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,
        String phone,
        String address,
        String contactPerson,
        String website
) {}
