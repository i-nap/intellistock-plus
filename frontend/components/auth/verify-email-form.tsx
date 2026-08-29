"use client";

import { useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyOtp, useResendOtp } from "@/features/auth/hooks";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { verifyOtp, isLoading, error } = useVerifyOtp();
  const { resendOtp, isLoading: resending, sent } = useResendOtp();

  const otp = digits.join("");
  const isComplete = otp.length === 6;

  const focusAt = useCallback((index: number) => {
    inputRefs.current[Math.max(0, Math.min(5, index))]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) focusAt(index + 1);
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        focusAt(index - 1);
      }
    } else if (e.key === "ArrowLeft") {
      focusAt(index - 1);
    } else if (e.key === "ArrowRight") {
      focusAt(index + 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    focusAt(Math.min(pasted.length, 5));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isComplete) return;
    await verifyOtp({ email, otp });
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
            One step away
            <br />
            from the dashboard.
          </h1>
          <p className="text-[#77776F] text-lg leading-relaxed">
            Check your inbox for the 6-digit code we just sent you.
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
              Verify your email
            </h2>
            <p className="text-[#77776F]">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-[#171717]">{email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {sent && (
            <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              A new code has been sent to your email.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6-box OTP input */}
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-[#E4E1D8] bg-white text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#DFFF3F] focus:border-transparent transition-all"
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={!isComplete || isLoading}
              className="w-full h-11 bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent disabled:opacity-60"
            >
              {isLoading ? "Verifying…" : "Verify email"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#77776F]">
            Didn&apos;t receive a code?{" "}
            <button
              type="button"
              disabled={resending}
              onClick={() => resendOtp(email)}
              className="font-medium text-[#171717] hover:underline disabled:opacity-50"
            >
              {resending ? "Sending…" : "Resend code"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
