package com.intellistock.backend.order;

import com.intellistock.backend.reports.SupplierOrderSummaryProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<PurchaseOrder, Long> {
    Optional<PurchaseOrder> findByIdAndWarehouseId(Long id, Long warehouseId);
    List<PurchaseOrder> findByWarehouseIdOrderByCreatedAtDesc(Long warehouseId);
    List<PurchaseOrder> findByStatusAndWarehouseIdOrderByCreatedAtDesc(OrderStatus status, Long warehouseId);
    long countByStatusAndWarehouseId(OrderStatus status, Long warehouseId);

    @Query("SELECT o.supplier.name AS supplierName, COUNT(o) AS orderCount, COALESCE(SUM(o.totalAmount), 0) AS totalSpend, MAX(o.orderedAt) AS lastOrderDate FROM PurchaseOrder o WHERE o.warehouse.id = :warehouseId GROUP BY o.supplier.name ORDER BY SUM(o.totalAmount) DESC")
    List<SupplierOrderSummaryProjection> findSupplierOrderSummaryByWarehouse(@Param("warehouseId") Long warehouseId);

    // Used by reports for delivered orders spend
    @Query("SELECT o FROM PurchaseOrder o WHERE o.status = :status AND o.warehouse.id = :warehouseId ORDER BY o.createdAt DESC")
    List<PurchaseOrder> findByStatusAndWarehouseId(@Param("status") OrderStatus status, @Param("warehouseId") Long warehouseId);
}
