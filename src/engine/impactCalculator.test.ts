import { describe, expect, it } from "vitest";
import { evaluateFoodRescue } from "./foodRescueRouter";
import {
	computeImpactSummary,
	createFoodRescueLedgerEntry,
	createWasteLedgerEntry,
	exportLedgerToCsv,
	exportLedgerToJson,
	getSeedLedgerEntries,
	MRF_COST_SAVED_PER_PREVENTED_CONTAMINATION_USD,
	MRF_FIRE_PREVENTION_VALUE_USD,
} from "./impactCalculator";
import { routeWasteItem } from "./municipalityRules";
import { getWasteItemById } from "./wasteCatalog";

describe("impactCalculator", () => {
	it("calculates exact EPA WARM CO2e avoided for recycled aluminum cans", () => {
		const alu = getWasteItemById("metal-aluminum-can")!;
		const decision = routeWasteItem(alu, "san-francisco");
		const entry = createWasteLedgerEntry(
			alu,
			decision,
			10,
			"2026-11-24T10:00:00.000Z",
		);
		// 10 cans * 14g = 0.14 kg * 9.13 kg CO2e/kg = 1.2782 kg CO2e
		expect(entry.weightKg).toBeCloseTo(0.14, 4);
		expect(entry.co2eAvoidedKg).toBeCloseTo(1.2782, 4);
		expect(entry.bin).toBe("RECYCLE");
	});

	it("credits contamination prevention when HIGH-risk item is kept out of curbside recycling", () => {
		const pvc = getWasteItemById("pvc-blister-pack")!;
		const decision = routeWasteItem(pvc, "london");
		const entry = createWasteLedgerEntry(pvc, decision, 1);
		expect(entry.bin).toBe("LANDFILL");
		expect(entry.preventedContamination).toBe(true);
		expect(entry.co2eAvoidedKg).toBeCloseTo(0.35, 3);
	});

	it("tracks prevented lithium-ion MRF fire hazards and MRF cost savings", () => {
		const powerbank = getWasteItemById("battery-lithium-powerbank")!;
		const decision = routeWasteItem(powerbank, "new-york");
		const entry = createWasteLedgerEntry(powerbank, decision, 1);
		const summary = computeImpactSummary([entry]);

		expect(summary.fireHazardsPrevented).toBe(1);
		expect(summary.contaminatedBatchesPrevented).toBe(1);
		expect(summary.diversionRatePct).toBe(100);
		expect(summary.estimatedMrfCostSavedUsd).toBeCloseTo(
			MRF_COST_SAVED_PER_PREVENTED_CONTAMINATION_USD +
				MRF_FIRE_PREVENTION_VALUE_USD,
			2,
		);
	});

	it("combines waste sorting and food rescue entries cleanly into KPI summary", () => {
		const box = getWasteItemById("paper-corrugated-box")!;
		const boxEntry = createWasteLedgerEntry(
			box,
			routeWasteItem(box, "seattle"),
			1,
		);

		const foodPlan = evaluateFoodRescue({
			name: "Campus Sandwiches",
			category: "PREPARED_MEAL",
			weightKg: 2.0,
			daysToExpiry: 1,
			isOpened: false,
			sourceLocation: "Cafe",
		});
		const foodEntry = createFoodRescueLedgerEntry(foodPlan, "seattle");

		const summary = computeImpactSummary([boxEntry, foodEntry]);
		expect(summary.totalItemsLogged).toBe(2);
		expect(summary.totalWeightDivertedKg).toBeCloseTo(2.38, 3);
		expect(summary.totalLandfillKg).toBe(0);
		expect(summary.diversionRatePct).toBe(100);
		expect(summary.mealsRescued).toBeGreaterThan(3.5);
		expect(summary.categoryBreakdown).toHaveLength(2);
	});

	it("handles empty ledger gracefully with zeroed metrics", () => {
		const summary = computeImpactSummary([]);
		expect(summary.totalItemsLogged).toBe(0);
		expect(summary.diversionRatePct).toBe(0);
		expect(summary.totalCo2eAvoidedKg).toBe(0);
		expect(summary.categoryBreakdown).toEqual([]);
	});

	it("exports RFC-4180 compliant CSV with proper quoting for commas and quotes", () => {
		const entries = getSeedLedgerEntries("san-francisco");
		entries[0].notes = 'Keep flat, "dry", and oil-free';
		const csv = exportLedgerToCsv(entries);
		const lines = csv.split("\n");
		expect(lines.length).toBe(entries.length + 1);
		expect(lines[0]).toContain("EPA WARM Factor (kg CO2e/kg)");
		expect(csv).toContain('"Keep flat, ""dry"", and oil-free"');
	});

	it("exports structured JSON audit report with schemaVersion, methodology, summary, and entries", () => {
		const entries = getSeedLedgerEntries("ho-chi-minh-city");
		const jsonText = exportLedgerToJson(entries);
		const parsed = JSON.parse(jsonText);
		expect(parsed.schemaVersion).toBe("sortlens-epa-warm-audit-v1");
		expect(parsed.methodology.model).toContain("EPA Waste Reduction Model");
		expect(parsed.summary.totalItemsLogged).toBe(entries.length);
		expect(parsed.entries).toHaveLength(entries.length);
	});
});
