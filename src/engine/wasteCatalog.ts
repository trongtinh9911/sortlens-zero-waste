import type {
	ContaminationRisk,
	MaterialCategory,
	ResinCode,
	WasteItem,
} from "./types";

/**
 * Curated catalog of 54 real household and university campus waste items.
 * Emission factors derived from U.S. EPA Waste Reduction Model (WARM v16)
 * expressed in kg CO2e avoided per kg of material diverted from landfill.
 */
export const WASTE_CATALOG: WasteItem[] = [
	// ===================== #1 PET PLASTICS =====================
	{
		id: "pet-water-bottle",
		name: "Clear Plastic Water / Soda Bottle",
		aliases: [
			"water bottle",
			"soda bottle",
			"pet bottle",
			"aquafina",
			"dasani",
			"coke bottle",
		],
		category: "PLASTIC",
		resinCode: "#1 PET",
		weightGrams: 22,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Leftover liquid degrades paper bales in single-stream MRFs and adds hauling weight.",
		prepSteps: [
			"Empty all liquid completely",
			"Quick rinse if sugary",
			"Re-attach cap tightly so small cap is captured",
		],
		epaWarmFactorKgCo2ePerKg: 1.13,
		epaWarmCategory: "PET (#1 Plastic)",
		description:
			"Standard clear polyethylene terephthalate beverage bottle with high secondary market demand.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#c8dce6",
			brightness: "light",
			texture: "translucent",
			aspectHint: "tall",
			keywords: ["bottle", "water", "soda", "pet", "clear", "drink"],
		},
	},
	{
		id: "pet-berry-clamshell",
		name: "Clear Thermoform Berry / Salad Clamshell",
		aliases: [
			"berry box",
			"salad container",
			"clamshell",
			"strawberry container",
			"thermoform",
		],
		category: "PLASTIC",
		resinCode: "#1 PET",
		weightGrams: 34,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Thermoform PET melts at a different intrinsic viscosity than bottle-grade PET; some MRFs reject it.",
		prepSteps: [
			"Remove absorbent fruit pad (landfill)",
			"Rinse food residue",
			"Keep lid closed flat",
		],
		epaWarmFactorKgCo2ePerKg: 1.13,
		epaWarmCategory: "PET (#1 Plastic)",
		description: "Clear hinged produce or bakery clamshell stamped #1 PET.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#dce6e2",
			brightness: "light",
			texture: "translucent",
			aspectHint: "wide",
			keywords: ["clamshell", "berry", "salad", "thermoform", "produce", "pet"],
		},
	},
	{
		id: "pet-peanut-butter-jar",
		name: "Peanut Butter / Condiment Jar (#1 PET)",
		aliases: ["peanut butter jar", "mayo jar", "plastic jar", "nut butter"],
		category: "PLASTIC",
		resinCode: "#1 PET",
		weightGrams: 48,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Thick oil and nut butter residue spoils entire recycling bales and attracts pests at MRFs.",
		prepSteps: [
			"Scrape jar clean with spatula",
			"Wash with warm soapy water",
			"Replace lid before binning",
		],
		epaWarmFactorKgCo2ePerKg: 1.13,
		epaWarmCategory: "PET (#1 Plastic)",
		description:
			"Wide-mouth PET food jar that must be oil-free before curbside recycling.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#b8824a",
			brightness: "medium",
			texture: "glossy",
			aspectHint: "tall",
			keywords: ["jar", "peanut", "butter", "condiment", "pet"],
		},
	},
	{
		id: "pet-iced-coffee-cup",
		name: "Clear Plastic Iced Coffee / Boba Cup (#1 PET)",
		aliases: [
			"iced coffee cup",
			"boba cup",
			"starbucks cold cup",
			"clear plastic cup",
		],
		category: "PLASTIC",
		resinCode: "#1 PET",
		weightGrams: 18,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Straws and lingering milk/ice spill onto paper streams inside collection trucks.",
		prepSteps: [
			"Dump ice and liquid",
			"Discard plastic straw in landfill",
			"Quick rinse cup and dome lid",
		],
		epaWarmFactorKgCo2ePerKg: 1.13,
		epaWarmCategory: "PET (#1 Plastic)",
		description:
			"Rigid cold beverage cup stamped #1 PET; distinct from PLA bioplastic lookalikes.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#d4c3a3",
			brightness: "light",
			texture: "translucent",
			aspectHint: "tall",
			keywords: ["iced", "coffee", "cold cup", "boba", "cup", "pet"],
		},
	},
	{
		id: "pet-black-takeout-tray",
		name: "Black Plastic Takeout Tray (#1/#5 Carbon Black)",
		aliases: ["black takeout", "sushi tray", "microwave tray", "black plastic"],
		category: "PLASTIC",
		resinCode: "#1 PET",
		weightGrams: 42,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Carbon-black pigment absorbs near-infrared (NIR) optical sorter beams at MRFs, causing automatic rejection.",
		prepSteps: [
			"Do NOT wish-cycle in optical-sorted MRFs",
			"Reuse for meal prep if intact",
			"Place in Landfill if city MRF rejects black plastic",
		],
		epaWarmFactorKgCo2ePerKg: 1.05,
		epaWarmCategory: "Mixed Plastics",
		description:
			"Dark carbon-black trays invisible to standard NIR optical recycling sensors.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#1e2022",
			brightness: "dark",
			texture: "glossy",
			aspectHint: "wide",
			keywords: ["black", "tray", "takeout", "sushi", "microwave"],
		},
	},

	// ===================== #2 HDPE PLASTICS =====================
	{
		id: "hdpe-milk-jug",
		name: "Natural Milk / Water Jug (#2 HDPE)",
		aliases: ["milk jug", "gallon jug", "hdpe jug", "water gallon"],
		category: "PLASTIC",
		resinCode: "#2 HDPE",
		weightGrams: 62,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Spoiled milk residue creates odor hazards and contaminates clean HDPE natural flakes.",
		prepSteps: [
			"Empty completely",
			"Swish with cold water",
			"Keep cap screwed on",
		],
		epaWarmFactorKgCo2ePerKg: 0.87,
		epaWarmCategory: "HDPE (#2 Plastic)",
		description:
			"High-value translucent natural #2 HDPE jug widely recycled across all major MRFs.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#ecefe8",
			brightness: "light",
			texture: "matte",
			aspectHint: "tall",
			keywords: ["milk", "jug", "gallon", "hdpe", "white"],
		},
	},
	{
		id: "hdpe-detergent-bottle",
		name: "Laundry Detergent / Shampoo Bottle (#2 HDPE)",
		aliases: [
			"detergent",
			"shampoo bottle",
			"soap bottle",
			"tide bottle",
			"conditioner",
		],
		category: "PLASTIC",
		resinCode: "#2 HDPE",
		weightGrams: 115,
		contaminationRisk: "NONE",
		contaminationNote:
			"Low contamination risk once drained; pigmented #2 HDPE has strong domestic recycling markets.",
		prepSteps: [
			"Drain remaining detergent/soap",
			"Quick rinse",
			"Leave cap on (remove spring pump if metal inside)",
		],
		epaWarmFactorKgCo2ePerKg: 0.87,
		epaWarmCategory: "HDPE (#2 Plastic)",
		description: "Colored rigid #2 HDPE household bottle.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#d96b27",
			brightness: "medium",
			texture: "matte",
			aspectHint: "tall",
			keywords: ["detergent", "shampoo", "laundry", "soap", "hdpe", "bottle"],
		},
	},
	{
		id: "hdpe-motor-oil-jug",
		name: "Motor Oil / Chemical Container (#2 HDPE)",
		aliases: [
			"motor oil",
			"bleach industrial",
			"pesticide jug",
			"antifreeze bottle",
		],
		category: "PLASTIC",
		resinCode: "#2 HDPE",
		weightGrams: 130,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Petroleum and toxic chemical residues permanently ruin entire recycled plastic resin batches.",
		prepSteps: [
			"Drain oil into sealed collection pan",
			"NEVER place in curbside recycling",
			"Take to Household Hazardous Waste (HHW) drop-off",
		],
		epaWarmFactorKgCo2ePerKg: 0.87,
		epaWarmCategory: "HDPE (#2 Plastic)",
		description:
			"Hazardous-product #2 HDPE bottle prohibited from residential recycling streams.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#30343a",
			brightness: "dark",
			texture: "matte",
			aspectHint: "tall",
			keywords: ["oil", "motor", "chemical", "hazardous", "hdpe"],
		},
	},

	// ===================== #3 PVC PLASTICS =====================
	{
		id: "pvc-blister-pack",
		name: "PVC Blister Pack / Hardware Packaging (#3 PVC)",
		aliases: [
			"blister pack",
			"pvc plastic",
			"pill pack",
			"vinyl packaging",
			"shower curtain",
		],
		category: "PLASTIC",
		resinCode: "#3 PVC",
		weightGrams: 28,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Even trace #3 PVC releases hydrochloric acid when heated with #1 PET, ruining entire bales of recycled plastic.",
		prepSteps: [
			"Peel off paper backing (recycle clean paper)",
			"Place #3 PVC plastic strictly in Landfill",
		],
		epaWarmFactorKgCo2ePerKg: 0.92,
		epaWarmCategory: "Mixed Plastics",
		description:
			"Polyvinyl chloride packaging containing chlorine additives incompatible with curbside MRFs.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#c4cdd4",
			brightness: "light",
			texture: "glossy",
			aspectHint: "wide",
			keywords: ["pvc", "blister", "vinyl", "hardware", "pill"],
		},
	},
	{
		id: "pvc-pipe-tubing",
		name: "PVC Pipe / Vinyl Tubing (#3 PVC)",
		aliases: ["pvc pipe", "garden hose", "vinyl tube", "plumbing pipe"],
		category: "PLASTIC",
		resinCode: "#3 PVC",
		weightGrams: 240,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Long hoses and rigid PVC pipes wrap around MRF sorting discs and contaminate PET/HDPE resin.",
		prepSteps: [
			"Never place in curbside blue bin",
			"Take clean construction PVC to building-supply drop-off or Landfill",
		],
		epaWarmFactorKgCo2ePerKg: 0.92,
		epaWarmCategory: "Mixed Plastics",
		description: "Chlorinated vinyl pipe or flexible hose.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#e6e8ea",
			brightness: "light",
			texture: "matte",
			aspectHint: "wide",
			keywords: ["pipe", "hose", "pvc", "tubing", "vinyl"],
		},
	},

	// ===================== #4 LDPE PLASTICS =====================
	{
		id: "ldpe-grocery-bag",
		name: "Plastic Grocery / Shopping Bag (#4 LDPE Film)",
		aliases: [
			"plastic bag",
			"grocery bag",
			"shopping bag",
			"nylon bag",
			"túi nilon",
			"film bag",
		],
		category: "PLASTIC",
		resinCode: "#4 LDPE",
		weightGrams: 8,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Top #1 MRF tangler: loose bags wrap around rotating star-screen shafts, forcing daily manual knife shutdowns.",
		prepSteps: [
			"Empty receipts and crumbs",
			"Keep clean and dry",
			"Return to Supermarket Plastic Film Drop-off (NEVER loose in curbside)",
		],
		epaWarmFactorKgCo2ePerKg: 0.98,
		epaWarmCategory: "LDPE (#4 Film)",
		description:
			"Thin flexible #4 LDPE/HDPE carrier bag that jams automated single-stream sorting machinery.",
		isFilmOrTangler: true,
		visualHints: {
			dominantHex: "#e9ecef",
			brightness: "light",
			texture: "translucent",
			aspectHint: "square",
			keywords: ["bag", "grocery", "plastic bag", "film", "ldpe", "nilon"],
		},
	},
	{
		id: "ldpe-bubble-mailer",
		name: "Bubble Wrap / E-Commerce Poly Mailer (#4 LDPE)",
		aliases: [
			"bubble wrap",
			"amazon mailer",
			"poly mailer",
			"shipping pouch",
			"air pillows",
		],
		category: "PLASTIC",
		resinCode: "#4 LDPE",
		weightGrams: 16,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Flexible poly mailers jam optical belts and entangle spinning MRF sorters.",
		prepSteps: [
			"Deflate air pillows",
			"Peel off paper shipping label if possible",
			"Drop off at retail flexible-film bin or reuse",
		],
		epaWarmFactorKgCo2ePerKg: 0.98,
		epaWarmCategory: "LDPE (#4 Film)",
		description:
			"Stretchy LDPE shipping film recyclable only through store drop-off film streams.",
		isFilmOrTangler: true,
		visualHints: {
			dominantHex: "#dce4ec",
			brightness: "light",
			texture: "glossy",
			aspectHint: "wide",
			keywords: ["bubble", "mailer", "amazon", "pouch", "wrap", "ldpe"],
		},
	},
	{
		id: "ldpe-cling-wrap",
		name: "Food Cling Wrap / Dirty Ziploc Bag (#4 LDPE)",
		aliases: [
			"cling wrap",
			"saran wrap",
			"ziploc",
			"food wrap",
			"plastic wrap",
		],
		category: "PLASTIC",
		resinCode: "#4 LDPE",
		weightGrams: 6,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Food-soiled film cannot enter store drop-off film recycling and clogs curbside machinery.",
		prepSteps: [
			"Do NOT put in curbside recycling",
			"Place soiled food wrap in Landfill",
		],
		epaWarmFactorKgCo2ePerKg: 0.98,
		epaWarmCategory: "LDPE (#4 Film)",
		description:
			"Thin food-contact plastic film contaminated with oils and food residue.",
		isFilmOrTangler: true,
		visualHints: {
			dominantHex: "#d5dde0",
			brightness: "light",
			texture: "translucent",
			aspectHint: "wide",
			keywords: ["cling", "saran", "wrap", "ziploc", "film"],
		},
	},
	{
		id: "ldpe-squeeze-bottle",
		name: "Flexible Squeeze Bottle (Honey / Ketchup #4 LDPE)",
		aliases: [
			"squeeze bottle",
			"honey bottle",
			"mustard bottle",
			"ldpe bottle",
		],
		category: "PLASTIC",
		resinCode: "#4 LDPE",
		weightGrams: 32,
		contaminationRisk: "MODERATE",
		contaminationNote: "Thick sauce residue contaminates mixed plastic bales.",
		prepSteps: ["Rinse interior with warm water", "Keep cap attached"],
		epaWarmFactorKgCo2ePerKg: 0.98,
		epaWarmCategory: "LDPE (#4 Rigid)",
		description: "Squeezable rigid-wall #4 LDPE condiment container.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#d99a26",
			brightness: "medium",
			texture: "glossy",
			aspectHint: "tall",
			keywords: ["squeeze", "honey", "ketchup", "mustard", "ldpe"],
		},
	},

	// ===================== #5 PP PLASTICS =====================
	{
		id: "pp-yogurt-tub",
		name: "Yogurt / Butter / Hummus Tub (#5 PP)",
		aliases: [
			"yogurt cup",
			"yogurt tub",
			"butter tub",
			"hummus container",
			"pp tub",
		],
		category: "PLASTIC",
		resinCode: "#5 PP",
		weightGrams: 26,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Dairy and oil film spoils bales; foil peel-off lids must be separated.",
		prepSteps: [
			"Peel off foil seal completely",
			"Spoon out residue and quick rinse",
			"Snap plastic lid back on",
		],
		epaWarmFactorKgCo2ePerKg: 1.01,
		epaWarmCategory: "PP (#5 Plastic)",
		description:
			"Polypropylene dairy or deli tub increasingly accepted in modern MRFs.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#f2f0eb",
			brightness: "light",
			texture: "glossy",
			aspectHint: "square",
			keywords: ["yogurt", "tub", "butter", "hummus", "pp", "deli"],
		},
	},
	{
		id: "pp-milk-tea-cup",
		name: "Boba / Milk Tea Cup (#5 PP Rigid)",
		aliases: ["milk tea cup", "trà sữa", "boba tea", "pp cup", "takeaway cup"],
		category: "PLASTIC",
		resinCode: "#5 PP",
		weightGrams: 19,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Heat-sealed plastic film top and tapioca pearls contaminate recycling streams if left inside.",
		prepSteps: [
			"Peel off heat-seal film (landfill)",
			"Empty pearls into compost/trash",
			"Rinse cup thoroughly",
		],
		epaWarmFactorKgCo2ePerKg: 1.01,
		epaWarmCategory: "PP (#5 Plastic)",
		description: "Polypropylene cold drink cup common on university campuses.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#cfa97e",
			brightness: "medium",
			texture: "translucent",
			aspectHint: "tall",
			keywords: ["milk tea", "boba", "cup", "pp", "trasua"],
		},
	},
	{
		id: "pp-prescription-bottle",
		name: "Amber Prescription Pill Bottle (#5 PP)",
		aliases: [
			"pill bottle",
			"medicine bottle",
			"prescription bottle",
			"pharmacy bottle",
		],
		category: "PLASTIC",
		resinCode: "#5 PP",
		weightGrams: 15,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Bottles smaller than 2 inches fall through MRF trommel screens into broken glass residue.",
		prepSteps: [
			"Empty medication (use pharmacy take-back for unused pills)",
			"Peel personal label",
			"Check city size rule (often Landfill or pharmacy reuse)",
		],
		epaWarmFactorKgCo2ePerKg: 1.01,
		epaWarmCategory: "PP (#5 Plastic)",
		description:
			"Small amber #5 PP pharmacy bottle that often misses optical sorters due to tiny diameter.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#c96c1d",
			brightness: "medium",
			texture: "translucent",
			aspectHint: "tall",
			keywords: ["pill", "medicine", "prescription", "pharmacy", "pp"],
		},
	},
	{
		id: "pp-clear-deli-container",
		name: "Clear Round Takeout Soup Container (#5 PP)",
		aliases: [
			"deli container",
			"soup tub",
			"takeout container",
			"microwaveable container",
		],
		category: "PLASTIC",
		resinCode: "#5 PP",
		weightGrams: 29,
		contaminationRisk: "MODERATE",
		contaminationNote: "Broth and grease coat paper fiber if unwashed.",
		prepSteps: [
			"Empty broth and solids",
			"Quick soapy rinse",
			"Keep lid on if clean",
		],
		epaWarmFactorKgCo2ePerKg: 1.01,
		epaWarmCategory: "PP (#5 Plastic)",
		description:
			"Durable #5 polypropylene food container great for reuse and accepted in #5 MRFs.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#e3e8e6",
			brightness: "light",
			texture: "translucent",
			aspectHint: "square",
			keywords: ["deli", "soup", "takeout", "container", "pp"],
		},
	},
	{
		id: "pp-plastic-cutlery",
		name: "Disposable Plastic Fork / Spoon / Straw (#5 PP/#6 PS)",
		aliases: [
			"plastic fork",
			"plastic spoon",
			"plastic knife",
			"straw",
			"utensils",
			"cutlery",
		],
		category: "PLASTIC",
		resinCode: "#5 PP",
		weightGrams: 5,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Small utensils and straws slip through MRF screens, jam gears, and have zero recycling market value.",
		prepSteps: [
			"Never place loose utensils or straws in recycling",
			"Dispose in Landfill (opt out on delivery apps)",
		],
		epaWarmFactorKgCo2ePerKg: 0.92,
		epaWarmCategory: "Mixed Plastics",
		description:
			"Single-use plastic cutlery too small and mixed-resin for municipal recycling.",
		isRigidPlastic: false,
		visualHints: {
			dominantHex: "#eaeaea",
			brightness: "light",
			texture: "glossy",
			aspectHint: "tall",
			keywords: ["fork", "spoon", "straw", "cutlery", "utensil"],
		},
	},

	// ===================== #6 PS PLASTICS =====================
	{
		id: "ps-styrofoam-clamshell",
		name: "Expanded Styrofoam Takeout Box (#6 EPS Foam)",
		aliases: ["styrofoam", "foam box", "hộp xốp", "eps foam", "foam cup"],
		category: "PLASTIC",
		resinCode: "#6 PS",
		weightGrams: 12,
		contaminationRisk: "HIGH",
		contaminationNote:
			"95% air foam shatters into micro-beads inside compactor trucks, contaminating paper and glass streams permanently.",
		prepSteps: [
			"NEVER place foam in curbside recycling",
			"Place food-soiled foam in Landfill",
		],
		epaWarmFactorKgCo2ePerKg: 0.92,
		epaWarmCategory: "Mixed Plastics",
		description:
			"Expanded polystyrene (#6 EPS) food box prohibited in curbside recycling across almost all cities.",
		isFoamPolystyrene: true,
		visualHints: {
			dominantHex: "#f5f6f7",
			brightness: "light",
			texture: "matte",
			aspectHint: "wide",
			keywords: ["styrofoam", "foam", "eps", "takeout", "ps", "xop"],
		},
	},
	{
		id: "ps-packing-blocks",
		name: "Clean Appliance Styrofoam Packing Blocks (#6 EPS)",
		aliases: ["packing foam", "styrofoam block", "tv foam", "packing peanuts"],
		category: "PLASTIC",
		resinCode: "#6 PS",
		weightGrams: 140,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Crumbles into static beads inside curbside MRFs; requires specialized densifier drop-off.",
		prepSteps: [
			"Remove tape and cardboard",
			"Keep clean and dry",
			"Bring to EPS Densifier Drop-off (or Landfill if unavailable)",
		],
		epaWarmFactorKgCo2ePerKg: 0.92,
		epaWarmCategory: "Mixed Plastics",
		description:
			"Clean bulky white expanded polystyrene packaging from electronics and furniture.",
		isFoamPolystyrene: true,
		visualHints: {
			dominantHex: "#ffffff",
			brightness: "light",
			texture: "matte",
			aspectHint: "wide",
			keywords: ["packing", "foam", "styrofoam", "block", "eps", "ps"],
		},
	},
	{
		id: "ps-red-party-cup",
		name: "Rigid Red Party Cup (#6 PS)",
		aliases: ["solo cup", "red cup", "party cup", "ps cup"],
		category: "PLASTIC",
		resinCode: "#6 PS",
		weightGrams: 14,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Rigid polystyrene (#6) lacks stable reclaimer markets outside specialized rigid-plastic MRFs.",
		prepSteps: [
			"Empty beverage",
			"Check local city rule (NYC accepts rigid #6, most cities send to Landfill)",
		],
		epaWarmFactorKgCo2ePerKg: 0.92,
		epaWarmCategory: "Mixed Plastics",
		description: "Rigid non-foam #6 polystyrene party cup.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#cc2936",
			brightness: "medium",
			texture: "glossy",
			aspectHint: "tall",
			keywords: ["solo", "red cup", "party", "cup", "ps"],
		},
	},

	// ===================== #7 OTHER & MULTI-LAYER =====================
	{
		id: "other-chip-bag",
		name: "Foil-Lined Snack / Chip Bag (#7 Multi-Layer)",
		aliases: [
			"chip bag",
			"crisp packet",
			"doritos bag",
			"snack wrapper",
			"candy wrapper",
			"mylar",
		],
		category: "PLASTIC",
		resinCode: "#7 Other",
		weightGrams: 11,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Fused aluminum-plastic laminate cannot be separated in paper, metal, or plastic MRFs.",
		prepSteps: [
			"Do NOT put in recycling (even though inside looks metallic)",
			"Place in Landfill (or TerraCycle drop-off)",
		],
		epaWarmFactorKgCo2ePerKg: 0.85,
		epaWarmCategory: "Mixed Plastics",
		description:
			"Metallized multi-layer film pouch used for chips, snacks, and instant noodles.",
		isFilmOrTangler: true,
		visualHints: {
			dominantHex: "#c8a93b",
			brightness: "medium",
			texture: "metallic",
			aspectHint: "tall",
			keywords: ["chip", "snack", "wrapper", "foil pouch", "crisp", "mylar"],
		},
	},
	{
		id: "other-toothpaste-tube",
		name: "Multi-Layer Toothpaste Tube (#7 Mixed)",
		aliases: ["toothpaste", "lotion tube", "cosmetic tube"],
		category: "PLASTIC",
		resinCode: "#7 Other",
		weightGrams: 24,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Legacy foil-plastic laminate tubes cannot be pulped or melted cleanly unless stamped #2 HDPE.",
		prepSteps: [
			"Check for #2 HDPE recyclable symbol; otherwise Landfill",
			"Do not leave paste residue",
		],
		epaWarmFactorKgCo2ePerKg: 0.85,
		epaWarmCategory: "Mixed Plastics",
		description: "Composite plastic/aluminum hygiene tube.",
		visualHints: {
			dominantHex: "#4f92c8",
			brightness: "medium",
			texture: "glossy",
			aspectHint: "wide",
			keywords: ["toothpaste", "tube", "cosmetic"],
		},
	},
	{
		id: "other-polycarbonate-bottle",
		name: "Hard Reusable Sports Bottle (#7 Polycarbonate/Tritan)",
		aliases: ["nalgene", "tritan bottle", "hard water bottle", "baby bottle"],
		category: "PLASTIC",
		resinCode: "#7 Other",
		weightGrams: 165,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Mixed resin #7 includes dozens of incompatible polymers that cannot be co-melted.",
		prepSteps: [
			"Donate if still usable",
			"If cracked, Landfill (or specialty drop-off)",
		],
		epaWarmFactorKgCo2ePerKg: 0.85,
		epaWarmCategory: "Mixed Plastics",
		description: "Impact-resistant #7 reusable plastic bottle.",
		isRigidPlastic: true,
		visualHints: {
			dominantHex: "#3f7ea6",
			brightness: "medium",
			texture: "translucent",
			aspectHint: "tall",
			keywords: ["nalgene", "sports bottle", "reusable", "tritan"],
		},
	},

	// ===================== PAPER & CARDBOARD =====================
	{
		id: "paper-corrugated-box",
		name: "Clean Corrugated Shipping Box",
		aliases: [
			"cardboard box",
			"amazon box",
			"shipping box",
			"moving box",
			"carton",
		],
		category: "PAPER_CARDBOARD",
		resinCode: "NONE",
		weightGrams: 380,
		contaminationRisk: "NONE",
		contaminationNote:
			"Clean corrugated fiber has one of the highest GHG reductions in EPA WARM when recycled.",
		prepSteps: [
			"Remove foam/plastic air pillows",
			"Flatten box completely to save truck volume",
			"Keep dry from rain",
		],
		epaWarmFactorKgCo2ePerKg: 3.14,
		epaWarmCategory: "Corrugated Containers",
		description: "Dry fluted brown kraft cardboard shipping box.",
		visualHints: {
			dominantHex: "#b38b5d",
			brightness: "medium",
			texture: "fibrous",
			aspectHint: "wide",
			keywords: [
				"cardboard",
				"box",
				"amazon",
				"shipping",
				"corrugated",
				"kraft",
			],
		},
	},
	{
		id: "paper-greasy-pizza-box",
		name: "Greasy / Cheese-Soaked Pizza Box Bottom",
		aliases: [
			"greasy pizza box",
			"pizza box",
			"oily cardboard",
			"dirty pizza box",
		],
		category: "PAPER_CARDBOARD",
		resinCode: "NONE",
		weightGrams: 165,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Oil cannot be separated from paper fibers in water pulping tanks—greasy boxes cause paper mill rejection.",
		prepSteps: [
			"Tear off clean top lid for Recycling",
			"Remove pizza saver table",
			"Route greasy bottom to Compost (where accepted) or Landfill",
		],
		epaWarmFactorKgCo2ePerKg: 0.62,
		epaWarmCategory: "Food-Soiled Paper (Compost)",
		description:
			"Oil-saturated corrugated cardboard bottom — classic wish-cycling trap with divergent city rules.",
		isGreasyPaper: true,
		visualHints: {
			dominantHex: "#9e7444",
			brightness: "medium",
			texture: "fibrous",
			aspectHint: "square",
			keywords: ["pizza", "greasy", "oily", "cheese", "box", "cardboard"],
		},
	},
	{
		id: "paper-clean-pizza-lid",
		name: "Clean Torn Pizza Box Top Lid",
		aliases: ["clean pizza box", "pizza lid", "clean cardboard lid"],
		category: "PAPER_CARDBOARD",
		resinCode: "NONE",
		weightGrams: 110,
		contaminationRisk: "NONE",
		contaminationNote:
			"Grease-free top lids are clean corrugated fiber and fully recyclable.",
		prepSteps: [
			"Verify zero cheese or oil stains",
			"Flatten and place in Paper/Cardboard Recycling",
		],
		epaWarmFactorKgCo2ePerKg: 3.14,
		epaWarmCategory: "Corrugated Containers",
		description:
			"Clean top half of a pizza box separated from the greasy base.",
		visualHints: {
			dominantHex: "#c49d6e",
			brightness: "medium",
			texture: "fibrous",
			aspectHint: "square",
			keywords: ["pizza lid", "clean pizza", "cardboard"],
		},
	},
	{
		id: "paper-coffee-cup",
		name: "Hot Paper Coffee Cup (Polyethylene-Lined)",
		aliases: [
			"coffee cup",
			"starbucks cup",
			"hot cup",
			"paper cup",
			"takeaway coffee",
		],
		category: "PAPER_CARDBOARD",
		resinCode: "NONE",
		weightGrams: 14,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Waterproof LDPE plastic inner lining binds to paper pulp, causing rejection in standard paper mills.",
		prepSteps: [
			"Remove cardboard sleeve (Recycle)",
			"Dump liquid",
			"Check city rule: Landfill in most cities, Specialty/Compost only if certified",
		],
		epaWarmFactorKgCo2ePerKg: 1.45,
		epaWarmCategory: "Mixed Paper",
		description:
			"Single-use hot beverage cup lined internally with waterproof plastic film.",
		visualHints: {
			dominantHex: "#dfd7c8",
			brightness: "light",
			texture: "matte",
			aspectHint: "tall",
			keywords: ["coffee", "cup", "starbucks", "paper cup", "latte"],
		},
	},
	{
		id: "paper-tetra-pak",
		name: "Tetra Pak Milk / Oat Milk / Juice Carton",
		aliases: [
			"tetra pak",
			"milk carton",
			"oat milk",
			"juice box",
			"aseptic carton",
			"broth carton",
		],
		category: "PAPER_CARDBOARD",
		resinCode: "NONE",
		weightGrams: 36,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Multi-layer paper-poly-aluminum carton requires specialized hydrapulper mills.",
		prepSteps: [
			"Empty and quick rinse",
			"Do not crush flat if optical sorter needs 3D shape",
			"Keep cap on",
		],
		epaWarmFactorKgCo2ePerKg: 2.18,
		epaWarmCategory: "Aseptic Cartons",
		description: "Shelf-stable or gable-top food/beverage carton.",
		visualHints: {
			dominantHex: "#e5e0d5",
			brightness: "light",
			texture: "matte",
			aspectHint: "tall",
			keywords: ["tetra", "carton", "oat milk", "juice", "milk"],
		},
	},
	{
		id: "paper-office-sheets",
		name: "Clean Office Paper / Lecture Notes / Exam Sheets",
		aliases: [
			"office paper",
			"printer paper",
			"notebook paper",
			"lecture notes",
			"homework",
		],
		category: "PAPER_CARDBOARD",
		resinCode: "NONE",
		weightGrams: 95,
		contaminationRisk: "NONE",
		contaminationNote:
			"High-grade bleached fiber with very high carbon offset when recycled.",
		prepSteps: [
			"Remove plastic binders/clips (small staples are fine)",
			"Keep dry and unshredded if possible",
		],
		epaWarmFactorKgCo2ePerKg: 3.55,
		epaWarmCategory: "Office Paper",
		description: "Clean white printing paper and study handouts.",
		visualHints: {
			dominantHex: "#f4f4f0",
			brightness: "light",
			texture: "fibrous",
			aspectHint: "tall",
			keywords: ["paper", "notes", "office", "printer", "document", "sheet"],
		},
	},
	{
		id: "paper-cereal-box",
		name: "Paperboard Cereal / Pasta Box",
		aliases: [
			"cereal box",
			"pasta box",
			"tissue box",
			"cracker box",
			"paperboard",
		],
		category: "PAPER_CARDBOARD",
		resinCode: "NONE",
		weightGrams: 65,
		contaminationRisk: "NONE",
		contaminationNote:
			"Plastic inner liner bag must be removed so it does not tangle paper screens.",
		prepSteps: [
			"Pull out plastic inner bag (store drop-off or landfill)",
			"Flatten box",
		],
		epaWarmFactorKgCo2ePerKg: 3.14,
		epaWarmCategory: "Mixed Paper / Paperboard",
		description: "Thin coated folding carton from dry groceries.",
		visualHints: {
			dominantHex: "#d8b46c",
			brightness: "medium",
			texture: "matte",
			aspectHint: "tall",
			keywords: ["cereal", "pasta", "box", "paperboard", "carton"],
		},
	},
	{
		id: "paper-thermal-receipt",
		name: "Glossy Thermal Store Receipt (BPA/BPS Coated)",
		aliases: ["receipt", "thermal paper", "atm slip", "grocery receipt"],
		category: "PAPER_CARDBOARD",
		resinCode: "NONE",
		weightGrams: 3,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Thermal developer chemicals (BPA/BPS) contaminate recycled tissue and food-contact paper pulp.",
		prepSteps: [
			"Scratch test: dark mark = thermal paper",
			"NEVER recycle or compost",
			"Place in Landfill",
		],
		epaWarmFactorKgCo2ePerKg: 0.0,
		epaWarmCategory: "Non-Recyclable Paper",
		description:
			"Heat-printed glossy register receipt coated with chemical dyes.",
		visualHints: {
			dominantHex: "#f1f3f5",
			brightness: "light",
			texture: "glossy",
			aspectHint: "tall",
			keywords: ["receipt", "thermal", "slip", "ticket"],
		},
	},
	{
		id: "paper-egg-carton",
		name: "Molded Pulp Paper Egg Carton",
		aliases: ["egg carton", "pulp tray", "coffee cup carrier", "molded fiber"],
		category: "PAPER_CARDBOARD",
		resinCode: "NONE",
		weightGrams: 48,
		contaminationRisk: "NONE",
		contaminationNote:
			"Short recycled fibers are ideal for composting or paperboard recycling if clean.",
		prepSteps: [
			"Check for broken raw egg yolk (compost if soiled)",
			"Recycle or Compost if clean",
		],
		epaWarmFactorKgCo2ePerKg: 2.45,
		epaWarmCategory: "Mixed Paper",
		description: "Pressed gray/brown molded fiber carton.",
		visualHints: {
			dominantHex: "#b8afa2",
			brightness: "medium",
			texture: "fibrous",
			aspectHint: "wide",
			keywords: ["egg", "carton", "pulp", "carrier", "fiber"],
		},
	},
	{
		id: "paper-newspaper-magazine",
		name: "Newspaper / Glossy Magazine / Flyers",
		aliases: ["newspaper", "magazine", "catalog", "junk mail", "flyer"],
		category: "PAPER_CARDBOARD",
		resinCode: "NONE",
		weightGrams: 180,
		contaminationRisk: "NONE",
		contaminationNote: "Keep plastic delivery sleeve separate.",
		prepSteps: ["Remove any polybag wrapper", "Place dry paper in Recycling"],
		epaWarmFactorKgCo2ePerKg: 2.75,
		epaWarmCategory: "Newspaper / Magazines",
		description: "Clean newsprint and glossy magazines.",
		visualHints: {
			dominantHex: "#d0cec8",
			brightness: "light",
			texture: "fibrous",
			aspectHint: "tall",
			keywords: ["newspaper", "magazine", "flyer", "mail"],
		},
	},
	{
		id: "paper-soiled-napkin",
		name: "Used Paper Napkin / Paper Towel",
		aliases: ["napkin", "paper towel", "tissue", "kleenex", "used tissue"],
		category: "PAPER_CARDBOARD",
		resinCode: "NONE",
		weightGrams: 8,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Fibers are too short to repulp and hygiene/food residue contaminates clean paper bales.",
		prepSteps: [
			"NEVER place in paper recycling",
			"Compost if food-soiled only (Landfill if chemical cleaner used)",
		],
		epaWarmFactorKgCo2ePerKg: 0.58,
		epaWarmCategory: "Compostable Fiber",
		description: "Short-fiber paper napkin or kitchen towel.",
		isGreasyPaper: true,
		visualHints: {
			dominantHex: "#ece7df",
			brightness: "light",
			texture: "fibrous",
			aspectHint: "square",
			keywords: ["napkin", "towel", "tissue", "paper"],
		},
	},

	// ===================== METALS =====================
	{
		id: "metal-aluminum-can",
		name: "Aluminum Soda / Sparkling Water / Beer Can",
		aliases: [
			"aluminum can",
			"soda can",
			"beer can",
			"coke can",
			"red bull can",
			"tin can",
		],
		category: "METAL",
		resinCode: "NONE",
		weightGrams: 14,
		contaminationRisk: "NONE",
		contaminationNote:
			"Highest energy & carbon payback in EPA WARM (saves 95% energy vs virgin bauxite smelting).",
		prepSteps: [
			"Empty liquid",
			"Quick rinse",
			"Do NOT crush flat (3D shape helps eddy-current optical sorters)",
		],
		epaWarmFactorKgCo2ePerKg: 9.13,
		epaWarmCategory: "Aluminum Cans",
		description: "Infinitely recyclable lightweight aluminum beverage can.",
		visualHints: {
			dominantHex: "#b9c2c9",
			brightness: "light",
			texture: "metallic",
			aspectHint: "tall",
			keywords: ["can", "aluminum", "soda", "beer", "sparkling", "metal"],
		},
	},
	{
		id: "metal-clean-foil",
		name: "Clean Aluminum Foil / Pie Pan (Balled Up)",
		aliases: ["aluminum foil", "tin foil", "pie pan", "foil tray"],
		category: "METAL",
		resinCode: "NONE",
		weightGrams: 18,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Flat loose foil gets mis-sorted into paper; baked-on food residue rejects the metal load.",
		prepSteps: [
			"Wipe completely free of food grease",
			"Scrunch into a ball at least fist-sized (2+ inches)",
			"Place in Metal Recycling",
		],
		epaWarmFactorKgCo2ePerKg: 8.4,
		epaWarmCategory: "Aluminum Ingot/Foil",
		description: "Clean household aluminum foil or baking pan.",
		visualHints: {
			dominantHex: "#cfd6db",
			brightness: "light",
			texture: "metallic",
			aspectHint: "square",
			keywords: ["foil", "aluminum", "tray", "tin foil"],
		},
	},
	{
		id: "metal-steel-can",
		name: "Steel Tin Food Can (Beans / Soup / Tuna)",
		aliases: ["soup can", "bean can", "tuna can", "steel can", "tin food can"],
		category: "METAL",
		resinCode: "NONE",
		weightGrams: 68,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Food residue attracts rodents and spoils neighboring cardboard.",
		prepSteps: [
			"Rinse food clean",
			"Tuck sharp lid inside can and pinch slightly",
			"Place in Metal Recycling",
		],
		epaWarmFactorKgCo2ePerKg: 1.83,
		epaWarmCategory: "Steel Cans",
		description:
			"Ferrous steel food can captured easily by overhead MRF magnets.",
		visualHints: {
			dominantHex: "#9ea6ad",
			brightness: "medium",
			texture: "metallic",
			aspectHint: "tall",
			keywords: ["steel", "soup", "tuna", "beans", "tin", "can"],
		},
	},
	{
		id: "metal-aerosol-can",
		name: "Empty Aerosol Spray Can (Deodorant / Cooking Spray)",
		aliases: ["aerosol", "spray can", "deodorant can", "pam spray"],
		category: "METAL",
		resinCode: "NONE",
		weightGrams: 85,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Pressurized or partially full cans can explode inside MRF balers; paint/pesticide cans are hazardous waste.",
		prepSteps: [
			"Ensure can is 100% empty (no hiss)",
			"Remove plastic cap",
			"NEVER puncture; take paint/chemical aerosols to HHW",
		],
		epaWarmFactorKgCo2ePerKg: 1.83,
		epaWarmCategory: "Steel Cans",
		description: "Empty household pressurized steel/aluminum canister.",
		visualHints: {
			dominantHex: "#7d8a96",
			brightness: "medium",
			texture: "metallic",
			aspectHint: "tall",
			keywords: ["aerosol", "spray", "deodorant", "can"],
		},
	},

	// ===================== GLASS =====================
	{
		id: "glass-beverage-bottle",
		name: "Clear / Green / Amber Glass Beverage Bottle",
		aliases: ["glass bottle", "wine bottle", "beer bottle", "kombucha bottle"],
		category: "GLASS",
		resinCode: "NONE",
		weightGrams: 310,
		contaminationRisk: "NONE",
		contaminationNote:
			"Infinitely recyclable container glass; keep separate from ceramics and heat-treated Pyrex.",
		prepSteps: [
			"Empty liquid and quick rinse",
			"Paper labels can stay on",
			"Remove cork; screw metal cap back on or recycle separately per city",
		],
		epaWarmFactorKgCo2ePerKg: 0.28,
		epaWarmCategory: "Glass",
		description: "Standard soda-lime container glass bottle.",
		visualHints: {
			dominantHex: "#4f7a5a",
			brightness: "medium",
			texture: "translucent",
			aspectHint: "tall",
			keywords: ["glass", "wine", "beer", "kombucha", "bottle"],
		},
	},
	{
		id: "glass-jam-jar",
		name: "Glass Pasta Sauce / Jam Jar",
		aliases: [
			"glass jar",
			"jam jar",
			"pasta sauce jar",
			"mason jar",
			"pickle jar",
		],
		category: "GLASS",
		resinCode: "NONE",
		weightGrams: 245,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Heavy sauce residue fouls paper in single-stream trucks.",
		prepSteps: [
			"Swish with warm water to remove sauce",
			"Recycle metal lid separately or loosely attached per city",
		],
		epaWarmFactorKgCo2ePerKg: 0.28,
		epaWarmCategory: "Glass",
		description: "Clear food-grade glass jar.",
		visualHints: {
			dominantHex: "#c8d4cf",
			brightness: "light",
			texture: "translucent",
			aspectHint: "tall",
			keywords: ["jar", "jam", "sauce", "pickle", "glass"],
		},
	},
	{
		id: "glass-ceramic-pyrex",
		name: "Broken Ceramic Mug / Pyrex Bakeware / Drinking Glass",
		aliases: [
			"ceramic mug",
			"pyrex",
			"broken cup",
			"plate",
			"mirror",
			"window glass",
		],
		category: "GLASS",
		resinCode: "NONE",
		weightGrams: 280,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Borosilicate Pyrex and ceramics melt at higher temperatures than bottle glass—one mug ruins an entire furnace batch of recycled glass.",
		prepSteps: [
			"NEVER place in glass recycling",
			"Wrap broken shards safely in newspaper",
			"Place in Landfill",
		],
		epaWarmFactorKgCo2ePerKg: 0.0,
		epaWarmCategory: "Non-Container Glass",
		description:
			"Heat-resistant glassware or porcelain ceramic incompatible with bottle cullet furnaces.",
		visualHints: {
			dominantHex: "#d9d4cc",
			brightness: "light",
			texture: "glossy",
			aspectHint: "square",
			keywords: ["ceramic", "mug", "pyrex", "plate", "broken glass", "mirror"],
		},
	},

	// ===================== COMPOSTABLES & BIOPLASTICS =====================
	{
		id: "compost-coffee-grounds",
		name: "Used Coffee Grounds & Unbleached Paper Filter",
		aliases: ["coffee grounds", "coffee filter", "espresso puck", "bã cà phê"],
		category: "COMPOSTABLE",
		resinCode: "NONE",
		weightGrams: 45,
		contaminationRisk: "NONE",
		contaminationNote:
			"Nitrogen-rich organic feedstock that prevents landfill methane emissions when composted.",
		prepSteps: [
			"Remove any plastic K-cup pod casing",
			"Place grounds and paper filter directly in Compost",
		],
		epaWarmFactorKgCo2ePerKg: 0.58,
		epaWarmCategory: "Food Waste (Composting)",
		description: "Spent coffee grounds and paper drip filter.",
		visualHints: {
			dominantHex: "#4a3525",
			brightness: "dark",
			texture: "fibrous",
			aspectHint: "square",
			keywords: ["coffee", "grounds", "filter", "espresso", "compost"],
		},
	},
	{
		id: "compost-produce-scraps",
		name: "Fruit Peels & Vegetable Kitchen Scraps",
		aliases: [
			"banana peel",
			"apple core",
			"vegetable scraps",
			"food scraps",
			"orange peel",
		],
		category: "COMPOSTABLE",
		resinCode: "NONE",
		weightGrams: 180,
		contaminationRisk: "NONE",
		contaminationNote:
			"Peel off plastic PLU produce stickers first—stickers persist as microplastics in finished compost.",
		prepSteps: [
			"Peel off tiny plastic PLU stickers",
			"Place scraps in Green Compost bin",
		],
		epaWarmFactorKgCo2ePerKg: 0.58,
		epaWarmCategory: "Food Waste (Composting)",
		description: "Raw plant trimmings and peels.",
		visualHints: {
			dominantHex: "#7f9c4a",
			brightness: "medium",
			texture: "matte",
			aspectHint: "square",
			keywords: ["banana", "peel", "fruit", "vegetable", "scraps", "organic"],
		},
	},
	{
		id: "compost-cooked-leftovers",
		name: "Spoiled Cooked Food / Meat / Bones",
		aliases: [
			"leftovers",
			"spoiled food",
			"meat scraps",
			"bones",
			"plate scrapings",
		],
		category: "COMPOSTABLE",
		resinCode: "NONE",
		weightGrams: 220,
		contaminationRisk: "MODERATE",
		contaminationNote:
			"Landfilled food produces methane (28x CO2 potency). Municipal industrial composters accept meat/bones; backyard piles do not.",
		prepSteps: [
			"Remove all packaging and toothpicks",
			"Place in Municipal Compost (where available) or Landfill",
		],
		epaWarmFactorKgCo2ePerKg: 0.58,
		epaWarmCategory: "Food Waste (Composting)",
		description: "Post-consumer cooked food waste.",
		visualHints: {
			dominantHex: "#8c6244",
			brightness: "medium",
			texture: "matte",
			aspectHint: "square",
			keywords: ["leftovers", "food", "meat", "bones", "spoiled"],
		},
	},
	{
		id: "compost-pla-bioplastic-cup",
		name: "Compostable PLA Bioplastic Cold Cup (#7 PLA)",
		aliases: [
			"pla cup",
			"bioplastic",
			"compostable cup",
			"corn plastic",
			"green stripe cup",
		],
		category: "COMPOSTABLE",
		resinCode: "#7 Other",
		weightGrams: 16,
		contaminationRisk: "HIGH",
		contaminationNote:
			"CRITICAL WISH-CYCLING TRAP: PLA looks identical to #1 PET but ruins PET recycling bales AND requires 60°C industrial composting (cannot degrade in home compost or cities without PLA-enabled composters).",
		prepSteps: [
			"NEVER place PLA in plastic recycling!",
			"Check BPI / ASTM D6400 certification",
			"Compost ONLY in cities with industrial PLA composting (SF/Seattle); Landfill in NYC/London/HCMC",
		],
		epaWarmFactorKgCo2ePerKg: 0.48,
		epaWarmCategory: "PLA (Industrial Compost)",
		description:
			"Polylactic acid plant-based cup that diverges sharply across city waste systems.",
		isBioplasticPla: true,
		visualHints: {
			dominantHex: "#a9ccb0",
			brightness: "light",
			texture: "translucent",
			aspectHint: "tall",
			keywords: ["pla", "compostable", "bioplastic", "corn", "green cup"],
		},
	},
	{
		id: "compost-bamboo-chopsticks",
		name: "Untreated Bamboo Chopsticks / Wooden Stirrer",
		aliases: [
			"chopsticks",
			"bamboo",
			"wooden fork",
			"coffee stirrer",
			"popsicle stick",
		],
		category: "COMPOSTABLE",
		resinCode: "NONE",
		weightGrams: 9,
		contaminationRisk: "NONE",
		contaminationNote:
			"Untreated wood breaks down in municipal compost; lacquered or painted chopsticks go to landfill.",
		prepSteps: [
			"Remove paper wrapper (recycle paper)",
			"Place plain wood/bamboo in Compost",
		],
		epaWarmFactorKgCo2ePerKg: 0.52,
		epaWarmCategory: "Wood / Organics",
		description: "Single-use untreated bamboo chopsticks or coffee stir stick.",
		visualHints: {
			dominantHex: "#c9a978",
			brightness: "medium",
			texture: "fibrous",
			aspectHint: "wide",
			keywords: ["chopsticks", "bamboo", "wood", "stirrer"],
		},
	},

	// ===================== E-WASTE =====================
	{
		id: "ewaste-usb-cable",
		name: "Broken USB-C / Lightning Charging Cable",
		aliases: [
			"usb cable",
			"charger",
			"charging cord",
			"power cord",
			"tangled wire",
		],
		category: "EWASTE",
		resinCode: "NONE",
		weightGrams: 42,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Cords are severe MRF tanglers that wrap around shafts and contain recoverable copper and heavy metals.",
		prepSteps: [
			"NEVER place cords in curbside recycling",
			"Coil neatly",
			"Drop off at E-Waste / Electronics Take-Back bin",
		],
		epaWarmFactorKgCo2ePerKg: 1.25,
		epaWarmCategory: "Mixed Electronics",
		description: "Copper-core charging cable or power adapter.",
		isFilmOrTangler: true,
		visualHints: {
			dominantHex: "#2f3237",
			brightness: "dark",
			texture: "matte",
			aspectHint: "wide",
			keywords: ["cable", "usb", "charger", "cord", "wire", "ewaste"],
		},
	},
	{
		id: "ewaste-old-smartphone",
		name: "Broken Smartphone / Tablet (Contains Li-Ion)",
		aliases: [
			"old phone",
			"smartphone",
			"iphone",
			"tablet",
			"ipad",
			"broken phone",
		],
		category: "EWASTE",
		resinCode: "NONE",
		weightGrams: 190,
		contaminationRisk: "FIRE_HAZARD",
		contaminationNote:
			"Contains an embedded lithium-ion battery that ignites when crushed in garbage trucks + precious rare earths.",
		prepSteps: [
			"Factory reset & remove SIM card",
			"NEVER put in curbside trash or recycling",
			"Bring to Certified E-Waste / Carrier Take-Back",
		],
		epaWarmFactorKgCo2ePerKg: 2.85,
		epaWarmCategory: "Personal Electronics",
		description:
			"Consumer mobile device containing cobalt, gold, and lithium-ion cell.",
		visualHints: {
			dominantHex: "#232830",
			brightness: "dark",
			texture: "glossy",
			aspectHint: "tall",
			keywords: ["phone", "smartphone", "iphone", "tablet", "ewaste"],
		},
	},
	{
		id: "ewaste-led-bulb",
		name: "Burned-Out LED / CFL Light Bulb",
		aliases: ["light bulb", "led bulb", "cfl bulb", "fluorescent bulb"],
		category: "EWASTE",
		resinCode: "NONE",
		weightGrams: 75,
		contaminationRisk: "HIGH",
		contaminationNote:
			"CFLs contain toxic mercury vapor; LEDs contain circuit boards and heat sinks incompatible with container glass.",
		prepSteps: [
			"Do NOT break bulb or put in glass bin",
			"Place in original sleeve",
			"Take to Hardware Store / E-Waste Drop-off",
		],
		epaWarmFactorKgCo2ePerKg: 1.15,
		epaWarmCategory: "Mixed Electronics",
		description:
			"Electronic light bulb requiring hazardous/e-waste collection.",
		visualHints: {
			dominantHex: "#f0efe9",
			brightness: "light",
			texture: "matte",
			aspectHint: "tall",
			keywords: ["bulb", "led", "cfl", "lamp", "light"],
		},
	},
	{
		id: "ewaste-printer-cartridge",
		name: "Empty Printer Ink / Toner Cartridge",
		aliases: ["ink cartridge", "toner", "printer cartridge"],
		category: "EWASTE",
		resinCode: "NONE",
		weightGrams: 160,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Loose toner powder contaminates paper streams and contains heavy-metal pigments.",
		prepSteps: [
			"Seal in original bag/box",
			"Return to Office Supply / Campus E-Waste Take-Back",
		],
		epaWarmFactorKgCo2ePerKg: 1.4,
		epaWarmCategory: "Mixed Electronics",
		description:
			"Electronic printer consumable eligible for OEM remanufacturing.",
		visualHints: {
			dominantHex: "#1f2326",
			brightness: "dark",
			texture: "matte",
			aspectHint: "wide",
			keywords: ["ink", "toner", "printer", "cartridge"],
		},
	},

	// ===================== LITHIUM-ION BATTERIES (FIRE HAZARD!) =====================
	{
		id: "battery-lithium-powerbank",
		name: "Lithium-Ion Power Bank / Loose 18650 Battery",
		aliases: [
			"power bank",
			"lithium battery",
			"li-ion",
			"18650",
			"swollen battery",
			"laptop battery",
			"pin sạc dự phòng",
		],
		category: "BATTERY_HAZARD",
		resinCode: "NONE",
		weightGrams: 230,
		contaminationRisk: "FIRE_HAZARD",
		contaminationNote:
			"EXTREME MRF FIRE HAZARD: Crushed lithium-ion cells trigger thermal runaway fires inside collection trucks and sorting plants (causing 5,000+ waste facility fires/year in North America alone).",
		prepSteps: [
			"Tape both metal terminals with clear/electrical tape",
			"Place in non-conductive bag if swollen",
			"Take ONLY to Certified Battery / Call2Recycle Drop-off (NEVER curbside!)",
		],
		epaWarmFactorKgCo2ePerKg: 2.15,
		epaWarmCategory: "Batteries & E-Waste",
		description:
			"High-energy-density lithium-ion battery pack posing severe thermal runaway risk in MRFs.",
		visualHints: {
			dominantHex: "#252a2e",
			brightness: "dark",
			texture: "metallic",
			aspectHint: "wide",
			keywords: [
				"battery",
				"lithium",
				"powerbank",
				"power bank",
				"li-ion",
				"pin",
			],
		},
	},
	{
		id: "battery-disposable-vape",
		name: "Disposable E-Cigarette / Vape Pen (Embedded Li-Ion)",
		aliases: ["vape", "vape pen", "e-cigarette", "elf bar", "pod"],
		category: "BATTERY_HAZARD",
		resinCode: "NONE",
		weightGrams: 48,
		contaminationRisk: "FIRE_HAZARD",
		contaminationNote:
			"EXTREME MRF FIRE HAZARD + NICOTINE TOXIN: Combines a live lithium-ion cell with hazardous liquid nicotine inside plastic.",
		prepSteps: [
			"NEVER toss in trash or recycling bin",
			"Store in cool dry container",
			"Deliver to Hazardous Waste / Vape Battery Take-Back",
		],
		epaWarmFactorKgCo2ePerKg: 1.9,
		epaWarmCategory: "Hazardous E-Waste",
		description:
			"Single-use electronic nicotine device with non-removable lithium battery.",
		visualHints: {
			dominantHex: "#4b6b88",
			brightness: "medium",
			texture: "metallic",
			aspectHint: "tall",
			keywords: ["vape", "ecig", "pod", "nicotine", "battery"],
		},
	},
	{
		id: "battery-alkaline-aa",
		name: "Dead AA / AAA Alkaline or Coin Button Battery",
		aliases: [
			"aa battery",
			"aaa battery",
			"alkaline battery",
			"button battery",
			"coin cell",
			"pin tiểu",
		],
		category: "BATTERY_HAZARD",
		resinCode: "NONE",
		weightGrams: 24,
		contaminationRisk: "FIRE_HAZARD",
		contaminationNote:
			"Button cells and mixed batteries can short-circuit against scrap metal in MRF bins and leach heavy metals.",
		prepSteps: [
			"Tape positive (+) terminal on lithium coin/9V cells",
			"Collect in dry jar",
			"Drop off at Battery Recycling kiosk / campus collection box",
		],
		epaWarmFactorKgCo2ePerKg: 1.35,
		epaWarmCategory: "Household Batteries",
		description: "Household single-use or rechargeable dry-cell batteries.",
		visualHints: {
			dominantHex: "#b88c3e",
			brightness: "medium",
			texture: "metallic",
			aspectHint: "tall",
			keywords: ["aa", "aaa", "alkaline", "button", "battery", "pin"],
		},
	},

	// ===================== TEXTILES & MISC TRICKY ITEMS =====================
	{
		id: "misc-cotton-tshirt",
		name: "Worn Cotton T-Shirt / Clean Textiles",
		aliases: [
			"t-shirt",
			"clothes",
			"shirt",
			"jeans",
			"fabric",
			"textile",
			"shoes",
		],
		category: "TEXTILE_MISC",
		resinCode: "NONE",
		weightGrams: 195,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Textiles are severe MRF tanglers that wrap around rotating sorting shafts; divert via donation or textile bins.",
		prepSteps: [
			"Ensure clean and completely dry",
			"NEVER put in curbside recycling cart",
			"Donate wearable items or use Textile Recycling Drop-off",
		],
		epaWarmFactorKgCo2ePerKg: 2.38,
		epaWarmCategory: "Textiles (Reuse/Recycle)",
		description: "Apparel or clean household fabric.",
		isFilmOrTangler: true,
		visualHints: {
			dominantHex: "#63768a",
			brightness: "medium",
			texture: "fibrous",
			aspectHint: "square",
			keywords: ["shirt", "clothes", "cotton", "textile", "fabric", "jeans"],
		},
	},
	{
		id: "misc-disposable-diaper",
		name: "Used Disposable Diaper / Sanitary Pad",
		aliases: ["diaper", "nappy", "sanitary pad", "wet wipes"],
		category: "TEXTILE_MISC",
		resinCode: "NONE",
		weightGrams: 145,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Biohazard waste + superabsorbent polymer gel permanently ruins recycling and compost streams.",
		prepSteps: ["Wrap tightly", "Always dispose in Landfill"],
		epaWarmFactorKgCo2ePerKg: 0.0,
		epaWarmCategory: "Non-Recyclable Residual",
		description:
			"Multi-material hygiene product strictly excluded from recycling and composting.",
		visualHints: {
			dominantHex: "#f3f2ef",
			brightness: "light",
			texture: "matte",
			aspectHint: "square",
			keywords: ["diaper", "nappy", "wipe", "pad"],
		},
	},
	{
		id: "misc-face-mask",
		name: "Disposable Medical Face Mask (Non-Woven PP)",
		aliases: ["face mask", "surgical mask", "n95", "khẩu trang"],
		category: "TEXTILE_MISC",
		resinCode: "#5 PP",
		weightGrams: 4,
		contaminationRisk: "HIGH",
		contaminationNote:
			"Elastic ear loops tangle MRF screens and pose bio-contamination hazards for sorting workers.",
		prepSteps: ["Snip ear loops to protect wildlife", "Place in Landfill"],
		epaWarmFactorKgCo2ePerKg: 0.0,
		epaWarmCategory: "Non-Recyclable Residual",
		description: "Melt-blown polypropylene surgical or N95 mask.",
		isFilmOrTangler: true,
		visualHints: {
			dominantHex: "#8eb6d9",
			brightness: "light",
			texture: "fibrous",
			aspectHint: "wide",
			keywords: ["mask", "surgical", "n95", "medical"],
		},
	},
];

export const RESIN_CODES: Exclude<ResinCode, "NONE">[] = [
	"#1 PET",
	"#2 HDPE",
	"#3 PVC",
	"#4 LDPE",
	"#5 PP",
	"#6 PS",
	"#7 Other",
];

export const RESIN_CODE_GUIDE: Record<
	Exclude<ResinCode, "NONE">,
	{
		code: string;
		shortName: string;
		fullName: string;
		examples: string;
		typicalRisk: ContaminationRisk;
	}
> = {
	"#1 PET": {
		code: "1",
		shortName: "PET",
		fullName: "Polyethylene Terephthalate",
		examples: "Water bottles, soda bottles, clear berry clamshells",
		typicalRisk: "MODERATE",
	},
	"#2 HDPE": {
		code: "2",
		shortName: "HDPE",
		fullName: "High-Density Polyethylene",
		examples: "Milk jugs, detergent & shampoo bottles",
		typicalRisk: "NONE",
	},
	"#3 PVC": {
		code: "3",
		shortName: "PVC",
		fullName: "Polyvinyl Chloride",
		examples: "Blister packs, vinyl pipes, shower curtains",
		typicalRisk: "HIGH",
	},
	"#4 LDPE": {
		code: "4",
		shortName: "LDPE",
		fullName: "Low-Density Polyethylene",
		examples: "Grocery bags, bubble mailers, squeeze bottles",
		typicalRisk: "HIGH",
	},
	"#5 PP": {
		code: "5",
		shortName: "PP",
		fullName: "Polypropylene",
		examples: "Yogurt tubs, boba/milk tea cups, deli containers",
		typicalRisk: "MODERATE",
	},
	"#6 PS": {
		code: "6",
		shortName: "PS",
		fullName: "Polystyrene",
		examples: "Styrofoam takeout boxes, packing foam, red party cups",
		typicalRisk: "HIGH",
	},
	"#7 Other": {
		code: "7",
		shortName: "Other",
		fullName: "Multi-Layer, Polycarbonate & PLA",
		examples: "Chip bags, PLA bioplastic cups, Tritan bottles",
		typicalRisk: "HIGH",
	},
};

export function getWasteItemById(id: string): WasteItem | undefined {
	return WASTE_CATALOG.find((item) => item.id === id);
}

export function searchWasteCatalog(
	query: string,
	options?: {
		resinCode?: ResinCode | "ALL";
		category?: MaterialCategory | "ALL";
		risk?: ContaminationRisk | "ALL";
	},
): WasteItem[] {
	const normalized = query.trim().toLowerCase();
	return WASTE_CATALOG.filter((item) => {
		if (
			options?.resinCode &&
			options.resinCode !== "ALL" &&
			item.resinCode !== options.resinCode
		) {
			return false;
		}
		if (
			options?.category &&
			options.category !== "ALL" &&
			item.category !== options.category
		) {
			return false;
		}
		if (
			options?.risk &&
			options.risk !== "ALL" &&
			item.contaminationRisk !== options.risk
		) {
			return false;
		}
		if (!normalized) {
			return true;
		}
		const haystack = [
			item.name,
			item.resinCode,
			item.category,
			item.description,
			...item.aliases,
			...item.visualHints.keywords,
		]
			.join(" ")
			.toLowerCase();
		return haystack.includes(normalized);
	});
}
