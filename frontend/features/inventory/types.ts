import type { Product } from "../products/types";

export const INVENTORY_MOVEMENT_TYPES = ["RESTOCK", "ADJUSTMENT", "SALE"] as const;
export type InventoryMovementType = (typeof INVENTORY_MOVEMENT_TYPES)[number];

export type InventoryStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export interface InventoryItem {
  id: number;
  product: Product;
  quantity: number;
  reorderThreshold: number;
  leadTimeInDays: number | null;
  location?: string;
  status: InventoryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdjustStockRequest {
  quantityChange: number;
  movementType: InventoryMovementType;
  note?: string;
}
