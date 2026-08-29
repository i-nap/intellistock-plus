"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser, verifyOtpUser, resendOtpUser } from "./api";
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest, VerifyOtpRequest } from "./types";
import { APP_ROUTES } from "@/constants/app-routes";
import { AUTH_MESSAGES } from "@/constants/messages";

function persistSession(response: AuthResponse) {
  localStorage.setItem("token", response.token);
  localStorage.setItem("user", JSON.stringify(response.user));
  // Cookie lets middleware protect routes without localStorage access
  document.cookie = `token=${response.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
}

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(data: LoginRequest) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser(data);
      persistSession(response);
      router.push(APP_ROUTES.DASHBOARD);
    } catch (err) {
      setError(err instanceof Error ? err.message : AUTH_MESSAGES.LOGIN_ERROR);
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading, error };
}

export function useRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(data: RegisterRequest) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerUser(data);
      router.push(`${APP_ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(response.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : AUTH_MESSAGES.REGISTER_ERROR);
    } finally {
      setIsLoading(false);
    }
  }

  return { register, isLoading, error };
}

export function useVerifyOtp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function verifyOtp(data: VerifyOtpRequest) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await verifyOtpUser(data);
      persistSession(response);
      router.push(APP_ROUTES.DASHBOARD);
    } catch (err) {
      setError(err instanceof Error ? err.message : AUTH_MESSAGES.OTP_ERROR);
    } finally {
      setIsLoading(false);
    }
  }

  return { verifyOtp, isLoading, error };
}

export function useResendOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function resendOtp(email: string) {
    setIsLoading(true);
    setError(null);
    setSent(false);
    try {
      await resendOtpUser(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : AUTH_MESSAGES.RESEND_ERROR);
    } finally {
      setIsLoading(false);
    }
  }

  return { resendOtp, isLoading, error, sent };
}

export function useLogout() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    router.push(APP_ROUTES.LOGIN);
  }

  return { logout };
}

export function useCurrentUser(): AuthUser | null {
  const [user] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  return user;
}
