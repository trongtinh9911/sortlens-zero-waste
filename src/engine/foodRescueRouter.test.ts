import { describe, expect, it } from "vitest";
import {
	EPA_WARM_FOOD_COMPOST_FACTOR,
	EPA_WARM_FOOD_DONATION_FACTOR,
	evaluateFoodRescue,
	getSeedFoodRescueItems,
	KG_PER_MEAL_EQUIVALENT,
	sortFoodRescueByUrgency,
} from "./foodRescueRouter";

describe("foodRescueRouter", () => {
	it("routes items expiring in <= 1 day to CRITICAL_24H Community Fridge", () => {
		const plan = evaluateFoodRescue({
			name: "Fresh Cafe Wraps",
			category: "PREPARED_MEAL",
			weightKg: 1.088,
			daysToExpiry: 1,
			isOpened: false,
			sourceLocation: "Campus Dining",
		});
		expect(plan.urgencyTier).toBe("CRITICAL_24H");
		expect(plan.donationChannel).toBe("Community Fridge / Campus Rapid Share");
		expect(plan.mealEquivalents).toBeCloseTo(1.088 / KG_PER_MEAL_EQUIVALENT, 2);
		expect(plan.co2eAvoidedKg).toBeCloseTo(
			1.088 * EPA_WARM_FOOD_DONATION_FACTOR,
			2,
		);
	});

	it("routes items expiring in 2–3 days to SOON_72H Local Food Bank", () => {
		const plan = evaluateFoodRescue({
			name: "Organic Apples",
			category: "PRODUCE",
			weightKg: 2.0,
			daysToExpiry: 3,
			isOpened: false,
			sourceLocation: "Dorm Kitchen",
		});
		expect(plan.urgencyTier).toBe("SOON_72H");
		expect(plan.donationChannel).toBe("Local Food Bank / Student Pantry");
		expect(plan.mealEquivalents).toBeCloseTo(2.0 / KG_PER_MEAL_EQUIVALENT, 2);
	});

	it("routes expired items (< 0 days) to COMPOST_ONLY with 0 meals and EPA compost factor", () => {
		const plan = evaluateFoodRescue({
			name: "Spoiled Berries",
			category: "PRODUCE",
			weightKg: 1.0,
			daysToExpiry: -2,
			isOpened: true,
			sourceLocation: "Home Fridge",
		});
		expect(plan.urgencyTier).toBe("COMPOST_ONLY");
		expect(plan.donationChannel).toBe("Municipal / Campus Compost Bin");
		expect(plan.mealEquivalents).toBe(0);
		expect(plan.co2eAvoidedKg).toBeCloseTo(
			1.0 * EPA_WARM_FOOD_COMPOST_FACTOR,
			3,
		);
	});

	it("blocks donation of opened prepared meals expiring today (food safety gate)", () => {
		const plan = evaluateFoodRescue({
			name: "Opened Pasta Tray",
			category: "PREPARED_MEAL",
			weightKg: 1.5,
			daysToExpiry: 0,
			isOpened: true,
			sourceLocation: "Event Hall",
		});
		expect(plan.urgencyTier).toBe("COMPOST_ONLY");
		expect(plan.mealEquivalents).toBe(0);
	});

	it("routes 4+ days items to FRESH_STOCK planned donation / FIFO", () => {
		const plan = evaluateFoodRescue({
			name: "Canned Lentils",
			category: "PACKAGED_DRY",
			weightKg: 3.0,
			daysToExpiry: 14,
			isOpened: false,
			sourceLocation: "Pantry",
		});
		expect(plan.urgencyTier).toBe("FRESH_STOCK");
		expect(plan.donationChannel).toBe("Priority Pantry Use / Planned Donation");
	});

	it("sorts food rescue items with CRITICAL_24H first and SOON_72H second", () => {
		const seeds = getSeedFoodRescueItems();
		const sorted = sortFoodRescueByUrgency(seeds);
		expect(sorted[0].urgencyTier).toBe("CRITICAL_24H");
		const tiers = sorted.map((s) => s.urgencyTier);
		expect(tiers.indexOf("CRITICAL_24H")).toBeLessThan(
			tiers.indexOf("SOON_72H"),
		);
		expect(tiers.indexOf("SOON_72H")).toBeLessThan(
			tiers.indexOf("COMPOST_ONLY"),
		);
	});
});
