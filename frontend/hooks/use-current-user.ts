"use client";

import { useEffect, useState } from "react";
import type { AuthUser } from "@/features/auth/types";

export function useCurrentUser(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
      } catch {
        setUser(null);
      }
    }
  }, []);

  return user;
}
