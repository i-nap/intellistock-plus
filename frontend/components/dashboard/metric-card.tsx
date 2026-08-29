"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MiniSparkline } from "./mini-sparkline";
import type { SparklinePoint } from "@/features/dashboard/types";

export type MetricVariant = "default" | "accent" | "cyan";

type Props = {
  label: string;
  value: string;
  change: { value: string; positive: boolean };
  icon: LucideIcon;
  sparkline: SparklinePoint[];
  variant?: MetricVariant;
  className?: string;
};

const STYLES: Record<MetricVariant, { bg: string; iconBg: string; muted: string }> = {
  default: {
    bg: "bg-white",
    iconBg: "bg-[#F4F3EE]",
    muted: "text-[#77776F]",
  },
  accent: {
    bg: "bg-[#DFFF3F]",
    iconBg: "bg-[#171717]/10",
    muted: "text-[#171717]/60",
  },
  cyan: {
    bg: "bg-[#BDEFF3]",
    iconBg: "bg-[#171717]/10",
    muted: "text-[#171717]/60",
  },
};

export function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  sparkline,
  variant = "default",
  className,
}: Props) {
  const s = STYLES[variant];
  const sparkColor = variant === "default" ? "#77776F" : "#171717";

  return (
    <div
      className={cn(
        "rounded-2xl p-5 flex flex-col justify-between gap-4",
        s.bg,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "size-9 rounded-full flex items-center justify-center flex-shrink-0",
            s.iconBg
          )}
        >
          <Icon className="size-4 text-[#171717]" />
        </div>
        <MiniSparkline data={sparkline} color={sparkColor} />
      </div>

      <div>
        <p className={cn("text-xs font-medium mb-1", s.muted)}>
          {change.positive ? "↑" : "↓"} {change.value}
        </p>
        <p className="text-[28px] font-bold text-[#171717] tracking-tight leading-none">
          {value}
        </p>
        <p className={cn("text-sm mt-1.5", s.muted)}>{label}</p>
      </div>
    </div>
  );
}
