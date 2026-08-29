# Business Logic Rules

Use clear constants and helper functions for these rules.

## Reorder Condition

```txt
If stock <= threshold, trigger purchase order recommendation.
```

## Stock Update

```txt
newStock = currentStock + incomingQuantity - outgoingQuantity
```

## Demand Estimate

```txt
averageDailyUsage = totalUsage / numberOfDays
reorderLevel = averageDailyUsage * leadTimeInDays
```

Do not hardcode these formulas inside controllers or UI components. Keep them in domain services, utility classes, or calculation helpers.
