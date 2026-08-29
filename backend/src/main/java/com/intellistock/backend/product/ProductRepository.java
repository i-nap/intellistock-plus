package com.intellistock.backend.product;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByWarehouseId(Long warehouseId);
    Optional<Product> findByIdAndWarehouseId(Long id, Long warehouseId);
    boolean existsBySkuAndWarehouseId(String sku, Long warehouseId);
    boolean existsBySkuAndIdNotAndWarehouseId(String sku, Long id, Long warehouseId);
    List<Product> findByWarehouseIdAndNameContainingIgnoreCaseOrWarehouseIdAndSkuContainingIgnoreCase(
            Long wid1, String name, Long wid2, String sku);
    long countByWarehouseId(Long warehouseId);
    long countByWarehouseIdAndCreatedAtLessThanEqual(Long warehouseId, LocalDateTime cutoff);
}
