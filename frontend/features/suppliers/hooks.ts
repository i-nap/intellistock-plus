"use client";

import { useState, useEffect, useCallback } from "react";
import { listSuppliers, createSupplier, updateSupplier, deleteSupplier } from "./api";
import { SUPPLIER_MESSAGES } from "@/constants/messages";
import type { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from "./types";

function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message ?? fallback;
  }
  return err instanceof Error ? err.message : fallback;
}

export function useSuppliers(search?: string) {
  const [data, setData] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await listSuppliers(search));
    } catch (err) {
      setError(extractError(err, SUPPLIER_MESSAGES.LOAD_ERROR));
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useCreateSupplier() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(data: CreateSupplierRequest): Promise<Supplier | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await createSupplier(data);
    } catch (err) {
      setError(extractError(err, SUPPLIER_MESSAGES.CREATE_ERROR));
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { create, isLoading, error };
}

export function useUpdateSupplier() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(id: number, data: UpdateSupplierRequest): Promise<Supplier | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await updateSupplier(id, data);
    } catch (err) {
      setError(extractError(err, SUPPLIER_MESSAGES.UPDATE_ERROR));
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { update, isLoading, error };
}

export function useDeleteSupplier() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(id: number): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      await deleteSupplier(id);
      return true;
    } catch (err) {
      setError(extractError(err, SUPPLIER_MESSAGES.DELETE_ERROR));
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { remove, isLoading, error };
}
