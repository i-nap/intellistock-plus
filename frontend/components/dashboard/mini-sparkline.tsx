"use client";

import { LineChart, Line } from "recharts";
import type { SparklinePoint } from "@/features/dashboard/types";

type Props = {
  data: SparklinePoint[];
  color?: string;
};

export function MiniSparkline({ data, color = "#77776F" }: Props) {
  return (
    <LineChart width={80} height={36} data={data}>
      <Line
        type="monotone"
        dataKey="v"
        dot={false}
        strokeWidth={1.5}
        stroke={color}
        isAnimationActive={false}
      />
    </LineChart>
  );
}
