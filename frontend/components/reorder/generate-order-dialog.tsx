"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Supplier } from "@/features/suppliers/types";
import type { ReorderRecommendation } from "@/features/reorder/types";

const schema = z.object({
  supplierId: z.number().min(1, "Supplier is required"),
});

type FormValues = z.infer<typeof schema>;

interface GenerateOrderDialogProps {
  selected: ReorderRecommendation[];
  suppliers: Supplier[];
  onSubmit: (supplierId: number) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function GenerateOrderDialog({
  selected,
  suppliers,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: GenerateOrderDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { supplierId: 0 },
  });

  async function handleSubmit(values: FormValues) {
    await onSubmit(values.supplierId);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-xl bg-[#F4F3EE] p-4 space-y-1">
          <p className="text-sm font-semibold text-[#171717]">
            {selected.length} item{selected.length !== 1 ? "s" : ""} selected
          </p>
          <ul className="space-y-0.5">
            {selected.map((item) => (
              <li key={item.inventoryItemId} className="text-xs text-[#77776F] flex justify-between">
                <span>{item.productName}</span>
                <span className="font-medium text-[#171717]">× {item.suggestedQuantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <FormField
          control={form.control}
          name="supplierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  value={field.value === 0 ? "" : String(field.value)}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? 0 : parseInt(e.target.value, 10))
                  }
                >
                  <option value="">Select supplier…</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent disabled:opacity-60"
          >
            {isLoading ? "Creating…" : "Create Purchase Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
