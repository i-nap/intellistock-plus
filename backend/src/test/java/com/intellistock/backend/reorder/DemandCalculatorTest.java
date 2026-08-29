package com.intellistock.backend.reorder;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

class DemandCalculatorTest {

    @Test
    void averagesUsageOverTheWindow() {
        assertThat(DemandCalculator.averageDailyUsage(90, 30)).isEqualTo(3.0, within(1e-9));
    }

    @Test
    void treatsNoUsageAsZeroDemand() {
        assertThat(DemandCalculator.averageDailyUsage(0, 30)).isZero();
        assertThat(DemandCalculator.averageDailyUsage(-5, 30)).isZero();
        assertThat(DemandCalculator.averageDailyUsage(90, 0)).isZero();
    }

    @Test
    void reorderLevelCoversDemandAcrossTheLeadTime() {
        // 3/day over a 5 day lead time
        assertThat(DemandCalculator.reorderLevel(3.0, 5)).isEqualTo(15);
    }

    @Test
    void reorderLevelRoundsUpToWholeUnits() {
        // 2.5/day over 3 days = 7.5 units; a partial unit still has to be ordered
        assertThat(DemandCalculator.reorderLevel(2.5, 3)).isEqualTo(8);
    }

    @Test
    void fallsBackToDefaultLeadTimeWhenMissingOrInvalid() {
        int expected = (int) Math.ceil(2.0 * DemandCalculator.DEFAULT_LEAD_TIME_DAYS);
        assertThat(DemandCalculator.reorderLevel(2.0, null)).isEqualTo(expected);
        assertThat(DemandCalculator.reorderLevel(2.0, 0)).isEqualTo(expected);
        assertThat(DemandCalculator.reorderLevel(2.0, -3)).isEqualTo(expected);
    }

    @Test
    void suggestsEnoughToCoverLeadTimeAndRebuildSafetyStock() {
        // level 15, threshold 20 safety, 4 on hand -> 31
        assertThat(DemandCalculator.suggestedQuantity(15, 4, 20)).isEqualTo(31);
    }

    @Test
    void neverSuggestsLessThanOneUnit() {
        assertThat(DemandCalculator.suggestedQuantity(0, 50, 5)).isEqualTo(1);
    }
}
