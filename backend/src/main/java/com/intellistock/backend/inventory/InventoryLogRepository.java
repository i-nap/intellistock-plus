package com.intellistock.backend.inventory;

import com.intellistock.backend.common.constants.InventoryMovementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
    List<InventoryLog> findByInventoryItemIdOrderByCreatedAtDesc(Long inventoryItemId);
    void deleteByInventoryItemId(Long inventoryItemId);

    @Query("SELECT COALESCE(SUM(l.quantityChange), 0) FROM InventoryLog l WHERE l.createdAt > :after AND l.inventoryItem.product.warehouse.id = :warehouseId")
    Long sumQuantityChangesAfterInWarehouse(@Param("after") LocalDateTime after, @Param("warehouseId") Long warehouseId);

    @Query("SELECT l FROM InventoryLog l JOIN FETCH l.inventoryItem i JOIN FETCH i.product p WHERE l.createdAt >= :from AND p.warehouse.id = :warehouseId ORDER BY l.createdAt DESC")
    List<InventoryLog> findRecentWithProductsInWarehouse(@Param("from") LocalDateTime from, @Param("warehouseId") Long warehouseId);

    /**
     * Units consumed per item since {@code from}. SALE movements are stored as negative
     * quantity changes, so the sum is negated to give a positive usage figure.
     */
    @Query("SELECT l.inventoryItem.id AS itemId, -COALESCE(SUM(l.quantityChange), 0) AS usage "
            + "FROM InventoryLog l "
            + "WHERE l.movementType = :movementType AND l.createdAt >= :from AND l.inventoryItem.id IN :itemIds "
            + "GROUP BY l.inventoryItem.id")
    List<ItemUsageProjection> sumUsageByItem(@Param("movementType") InventoryMovementType movementType,
                                             @Param("from") LocalDateTime from,
                                             @Param("itemIds") List<Long> itemIds);
}
