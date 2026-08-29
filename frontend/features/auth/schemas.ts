import { z } from "zod";
import { AUTH_MESSAGES } from "@/constants/messages";

export const loginSchema = z.object({
  email: z.string().email(AUTH_MESSAGES.INVALID_EMAIL),
  password: z.string().min(8, AUTH_MESSAGES.PASSWORD_TOO_SHORT),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    warehouseName: z.string().min(1, "Warehouse name is required."),
    name: z.string().min(1, AUTH_MESSAGES.NAME_REQUIRED),
    email: z.string().email(AUTH_MESSAGES.INVALID_EMAIL),
    password: z.string().min(8, AUTH_MESSAGES.PASSWORD_TOO_SHORT),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: AUTH_MESSAGES.PASSWORDS_MUST_MATCH,
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
