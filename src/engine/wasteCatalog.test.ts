import { describe, expect, it } from "vitest";
import {
	getWasteItemById,
	RESIN_CODES,
	searchWasteCatalog,
	WASTE_CATALOG,
} from "./wasteCatalog";

describe("wasteCatalog", () => {
	it("contains at least 50 real household and campus waste items", () => {
		expect(WASTE_CATALOG.length).toBeGreaterThanOrEqual(50);
	});

	it("has unique IDs and valid weights, prep steps, and EPA WARM factors for every item", () => {
		const ids = new Set<string>();
		for (const item of WASTE_CATALOG) {
			expect(ids.has(item.id)).toBe(false);
			ids.add(item.id);
			expect(item.weightGrams).toBeGreaterThan(0);
			expect(item.epaWarmFactorKgCo2ePerKg).toBeGreaterThanOrEqual(0);
			expect(item.prepSteps.length).toBeGreaterThan(0);
			expect(item.contaminationNote.length).toBeGreaterThan(10);
		}
	});

	it("covers all 7 Resin Identification Codes (#1 PET through #7 Other)", () => {
		for (const code of RESIN_CODES) {
			const matches = searchWasteCatalog("", { resinCode: code });
			expect(matches.length).toBeGreaterThanOrEqual(2);
		}
	});

	it("distinguishes clean pizza box lid from greasy pizza box bottom", () => {
		const cleanLid = getWasteItemById("paper-clean-pizza-lid");
		const greasyBase = getWasteItemById("paper-greasy-pizza-box");
		expect(cleanLid).toBeDefined();
		expect(greasyBase).toBeDefined();
		expect(cleanLid!.contaminationRisk).toBe("NONE");
		expect(greasyBase!.contaminationRisk).toBe("HIGH");
		expect(cleanLid!.epaWarmFactorKgCo2ePerKg).toBeGreaterThan(
			greasyBase!.epaWarmFactorKgCo2ePerKg,
		);
	});

	it("flags lithium-ion batteries, vapes, and smartphones as FIRE_HAZARD", () => {
		const hazards = searchWasteCatalog("", { risk: "FIRE_HAZARD" });
		const hazardIds = hazards.map((h) => h.id);
		expect(hazardIds).toContain("battery-lithium-powerbank");
		expect(hazardIds).toContain("battery-disposable-vape");
		expect(hazardIds).toContain("ewaste-old-smartphone");
	});

	it("supports alias and multilingual search queries", () => {
		expect(searchWasteCatalog("styrofoam").length).toBeGreaterThanOrEqual(2);
		expect(
			searchWasteCatalog("trà sữa").some((i) => i.id === "pp-milk-tea-cup"),
		).toBe(true);
		expect(
			searchWasteCatalog("túi nilon").some((i) => i.id === "ldpe-grocery-bag"),
		).toBe(true);
	});

	it("assigns highest EPA WARM emission reduction factor to aluminum cans", () => {
		const aluCan = getWasteItemById("metal-aluminum-can");
		expect(aluCan).toBeDefined();
		expect(aluCan!.epaWarmFactorKgCo2ePerKg).toBeCloseTo(9.13, 2);
	});
});
