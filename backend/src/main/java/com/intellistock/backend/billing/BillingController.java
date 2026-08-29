package com.intellistock.backend.billing;

import com.intellistock.backend.billing.dto.BillingStatusResponse;
import com.intellistock.backend.billing.dto.EsewaFormResponse;
import com.intellistock.backend.common.exception.AppException;
import com.intellistock.backend.common.response.ApiResponse;
import com.intellistock.backend.common.tenant.TenantContext;
import com.intellistock.backend.warehouse.Warehouse;
import com.intellistock.backend.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/v1/billing")
@RequiredArgsConstructor
public class BillingController {

    private final EsewaService esewaService;
    private final WarehouseRepository warehouseRepository;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<BillingStatusResponse>> status() {
        Warehouse warehouse = warehouseRepository.findById(TenantContext.get())
                .orElseThrow(() -> new AppException("Warehouse not found"));
        return ResponseEntity.ok(ApiResponse.success(
                "Billing status", new BillingStatusResponse(warehouse.getPlan().name())));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/esewa/initiate")
    public ResponseEntity<ApiResponse<EsewaFormResponse>> initiate() {
        return ResponseEntity.ok(ApiResponse.success(
                "Payment initiated", esewaService.initiate(TenantContext.get())));
    }

    // ── eSewa browser redirects (no JWT — verified by signature) ────────────

    @GetMapping("/esewa/success")
    public RedirectView success(@RequestParam("data") String data) {
        try {
            esewaService.handleSuccess(data);
            return new RedirectView(frontendUrl + "/billing?status=success");
        } catch (Exception e) {
            return new RedirectView(frontendUrl + "/billing?status=error");
        }
    }

    @GetMapping("/esewa/failure")
    public RedirectView failure(@RequestParam(value = "transaction_uuid", required = false) String txnUuid) {
        esewaService.handleFailure(txnUuid);
        return new RedirectView(frontendUrl + "/billing?status=failure");
    }
}
