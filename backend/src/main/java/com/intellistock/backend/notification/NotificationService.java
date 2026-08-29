package com.intellistock.backend.notification;

import com.intellistock.backend.common.exception.ResourceNotFoundException;
import com.intellistock.backend.common.tenant.TenantContext;
import com.intellistock.backend.notification.dto.NotificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Records a notification for a warehouse. When {@code dedupeKey} is non-null and an
     * unread notification already carries that key, nothing is written — the condition
     * has already been reported and not yet acknowledged.
     *
     * @return true when a notification was written
     */
    @Transactional
    public boolean create(Long warehouseId, NotificationType type, String message,
                          String link, String dedupeKey) {
        if (warehouseId == null) {
            return false;
        }
        if (dedupeKey != null
                && notificationRepository.existsByWarehouseIdAndDedupeKeyAndReadFalse(warehouseId, dedupeKey)) {
            return false;
        }
        notificationRepository.save(Notification.builder()
                .warehouseId(warehouseId)
                .type(type)
                .message(message)
                .link(link)
                .dedupeKey(dedupeKey)
                .build());
        return true;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> list() {
        return notificationRepository
                .findTop50ByWarehouseIdOrderByCreatedAtDesc(TenantContext.get())
                .stream()
                .map(NotificationService::toResponse)
                .toList();
    }

    @Transactional
    public NotificationResponse markRead(Long id) {
        Notification notification = notificationRepository
                .findByIdAndWarehouseId(id, TenantContext.get())
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public int markAllRead() {
        return notificationRepository.markAllRead(TenantContext.get());
    }

    private static NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(), n.getType(), n.getMessage(), n.getLink(), n.isRead(), n.getCreatedAt());
    }
}
