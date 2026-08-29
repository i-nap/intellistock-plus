export type ReorderRecommendation = {
  inventoryItemId: number;
  productId: number;
  productName: string;
  sku: string;
  category: string;
  currentQuantity: number;
  reorderThreshold: number;
  averageDailyUsage: number;
  leadTimeInDays: number;
  reorderLevel: number;
  suggestedQuantity: number;
  urgency: "LOW_STOCK" | "OUT_OF_STOCK";
};

export type GenerateOrderItem = {
  inventoryItemId: number;
  quantity: number;
};

export type GenerateOrderRequest = {
  supplierId: number;
  items: GenerateOrderItem[];
};
