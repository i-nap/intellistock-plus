# Design System

## Theme Direction

Use the uploaded dashboard reference as the UI direction.

Recommended design tokens:

```ts
export const THEME_COLORS = {
  background: "#F4F3EE",
  surface: "#FFFFFF",
  foreground: "#171717",
  muted: "#77776F",
  border: "#E4E1D8",
  accent: "#DFFF3F",
  accentSoft: "#F0FFC2",
  secondaryAccent: "#BDEFF3",
  danger: "#EF4444",
  success: "#16A34A",
  warning: "#F59E0B",
} as const;
```

Use Tailwind CSS variables where possible instead of hardcoded hex values inside components.

## UI Style Rules

- Use rounded cards.
- Use `Card`, `Button`, `Input`, `Table`, `Badge`, `Dialog`, `DropdownMenu`, `Tabs`, and `Sheet` from shadcn/ui.
- Use consistent spacing.
- Use skeleton loaders for dashboard and tables.
- Use empty states for tables with no data.
- Use confirmation dialogs for destructive actions.
- Use toast notifications for success and error feedback.
- Use responsive layouts from the beginning.

## Dashboard Requirements

Dashboard should include:

- Total products
- Low stock items
- Pending orders
- Recent stock movements
- Reorder alerts
- Inventory value
- Stock trend chart
- Category-wise stock chart
- Recent orders table

Keep dashboard cards reusable. Do not build one massive dashboard component.
