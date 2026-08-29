package com.intellistock.backend.common.tenant;

public final class TenantContext {

    private static final ThreadLocal<Long> WAREHOUSE_ID = new ThreadLocal<>();

    private TenantContext() {}

    public static void set(Long warehouseId) {
        WAREHOUSE_ID.set(warehouseId);
    }

    public static Long get() {
        return WAREHOUSE_ID.get();
    }

    public static void clear() {
        WAREHOUSE_ID.remove();
    }
}
