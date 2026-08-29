"use client";

import { useEffect, useState } from "react";
import { Check, Crown, Loader2, X, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { usePlan, useUpgrade, syncPlan } from "@/features/billing/hooks";

const PRO_PRICE = "Rs 1,000";

const FEATURES: { label: string; free: boolean; pro: boolean }[] = [
  { label: "Inventory & product management", free: true, pro: true },
  { label: "Suppliers & purchase orders", free: true, pro: true },
  { label: "Auto-reorder engine", free: true, pro: true },
  { label: "Dashboard & low-stock alerts", free: true, pro: true },
  { label: "Reports & analytics", free: false, pro: true },
  { label: "Team management (multi-user)", free: false, pro: true },
];

export default function BillingPage() {
  const { isPro } = usePlan();
  const { upgrade, isLoading, error } = useUpgrade();
  const [banner, setBanner] = useState<"success" | "failure" | "error" | null>(null);

  // Handle eSewa redirect back (?status=…). On success, refresh plan + reload
  // so the nav unlocks, then strip the query param.
  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("status");
    if (!status) return;
    if (status === "success") {
      syncPlan().finally(() => window.location.replace("/billing"));
      return;
    }
    setBanner(status === "failure" ? "failure" : "error");
    window.history.replaceState(null, "", "/billing");
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Billing & Plans" description="Choose the plan that fits your warehouse" />

      {banner === "failure" && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Payment was cancelled or failed. You have not been charged.
        </div>
      )}
      {banner === "error" && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          We couldn&apos;t verify your payment. If you were charged, contact support.
        </div>
      )}
      {isPro && (
        <div className="mb-5 rounded-xl bg-[#171717] text-white px-5 py-4 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-500">
          <Crown className="size-5 text-[#DFFF3F] fill-[#DFFF3F]" />
          <div>
            <p className="font-semibold">You&apos;re on the Pro plan</p>
            <p className="text-sm text-white/60">All features unlocked. Thanks for the support! 🎉</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {/* Free */}
        <div
          className={`rounded-2xl border bg-white p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg ${
            isPro ? "border-[#E4E1D8]" : "border-[#171717] ring-1 ring-[#171717]"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#171717]">Free</h3>
            {!isPro && (
              <span className="text-xs font-semibold bg-[#F4F3EE] text-[#77776F] rounded-full px-2.5 py-1">
                Current plan
              </span>
            )}
          </div>
          <p className="mt-3 text-3xl font-bold text-[#171717]">
            Rs 0<span className="text-sm font-medium text-[#77776F]"> / forever</span>
          </p>
          <p className="mt-1 text-sm text-[#77776F]">Core warehouse management for small teams.</p>

          <ul className="mt-6 space-y-3">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex items-center gap-2.5 text-sm">
                {f.free ? (
                  <Check className="size-4 text-[#171717] flex-shrink-0" />
                ) : (
                  <X className="size-4 text-[#C4C2B8] flex-shrink-0" />
                )}
                <span className={f.free ? "text-[#171717]" : "text-[#C4C2B8] line-through"}>
                  {f.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div
          style={{ animationDelay: "120ms" }}
          className={`relative rounded-2xl border bg-white p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards transition-shadow hover:shadow-lg ${
            isPro ? "border-[#171717] ring-1 ring-[#171717]" : "border-[#DFFF3F] ring-2 ring-[#DFFF3F]"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#171717] flex items-center gap-1.5">
              <Sparkles className="size-4 text-[#171717]" />
              Pro
            </h3>
            {isPro ? (
              <span className="text-xs font-semibold bg-[#171717] text-white rounded-full px-2.5 py-1">
                Current plan
              </span>
            ) : (
              <span className="text-xs font-semibold bg-[#DFFF3F] text-[#171717] rounded-full px-2.5 py-1">
                Recommended
              </span>
            )}
          </div>
          <p className="mt-3 text-3xl font-bold text-[#171717]">
            {PRO_PRICE}
            <span className="text-sm font-medium text-[#77776F]"> / one-time</span>
          </p>
          <p className="mt-1 text-sm text-[#77776F]">Everything in Free, plus reporting and your full team.</p>

          <ul className="mt-6 space-y-3">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex items-center gap-2.5 text-sm text-[#171717]">
                <Check className="size-4 text-[#171717] flex-shrink-0" />
                {f.label}
              </li>
            ))}
          </ul>

          {!isPro && (
            <Button
              onClick={upgrade}
              disabled={isLoading}
              className="mt-6 w-full bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent gap-2 h-11"
            >
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Crown className="size-4" />}
              Upgrade with eSewa
            </Button>
          )}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {!isPro && (
            <p className="mt-3 text-center text-xs text-[#77776F]">
              Secure payment via eSewa. You&apos;ll be redirected to complete checkout.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
