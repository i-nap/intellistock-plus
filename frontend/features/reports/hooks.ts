"use client";

import { useState, useEffect, useCallback } from "react";
import { getInventorySummary, getStockMovements, getOrderSummary } from "./api";
import type { InventorySummaryReport, StockMovementEntry, OrderSummaryReport } from "./types";

function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message ?? fallback;
  }
  return err instanceof Error ? err.message : fallback;
}

export function useInventorySummary() {
  const [data, setData] = useState<InventorySummaryReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await getInventorySummary());
    } catch (err) {
      setError(extractError(err, "Failed to load inventory summary."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useStockMovements(days: number) {
  const [data, setData] = useState<StockMovementEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await getStockMovements(days));
    } catch (err) {
      setError(extractError(err, "Failed to load stock movements."));
    } finally {
      setIsLoading(false);
    }
  }, [days]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useOrderSummary() {
  const [data, setData] = useState<OrderSummaryReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await getOrderSummary());
    } catch (err) {
      setError(extractError(err, "Failed to load order summary."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
