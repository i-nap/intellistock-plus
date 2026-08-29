"use client";

import { useState, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { ProductTable } from "@/components/products/product-table";
import { ProductForm } from "@/components/products/product-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/features/products/hooks";
import { useCurrentUser } from "@/features/auth/hooks";
import type { CreateProductFormValues, UpdateProductFormValues } from "@/features/products/schemas";

export default function ProductsPage() {
  const currentUser = useCurrentUser();
  const canEdit = currentUser?.role !== "VIEWER";

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const { data: products, isLoading, error, refetch } = useProducts(debouncedSearch || undefined);
  const { create, isLoading: isCreating, error: createError } = useCreateProduct();
  const { update, isLoading: isUpdating, error: updateError } = useUpdateProduct();
  const { remove } = useDeleteProduct();

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    clearTimeout((handleSearchChange as { _t?: ReturnType<typeof setTimeout> })._t);
    (handleSearchChange as { _t?: ReturnType<typeof setTimeout> })._t = setTimeout(() => {
      setDebouncedSearch(value);
    }, 400);
  }, []);

  async function handleCreate(data: CreateProductFormValues) {
    const result = await create(data);
    if (result) {
      setCreateOpen(false);
      refetch();
    }
  }

  async function handleUpdate(id: number, data: UpdateProductFormValues): Promise<boolean> {
    const result = await update(id, data);
    if (result) refetch();
    return !!result;
  }

  async function handleDelete(id: number) {
    await remove(id);
    refetch();
  }

  return (
    <div>
      <PageHeader title="Products" description="Manage your product catalogue">
        {canEdit && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent gap-2"
          >
            <Plus className="size-4" />
            Add Product
          </Button>
        )}
      </PageHeader>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#77776F]" />
        <Input
          placeholder="Search by name or SKU…"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 bg-white border-[#E4E1D8]"
        />
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-[#E4E1D8] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="size-6 border-2 border-[#DFFF3F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <Button variant="ghost" size="sm" onClick={refetch} className="mt-2">
              Try again
            </Button>
          </div>
        ) : (
          <ProductTable
            products={products}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isUpdating={isUpdating}
            updateError={updateError}
            canEdit={canEdit}
          />
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new product to your catalogue.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            mode="create"
            onSubmit={handleCreate}
            isLoading={isCreating}
            error={createError}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
