export type UserRole = "ADMIN" | "MANAGER" | "WAREHOUSE_STAFF" | "VIEWER";

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateRoleRequest = {
  role: UserRole;
};
