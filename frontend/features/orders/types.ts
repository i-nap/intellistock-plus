import type { Product } from "../products/types";
import type { Supplier } from "../suppliers/types";
import type { OrderStatus } from "@/constants/status";

export type { OrderStatus };

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  supplier: Supplier;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  notes?: string;
  expectedDelivery?: string;
  orderedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
  supplierId: number;
  items: OrderItemRequest[];
  notes?: string;
  expectedDelivery?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
