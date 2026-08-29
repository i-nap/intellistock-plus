package com.intellistock.backend.reports;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface SupplierOrderSummaryProjection {
    String getSupplierName();
    Long getOrderCount();
    BigDecimal getTotalSpend();
    LocalDateTime getLastOrderDate();
}
