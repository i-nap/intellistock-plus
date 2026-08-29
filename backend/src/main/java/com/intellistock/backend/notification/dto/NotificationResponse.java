package com.intellistock.backend.notification.dto;

import com.intellistock.backend.notification.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        NotificationType type,
        String message,
        String link,
        boolean read,
        LocalDateTime createdAt
) {}
