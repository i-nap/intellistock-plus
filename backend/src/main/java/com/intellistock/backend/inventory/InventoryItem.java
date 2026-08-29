package com.intellistock.backend.inventory;

import com.intellistock.backend.common.constants.InventoryStatus;
import com.intellistock.backend.product.Product;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "reorder_threshold", nullable = false)
    private Integer reorderThreshold;

    @Column(length = 100)
    private String location;

    /** Days between placing a purchase order and stock arriving; drives the reorder level. */
    @Column(name = "lead_time_in_days")
    private Integer leadTimeInDays;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InventoryStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void recalculateStatus() {
        if (quantity <= 0) {
            status = InventoryStatus.OUT_OF_STOCK;
        } else if (quantity <= reorderThreshold) {
            status = InventoryStatus.LOW_STOCK;
        } else {
            status = InventoryStatus.IN_STOCK;
        }
    }
}
