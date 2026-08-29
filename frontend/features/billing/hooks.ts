"use client";

import { useState } from "react";
import { getBillingStatus, initiateEsewa } from "./api";
import type { AuthUser } from "@/features/auth/types";

/** Reads the plan synchronously from the stored user (set at login). */
export function usePlan() {
  const [plan] = useState<string>(() => {
    if (typeof window === "undefined") return "FREE";
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as AuthUser).plan ?? "FREE" : "FREE";
    } catch {
      return "FREE";
    }
  });
  return { plan, isPro: plan === "PRO" };
}

/** Re-fetches plan from the server and writes it back into the stored user. */
export async function syncPlan(): Promise<string> {
  const { plan } = await getBillingStatus();
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const user = JSON.parse(raw) as AuthUser;
      user.plan = plan;
      localStorage.setItem("user", JSON.stringify(user));
    }
  } catch {
    /* ignore */
  }
  return plan;
}

/** Starts eSewa checkout: gets signed form fields, then auto-submits to eSewa. */
export function useUpgrade() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upgrade() {
    setIsLoading(true);
    setError(null);
    try {
      const { actionUrl, fields } = await initiateEsewa();
      const form = document.createElement("form");
      form.method = "POST";
      form.action = actionUrl;
      for (const [name, value] of Object.entries(fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit(); // navigates the browser to eSewa
    } catch {
      setError("Could not start checkout. Try again.");
      setIsLoading(false);
    }
  }

  return { upgrade, isLoading, error };
}
