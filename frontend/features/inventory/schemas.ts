import { z } from "zod";
import { INVENTORY_MOVEMENT_TYPES } from "./types";

export const adjustStockSchema = z.object({
  quantityChange: z.number().int({ message: "Must be a whole number" }),
  movementType: z.enum(INVENTORY_MOVEMENT_TYPES),
  note: z.string().optional(),
});

export type AdjustStockFormValues = z.infer<typeof adjustStockSchema>;
