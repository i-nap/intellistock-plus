package com.intellistock.backend.user.dto;

import com.intellistock.backend.user.Role;
import com.intellistock.backend.user.User;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record UserResponse(
        Long id,
        String name,
        String email,
        String role,
        LocalDateTime createdAt
) {
    public static UserResponse from(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole().name())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
