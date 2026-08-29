package com.intellistock.backend.notification;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    private static final Long WAREHOUSE_ID = 1L;
    private static final String KEY = "LOW_STOCK:42";

    @Mock private NotificationRepository notificationRepository;
    @InjectMocks private NotificationService notificationService;

    @Test
    void createsNotificationWhenNoUnreadDuplicateExists() {
        when(notificationRepository.existsByWarehouseIdAndDedupeKeyAndReadFalse(WAREHOUSE_ID, KEY))
                .thenReturn(false);

        boolean created = notificationService.create(
                WAREHOUSE_ID, NotificationType.LOW_STOCK, "Widget is low.", "/reorder", KEY);

        assertThat(created).isTrue();
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void suppressesDuplicateWhileEarlierAlertIsStillUnread() {
        when(notificationRepository.existsByWarehouseIdAndDedupeKeyAndReadFalse(WAREHOUSE_ID, KEY))
                .thenReturn(true);

        boolean created = notificationService.create(
                WAREHOUSE_ID, NotificationType.LOW_STOCK, "Widget is low.", "/reorder", KEY);

        assertThat(created).isFalse();
        verify(notificationRepository, never()).save(any(Notification.class));
    }

    @Test
    void alwaysWritesWhenNoDedupeKeyIsGiven() {
        boolean created = notificationService.create(
                WAREHOUSE_ID, NotificationType.ORDER_STATUS, "Order PO-1 is now DELIVERED.", "/orders", null);

        assertThat(created).isTrue();
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void skipsWhenWarehouseIsUnknown() {
        boolean created = notificationService.create(
                null, NotificationType.LOW_STOCK, "Widget is low.", "/reorder", KEY);

        assertThat(created).isFalse();
        verify(notificationRepository, never()).save(any(Notification.class));
    }
}
