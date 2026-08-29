"use client";

import { useState, useEffect, useCallback } from "react";
import { listProducts, createProduct, updateProduct, deleteProduct } from "./api";
import { PRODUCT_MESSAGES } from "@/constants/messages";
import type { Product, CreateProductRequest, UpdateProductRequest } from "./types";

function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message ?? fallback;
  }
  return err instanceof Error ? err.message : fallback;
}

export function useProducts(search?: string) {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await listProducts(search));
    } catch (err) {
      setError(extractError(err, PRODUCT_MESSAGES.LOAD_ERROR));
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useCreateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(data: CreateProductRequest): Promise<Product | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await createProduct(data);
    } catch (err) {
      setError(extractError(err, PRODUCT_MESSAGES.CREATE_ERROR));
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { create, isLoading, error };
}

export function useUpdateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(id: number, data: UpdateProductRequest): Promise<Product | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await updateProduct(id, data);
    } catch (err) {
      setError(extractError(err, PRODUCT_MESSAGES.UPDATE_ERROR));
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { update, isLoading, error };
}

export function useDeleteProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(id: number): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      await deleteProduct(id);
      return true;
    } catch (err) {
      setError(extractError(err, PRODUCT_MESSAGES.DELETE_ERROR));
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { remove, isLoading, error };
}
