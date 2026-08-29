"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useDashboardCharts } from "@/features/dashboard/hooks";

const BAR_COLORS = ["#DFFF3F", "#BDEFF3", "#F0FFC2", "#FEF3C7", "#E4E1D8"];

export function CategoryStockChart({ className }: { className?: string }) {
  const { data } = useDashboardCharts();

  return (
    <div className={`bg-white rounded-2xl p-5 flex flex-col gap-4 ${className ?? ""}`}>
      <div>
        <p className="text-sm font-semibold text-[#171717]">Stock by Category</p>
        <p className="text-xs text-[#77776F] mt-0.5">Units per category</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data.categoryStock}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F4F3EE" vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 10, fill: "#77776F" }}
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
            cursor={{ fill: "#F4F3EE" }}
          />
          <Bar dataKey="stock" radius={[5, 5, 0, 0]} name="Stock">
            {data.categoryStock.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
