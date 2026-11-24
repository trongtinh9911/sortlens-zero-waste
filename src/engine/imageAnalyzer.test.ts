import { describe, expect, it } from "vitest";
import {
	analyzeSamplePreset,
	detectResinFromText,
	extractVisualProfileFromPixels,
	generateSyntheticPixels,
	matchWasteItemsFromAnalysis,
	SAMPLE_PHOTO_PRESETS,
} from "./imageAnalyzer";

describe("imageAnalyzer", () => {
	it("detects resin codes #1 through #7 from filenames and user hints", () => {
		expect(detectResinFromText("clear_water_bottle_pet.jpg")).toBe("#1 PET");
		expect(detectResinFromText("milk_jug_#2_hdpe.png")).toBe("#2 HDPE");
		expect(detectResinFromText("pvc_blister_pack.jpg")).toBe("#3 PVC");
		expect(detectResinFromText("grocery_ldpe_film.jpg")).toBe("#4 LDPE");
		expect(detectResinFromText("yogurt_pp5_tub.png")).toBe("#5 PP");
		expect(detectResinFromText("styrofoam_eps_box.jpg")).toBe("#6 PS");
		expect(detectResinFromText("compostable_pla_cup_#7.png")).toBe("#7 Other");
		expect(detectResinFromText("random_photo_1234.jpg")).toBeNull();
	});

	it("extracts accurate dominant color, brightness, and aspect ratio from pixel buffers", () => {
		const pixels = generateSyntheticPixels("#9c7242", "#b88b55", 160, 80);
		const profile = extractVisualProfileFromPixels(pixels, 160, 80);
		expect(profile.aspectRatio).toBe(2);
		expect(profile.dominantHex).toMatch(/^#[0-9a-f]{6}$/);
		expect(profile.averageBrightness).toBeGreaterThan(0.3);
		expect(profile.averageBrightness).toBeLessThan(0.7);
		expect(profile.detectedTexture).toBe("fibrous");
	});

	it("identifies all 6 sample photo presets accurately", () => {
		const expectedIds: Record<string, string> = {
			"sample-greasy-pizza": "paper-greasy-pizza-box",
			"sample-pla-cup": "compost-pla-bioplastic-cup",
			"sample-lithium-powerbank": "battery-lithium-powerbank",
			"sample-plastic-bag": "ldpe-grocery-bag",
			"sample-milk-tea-pp": "pp-milk-tea-cup",
			"sample-aluminum-can": "metal-aluminum-can",
		};

		for (const preset of SAMPLE_PHOTO_PRESETS) {
			const result = analyzeSamplePreset(preset);
			expect(result.candidates).toHaveLength(5);
			expect(result.topMatch.id).toBe(expectedIds[preset.id]);
			expect(result.candidates[0].confidence).toBeGreaterThanOrEqual(55);
		}
	});

	it("re-ranks matches cleanly when user overrides resin code (#1–#7)", () => {
		const neutralPixels = generateSyntheticPixels(
			"#d8e0e4",
			"#c5d0d5",
			90,
			150,
		);
		const profile = extractVisualProfileFromPixels(neutralPixels, 90, 150);

		const asPet = matchWasteItemsFromAnalysis(
			profile,
			"clear_cup.jpg",
			"#1 PET",
		);
		expect(asPet.topMatch.resinCode).toBe("#1 PET");

		const asPla = matchWasteItemsFromAnalysis(
			profile,
			"clear_cup.jpg",
			"#7 Other",
		);
		expect(asPla.topMatch.resinCode).toBe("#7 Other");

		const asPp = matchWasteItemsFromAnalysis(profile, "clear_cup.jpg", "#5 PP");
		expect(asPp.topMatch.resinCode).toBe("#5 PP");
	});
});
