"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { useDashboardCharts } from "@/features/dashboard/hooks";

const TIME_PERIODS = ["1D", "1W", "1M", "6M", "1Y"] as const;
type TimePeriod = (typeof TIME_PERIODS)[number];

export function StockTrendChart({ className }: { className?: string }) {
  const [period, setPeriod] = useState<TimePeriod>("1W");
  const { data } = useDashboardCharts();

  return (
    <div className={cn("bg-white rounded-2xl p-5 flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#171717]">Stock Trend</p>
          <p className="text-xs text-[#77776F] mt-0.5">Total units in warehouse</p>
        </div>
        <div className="flex items-center bg-[#F4F3EE] rounded-xl p-1 gap-0.5 flex-shrink-0">
          {TIME_PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                period === p
                  ? "bg-[#171717] text-white"
                  : "text-[#77776F] hover:text-[#171717]"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={data.stockTrend}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#DFFF3F" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#DFFF3F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F4F3EE" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#77776F" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#77776F" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#171717",
              border: "none",
              borderRadius: "10px",
              fontSize: "12px",
              padding: "8px 12px",
            }}
            labelStyle={{ color: "#DFFF3F", fontWeight: 600, marginBottom: 2 }}
            itemStyle={{ color: "#fff" }}
            cursor={{ stroke: "#E4E1D8", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#DFFF3F"
            strokeWidth={2.5}
            fill="url(#stockGradient)"
            name="Stock"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
