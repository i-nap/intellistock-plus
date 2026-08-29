package com.intellistock.backend.user.dto;

import com.intellistock.backend.user.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRoleRequest {
    @NotNull
    private Role role;
}
