import type {
	ImageAnalysisResult,
	ImageMatchCandidate,
	ImageVisualProfile,
	ResinCode,
} from "./types";
import { WASTE_CATALOG } from "./wasteCatalog";

export interface SamplePhotoPreset {
	id: string;
	label: string;
	filename: string;
	subtitle: string;
	swatchHex: string;
	secondaryHex: string;
	resinHint: ResinCode | null;
	width: number;
	height: number;
}

export const SAMPLE_PHOTO_PRESETS: SamplePhotoPreset[] = [
	{
		id: "sample-greasy-pizza",
		label: "Greasy Pizza Box",
		filename: "greasy_pizza_box_cheese.jpg",
		subtitle: "Oil-stained corrugated kraft",
		swatchHex: "#9c7242",
		secondaryHex: "#c89b5e",
		resinHint: null,
		width: 120,
		height: 120,
	},
	{
		id: "sample-pla-cup",
		label: "PLA Bioplastic Cup (#7)",
		filename: "compostable_pla_cold_cup_7.png",
		subtitle: "Green-striped corn bioplastic",
		swatchHex: "#a8cbb0",
		secondaryHex: "#ddece0",
		resinHint: "#7 Other",
		width: 90,
		height: 150,
	},
	{
		id: "sample-lithium-powerbank",
		label: "Swollen Power Bank",
		filename: "lithium_power_bank_battery.jpg",
		subtitle: "Li-Ion MRF fire hazard",
		swatchHex: "#252a2f",
		secondaryHex: "#4f5760",
		resinHint: null,
		width: 150,
		height: 90,
	},
	{
		id: "sample-plastic-bag",
		label: "Plastic Grocery Bag (#4)",
		filename: "grocery_plastic_bag_ldpe_4.jpg",
		subtitle: "Flexible LDPE tangler film",
		swatchHex: "#e7ebee",
		secondaryHex: "#d3dce2",
		resinHint: "#4 LDPE",
		width: 110,
		height: 120,
	},
	{
		id: "sample-milk-tea-pp",
		label: "Boba Milk Tea Cup (#5 PP)",
		filename: "milk_tea_boba_cup_pp5.jpg",
		subtitle: "Polypropylene rigid cup",
		swatchHex: "#cfa97e",
		secondaryHex: "#ead8c0",
		resinHint: "#5 PP",
		width: 90,
		height: 150,
	},
	{
		id: "sample-aluminum-can",
		label: "Aluminum Soda Can",
		filename: "aluminum_soda_can_silver.jpg",
		subtitle: "High EPA WARM carbon payback",
		swatchHex: "#bcc5cc",
		secondaryHex: "#8d99a3",
		resinHint: null,
		width: 85,
		height: 150,
	},
];

function hexToRgb(hex: string): [number, number, number] {
	const clean = hex.replace("#", "");
	const num = parseInt(clean, 16);
	return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
	const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
	return (
		"#" +
		[clamp(r), clamp(g), clamp(b)]
			.map((v) => v.toString(16).padStart(2, "0"))
			.join("")
	);
}

function colorDistance(hexA: string, hexB: string): number {
	const [r1, g1, b1] = hexToRgb(hexA);
	const [r2, g2, b2] = hexToRgb(hexB);
	return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

export function detectResinFromText(text: string): ResinCode | null {
	const lower = text.toLowerCase().replace(/[_\-./]+/g, " ");
	if (/(#1|\bpet\b|\bpete\b|resin\s*1)/.test(lower)) return "#1 PET";
	if (/(#2|\bhdpe\b|resin\s*2)/.test(lower)) return "#2 HDPE";
	if (/(#3|\bpvc\b|vinyl|resin\s*3)/.test(lower)) return "#3 PVC";
	if (/(#4|\bldpe\b|plastic\s*bag|film|resin\s*4)/.test(lower))
		return "#4 LDPE";
	if (/(#5|\bpp5\b|\bpp\b|polypropylene|resin\s*5)/.test(lower)) return "#5 PP";
	if (/(#6|\beps\b|styrofoam|\bps\b|polystyrene|resin\s*6)/.test(lower))
		return "#6 PS";
	if (/(#7|\bpla\b|bioplastic|chip\s*bag|resin\s*7)/.test(lower))
		return "#7 Other";
	return null;
}

/**
 * Pure deterministic RGBA pixel buffer analyzer (runs cleanly in both Browser Canvas and Vitest Node).
 */
export function extractVisualProfileFromPixels(
	rgba: Uint8ClampedArray | number[],
	width: number,
	height: number,
): ImageVisualProfile {
	const totalPixels = Math.max(1, Math.floor(rgba.length / 4));
	let sumR = 0;
	let sumG = 0;
	let sumB = 0;
	let sumBrightness = 0;
	let sumSat = 0;
	let counted = 0;

	// Sample every pixel (or strided for very large buffers)
	const stride = totalPixels > 10000 ? Math.floor(totalPixels / 10000) : 1;

	for (let i = 0; i < totalPixels; i += stride) {
		const idx = i * 4;
		const r = rgba[idx] ?? 0;
		const g = rgba[idx + 1] ?? 0;
		const b = rgba[idx + 2] ?? 0;
		const a = rgba[idx + 3] ?? 255;
		if (a < 32) continue;

		sumR += r;
		sumG += g;
		sumB += b;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		const sat = max === 0 ? 0 : (max - min) / max;
		sumBrightness += brightness;
		sumSat += sat;
		counted++;
	}

	const safeCount = Math.max(1, counted);
	const avgR = sumR / safeCount;
	const avgG = sumG / safeCount;
	const avgB = sumB / safeCount;
	const averageBrightness = Number((sumBrightness / safeCount).toFixed(3));
	const averageSaturation = Number((sumSat / safeCount).toFixed(3));

	let varianceSum = 0;
	for (let i = 0; i < totalPixels; i += stride) {
		const idx = i * 4;
		const r = rgba[idx] ?? 0;
		const g = rgba[idx + 1] ?? 0;
		const b = rgba[idx + 2] ?? 0;
		const a = rgba[idx + 3] ?? 255;
		if (a < 32) continue;
		varianceSum += ((r - avgR) ** 2 + (g - avgG) ** 2 + (b - avgB) ** 2) / 3;
	}
	const colorVariance = Number(Math.sqrt(varianceSum / safeCount).toFixed(2));
	const aspectRatio = Number((width / Math.max(1, height)).toFixed(2));

	// Heuristic texture classification from luminance, chroma, and variance
	let detectedTexture: ImageVisualProfile["detectedTexture"] = "matte";
	if (
		averageSaturation < 0.14 &&
		colorVariance > 18 &&
		averageBrightness > 0.35 &&
		averageBrightness < 0.85
	) {
		detectedTexture = "metallic";
	} else if (averageBrightness > 0.72 && averageSaturation < 0.22) {
		detectedTexture = "translucent";
	} else if (
		avgR > avgG &&
		avgG > avgB &&
		averageSaturation > 0.16 &&
		averageSaturation < 0.68
	) {
		detectedTexture = "fibrous";
	} else if (colorVariance > 28) {
		detectedTexture = "glossy";
	}

	return {
		dominantHex: rgbToHex(avgR, avgG, avgB),
		averageBrightness,
		averageSaturation,
		colorVariance,
		aspectRatio,
		detectedTexture,
		width,
		height,
	};
}

export function generateSyntheticPixels(
	primaryHex: string,
	secondaryHex: string,
	width: number,
	height: number,
): Uint8ClampedArray {
	const [r1, g1, b1] = hexToRgb(primaryHex);
	const [r2, g2, b2] = hexToRgb(secondaryHex);
	const pixels = new Uint8ClampedArray(width * height * 4);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const idx = (y * width + x) * 4;
			const blend = (x + y) % 12 < 4 ? 0.35 : 0.08;
			pixels[idx] = Math.round(r1 * (1 - blend) + r2 * blend);
			pixels[idx + 1] = Math.round(g1 * (1 - blend) + g2 * blend);
			pixels[idx + 2] = Math.round(b1 * (1 - blend) + b2 * blend);
			pixels[idx + 3] = 255;
		}
	}
	return pixels;
}

export function matchWasteItemsFromAnalysis(
	visualProfile: ImageVisualProfile,
	sourceLabel: string,
	resinOverride: ResinCode | null = null,
): ImageAnalysisResult {
	const normalizedLabel = sourceLabel
		.toLowerCase()
		.replace(/[_\-./]+/g, " ")
		.trim();
	const labelTokens = normalizedLabel.split(/\s+/).filter((t) => t.length >= 2);
	const effectiveResin = resinOverride ?? detectResinFromText(normalizedLabel);

	const aspectBucket: "tall" | "wide" | "square" =
		visualProfile.aspectRatio < 0.85
			? "tall"
			: visualProfile.aspectRatio > 1.18
				? "wide"
				: "square";

	const brightnessBucket: "light" | "medium" | "dark" =
		visualProfile.averageBrightness < 0.34
			? "dark"
			: visualProfile.averageBrightness > 0.7
				? "light"
				: "medium";

	const scored: ImageMatchCandidate[] = WASTE_CATALOG.map((item) => {
		let score = 0;
		const matchReasons: string[] = [];

		// 1. Resin code exact match (strongest signal when user confirms or image/label indicates)
		if (effectiveResin && effectiveResin !== "NONE") {
			if (item.resinCode === effectiveResin) {
				score += 48;
				matchReasons.push(`Matches resin code ${effectiveResin}`);
			} else if (item.category === "PLASTIC") {
				score -= 12;
			}
		}

		// 2. Filename / keyword / alias matching
		let keywordHits = 0;
		const itemText = [item.name, ...item.aliases, ...item.visualHints.keywords]
			.join(" ")
			.toLowerCase();
		for (const token of labelTokens) {
			if (itemText.includes(token)) {
				keywordHits++;
			}
		}
		if (keywordHits > 0) {
			const kwScore = Math.min(54, keywordHits * 18);
			score += kwScore;
			matchReasons.push(
				`Matched ${keywordHits} item descriptor${keywordHits > 1 ? "s" : ""}`,
			);
		}

		// 3. Dominant color proximity in RGB space
		const dist = colorDistance(
			visualProfile.dominantHex,
			item.visualHints.dominantHex,
		);
		const colorScore = Math.max(0, 22 - dist / 14);
		score += colorScore;
		if (colorScore >= 13) {
			matchReasons.push(
				`Dominant tone close to ${item.visualHints.dominantHex}`,
			);
		}

		// 4. Brightness & surface texture heuristic
		if (item.visualHints.brightness === brightnessBucket) {
			score += 8;
		}
		if (item.visualHints.texture === visualProfile.detectedTexture) {
			score += 12;
			matchReasons.push(`Surface heuristic: ${visualProfile.detectedTexture}`);
		}

		// 5. Geometry aspect ratio heuristic
		if (item.visualHints.aspectHint === aspectBucket) {
			score += 7;
			matchReasons.push(`Aspect profile: ${aspectBucket}`);
		}

		// Normalize into clean confidence percentage (22%–98%)
		const confidence = Math.max(
			22,
			Math.min(98, Math.round((score / 110) * 100)),
		);

		return {
			item,
			confidence,
			matchReasons:
				matchReasons.length > 0 ? matchReasons : ["Visual baseline similarity"],
		};
	});

	scored.sort((a, b) => b.confidence - a.confidence);
	const topCandidates = scored.slice(0, 5);

	return {
		sourceLabel,
		visualProfile,
		detectedResinOverride: effectiveResin,
		candidates: topCandidates,
		topMatch: topCandidates[0].item,
	};
}

export function analyzeSamplePreset(
	preset: SamplePhotoPreset,
	resinOverride: ResinCode | null = null,
): ImageAnalysisResult {
	const pixels = generateSyntheticPixels(
		preset.swatchHex,
		preset.secondaryHex,
		preset.width,
		preset.height,
	);
	const visualProfile = extractVisualProfileFromPixels(
		pixels,
		preset.width,
		preset.height,
	);
	return matchWasteItemsFromAnalysis(
		visualProfile,
		preset.filename,
		resinOverride ?? preset.resinHint,
	);
}

/**
 * Browser Canvas analyzer for real user-uploaded/dragged photos.
 */
export async function analyzeImageFile(
	file: File,
	resinOverride: ResinCode | null = null,
): Promise<ImageAnalysisResult> {
	const dataUrl = await new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(new Error("Failed to read image file"));
		reader.readAsDataURL(file);
	});

	const img = await new Promise<HTMLImageElement>((resolve, reject) => {
		const el = new Image();
		el.onload = () => resolve(el);
		el.onerror = () => reject(new Error("Invalid image format"));
		el.src = dataUrl;
	});

	const maxDim = 160;
	const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
	const width = Math.max(1, Math.round(img.width * scale));
	const height = Math.max(1, Math.round(img.height * scale));

	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Canvas 2D context unavailable");
	}
	ctx.drawImage(img, 0, 0, width, height);
	const imageData = ctx.getImageData(0, 0, width, height);
	const visualProfile = extractVisualProfileFromPixels(
		imageData.data,
		width,
		height,
	);

	return matchWasteItemsFromAnalysis(visualProfile, file.name, resinOverride);
}
