"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas";
import { useRegister } from "@/features/auth/hooks";
import { APP_ROUTES } from "@/constants/app-routes";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, isLoading, error } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { warehouseName: "", name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    await register({
      warehouseName: values.warehouseName,
      name: values.name,
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#171717] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-[#DFFF3F] flex items-center justify-center">
            <Package className="size-5 text-[#171717]" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            IntelliStock+
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-white text-4xl font-bold leading-tight">
            Take control of
            <br />
            your warehouse.
          </h1>
          <p className="text-[#77776F] text-lg leading-relaxed">
            Set up your account and start managing inventory, suppliers, and
            orders from day one.
          </p>
        </div>

        <p className="text-[#4a4a42] text-sm">
          © 2026 IntelliStock+. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#F4F3EE] px-6 py-12">
        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-10 lg:hidden">
          <div className="size-9 rounded-lg bg-[#DFFF3F] flex items-center justify-center">
            <Package className="size-5 text-[#171717]" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#171717]">
            IntelliStock+
          </span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#171717] mb-1">
              Create an account
            </h2>
            <p className="text-[#77776F]">Get started with IntelliStock+</p>
          </div>

          {/* Google OAuth button — uncomment when backend OAuth is wired up
          <button
            type="button"
            className="w-full h-11 mb-5 flex items-center justify-center gap-3 rounded-lg border border-[#E4E1D8] bg-white text-sm font-medium text-[#171717] hover:bg-[#F4F3EE] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E4E1D8]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#F4F3EE] px-3 text-xs text-[#B0ADA4]">or continue with email</span>
            </div>
          </div>
          */}

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="warehouseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#171717] font-medium">
                      Warehouse / company name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Acme Supplies"
                        className="bg-white border-[#E4E1D8] h-11 focus-visible:ring-[#DFFF3F]/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#171717] font-medium">
                      Full name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="bg-white border-[#E4E1D8] h-11 focus-visible:ring-[#DFFF3F]/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#171717] font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="bg-white border-[#E4E1D8] h-11 focus-visible:ring-[#DFFF3F]/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#171717] font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="At least 8 characters"
                          className="bg-white border-[#E4E1D8] h-11 pr-10 focus-visible:ring-[#DFFF3F]/50"
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77776F] hover:text-[#171717] transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#171717] font-medium">
                      Confirm password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Repeat your password"
                          className="bg-white border-[#E4E1D8] h-11 pr-10 focus-visible:ring-[#DFFF3F]/50"
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77776F] hover:text-[#171717] transition-colors"
                        >
                          {showConfirm ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent mt-1 disabled:opacity-60"
              >
                {isLoading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-[#77776F]">
            Already have an account?{" "}
            <Link
              href={APP_ROUTES.LOGIN}
              className="font-medium text-[#171717] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
