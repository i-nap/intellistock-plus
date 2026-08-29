"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createUserSchema, type CreateUserFormValues } from "@/features/users/schemas";

interface UserFormProps {
  onSubmit: (data: CreateUserFormValues) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

const ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "WAREHOUSE_STAFF", label: "Warehouse Staff" },
  { value: "VIEWER", label: "Viewer (read-only)" },
] as const;

export function UserForm({ onSubmit, isLoading, error }: UserFormProps) {
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "", password: "", role: "VIEWER" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" className="bg-white border-[#E4E1D8]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jane@example.com" className="bg-white border-[#E4E1D8]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temporary password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="At least 8 characters" className="bg-white border-[#E4E1D8]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-9 w-full rounded-lg border border-[#E4E1D8] bg-white px-3 py-1 text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#DFFF3F]/50 focus:border-[#DFFF3F]"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#DFFF3F] text-[#171717] font-semibold hover:bg-[#c8e63a] border-transparent disabled:opacity-60"
        >
          {isLoading ? "Creating…" : "Create account"}
        </Button>
      </form>
    </Form>
  );
}
