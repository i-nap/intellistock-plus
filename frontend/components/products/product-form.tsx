"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductFormValues,
  type UpdateProductFormValues,
} from "@/features/products/schemas";
import { PRODUCT_UNITS } from "@/features/products/types";
import type { Product } from "@/features/products/types";

const UNIT_LABELS: Record<string, string> = {
  PIECE: "Piece",
  BOX: "Box",
  KG: "Kilogram (kg)",
  LITER: "Liter (L)",
  METER: "Meter (m)",
};

const inputCls = "bg-white border-[#E4E1D8] focus-visible:ring-[#DFFF3F]/50";

function parseNum(val: string) {
  return val === "" ? 0 : parseFloat(val);
}

function parseInt10(val: string) {
  return val === "" ? 0 : parseInt(val, 10);
}

interface CreateProductFormProps {
  mode: "create";
  onSubmit: (data: CreateProductFormValues) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

interface EditProductFormProps {
  mode: "edit";
  product: Product;
  onSubmit: (data: UpdateProductFormValues) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export type ProductFormProps = CreateProductFormProps | EditProductFormProps;

function CommonFields({
  control,
}: {
  control: ReturnType<typeof useForm<CreateProductFormValues>>["control"] | ReturnType<typeof useForm<UpdateProductFormValues>>["control"];
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control as ReturnType<typeof useForm<CreateProductFormValues>>["control"]}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Wireless Keyboard" className={inputCls} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control as ReturnType<typeof useForm<CreateProductFormValues>>["control"]}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="e.g. WK-001" className={inputCls} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control as ReturnType<typeof useForm<CreateProductFormValues>>["control"]}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Electronics" className={inputCls} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control as ReturnType<typeof useForm<CreateProductFormValues>>["control"]}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Select {...field}>
                  {PRODUCT_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {UNIT_LABELS[u]}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control as ReturnType<typeof useForm<CreateProductFormValues>>["control"]}
        name="unitPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unit Price ($)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                className={inputCls}
                {...field}
                onChange={(e) => field.onChange(parseNum(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control as ReturnType<typeof useForm<CreateProductFormValues>>["control"]}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Description{" "}
              <span className="text-[#77776F] font-normal">(optional)</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief product description..."
                className="resize-none"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function CreateForm({ onSubmit, isLoading, error }: CreateProductFormProps) {
  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      category: "",
      unit: "PIECE",
      unitPrice: 0,
      initialQuantity: 0,
      reorderThreshold: 10,
      leadTimeInDays: 7,
      location: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <CommonFields control={form.control} />

        <div className="border-t border-[#E4E1D8] pt-4">
          <p className="text-xs font-medium text-[#77776F] uppercase tracking-wide mb-3">
            Initial Inventory
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <FormField
              control={form.control}
              name="initialQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qty</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      className={inputCls}
                      {...field}
                      onChange={(e) => field.onChange(parseInt10(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reorderThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reorder At</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      className={inputCls}
                      {...field}
                      onChange={(e) => field.onChange(parseInt10(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leadTimeInDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Time (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      className={inputCls}
                      {...field}
                      onChange={(e) => field.onChange(parseInt10(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. A1-B2"
                      className={inputCls}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent disabled:opacity-60"
          >
            {isLoading ? "Creating…" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function EditForm({ product, onSubmit, isLoading, error }: EditProductFormProps) {
  const form = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      description: product.description ?? "",
      category: product.category,
      unit: product.unit,
      unitPrice: product.unitPrice,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <CommonFields control={form.control} />

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent disabled:opacity-60"
          >
            {isLoading ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ProductForm(props: ProductFormProps) {
  if (props.mode === "create") return <CreateForm {...props} />;
  return <EditForm {...props} />;
}
