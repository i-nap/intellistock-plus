"use client";

import { useState, useEffect, useCallback } from "react";
import { listOrders, createOrder, updateOrderStatus } from "./api";
import { ORDER_MESSAGES } from "@/constants/messages";
import type { Order, CreateOrderRequest, UpdateOrderStatusRequest } from "./types";
import type { OrderStatus } from "@/constants/status";

function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message ?? fallback;
  }
  return err instanceof Error ? err.message : fallback;
}

export function useOrders(status?: OrderStatus) {
  const [data, setData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await listOrders(status));
    } catch (err) {
      setError(extractError(err, ORDER_MESSAGES.LOAD_ERROR));
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useCreateOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(data: CreateOrderRequest): Promise<Order | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await createOrder(data);
    } catch (err) {
      setError(extractError(err, ORDER_MESSAGES.CREATE_ERROR));
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { create, isLoading, error };
}

export function useUpdateOrderStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(id: number, data: UpdateOrderStatusRequest): Promise<Order | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await updateOrderStatus(id, data);
    } catch (err) {
      setError(extractError(err, ORDER_MESSAGES.STATUS_ERROR));
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { updateStatus, isLoading, error };
}
