package com.intellistock.backend.reorder;

/**
 * Demand maths for the reorder engine, kept out of the service so the rules stay testable.
 *
 * <pre>
 * averageDailyUsage = totalUsage / numberOfDays
 * reorderLevel      = averageDailyUsage * leadTimeInDays
 * </pre>
 */
public final class DemandCalculator {

    /** Window of inventory history used to estimate demand. */
    public static final int USAGE_WINDOW_DAYS = 30;

    /** Applied when an item carries no lead time of its own. */
    public static final int DEFAULT_LEAD_TIME_DAYS = 7;

    private DemandCalculator() {}

    /**
     * @param totalUsage units consumed over the window (non-negative)
     * @param days       length of the window
     */
    public static double averageDailyUsage(int totalUsage, int days) {
        if (totalUsage <= 0 || days <= 0) {
            return 0d;
        }
        return (double) totalUsage / days;
    }

    /** Stock needed to cover demand until a replenishment arrives, rounded up to whole units. */
    public static int reorderLevel(double averageDailyUsage, Integer leadTimeInDays) {
        int leadTime = (leadTimeInDays == null || leadTimeInDays < 1)
                ? DEFAULT_LEAD_TIME_DAYS
                : leadTimeInDays;
        return (int) Math.ceil(averageDailyUsage * leadTime);
    }

    /**
     * Units to order: enough to cover the lead time and land back on the reorder threshold,
     * which acts as safety stock. Always at least one unit, since the caller only asks about
     * items that already tripped the reorder condition.
     */
    public static int suggestedQuantity(int reorderLevel, int currentQuantity, int reorderThreshold) {
        return Math.max(reorderLevel + reorderThreshold - currentQuantity, 1);
    }
}
