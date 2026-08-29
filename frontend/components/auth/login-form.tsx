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
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/hooks";
import { APP_ROUTES } from "@/constants/app-routes";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    await login(values);
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
            Smart inventory.
            <br />
            Smarter decisions.
          </h1>
          <p className="text-[#77776F] text-lg leading-relaxed">
            Full control over your warehouse, products, and orders — in one
            place.
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
              Welcome back
            </h2>
            <p className="text-[#77776F]">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-[#171717] font-medium">
                        Password
                      </FormLabel>
                      {/* <Link
                        href="#"
                        className="text-sm text-[#77776F] hover:text-[#171717] transition-colors"
                      >
                        Forgot password?
                      </Link> */}
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent mt-2 disabled:opacity-60"
              >
                {isLoading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </Form>

          {/* Sign-up flow disabled — users are provisioned via warehouse registration
          <p className="mt-6 text-center text-sm text-[#77776F]">
            Don&apos;t have an account?{" "}
            <Link
              href={APP_ROUTES.REGISTER}
              className="font-medium text-[#171717] hover:underline"
            >
              Create account
            </Link>
          </p>
          */}
        </div>
      </div>
    </div>
  );
}
