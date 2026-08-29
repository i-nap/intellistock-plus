package com.intellistock.backend.reports;

import com.intellistock.backend.common.response.ApiResponse;
import com.intellistock.backend.reports.dto.InventorySummaryReport;
import com.intellistock.backend.reports.dto.OrderSummaryReport;
import com.intellistock.backend.reports.dto.StockMovementEntry;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportsController {

    private final ReportsService reportsService;

    @GetMapping("/inventory-summary")
    public ResponseEntity<ApiResponse<InventorySummaryReport>> getInventorySummary() {
        return ResponseEntity.ok(ApiResponse.success("OK", reportsService.getInventorySummary()));
    }

    @GetMapping("/stock-movements")
    public ResponseEntity<ApiResponse<List<StockMovementEntry>>> getStockMovements(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.success("OK", reportsService.getStockMovements(days)));
    }

    @GetMapping("/order-summary")
    public ResponseEntity<ApiResponse<OrderSummaryReport>> getOrderSummary() {
        return ResponseEntity.ok(ApiResponse.success("OK", reportsService.getOrderSummary()));
    }
}
