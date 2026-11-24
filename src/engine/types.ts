export type ResinCode =
	| "#1 PET"
	| "#2 HDPE"
	| "#3 PVC"
	| "#4 LDPE"
	| "#5 PP"
	| "#6 PS"
	| "#7 Other"
	| "NONE";

export type MaterialCategory =
	| "PLASTIC"
	| "PAPER_CARDBOARD"
	| "METAL"
	| "GLASS"
	| "COMPOSTABLE"
	| "EWASTE"
	| "BATTERY_HAZARD"
	| "TEXTILE_MISC";

export type ContaminationRisk = "NONE" | "MODERATE" | "HIGH" | "FIRE_HAZARD";

export type BinType = "RECYCLE" | "COMPOST" | "LANDFILL" | "SPECIAL_DROPOFF";

export type CityId =
	| "san-francisco"
	| "new-york"
	| "seattle"
	| "london"
	| "ho-chi-minh-city";

export interface VisualHints {
	dominantHex: string;
	brightness: "light" | "medium" | "dark";
	texture: "glossy" | "matte" | "metallic" | "translucent" | "fibrous";
	aspectHint: "tall" | "wide" | "square";
	keywords: string[];
}

export interface WasteItem {
	id: string;
	name: string;
	aliases: string[];
	category: MaterialCategory;
	resinCode: ResinCode;
	weightGrams: number;
	contaminationRisk: ContaminationRisk;
	contaminationNote: string;
	prepSteps: string[];
	epaWarmFactorKgCo2ePerKg: number;
	epaWarmCategory: string;
	description: string;
	isRigidPlastic?: boolean;
	isFilmOrTangler?: boolean;
	isBioplasticPla?: boolean;
	isGreasyPaper?: boolean;
	isFoamPolystyrene?: boolean;
	visualHints: VisualHints;
}

export interface CityProfile {
	id: CityId;
	name: string;
	region: string;
	agency: string;
	programName: string;
	binLabels: Record<BinType, string>;
	baselineContaminationRatePct: number;
	mrfNotes: string;
}

export interface RoutingDecision {
	itemId: string;
	itemName: string;
	cityId: CityId;
	cityName: string;
	agency: string;
	bin: BinType;
	binLabel: string;
	reason: string;
	mrfImpactNote: string;
	contaminationWarning: string | null;
	prepChecklist: string[];
	diversionEligible: boolean;
	preventsContamination: boolean;
}

export interface ImageVisualProfile {
	dominantHex: string;
	averageBrightness: number;
	averageSaturation: number;
	colorVariance: number;
	aspectRatio: number;
	detectedTexture: "glossy" | "matte" | "metallic" | "translucent" | "fibrous";
	width: number;
	height: number;
}

export interface ImageMatchCandidate {
	item: WasteItem;
	confidence: number;
	matchReasons: string[];
}

export interface ImageAnalysisResult {
	sourceLabel: string;
	visualProfile: ImageVisualProfile;
	detectedResinOverride: ResinCode | null;
	candidates: ImageMatchCandidate[];
	topMatch: WasteItem;
}

export type FoodUrgencyTier =
	| "CRITICAL_24H"
	| "SOON_72H"
	| "FRESH_STOCK"
	| "COMPOST_ONLY";

export type FoodDonationChannel =
	| "Community Fridge / Campus Rapid Share"
	| "Local Food Bank / Student Pantry"
	| "Priority Pantry Use / Planned Donation"
	| "Municipal / Campus Compost Bin";

export type FoodCategory =
	| "PRODUCE"
	| "BAKERY"
	| "DAIRY_EGGS"
	| "PREPARED_MEAL"
	| "PACKAGED_DRY"
	| "BEVERAGE";

export interface FoodRescueInput {
	id?: string;
	name: string;
	category: FoodCategory;
	weightKg: number;
	daysToExpiry: number;
	isOpened: boolean;
	sourceLocation: string;
}

export interface FoodRescuePlan {
	id: string;
	name: string;
	category: FoodCategory;
	weightKg: number;
	daysToExpiry: number;
	isOpened: boolean;
	sourceLocation: string;
	urgencyTier: FoodUrgencyTier;
	donationChannel: FoodDonationChannel;
	handlingAdvice: string;
	mealEquivalents: number;
	co2eAvoidedKg: number;
	epaWarmBasis: string;
	status: "PENDING" | "RESCUED" | "COMPOSTED";
}

export type LedgerEntryType = "WASTE_SORT" | "FOOD_RESCUE";

export interface LedgerEntry {
	id: string;
	timestamp: string;
	entryType: LedgerEntryType;
	itemId: string;
	itemName: string;
	category: MaterialCategory | "FOOD_RESCUE";
	cityId: CityId;
	cityName: string;
	bin: BinType;
	weightKg: number;
	epaWarmFactor: number;
	co2eAvoidedKg: number;
	contaminationRisk: ContaminationRisk;
	preventedContamination: boolean;
	preventedFireHazard: boolean;
	mealEquivalents: number;
	notes: string;
}

export interface CategoryImpactBreakdown {
	category: string;
	label: string;
	weightKg: number;
	co2eAvoidedKg: number;
	itemCount: number;
}

export interface ImpactSummary {
	totalItemsLogged: number;
	totalWeightProcessedKg: number;
	totalWeightDivertedKg: number;
	totalLandfillKg: number;
	diversionRatePct: number;
	totalCo2eAvoidedKg: number;
	contaminatedBatchesPrevented: number;
	fireHazardsPrevented: number;
	mealsRescued: number;
	estimatedMrfCostSavedUsd: number;
	categoryBreakdown: CategoryImpactBreakdown[];
}
