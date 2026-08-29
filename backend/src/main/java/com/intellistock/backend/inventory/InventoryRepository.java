package com.intellistock.backend.inventory;

import com.intellistock.backend.common.constants.InventoryStatus;
import com.intellistock.backend.dashboard.CategoryStockProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    Optional<InventoryItem> findByProductId(Long productId);
    Optional<InventoryItem> findByIdAndProductWarehouseId(Long id, Long warehouseId);

    List<InventoryItem> findByProductWarehouseId(Long warehouseId);
    List<InventoryItem> findByStatusAndProductWarehouseId(InventoryStatus status, Long warehouseId);
    List<InventoryItem> findByStatusInAndProductWarehouseId(List<InventoryStatus> statuses, Long warehouseId);

    // Used by scheduled job only (no warehouse filter)
    List<InventoryItem> findByStatusIn(List<InventoryStatus> statuses);

    @Query("SELECT p.category AS category, SUM(i.quantity) AS stock FROM InventoryItem i JOIN i.product p WHERE p.warehouse.id = :warehouseId GROUP BY p.category ORDER BY SUM(i.quantity) DESC")
    List<CategoryStockProjection> findCategoryStockByWarehouse(@Param("warehouseId") Long warehouseId);
}
