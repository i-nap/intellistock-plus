package com.intellistock.backend.inventory;

import com.intellistock.backend.common.response.ApiResponse;
import com.intellistock.backend.inventory.dto.AdjustStockRequest;
import com.intellistock.backend.inventory.dto.InventoryItemResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryItemResponse>>> listAll() {
        return ResponseEntity.ok(ApiResponse.success("Inventory retrieved", inventoryService.listAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryItemResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Inventory item retrieved", inventoryService.getById(id)));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<InventoryItemResponse>>> getLowStock() {
        return ResponseEntity.ok(ApiResponse.success("Low stock items retrieved", inventoryService.getLowStock()));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'WAREHOUSE_STAFF')")
    @PostMapping("/{id}/adjust")
    public ResponseEntity<ApiResponse<InventoryItemResponse>> adjustStock(
            @PathVariable Long id,
            @Valid @RequestBody AdjustStockRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(ApiResponse.success("Stock adjusted successfully",
                inventoryService.adjustStock(id, request, principal.getUsername())));
    }
}
