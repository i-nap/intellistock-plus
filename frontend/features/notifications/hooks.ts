"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "./api";
import { NOTIFICATION_MESSAGES } from "@/constants/messages";
import type { AppNotification } from "./types";

const POLL_INTERVAL_MS = 60_000;

function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message ?? fallback;
  }
  return err instanceof Error ? err.message : fallback;
}

export function useNotifications() {
  const [data, setData] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setError(null);
    try {
      setData(await getNotifications());
    } catch (err) {
      setError(extractError(err, NOTIFICATION_MESSAGES.LOAD_ERROR));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const timer = setInterval(fetch, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetch]);

  // ponytail: polling, not websockets. Swap when a second live-updating surface needs it.
  const markRead = useCallback(async (id: number) => {
    setData((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await markNotificationRead(id);
    } catch {
      fetch();
    }
  }, [fetch]);

  const markAllRead = useCallback(async () => {
    setData((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      fetch();
    }
  }, [fetch]);

  const unreadCount = data.filter((n) => !n.read).length;

  return { data, unreadCount, isLoading, error, markRead, markAllRead, refetch: fetch };
}
