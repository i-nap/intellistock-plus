import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/types/api";
import type { LoginRequest, RegisterRequest, RegisterResponse, VerifyOtpRequest, AuthResponse } from "./types";

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const { data: res } = await apiClient.post<ApiResponse<AuthResponse>>(
    API_ROUTES.AUTH.LOGIN,
    data
  );
  return res.data;
}

export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  const { data: res } = await apiClient.post<ApiResponse<RegisterResponse>>(
    API_ROUTES.AUTH.REGISTER,
    data
  );
  return res.data;
}

export async function verifyOtpUser(data: VerifyOtpRequest): Promise<AuthResponse> {
  const { data: res } = await apiClient.post<ApiResponse<AuthResponse>>(
    API_ROUTES.AUTH.VERIFY_OTP,
    data
  );
  return res.data;
}

export async function resendOtpUser(email: string): Promise<void> {
  await apiClient.post(API_ROUTES.AUTH.RESEND_OTP, { email });
}
