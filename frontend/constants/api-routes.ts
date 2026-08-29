const API_BASE = "/api/v1";

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
    LOGOUT: `${API_BASE}/auth/logout`,
    ME: `${API_BASE}/auth/me`,
    VERIFY_OTP: `${API_BASE}/auth/verify-otp`,
    RESEND_OTP: `${API_BASE}/auth/resend-otp`,
  },
  PRODUCTS: {
    LIST: `${API_BASE}/products`,
    DETAIL: (id: number) => `${API_BASE}/products/${id}`,
  },
  INVENTORY: {
    LIST: `${API_BASE}/inventory`,
    DETAIL: (id: number) => `${API_BASE}/inventory/${id}`,
    ADJUST: (id: number) => `${API_BASE}/inventory/${id}/adjust`,
    LOW_STOCK: `${API_BASE}/inventory/low-stock`,
  },
  SUPPLIERS: {
    LIST: `${API_BASE}/suppliers`,
    DETAIL: (id: number) => `${API_BASE}/suppliers/${id}`,
  },
  ORDERS: {
    LIST: `${API_BASE}/orders`,
    DETAIL: (id: number) => `${API_BASE}/orders/${id}`,
    UPDATE_STATUS: (id: number) => `${API_BASE}/orders/${id}/status`,
  },
  REORDER: {
    RECOMMENDATIONS: `${API_BASE}/reorder/recommendations`,
    GENERATE_ORDER: `${API_BASE}/reorder/generate-order`,
  },
  DASHBOARD: {
    METRICS: `${API_BASE}/dashboard/metrics`,
    CHARTS: `${API_BASE}/dashboard/charts`,
    RECENT_ORDERS: `${API_BASE}/dashboard/recent-orders`,
  },
  REPORTS: {
    INVENTORY_SUMMARY: `${API_BASE}/reports/inventory-summary`,
    STOCK_MOVEMENTS: `${API_BASE}/reports/stock-movements`,
    ORDER_SUMMARY: `${API_BASE}/reports/order-summary`,
  },
  BILLING: {
    STATUS: `${API_BASE}/billing/status`,
    INITIATE: `${API_BASE}/billing/esewa/initiate`,
  },
  NOTIFICATIONS: {
    LIST: `${API_BASE}/notifications`,
    MARK_READ: (id: number) => `${API_BASE}/notifications/${id}/read`,
    MARK_ALL_READ: `${API_BASE}/notifications/read-all`,
  },
  USERS: {
    LIST: `${API_BASE}/users`,
    CREATE: `${API_BASE}/users`,
    UPDATE_ROLE: (id: number) => `${API_BASE}/users/${id}/role`,
    DELETE: (id: number) => `${API_BASE}/users/${id}`,
  },
} as const;
