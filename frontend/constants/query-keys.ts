export const QUERY_KEYS = {
  DASHBOARD: {
    METRICS: ["dashboard", "metrics"],
    CHARTS: ["dashboard", "charts"],
    REORDER_ALERTS: ["dashboard", "reorder-alerts"],
    RECENT_ORDERS: ["dashboard", "recent-orders"],
  },
  INVENTORY: {
    LIST: ["inventory"],
    DETAIL: (id: number) => ["inventory", id],
  },
  PRODUCTS: {
    LIST: ["products"],
    DETAIL: (id: number) => ["products", id],
  },
  SUPPLIERS: {
    LIST: ["suppliers"],
    DETAIL: (id: number) => ["suppliers", id],
  },
  ORDERS: {
    LIST: ["orders"],
    DETAIL: (id: number) => ["orders", id],
  },
} as const;
