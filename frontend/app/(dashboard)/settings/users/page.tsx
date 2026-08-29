"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { ProGate } from "@/components/common/pro-gate";
import { UserTable } from "@/components/users/user-table";
import { UserForm } from "@/components/users/user-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUsers, useCreateUser, useUpdateUserRole, useDeleteUser } from "@/features/users/hooks";
import { useCurrentUser } from "@/features/auth/hooks";
import { APP_ROUTES } from "@/constants/app-routes";
import type { CreateUserFormValues } from "@/features/users/schemas";
import type { UserRole } from "@/features/users/types";

export default function UsersSettingsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const currentUser = useCurrentUser();
  const router = useRouter();
  const isAdmin = currentUser?.role === "ADMIN";

  // Non-admins can't manage users (backend enforces too); bounce to dashboard.
  useEffect(() => {
    if (!isAdmin) router.replace(APP_ROUTES.DASHBOARD);
  }, [isAdmin, router]);

  const { data: users, isLoading, error, refetch } = useUsers();
  const { create, isLoading: isCreating, error: createError } = useCreateUser();
  const { updateRole } = useUpdateUserRole();
  const { remove } = useDeleteUser();

  async function handleCreate(data: CreateUserFormValues) {
    const result = await create(data);
    if (result) {
      setCreateOpen(false);
      refetch();
    }
  }

  async function handleUpdateRole(id: number, role: UserRole) {
    await updateRole(id, { role });
    refetch();
  }

  async function handleDelete(id: number) {
    await remove(id);
    refetch();
  }

  if (!isAdmin) return null;

  return (
    <ProGate feature="Team management">
      <PageHeader title="Team Members" description="Manage who has access to your warehouse">
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent gap-2"
        >
          <UserPlus className="size-4" />
          Add Member
        </Button>
      </PageHeader>

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
          <UserTable
            users={users}
            currentUserId={currentUser?.id}
            onUpdateRole={handleUpdateRole}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Create an account for a team member. They can log in immediately with these credentials.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={handleCreate}
            isLoading={isCreating}
            error={createError}
          />
        </DialogContent>
      </Dialog>
    </ProGate>
  );
}
