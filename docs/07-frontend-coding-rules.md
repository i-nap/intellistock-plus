# Frontend Coding Rules

## Component Rules

- Keep components small.
- One component should do one clear thing.
- Split large files before they become hard to read.
- Avoid files longer than around 250 lines.
- Avoid functions longer than around 40 lines.
- Move repeated logic into hooks, utilities, or services.
- Keep page files thin. A page should mostly compose feature components.

Bad:

```tsx
export default function InventoryPage() {
  // API calls, form validation, table columns, modal logic,
  // formatting helpers, and JSX all in one file.
}
```

Good:

```tsx
export default function InventoryPage() {
  return <InventoryView />;
}
```

## API Rules

Do not call APIs directly from components.

Bad:

```tsx
const response = await fetch("/api/products");
```

Good:

```tsx
const products = useProducts();
```

Use feature-level API files:

```txt
features/products/api.ts
features/products/hooks.ts
```

**Use axios for all HTTP calls.** Never use raw `fetch` in feature API files. All requests must go through the shared axios instance at `lib/api-client.ts`.

```ts
// lib/api-client.ts — shared axios instance
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

```ts
// features/products/api.ts — use apiClient, not fetch
import { apiClient } from "@/lib/api-client";
import type { ProductResponse } from "./types";

export async function getProducts(): Promise<ProductResponse[]> {
  const { data } = await apiClient.get("/api/v1/products");
  return data;
}
```

## Constants Rules

Do not use magic strings.

Bad:

```tsx
if (status === "LOW_STOCK") {}
```

Good:

```tsx
if (status === INVENTORY_STATUS.LOW_STOCK) {}
```

Use constant files for:

- API routes
- App routes
- Roles
- Permissions
- Status values
- Query keys
- Error messages
- Table labels
- Form labels where repeated

Example:

```ts
export const INVENTORY_STATUS = {
  IN_STOCK: "IN_STOCK",
  LOW_STOCK: "LOW_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
} as const;
```

## Type Rules

- Avoid `any`.
- Use DTO types that match backend API responses.
- Use Zod schemas for form validation.
- Infer form types from Zod schemas where possible.
- Keep shared frontend types in feature folders or `src/types`.

## Form Rules

Use:

- React Hook Form
- Zod validation
- shadcn form components
- Clear error messages
- Disabled submit state while loading

## Table Rules

Inventory, products, orders, and suppliers should use reusable table patterns.

Tables should support:

- Search
- Pagination
- Loading state
- Empty state
- Status badges
- Row actions
- Delete confirmation
