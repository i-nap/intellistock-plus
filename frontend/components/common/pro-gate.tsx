"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { usePlan } from "@/features/billing/hooks";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/app-routes";

/**
 * Wraps a Pro-only page. FREE warehouses see an upgrade prompt instead of the
 * content. (Backend also returns 402 for these features — this is just UX.)
 */
export function ProGate({ feature, children }: { feature: string; children: React.ReactNode }) {
  const { isPro } = usePlan();
  if (isPro) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="size-14 rounded-2xl bg-[#DFFF3F] flex items-center justify-center mb-5">
        <Lock className="size-6 text-[#171717]" />
      </div>
      <h2 className="text-xl font-bold text-[#171717]">{feature} is a Pro feature</h2>
      <p className="text-sm text-[#77776F] mt-1 max-w-sm">
        Upgrade your warehouse to Pro to unlock {feature.toLowerCase()} and other automation tools.
      </p>
      <Button
        asChild
        className="mt-5 bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent"
      >
        <Link href={APP_ROUTES.BILLING}>Upgrade to Pro</Link>
      </Button>
    </div>
  );
}
