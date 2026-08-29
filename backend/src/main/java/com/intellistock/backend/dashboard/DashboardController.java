package com.intellistock.backend.dashboard;

import com.intellistock.backend.common.response.ApiResponse;
import com.intellistock.backend.dashboard.dto.DashboardChartsResponse;
import com.intellistock.backend.dashboard.dto.DashboardMetricsResponse;
import com.intellistock.backend.dashboard.dto.RecentOrderSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<DashboardMetricsResponse>> getMetrics() {
        return ResponseEntity.ok(ApiResponse.success("OK", dashboardService.getMetrics()));
    }

    @GetMapping("/charts")
    public ResponseEntity<ApiResponse<DashboardChartsResponse>> getCharts() {
        return ResponseEntity.ok(ApiResponse.success("OK", dashboardService.getCharts()));
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<ApiResponse<List<RecentOrderSummary>>> getRecentOrders() {
        return ResponseEntity.ok(ApiResponse.success("OK", dashboardService.getRecentOrders()));
    }
}
