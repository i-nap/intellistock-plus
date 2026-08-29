package com.intellistock.backend.reorder;

import com.intellistock.backend.common.response.ApiResponse;
import com.intellistock.backend.order.dto.OrderResponse;
import com.intellistock.backend.reorder.dto.GenerateOrderRequest;
import com.intellistock.backend.reorder.dto.ReorderRecommendation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reorder")
@RequiredArgsConstructor
public class ReorderController {

    private final ReorderService reorderService;

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<ReorderRecommendation>>> getRecommendations() {
        return ResponseEntity.ok(
                ApiResponse.success("Recommendations fetched", reorderService.listRecommendations()));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'WAREHOUSE_STAFF')")
    @PostMapping("/generate-order")
    public ResponseEntity<ApiResponse<OrderResponse>> generateOrder(
            @Valid @RequestBody GenerateOrderRequest request,
            Authentication auth) {
        OrderResponse order = reorderService.generateOrder(request, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Purchase order generated", order));
    }
}
