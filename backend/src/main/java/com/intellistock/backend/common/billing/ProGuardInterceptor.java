package com.intellistock.backend.common.billing;

import com.intellistock.backend.common.exception.AppException;
import com.intellistock.backend.common.tenant.TenantContext;
import com.intellistock.backend.warehouse.Plan;
import com.intellistock.backend.warehouse.Warehouse;
import com.intellistock.backend.warehouse.WarehouseRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Blocks Pro-only features (Reports, Team) for FREE warehouses.
 * Registered against those path prefixes in {@code WebMvcConfig}.
 * ponytail: one DB lookup per gated request; add a per-request plan cache if it shows up in profiling.
 */
@Component
@RequiredArgsConstructor
public class ProGuardInterceptor implements HandlerInterceptor {

    private final WarehouseRepository warehouseRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Let CORS preflight through untouched.
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) return true;

        Long warehouseId = TenantContext.get();
        if (warehouseId == null) return true; // unauthenticated path handled elsewhere

        Plan plan = warehouseRepository.findById(warehouseId)
                .map(Warehouse::getPlan)
                .orElse(Plan.FREE);

        if (plan != Plan.PRO) {
            throw new AppException("Upgrade to Pro to use this feature", HttpStatus.PAYMENT_REQUIRED);
        }
        return true;
    }
}
