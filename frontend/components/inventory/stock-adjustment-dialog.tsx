"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { adjustStockSchema, type AdjustStockFormValues } from "@/features/inventory/schemas";
import { INVENTORY_MOVEMENT_TYPES } from "@/features/inventory/types";
import type { InventoryItem } from "@/features/inventory/types";

const MOVEMENT_LABELS: Record<string, string> = {
  RESTOCK: "Restock (add stock)",
  ADJUSTMENT: "Adjustment (add or remove)",
  SALE: "Sale (remove stock)",
};

interface StockAdjustmentDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AdjustStockFormValues) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export function StockAdjustmentDialog({
  item,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  error,
}: StockAdjustmentDialogProps) {
  const form = useForm<AdjustStockFormValues>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      quantityChange: 0,
      movementType: "RESTOCK",
      note: "",
    },
  });

  async function handleSubmit(values: AdjustStockFormValues) {
    await onSubmit(values);
    form.reset();
  }

  const inputCls = "bg-white border-[#E4E1D8] focus-visible:ring-[#DFFF3F]/50";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          {item && (
            <DialogDescription>
              {item.product.name} — current stock:{" "}
              <span className="font-semibold text-[#171717]">{item.quantity}</span>
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="movementType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movement Type</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      {INVENTORY_MOVEMENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {MOVEMENT_LABELS[t]}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantityChange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Quantity Change{" "}
                    <span className="text-[#77776F] font-normal text-xs">
                      (positive = add, negative = remove)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className={inputCls}
                      {...field}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? 0 : parseInt(val, 10));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note <span className="text-[#77776F] font-normal">(optional)</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Reason for adjustment..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent disabled:opacity-60"
              >
                {isLoading ? "Saving…" : "Apply Adjustment"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
