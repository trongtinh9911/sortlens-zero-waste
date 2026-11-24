import {
	EPA_WARM_FOOD_COMPOST_FACTOR,
	EPA_WARM_FOOD_DONATION_FACTOR,
} from "./foodRescueRouter";
import { MUNICIPALITIES, routeWasteItem } from "./municipalityRules";
import type {
	CategoryImpactBreakdown,
	CityId,
	FoodRescuePlan,
	ImpactSummary,
	LedgerEntry,
	RoutingDecision,
	WasteItem,
} from "./types";
import { getWasteItemById } from "./wasteCatalog";

/**
 * Average MRF contamination penalty avoided per prevented wish-cycling event:
 * Municipal studies (Recycling Partnership / SWANA) estimate each rejected single-stream
 * contamination incident adds ~$1.25–$2.50 in sorting downtime & landfill tipping fees per household batch.
 */
export const MRF_COST_SAVED_PER_PREVENTED_CONTAMINATION_USD = 1.85;
export const MRF_FIRE_PREVENTION_VALUE_USD = 12.5;

const CATEGORY_LABELS: Record<string, string> = {
	PLASTIC: "Plastics (#1–#7)",
	PAPER_CARDBOARD: "Paper & Cardboard",
	METAL: "Aluminum & Steel",
	GLASS: "Glass Containers",
	COMPOSTABLE: "Organics & Bioplastics",
	EWASTE: "Electronics (E-Waste)",
	BATTERY_HAZARD: "Batteries (Fire Hazard)",
	TEXTILE_MISC: "Textiles & Residuals",
	FOOD_RESCUE: "Rescued Edible Food",
};

export function createWasteLedgerEntry(
	item: WasteItem,
	decision: RoutingDecision,
	quantity = 1,
	timestamp = new Date().toISOString(),
): LedgerEntry {
	const safeQty = Math.max(1, Math.round(quantity));
	const weightKg = Number(((item.weightGrams * safeQty) / 1000).toFixed(4));

	// If diverted from landfill, credit EPA WARM diversion CO2e; if correctly kept out of recycling
	// as a HIGH contamination risk (e.g. greasy pizza box or PVC routed to Landfill), credit
	// 0.35 kg CO2e per prevented wish-cycling contamination event for protecting neighboring recyclables.
	const preventedFireHazard =
		item.contaminationRisk === "FIRE_HAZARD" &&
		decision.bin === "SPECIAL_DROPOFF";

	let co2eAvoidedKg = 0;
	if (decision.diversionEligible) {
		co2eAvoidedKg = Number(
			(weightKg * item.epaWarmFactorKgCo2ePerKg).toFixed(4),
		);
	} else if (decision.preventsContamination) {
		co2eAvoidedKg = Number((0.35 * safeQty).toFixed(4));
	}

	return {
		id: `led-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		timestamp,
		entryType: "WASTE_SORT",
		itemId: item.id,
		itemName: safeQty > 1 ? `${item.name} (×${safeQty})` : item.name,
		category: item.category,
		cityId: decision.cityId,
		cityName: decision.cityName,
		bin: decision.bin,
		weightKg,
		epaWarmFactor: item.epaWarmFactorKgCo2ePerKg,
		co2eAvoidedKg,
		contaminationRisk: item.contaminationRisk,
		preventedContamination: decision.preventsContamination,
		preventedFireHazard,
		mealEquivalents: 0,
		notes: decision.reason,
	};
}

export function createFoodRescueLedgerEntry(
	plan: FoodRescuePlan,
	cityId: CityId,
	timestamp = new Date().toISOString(),
): LedgerEntry {
	const isCompostOnly = plan.urgencyTier === "COMPOST_ONLY";
	const city = MUNICIPALITIES[cityId];

	return {
		id: `led-food-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		timestamp,
		entryType: "FOOD_RESCUE",
		itemId: plan.id,
		itemName: plan.name,
		category: "FOOD_RESCUE",
		cityId,
		cityName: city.name,
		bin: isCompostOnly ? "COMPOST" : "SPECIAL_DROPOFF",
		weightKg: plan.weightKg,
		epaWarmFactor: isCompostOnly
			? EPA_WARM_FOOD_COMPOST_FACTOR
			: EPA_WARM_FOOD_DONATION_FACTOR,
		co2eAvoidedKg: plan.co2eAvoidedKg,
		contaminationRisk: "NONE",
		preventedContamination: false,
		preventedFireHazard: false,
		mealEquivalents: plan.mealEquivalents,
		notes: `${plan.donationChannel} (${plan.sourceLocation})`,
	};
}

export function computeImpactSummary(entries: LedgerEntry[]): ImpactSummary {
	let totalWeightProcessedKg = 0;
	let totalWeightDivertedKg = 0;
	let totalLandfillKg = 0;
	let totalCo2eAvoidedKg = 0;
	let contaminatedBatchesPrevented = 0;
	let fireHazardsPrevented = 0;
	let mealsRescued = 0;

	const breakdownMap = new Map<string, CategoryImpactBreakdown>();

	for (const entry of entries) {
		totalWeightProcessedKg += entry.weightKg;
		if (entry.bin === "LANDFILL") {
			totalLandfillKg += entry.weightKg;
		} else {
			totalWeightDivertedKg += entry.weightKg;
		}
		totalCo2eAvoidedKg += entry.co2eAvoidedKg;
		if (entry.preventedContamination) contaminatedBatchesPrevented += 1;
		if (entry.preventedFireHazard) fireHazardsPrevented += 1;
		mealsRescued += entry.mealEquivalents;

		const existing = breakdownMap.get(entry.category) ?? {
			category: entry.category,
			label: CATEGORY_LABELS[entry.category] ?? entry.category,
			weightKg: 0,
			co2eAvoidedKg: 0,
			itemCount: 0,
		};
		existing.weightKg = Number((existing.weightKg + entry.weightKg).toFixed(4));
		existing.co2eAvoidedKg = Number(
			(existing.co2eAvoidedKg + entry.co2eAvoidedKg).toFixed(4),
		);
		existing.itemCount += 1;
		breakdownMap.set(entry.category, existing);
	}

	const diversionRatePct =
		totalWeightProcessedKg > 0
			? Number(
					((totalWeightDivertedKg / totalWeightProcessedKg) * 100).toFixed(1),
				)
			: 0;

	const estimatedMrfCostSavedUsd = Number(
		(
			contaminatedBatchesPrevented *
				MRF_COST_SAVED_PER_PREVENTED_CONTAMINATION_USD +
			fireHazardsPrevented * MRF_FIRE_PREVENTION_VALUE_USD
		).toFixed(2),
	);

	const categoryBreakdown = Array.from(breakdownMap.values()).sort(
		(a, b) => b.co2eAvoidedKg - a.co2eAvoidedKg,
	);

	return {
		totalItemsLogged: entries.length,
		totalWeightProcessedKg: Number(totalWeightProcessedKg.toFixed(3)),
		totalWeightDivertedKg: Number(totalWeightDivertedKg.toFixed(3)),
		totalLandfillKg: Number(totalLandfillKg.toFixed(3)),
		diversionRatePct,
		totalCo2eAvoidedKg: Number(totalCo2eAvoidedKg.toFixed(3)),
		contaminatedBatchesPrevented,
		fireHazardsPrevented,
		mealsRescued: Number(mealsRescued.toFixed(2)),
		estimatedMrfCostSavedUsd,
		categoryBreakdown,
	};
}

function escapeCsvCell(value: string | number | boolean): string {
	const str = String(value);
	if (/[",\r\n]/.test(str)) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

export function exportLedgerToCsv(entries: LedgerEntry[]): string {
	const headers = [
		"Entry ID",
		"Timestamp (ISO-8601)",
		"Entry Type",
		"Item Name",
		"Category",
		"Municipality",
		"Routed Bin",
		"Weight (kg)",
		"EPA WARM Factor (kg CO2e/kg)",
		"CO2e Avoided (kg)",
		"Contamination Risk",
		"Prevented MRF Contamination",
		"Prevented Fire Hazard",
		"Meals Rescued",
		"Routing Notes",
	];

	const rows = entries.map((e) =>
		[
			e.id,
			e.timestamp,
			e.entryType,
			e.itemName,
			e.category,
			e.cityName,
			e.bin,
			e.weightKg.toFixed(4),
			e.epaWarmFactor.toFixed(2),
			e.co2eAvoidedKg.toFixed(4),
			e.contaminationRisk,
			e.preventedContamination ? "YES" : "NO",
			e.preventedFireHazard ? "YES" : "NO",
			e.mealEquivalents.toFixed(2),
			e.notes,
		]
			.map(escapeCsvCell)
			.join(","),
	);

	return [headers.map(escapeCsvCell).join(","), ...rows].join("\n");
}

export function exportLedgerToJson(entries: LedgerEntry[]): string {
	const summary = computeImpactSummary(entries);
	const report = {
		schemaVersion: "sortlens-epa-warm-audit-v1",
		generatedAt: new Date().toISOString(),
		methodology: {
			model: "U.S. EPA Waste Reduction Model (WARM v16)",
			mealConversionBasis:
				"USDA / Feeding America (0.544 kg per meal equivalent)",
			contaminationPreventionBasis:
				"Tracks HIGH and FIRE_HAZARD wish-cycling items correctly excluded from curbside recycling streams (~25% national MRF contamination baseline).",
		},
		summary,
		entries,
	};
	return JSON.stringify(report, null, 2);
}

export function getSeedLedgerEntries(
	cityId: CityId = "san-francisco",
): LedgerEntry[] {
	const sampleSpecs: Array<{ id: string; qty: number; hoursAgo: number }> = [
		{ id: "paper-corrugated-box", qty: 2, hoursAgo: 18 },
		{ id: "metal-aluminum-can", qty: 6, hoursAgo: 15 },
		{ id: "paper-greasy-pizza-box", qty: 1, hoursAgo: 12 },
		{ id: "battery-lithium-powerbank", qty: 1, hoursAgo: 9 },
		{ id: "ldpe-grocery-bag", qty: 4, hoursAgo: 6 },
		{ id: "compost-pla-bioplastic-cup", qty: 2, hoursAgo: 4 },
		{ id: "hdpe-milk-jug", qty: 2, hoursAgo: 2 },
	];

	const now = Date.now();
	const wasteEntries = sampleSpecs
		.map((spec) => {
			const item = getWasteItemById(spec.id);
			if (!item) return null;
			const decision = routeWasteItem(item, cityId);
			const ts = new Date(now - spec.hoursAgo * 3600 * 1000).toISOString();
			return createWasteLedgerEntry(item, decision, spec.qty, ts);
		})
		.filter((entry): entry is LedgerEntry => entry !== null);

	return wasteEntries;
}
