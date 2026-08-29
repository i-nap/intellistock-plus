package com.intellistock.backend.notification;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "warehouse_id", nullable = false)
    private Long warehouseId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false, length = 500)
    private String message;

    /** Frontend route this notification points at, e.g. "/reorder". */
    private String link;

    /**
     * Identity of the underlying condition, e.g. "LOW_STOCK:42". A new notification is
     * suppressed while an unread one with the same key exists, so the recurring
     * low-stock sweep does not pile up duplicates.
     */
    @Column(name = "dedupe_key", length = 120)
    private String dedupeKey;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private boolean read = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
