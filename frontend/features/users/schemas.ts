import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["ADMIN", "MANAGER", "WAREHOUSE_STAFF", "VIEWER"]),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
