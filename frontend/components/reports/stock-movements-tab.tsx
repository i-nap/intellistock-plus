"use client";

import { useState } from "react";
import { useStockMovements } from "@/features/reports/hooks";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Select } from "@/components/ui/select";

const DAY_OPTIONS = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
];

const MOVEMENT_COLORS: Record<string, string> = {
  RESTOCK: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SALE: "bg-red-50 text-red-700 border-red-200",
  ADJUSTMENT: "bg-blue-50 text-blue-700 border-blue-200",
  INITIAL: "bg-[#F4F3EE] text-[#77776F] border-[#E4E1D8]",
};

export function StockMovementsTab() {
  const [days, setDays] = useState(30);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const { data, isLoading, error, refetch } = useStockMovements(days);

  const movementTypes = ["ALL", ...Array.from(new Set(data.map((e) => e.movementType)))];
  const filtered = typeFilter === "ALL" ? data : data.filter((e) => e.movementType === typeFilter);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          value={String(days)}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-40"
        >
          {DAY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-40"
        >
          {movementTypes.map((t) => (
            <option key={t} value={t}>{t === "ALL" ? "All Types" : t}</option>
          ))}
        </Select>
        <span className="text-xs text-[#77776F]">{filtered.length} entries</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E1D8] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="size-6 border-2 border-[#DFFF3F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-red-600">{error}</p>
            <Button variant="ghost" size="sm" onClick={refetch} className="mt-2">Try again</Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-[#77776F]">No movements found for this period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">Before</TableHead>
                  <TableHead className="text-right">After</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-xs text-[#77776F] whitespace-nowrap">{entry.date}</TableCell>
                    <TableCell>
                      <p className="font-medium text-[#171717]">{entry.productName}</p>
                      <p className="text-xs text-[#77776F]">{entry.sku}</p>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${MOVEMENT_COLORS[entry.movementType] ?? MOVEMENT_COLORS.INITIAL}`}>
                        {entry.movementType}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right tabular-nums font-semibold ${entry.quantityChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {entry.quantityChange >= 0 ? "+" : ""}{entry.quantityChange}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-[#77776F]">{entry.previousQuantity}</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">{entry.newQuantity}</TableCell>
                    <TableCell className="text-xs text-[#77776F] max-w-[160px] truncate">{entry.note ?? "—"}</TableCell>
                    <TableCell className="text-xs text-[#77776F]">{entry.performedBy ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
