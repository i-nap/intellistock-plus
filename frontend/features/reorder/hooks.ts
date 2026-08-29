"use client";

import { useState, useEffect, useCallback } from "react";
import { getRecommendations, generateOrder } from "./api";
import { REORDER_MESSAGES } from "@/constants/messages";
import type { ReorderRecommendation, GenerateOrderRequest } from "./types";
import type { Order } from "@/features/orders/types";

function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message ?? fallback;
  }
  return err instanceof Error ? err.message : fallback;
}

export function useReorderRecommendations() {
  const [data, setData] = useState<ReorderRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await getRecommendations());
    } catch (err) {
      setError(extractError(err, REORDER_MESSAGES.LOAD_ERROR));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useGenerateOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(data: GenerateOrderRequest): Promise<Order | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await generateOrder(data);
    } catch (err) {
      setError(extractError(err, REORDER_MESSAGES.GENERATE_ERROR));
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { generate, isLoading, error };
}
