import { describe, expect, it } from "vitest";
import {
	CITY_LIST,
	compareAcrossCities,
	getDivergentItems,
	routeWasteItem,
} from "./municipalityRules";
import { WASTE_CATALOG } from "./wasteCatalog";

describe("municipalityRules", () => {
	it("defines 5 real municipal rulebooks", () => {
		expect(CITY_LIST).toHaveLength(5);
		const ids = CITY_LIST.map((c) => c.id);
		expect(ids).toEqual([
			"san-francisco",
			"new-york",
			"seattle",
			"london",
			"ho-chi-minh-city",
		]);
	});

	it("routes every catalog item cleanly in all 5 cities without throwing", () => {
		for (const item of WASTE_CATALOG) {
			for (const city of CITY_LIST) {
				const decision = routeWasteItem(item, city.id);
				expect(decision.cityId).toBe(city.id);
				expect(decision.reason.length).toBeGreaterThan(10);
				expect(decision.binLabel.length).toBeGreaterThan(3);
			}
		}
	});

	it("diverges on greasy pizza box bottom across cities (SF/NYC/Seattle COMPOST vs London/HCMC LANDFILL)", () => {
		const cmp = compareAcrossCities("paper-greasy-pizza-box");
		expect(cmp.hasDivergence).toBe(true);
		expect(cmp.decisions["san-francisco"].bin).toBe("COMPOST");
		expect(cmp.decisions["new-york"].bin).toBe("COMPOST");
		expect(cmp.decisions["seattle"].bin).toBe("COMPOST");
		expect(cmp.decisions["london"].bin).toBe("LANDFILL");
		expect(cmp.decisions["ho-chi-minh-city"].bin).toBe("LANDFILL");
	});

	it("diverges on PLA bioplastic cup (SF/Seattle COMPOST vs NYC/London/HCMC LANDFILL)", () => {
		const cmp = compareAcrossCities("compost-pla-bioplastic-cup");
		expect(cmp.hasDivergence).toBe(true);
		expect(cmp.decisions["san-francisco"].bin).toBe("COMPOST");
		expect(cmp.decisions["seattle"].bin).toBe("COMPOST");
		expect(cmp.decisions["new-york"].bin).toBe("LANDFILL");
		expect(cmp.decisions["london"].bin).toBe("LANDFILL");
		expect(cmp.decisions["ho-chi-minh-city"].bin).toBe("LANDFILL");
	});

	it("captures NYC DSNY unique rigid plastic acceptance for red #6 PS party cup and black takeout trays", () => {
		expect(routeWasteItem("ps-red-party-cup", "new-york").bin).toBe("RECYCLE");
		expect(routeWasteItem("ps-red-party-cup", "san-francisco").bin).toBe(
			"LANDFILL",
		);
		expect(routeWasteItem("ps-red-party-cup", "london").bin).toBe("LANDFILL");

		expect(routeWasteItem("pet-black-takeout-tray", "new-york").bin).toBe(
			"RECYCLE",
		);
		expect(routeWasteItem("pet-black-takeout-tray", "seattle").bin).toBe(
			"LANDFILL",
		);
	});

	it("diverges on PE-lined hot paper coffee cup (SF/Seattle RECYCLE, London SPECIAL_DROPOFF, NYC/HCMC LANDFILL)", () => {
		const cmp = compareAcrossCities("paper-coffee-cup");
		expect(cmp.decisions["san-francisco"].bin).toBe("RECYCLE");
		expect(cmp.decisions["seattle"].bin).toBe("RECYCLE");
		expect(cmp.decisions["london"].bin).toBe("SPECIAL_DROPOFF");
		expect(cmp.decisions["new-york"].bin).toBe("LANDFILL");
		expect(cmp.decisions["ho-chi-minh-city"].bin).toBe("LANDFILL");
	});

	it("routes plastic grocery bags out of curbside recycling in every city to prevent MRF tangling", () => {
		const cmp = compareAcrossCities("ldpe-grocery-bag");
		for (const city of CITY_LIST) {
			expect(cmp.decisions[city.id].bin).not.toBe("RECYCLE");
			expect(cmp.decisions[city.id].preventsContamination).toBe(true);
		}
		expect(cmp.decisions["london"].bin).toBe("SPECIAL_DROPOFF");
		expect(cmp.decisions["ho-chi-minh-city"].bin).toBe("LANDFILL");
	});

	it("routes Tetra Pak cartons to SPECIAL_DROPOFF in HCMC and RECYCLE in SF/NYC/Seattle/London", () => {
		const cmp = compareAcrossCities("paper-tetra-pak");
		expect(cmp.decisions["ho-chi-minh-city"].bin).toBe("SPECIAL_DROPOFF");
		expect(cmp.decisions["san-francisco"].bin).toBe("RECYCLE");
		expect(cmp.decisions["new-york"].bin).toBe("RECYCLE");
		expect(cmp.decisions["seattle"].bin).toBe("RECYCLE");
		expect(cmp.decisions["london"].bin).toBe("RECYCLE");
	});

	it("routes all FIRE_HAZARD lithium battery items to SPECIAL_DROPOFF in all 5 cities with fire warning", () => {
		const fireItems = [
			"battery-lithium-powerbank",
			"battery-disposable-vape",
			"ewaste-old-smartphone",
		];
		for (const id of fireItems) {
			for (const city of CITY_LIST) {
				const decision = routeWasteItem(id, city.id);
				expect(decision.bin).toBe("SPECIAL_DROPOFF");
				expect(decision.contaminationWarning).toContain("FIRE HAZARD");
				expect(decision.preventsContamination).toBe(true);
			}
		}
	});

	it("rejects #3 PVC blister packs from curbside recycling across all 5 cities", () => {
		for (const city of CITY_LIST) {
			const decision = routeWasteItem("pvc-blister-pack", city.id);
			expect(decision.bin).toBe("LANDFILL");
			expect(decision.preventsContamination).toBe(true);
		}
	});

	it("accepts #5 PP milk tea cups for recycling in all 5 cities once rinsed", () => {
		for (const city of CITY_LIST) {
			const decision = routeWasteItem("pp-milk-tea-cup", city.id);
			expect(decision.bin).toBe("RECYCLE");
		}
	});

	it("returns curated divergent items list where most items diverge across cities", () => {
		const divergent = getDivergentItems();
		expect(divergent.length).toBeGreaterThanOrEqual(10);
		const actuallyDivergent = divergent.filter((d) => d.hasDivergence);
		expect(actuallyDivergent.length).toBeGreaterThanOrEqual(9);
	});

	it("throws on unknown waste item id", () => {
		expect(() =>
			routeWasteItem("non-existent-item", "san-francisco"),
		).toThrow();
	});
});
