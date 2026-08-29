"use client";

import { useState, useEffect, useCallback } from "react";
import { getDashboardMetrics, getDashboardCharts, getRecentOrders } from "./api";
import { getRecommendations } from "@/features/reorder/api";
import type { DashboardMetrics, DashboardCharts, ReorderAlert, RecentOrder } from "./types";

const EMPTY_METRICS: DashboardMetrics = {
  totalProducts: 0,
  lowStockItems: 0,
  pendingOrders: 0,
  inventoryValue: 0,
  sparklines: {
    totalProducts: [],
    lowStockItems: [],
    pendingOrders: [],
    inventoryValue: [],
  },
};

const EMPTY_CHARTS: DashboardCharts = {
  stockTrend: [],
  categoryStock: [],
};

export function useDashboardMetrics() {
  const [data, setData] = useState<DashboardMetrics>(EMPTY_METRICS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await getDashboardMetrics());
    } catch {
      setError("Failed to load metrics.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error };
}

export function useDashboardCharts() {
  const [data, setData] = useState<DashboardCharts>(EMPTY_CHARTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await getDashboardCharts());
    } catch {
      setError("Failed to load charts.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error };
}

export function useReorderAlerts() {
  const [data, setData] = useState<ReorderAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const recs = await getRecommendations();
      setData(
        recs.map((r) => ({
          id: r.inventoryItemId,
          product: r.productName,
          sku: r.sku,
          current: r.currentQuantity,
          minimum: r.reorderThreshold,
          supplier: "",
        }))
      );
    } catch {
      setError("Failed to load reorder alerts.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error };
}

export function useRecentOrders() {
  const [data, setData] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await getRecentOrders());
    } catch {
      setError("Failed to load recent orders.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error };
}
