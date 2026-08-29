"use client";

import { useState, useEffect, useCallback } from "react";
import { listInventory, adjustStock } from "./api";
import { INVENTORY_MESSAGES } from "@/constants/messages";
import type { InventoryItem, AdjustStockRequest } from "./types";

function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message ?? fallback;
  }
  return err instanceof Error ? err.message : fallback;
}

export function useInventory() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await listInventory());
    } catch (err) {
      setError(extractError(err, INVENTORY_MESSAGES.LOAD_ERROR));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useAdjustStock() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function adjust(id: number, data: AdjustStockRequest): Promise<InventoryItem | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await adjustStock(id, data);
    } catch (err) {
      setError(extractError(err, INVENTORY_MESSAGES.ADJUST_ERROR));
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { adjust, isLoading, error };
}
