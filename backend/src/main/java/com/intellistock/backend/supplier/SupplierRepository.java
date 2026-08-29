package com.intellistock.backend.supplier;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    long count();
    List<Supplier> findByWarehouseId(Long warehouseId);
    Optional<Supplier> findByIdAndWarehouseId(Long id, Long warehouseId);
    boolean existsByEmailAndWarehouseId(String email, Long warehouseId);
    boolean existsByEmailAndIdNotAndWarehouseId(String email, Long id, Long warehouseId);
    List<Supplier> findByWarehouseIdAndNameContainingIgnoreCaseOrWarehouseIdAndEmailContainingIgnoreCase(
            Long wid1, String name, Long wid2, String email);
}
