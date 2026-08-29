import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.number().int().min(1, "Select a product"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Price must be non-negative"),
});

export const createOrderSchema = z.object({
  supplierId: z.number().int().min(1, "Select a supplier"),
  items: z.array(orderItemSchema).min(1, "Add at least one item"),
  notes: z.string().optional(),
  expectedDelivery: z.string().optional(),
});

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;
export type OrderItemFormValues = z.infer<typeof orderItemSchema>;
