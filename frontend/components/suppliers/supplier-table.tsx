"use client";

import { useState } from "react";
import { Pencil, Trash2, Truck, ExternalLink } from "lucide-react";
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
import { SupplierForm } from "./supplier-form";
import type { Supplier } from "@/features/suppliers/types";
import type { SupplierFormValues } from "@/features/suppliers/schemas";

interface SupplierTableProps {
  suppliers: Supplier[];
  onUpdate: (id: number, data: SupplierFormValues) => Promise<boolean>;
  onDelete: (id: number) => Promise<void>;
  isUpdating: boolean;
  updateError?: string | null;
  canEdit?: boolean;
}

export function SupplierTable({
  suppliers,
  onUpdate,
  onDelete,
  isUpdating,
  updateError,
  canEdit = true,
}: SupplierTableProps) {
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleUpdate(data: SupplierFormValues) {
    if (!editingSupplier) return;
    const ok = await onUpdate(editingSupplier.id, data);
    if (ok) setEditingSupplier(null);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this supplier? This action cannot be undone.")) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  }

  if (suppliers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-12 rounded-xl bg-[#F4F3EE] flex items-center justify-center mb-3">
          <Truck className="size-6 text-[#77776F]" />
        </div>
        <p className="text-sm font-medium text-[#171717]">No suppliers yet</p>
        <p className="text-xs text-[#77776F] mt-1">Add your first supplier to get started.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Website</TableHead>
            {canEdit && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{supplier.name}</p>
                  {supplier.address && (
                    <p className="text-xs text-[#77776F] mt-0.5 max-w-xs truncate">
                      {supplier.address}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>{supplier.contactPerson ?? "—"}</TableCell>
              <TableCell>
                <a
                  href={`mailto:${supplier.email}`}
                  className="text-[#171717] hover:underline"
                >
                  {supplier.email}
                </a>
              </TableCell>
              <TableCell>{supplier.phone ?? "—"}</TableCell>
              <TableCell>
                {supplier.website ? (
                  <a
                    href={supplier.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#77776F] hover:text-[#171717] transition-colors text-xs"
                  >
                    Visit <ExternalLink className="size-3" />
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
              {canEdit && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditingSupplier(supplier)}
                      aria-label="Edit supplier"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={deletingId === supplier.id}
                      onClick={() => handleDelete(supplier.id)}
                      aria-label="Delete supplier"
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

      <Dialog open={!!editingSupplier} onOpenChange={(open) => !open && setEditingSupplier(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update supplier details below.</DialogDescription>
          </DialogHeader>
          {editingSupplier && (
            <SupplierForm
              supplier={editingSupplier}
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
