export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  warehouseName: string;
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  email: string;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
};

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: string;
  warehouseId: number;
  warehouseName: string;
  plan: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
