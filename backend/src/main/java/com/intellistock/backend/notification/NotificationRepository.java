package com.intellistock.backend.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findTop50ByWarehouseIdOrderByCreatedAtDesc(Long warehouseId);

    Optional<Notification> findByIdAndWarehouseId(Long id, Long warehouseId);

    boolean existsByWarehouseIdAndDedupeKeyAndReadFalse(Long warehouseId, String dedupeKey);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Notification n SET n.read = true WHERE n.warehouseId = :warehouseId AND n.read = false")
    int markAllRead(@Param("warehouseId") Long warehouseId);
}
