import { z } from "zod";
import { PRODUCT_UNITS } from "./types";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  unit: z.enum(PRODUCT_UNITS),
  unitPrice: z.number().min(0, "Price must be non-negative"),
  initialQuantity: z.number().int().min(0, "Quantity must be non-negative"),
  reorderThreshold: z.number().int().min(0, "Threshold must be non-negative"),
  leadTimeInDays: z.number().int().min(1, "Lead time must be at least 1 day"),
  location: z.string().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  unit: z.enum(PRODUCT_UNITS),
  unitPrice: z.number().min(0, "Price must be non-negative"),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
