export type InventorySummaryReport = {
  totalProducts: number;
  totalUnits: number;
  totalValue: number;
  statusBreakdown: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
  topProductsByValue: {
    name: string;
    sku: string;
    quantity: number;
    value: number;
  }[];
  categoryBreakdown: {
    category: string;
    itemCount: number;
    totalQuantity: number;
    totalValue: number;
  }[];
};

export type StockMovementEntry = {
  id: number;
  date: string;
  productName: string;
  sku: string;
  movementType: string;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  note: string | null;
  performedBy: string | null;
};

export type OrderSummaryReport = {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalSpend: number;
  supplierBreakdown: {
    supplier: string;
    orderCount: number;
    totalSpend: number;
    lastOrderDate: string;
  }[];
};
