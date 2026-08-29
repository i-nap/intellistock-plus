"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
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
import { createOrderSchema, type CreateOrderFormValues } from "@/features/orders/schemas";
import type { Supplier } from "@/features/suppliers/types";
import type { Product } from "@/features/products/types";
import { formatNPR } from "@/lib/utils";

interface OrderFormProps {
  suppliers: Supplier[];
  products: Product[];
  onSubmit: (data: CreateOrderFormValues) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

const inputCls = "bg-white border-[#E4E1D8] focus-visible:ring-[#DFFF3F]/50";

export function OrderForm({ suppliers, products, onSubmit, isLoading, error }: OrderFormProps) {
  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      supplierId: 0,
      items: [{ productId: 0, quantity: 1, unitPrice: 0 }],
      notes: "",
      expectedDelivery: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = useWatch({ control: form.control, name: "items" });
  const total = watchedItems?.reduce(
    (sum, item) => sum + (Number(item?.quantity) || 0) * (Number(item?.unitPrice) || 0),
    0
  ) ?? 0;

  function handleProductChange(index: number, productId: number) {
    form.setValue(`items.${index}.productId`, productId);
    const product = products.find((p) => p.id === productId);
    if (product) {
      form.setValue(`items.${index}.unitPrice`, Number(product.unitPrice));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
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
          <FormField
            control={form.control}
            name="expectedDelivery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Expected Delivery{" "}
                  <span className="text-[#77776F] font-normal">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input type="date" className={inputCls} {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Notes <span className="text-[#77776F] font-normal">(optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes for this order…"
                  className="resize-none"
                  rows={2}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Line items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-[#171717]">Order Items</p>
            {form.formState.errors.items?.root && (
              <p className="text-xs text-red-600">{form.formState.errors.items.root.message}</p>
            )}
          </div>

          <div className="rounded-xl border border-[#E4E1D8] overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_110px_90px_36px] gap-0 bg-[#F9F8F5] px-3 py-2 text-xs font-medium text-[#77776F] uppercase tracking-wide">
              <span>Product</span>
              <span>Qty</span>
              <span>Unit Price</span>
              <span className="text-right">Subtotal</span>
              <span />
            </div>

            {fields.map((field, index) => {
              const qty = Number(watchedItems?.[index]?.quantity) || 0;
              const price = Number(watchedItems?.[index]?.unitPrice) || 0;
              const subtotal = qty * price;

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_80px_110px_90px_36px] gap-2 items-center px-3 py-2 border-t border-[#E4E1D8]"
                >
                  <FormField
                    control={form.control}
                    name={`items.${index}.productId`}
                    render={({ field: f }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Select
                            value={f.value === 0 ? "" : String(f.value)}
                            onChange={(e) => {
                              const id = parseInt(e.target.value, 10);
                              handleProductChange(index, isNaN(id) ? 0 : id);
                            }}
                          >
                            <option value="">Select…</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
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
                    name={`items.${index}.quantity`}
                    render={({ field: f }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            className={inputCls}
                            {...f}
                            onChange={(e) => {
                              const v = e.target.value;
                              f.onChange(v === "" ? 1 : parseInt(v, 10));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field: f }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            className={inputCls}
                            {...f}
                            onChange={(e) => {
                              const v = e.target.value;
                              f.onChange(v === "" ? 0 : parseFloat(v));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="text-sm font-medium text-right tabular-nums">
                    {formatNPR(subtotal)}
                  </p>

                  <button
                    type="button"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                    className="flex items-center justify-center size-8 rounded-lg text-[#77776F] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              );
            })}

            <div className="flex items-center justify-between px-3 py-2 border-t border-[#E4E1D8] bg-[#F9F8F5]">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => append({ productId: 0, quantity: 1, unitPrice: 0 })}
                className="gap-1.5 text-[#77776F] hover:text-[#171717] h-7 px-2"
              >
                <Plus className="size-3.5" /> Add Item
              </Button>
              <p className="text-sm font-semibold text-[#171717]">
                Total: <span className="tabular-nums">{formatNPR(total)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent disabled:opacity-60"
          >
            {isLoading ? "Creating…" : "Create Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
