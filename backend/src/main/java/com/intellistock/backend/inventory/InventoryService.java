package com.intellistock.backend.inventory;

import com.intellistock.backend.common.constants.InventoryStatus;
import com.intellistock.backend.common.exception.AppException;
import com.intellistock.backend.common.exception.ResourceNotFoundException;
import com.intellistock.backend.common.tenant.TenantContext;
import com.intellistock.backend.inventory.dto.AdjustStockRequest;
import com.intellistock.backend.inventory.dto.InventoryItemResponse;
import com.intellistock.backend.inventory.mapper.InventoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final InventoryMapper inventoryMapper;

    public List<InventoryItemResponse> listAll() {
        return inventoryRepository.findByProductWarehouseId(TenantContext.get()).stream()
                .map(inventoryMapper::toResponse)
                .toList();
    }

    public InventoryItemResponse getById(Long id) {
        return inventoryMapper.toResponse(findById(id));
    }

    public List<InventoryItemResponse> getLowStock() {
        return inventoryRepository.findByStatusAndProductWarehouseId(InventoryStatus.LOW_STOCK, TenantContext.get()).stream()
                .map(inventoryMapper::toResponse)
                .toList();
    }

    @Transactional
    public InventoryItemResponse adjustStock(Long id, AdjustStockRequest request, String performedBy) {
        InventoryItem item = findById(id);
        int previousQty = item.getQuantity();
        int newQty = previousQty + request.quantityChange();

        if (newQty < 0) {
            throw new AppException("Stock cannot go below zero. Current stock: " + previousQty);
        }

        item.setQuantity(newQty);
        item.recalculateStatus();
        inventoryRepository.save(item);

        inventoryLogRepository.save(InventoryLog.builder()
                .inventoryItem(item)
                .movementType(request.movementType())
                .quantityChange(request.quantityChange())
                .previousQuantity(previousQty)
                .newQuantity(newQty)
                .note(request.note())
                .createdBy(performedBy)
                .build());

        log.info("Stock adjusted for '{}': {} -> {} ({})",
                item.getProduct().getName(), previousQty, newQty, request.movementType());
        return inventoryMapper.toResponse(item);
    }

    private InventoryItem findById(Long id) {
        return inventoryRepository.findByIdAndProductWarehouseId(id, TenantContext.get())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));
    }
}
