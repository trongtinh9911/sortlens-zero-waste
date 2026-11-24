import type {
	FoodDonationChannel,
	FoodRescueInput,
	FoodRescuePlan,
	FoodUrgencyTier,
} from "./types";

/**
 * USDA / Feeding America standard: 1 meal equivalent = 1.2 lbs = 0.544 kg.
 */
export const KG_PER_MEAL_EQUIVALENT = 0.544;

/**
 * U.S. EPA WARM v16 food emission factors (kg CO2e avoided per kg diverted from landfill):
 * - Source Reduction / Donation (human consumption): 3.66 kg CO2e / kg
 * - Anaerobic Digestion / Composting (unavoidable spoilage): 0.58 kg CO2e / kg
 */
export const EPA_WARM_FOOD_DONATION_FACTOR = 3.66;
export const EPA_WARM_FOOD_COMPOST_FACTOR = 0.58;

export function evaluateFoodRescue(input: FoodRescueInput): FoodRescuePlan {
	const safeWeightKg = Math.max(0.05, Number(input.weightKg.toFixed(3)));
	const days = Math.round(input.daysToExpiry);

	const unsafeToDonate =
		days < 0 ||
		(input.isOpened &&
			(input.category === "PREPARED_MEAL" || input.category === "DAIRY_EGGS") &&
			days <= 0);

	let urgencyTier: FoodUrgencyTier;
	let donationChannel: FoodDonationChannel;
	let handlingAdvice: string;
	let mealEquivalents: number;
	let co2eAvoidedKg: number;
	let epaWarmBasis: string;

	if (unsafeToDonate) {
		urgencyTier = "COMPOST_ONLY";
		donationChannel = "Municipal / Campus Compost Bin";
		handlingAdvice =
			"Past safe consumption window or opened perishable—remove all packaging and compost to prevent landfill methane.";
		mealEquivalents = 0;
		co2eAvoidedKg = Number(
			(safeWeightKg * EPA_WARM_FOOD_COMPOST_FACTOR).toFixed(3),
		);
		epaWarmBasis = `EPA WARM Food Composting (${EPA_WARM_FOOD_COMPOST_FACTOR} kg CO2e/kg)`;
	} else if (days <= 1) {
		urgencyTier = "CRITICAL_24H";
		donationChannel = "Community Fridge / Campus Rapid Share";
		handlingAdvice =
			"Expires within 24 hours: label with date/allergens and place in nearest 24/7 Community Fridge or post to Campus Rapid Food Alert.";
		mealEquivalents = Number(
			(safeWeightKg / KG_PER_MEAL_EQUIVALENT).toFixed(2),
		);
		co2eAvoidedKg = Number(
			(safeWeightKg * EPA_WARM_FOOD_DONATION_FACTOR).toFixed(3),
		);
		epaWarmBasis = `EPA WARM Food Donation (${EPA_WARM_FOOD_DONATION_FACTOR} kg CO2e/kg)`;
	} else if (days <= 3) {
		urgencyTier = "SOON_72H";
		donationChannel = "Local Food Bank / Student Pantry";
		handlingAdvice =
			"2–3 day shelf life remaining: keep refrigerated below 4°C (40°F) and drop off at Student Basic Needs Pantry or Local Food Bank.";
		mealEquivalents = Number(
			(safeWeightKg / KG_PER_MEAL_EQUIVALENT).toFixed(2),
		);
		co2eAvoidedKg = Number(
			(safeWeightKg * EPA_WARM_FOOD_DONATION_FACTOR).toFixed(3),
		);
		epaWarmBasis = `EPA WARM Food Donation (${EPA_WARM_FOOD_DONATION_FACTOR} kg CO2e/kg)`;
	} else {
		urgencyTier = "FRESH_STOCK";
		donationChannel = "Priority Pantry Use / Planned Donation";
		handlingAdvice =
			"4+ days remaining: move to front of fridge (FIFO) or bundle into weekly Food Bank pickup.";
		mealEquivalents = Number(
			(safeWeightKg / KG_PER_MEAL_EQUIVALENT).toFixed(2),
		);
		co2eAvoidedKg = Number(
			(safeWeightKg * EPA_WARM_FOOD_DONATION_FACTOR).toFixed(3),
		);
		epaWarmBasis = `EPA WARM Source Reduction (${EPA_WARM_FOOD_DONATION_FACTOR} kg CO2e/kg)`;
	}

	return {
		id:
			input.id ??
			`food-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		name: input.name.trim(),
		category: input.category,
		weightKg: safeWeightKg,
		daysToExpiry: days,
		isOpened: input.isOpened,
		sourceLocation: input.sourceLocation.trim() || "Campus / Home Kitchen",
		urgencyTier,
		donationChannel,
		handlingAdvice,
		mealEquivalents,
		co2eAvoidedKg,
		epaWarmBasis,
		status: "PENDING",
	};
}

export function getSeedFoodRescueItems(): FoodRescuePlan[] {
	const seeds: FoodRescueInput[] = [
		{
			id: "seed-food-1",
			name: "Unsold Whole-Wheat Sandwiches (6 packs)",
			category: "PREPARED_MEAL",
			weightKg: 1.8,
			daysToExpiry: 1,
			isOpened: false,
			sourceLocation: "Campus Cafe B2",
		},
		{
			id: "seed-food-2",
			name: "Organic Baby Spinach & Mixed Greens",
			category: "PRODUCE",
			weightKg: 1.2,
			daysToExpiry: 2,
			isOpened: false,
			sourceLocation: "Dorm Shared Fridge 4F",
		},
		{
			id: "seed-food-3",
			name: "Artisan Sourdough Loaves (3 loaves)",
			category: "BAKERY",
			weightKg: 2.1,
			daysToExpiry: 1,
			isOpened: false,
			sourceLocation: "Student Union Bakery",
		},
		{
			id: "seed-food-4",
			name: "Unopened Oat Milk Cartons (4L)",
			category: "BEVERAGE",
			weightKg: 4.0,
			daysToExpiry: 3,
			isOpened: false,
			sourceLocation: "Event Catering Surplus",
		},
		{
			id: "seed-food-5",
			name: "Bruised Bananas & Spoiled Berries",
			category: "PRODUCE",
			weightKg: 0.9,
			daysToExpiry: -1,
			isOpened: true,
			sourceLocation: "Home Kitchen",
		},
	];
	return seeds.map(evaluateFoodRescue);
}

export function sortFoodRescueByUrgency(
	plans: FoodRescuePlan[],
): FoodRescuePlan[] {
	const order: Record<FoodUrgencyTier, number> = {
		CRITICAL_24H: 0,
		SOON_72H: 1,
		COMPOST_ONLY: 2,
		FRESH_STOCK: 3,
	};
	return [...plans].sort((a, b) => {
		if (order[a.urgencyTier] !== order[b.urgencyTier]) {
			return order[a.urgencyTier] - order[b.urgencyTier];
		}
		return a.daysToExpiry - b.daysToExpiry;
	});
}
