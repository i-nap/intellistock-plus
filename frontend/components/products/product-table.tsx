"use client";

import { useState } from "react";
import { Pencil, Trash2, Package } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import type { Product } from "@/features/products/types";
import type { UpdateProductFormValues } from "@/features/products/schemas";
import { formatNPR } from "@/lib/utils";

const UNIT_LABEL: Record<string, string> = {
  PIECE: "pc",
  BOX: "box",
  KG: "kg",
  LITER: "L",
  METER: "m",
};

interface ProductTableProps {
  products: Product[];
  onUpdate: (id: number, data: UpdateProductFormValues) => Promise<boolean>;
  onDelete: (id: number) => Promise<void>;
  isUpdating: boolean;
  updateError?: string | null;
  canEdit?: boolean;
}

export function ProductTable({ products, onUpdate, onDelete, isUpdating, updateError, canEdit = true }: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleUpdate(data: UpdateProductFormValues) {
    if (!editingProduct) return;
    const ok = await onUpdate(editingProduct.id, data);
    if (ok) setEditingProduct(null);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this product? This will also remove its inventory record.")) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-12 rounded-xl bg-[#F4F3EE] flex items-center justify-center mb-3">
          <Package className="size-6 text-[#77776F]" />
        </div>
        <p className="text-sm font-medium text-[#171717]">No products found</p>
        <p className="text-xs text-[#77776F] mt-1">Add your first product to get started.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Price</TableHead>
            {canEdit && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{product.name}</p>
                  {product.description && (
                    <p className="text-xs text-[#77776F] mt-0.5 max-w-xs truncate">
                      {product.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-[#F4F3EE] px-1.5 py-0.5 rounded">{product.sku}</code>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{UNIT_LABEL[product.unit] ?? product.unit}</TableCell>
              <TableCell className="font-medium">{formatNPR(Number(product.unitPrice))}</TableCell>
              {canEdit && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditingProduct(product)}
                      aria-label="Edit product"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={deletingId === product.id}
                      onClick={() => handleDelete(product.id)}
                      aria-label="Delete product"
                      className="text-[#77776F] hover:text-red-600"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details below.</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              mode="edit"
              product={editingProduct}
              onSubmit={handleUpdate}
              isLoading={isUpdating}
              error={updateError}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
