"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { TeamMember, UserRole } from "@/features/users/types";

interface UserTableProps {
  users: TeamMember[];
  currentUserId?: number;
  onUpdateRole: (id: number, role: UserRole) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  WAREHOUSE_STAFF: "Warehouse Staff",
  VIEWER: "Viewer",
};

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: "bg-[#DFFF3F]/20 text-[#5a6600] border border-[#DFFF3F]/50",
  MANAGER: "bg-blue-50 text-blue-700 border border-blue-200",
  WAREHOUSE_STAFF: "bg-purple-50 text-purple-700 border border-purple-200",
  VIEWER: "bg-[#F4F3EE] text-[#77776F] border border-[#E4E1D8]",
};

const ROLES: UserRole[] = ["ADMIN", "MANAGER", "WAREHOUSE_STAFF", "VIEWER"];

export function UserTable({ users, currentUserId, onUpdateRole, onDelete }: UserTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!window.confirm("Remove this user? They will lose access immediately.")) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-[#171717]">No team members yet</p>
        <p className="text-xs text-[#77776F] mt-1">Add your first team member above.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isSelf = user.id === currentUserId;
          return (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-[#F4F3EE] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#77776F]">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    {isSelf && <p className="text-xs text-[#77776F]">You</p>}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-[#77776F] text-sm">{user.email}</TableCell>
              <TableCell>
                {isSelf ? (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                    {ROLE_LABELS[user.role]}
                  </span>
                ) : (
                  <select
                    value={user.role}
                    onChange={(e) => onUpdateRole(user.id, e.target.value as UserRole)}
                    className="h-7 rounded-md border border-[#E4E1D8] bg-white px-2 text-xs text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#DFFF3F]/50"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                )}
              </TableCell>
              <TableCell className="text-[#77776F] text-sm">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="text-right">
                {!isSelf && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={deletingId === user.id}
                    onClick={() => handleDelete(user.id)}
                    aria-label="Remove user"
                    className="text-[#77776F] hover:text-red-600"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
