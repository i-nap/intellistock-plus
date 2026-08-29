"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchUsers, createUserApi, updateUserRoleApi, deleteUserApi } from "./api";
import type { TeamMember, CreateUserRequest, UpdateRoleRequest } from "./types";

export function useUsers() {
  const [data, setData] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await fetchUsers());
    } catch {
      setError("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, isLoading, error, refetch: load };
}

export function useCreateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(data: CreateUserRequest): Promise<TeamMember | null> {
    setIsLoading(true);
    setError(null);
    try {
      return await createUserApi(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create user.";
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { create, isLoading, error };
}

export function useUpdateUserRole() {
  const [isLoading, setIsLoading] = useState(false);

  async function updateRole(id: number, data: UpdateRoleRequest): Promise<TeamMember | null> {
    setIsLoading(true);
    try {
      return await updateUserRoleApi(id, data);
    } catch {
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { updateRole, isLoading };
}

export function useDeleteUser() {
  async function remove(id: number): Promise<void> {
    await deleteUserApi(id);
  }
  return { remove };
}
