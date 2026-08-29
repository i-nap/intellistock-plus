"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useReorderAlerts } from "@/features/dashboard/hooks";
import { APP_ROUTES } from "@/constants/app-routes";

export function ReorderAlertsCard({ className }: { className?: string }) {
  const { data, isLoading } = useReorderAlerts();
  const preview = data.slice(0, 5);

  return (
    <div className={`bg-white rounded-2xl p-5 flex flex-col gap-4 ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#171717]">Reorder Alerts</p>
          <p className="text-xs text-[#77776F] mt-0.5">Items below minimum stock</p>
        </div>
        {!isLoading && (
          <span className="text-xs font-semibold bg-[#FEF3C7] text-[#92400E] px-2.5 py-1 rounded-full">
            {data.length} items
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <div className="size-5 border-2 border-[#DFFF3F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center py-6">
          <p className="text-xs text-[#77776F]">All stock levels are healthy.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2.5">
            {preview.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F3EE]">
                <div className="size-7 rounded-lg bg-[#FEF3C7] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="size-3.5 text-[#F59E0B]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#171717] truncate">{alert.product}</p>
                  <p className="text-xs text-[#77776F] mt-0.5">{alert.sku}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-semibold text-[#EF4444]">
                      {alert.current} left
                    </span>
                    <span className="text-xs text-[#77776F]">/ min {alert.minimum}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={APP_ROUTES.REORDER}
            className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#77776F] hover:text-[#171717] transition-colors pt-1"
          >
            {data.length > 5 ? `View all ${data.length} items` : "Manage reorders"}
            <ArrowRight className="size-3" />
          </Link>
        </>
      )}
    </div>
  );
}
