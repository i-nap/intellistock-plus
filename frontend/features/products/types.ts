export const PRODUCT_UNITS = ["PIECE", "BOX", "KG", "LITER", "METER"] as const;
export type ProductUnit = (typeof PRODUCT_UNITS)[number];

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  category: string;
  unit: ProductUnit;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  description?: string;
  category: string;
  unit: ProductUnit;
  unitPrice: number;
  initialQuantity: number;
  reorderThreshold: number;
  leadTimeInDays: number;
  location?: string;
}

export interface UpdateProductRequest {
  name: string;
  sku: string;
  description?: string;
  category: string;
  unit: ProductUnit;
  unitPrice: number;
}
