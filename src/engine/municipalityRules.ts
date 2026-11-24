import type {
	BinType,
	CityId,
	CityProfile,
	RoutingDecision,
	WasteItem,
} from "./types";
import { getWasteItemById } from "./wasteCatalog";

export const MUNICIPALITIES: Record<CityId, CityProfile> = {
	"san-francisco": {
		id: "san-francisco",
		name: "San Francisco",
		region: "California, USA",
		agency: "Recology SF",
		programName: "Fantastic 3 (Blue / Green / Black)",
		binLabels: {
			RECYCLE: "Blue Bin — Recology Recycling",
			COMPOST: "Green Bin — Recology Organics",
			LANDFILL: "Black Bin — Landfill",
			SPECIAL_DROPOFF: "SF Environment HHW / Retail Drop-off",
		},
		baselineContaminationRatePct: 21,
		mrfNotes:
			"Recology Pier 96 MRF uses optical sorters + commercial Jepson Prairie composters that accept food-soiled paper and BPI-certified PLA.",
	},
	"new-york": {
		id: "new-york",
		name: "New York City",
		region: "New York, USA",
		agency: "NYC DSNY",
		programName: "Dual-Stream MGP / Paper + Curbside Compost",
		binLabels: {
			RECYCLE: "Blue/Green Bin — DSNY Recycling (MGP or Paper)",
			COMPOST: "Brown Bin — DSNY Curbside Composting",
			LANDFILL: "Black Bin — DSNY Trash",
			SPECIAL_DROPOFF: "DSNY SAFE Disposal / Retail Take-Back",
		},
		baselineContaminationRatePct: 28,
		mrfNotes:
			"Sims Municipal Recycling (Sunset Park MRF) accepts rigid #1–#6 non-foam plastics, bans EPS foam & plastic film, and NYC brown bins reject PLA bioplastics.",
	},
	seattle: {
		id: "seattle",
		name: "Seattle",
		region: "Washington, USA",
		agency: "Seattle Public Utilities (SPU)",
		programName: "SPU Zero-Waste 3-Stream System",
		binLabels: {
			RECYCLE: "Blue Cart — SPU Recycling",
			COMPOST: "Green Cart — SPU Food & Yard Waste",
			LANDFILL: "Black Cart — SPU Garbage",
			SPECIAL_DROPOFF: "SPU Transfer Station / Retail Drop-off",
		},
		baselineContaminationRatePct: 19,
		mrfNotes:
			"SPU contracts with Cedar Grove industrial composting (accepts greasy pizza boxes and certified compostable PLA) and strictly bans loose plastic film and EPS foam from curbside.",
	},
	london: {
		id: "london",
		name: "London",
		region: "United Kingdom",
		agency: "WRAP / Recycle Now UK",
		programName: "London Kerbside + Front-of-Store Flexibles",
		binLabels: {
			RECYCLE: "Kerbside Dry Recycling Bin",
			COMPOST: "Food Waste Caddy (Anaerobic Digestion)",
			LANDFILL: "Residual General Waste Bin",
			SPECIAL_DROPOFF: "Supermarket Front-of-Store / HWRC Drop-off",
		},
		baselineContaminationRatePct: 24,
		mrfNotes:
			"UK MRFs focus on #1 PET, #2 HDPE, and #5 PP rigid containers; London anaerobic digestion facilities reject PLA bioplastics and greasy cardboard; plastic film goes to supermarket front-of-store drop-offs.",
	},
	"ho-chi-minh-city": {
		id: "ho-chi-minh-city",
		name: "Ho Chi Minh City",
		region: "Vietnam (Campus Pilot)",
		agency: "HCMC Zero-Waste Campus Pilot (UEH Green)",
		programName: "4-Bin Campus Circular Hub",
		binLabels: {
			RECYCLE: "Blue Bin — High-Value Recyclables (MRF / Co-op)",
			COMPOST: "Green Bin — Campus Aerobic Food Composter",
			LANDFILL: "Grey Bin — Residual Waste",
			SPECIAL_DROPOFF: "Campus Green Box / Vietnam Recycles E-Waste",
		},
		baselineContaminationRatePct: 34,
		mrfNotes:
			"Campus circular stations recover clean #1 PET, #2 HDPE, #5 PP rigid cups/bottles, clean cardboard, and metals; no citywide industrial PLA composter exists yet, so PLA and greasy cardboard go to residual waste.",
	},
};

export const CITY_LIST: CityProfile[] = Object.values(MUNICIPALITIES);

interface RuleEvaluation {
	bin: BinType;
	reason: string;
	mrfImpactNote: string;
}

function evaluateSanFrancisco(item: WasteItem): RuleEvaluation {
	if (item.category === "BATTERY_HAZARD" || item.category === "EWASTE") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"California Universal Waste Law prohibits batteries and electronics from all curbside bins.",
			mrfImpactNote:
				"Prevents lithium thermal runaway fires at Recology Pier 96 MRF and recovers cobalt/copper.",
		};
	}
	if (item.id === "hdpe-motor-oil-jug") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"Hazardous chemical/petroleum containers require SF Recology HHW drop-off.",
			mrfImpactNote: "Keeps hydrocarbon toxins out of clean #2 HDPE flakes.",
		};
	}
	if (item.id === "misc-cotton-tshirt") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"Clean textiles must be donated or taken to SF textile drop-off bins—never blue curbside.",
			mrfImpactNote:
				"Prevents fabric from jamming rotating optical sorting belts.",
		};
	}
	if (item.id === "ldpe-grocery-bag" || item.id === "ldpe-bubble-mailer") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"Bring clean dry plastic film to supermarket drop-off bins (or bundle tightly inside one clear bag per Recology guidance; loose bags jam sorters).",
			mrfImpactNote: "Eliminates #1 MRF tangler shutdowns on star screens.",
		};
	}
	if (item.isBioplasticPla) {
		return {
			bin: "COMPOST",
			reason:
				"Recology SF industrial composters reach 60°C+ and accept BPI-certified PLA compostable cups in the Green Bin.",
			mrfImpactNote:
				"Diverts PLA away from Blue PET bales where it causes catastrophic polymer contamination.",
		};
	}
	if (item.isGreasyPaper) {
		return {
			bin: "COMPOST",
			reason:
				"Food-soiled paper and greasy pizza boxes belong in the SF Green Compost bin, not Blue Recycling.",
			mrfImpactNote:
				"Turns oil-soaked cardboard into nutrient-rich compost instead of ruining dry paper pulp.",
		};
	}
	if (item.id === "paper-coffee-cup") {
		return {
			bin: "RECYCLE",
			reason:
				"Recology SF accepts empty paper coffee cups (lids separated) in the Blue Bin via specialized fiber recovery.",
			mrfImpactNote:
				"Empty all liquid completely so residual coffee does not spoil dry cardboard bales.",
		};
	}
	if (item.id === "pet-black-takeout-tray") {
		return {
			bin: "LANDFILL",
			reason:
				"Carbon-black plastic cannot be detected by Pier 96 NIR optical sorters—route to Black Landfill bin.",
			mrfImpactNote:
				"Stops optical-invisible black plastic from contaminating sorted #1/#5 resin bales.",
		};
	}
	if (item.id === "ps-packing-blocks") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"Clean white EPS packing blocks are banned from SF curbside; take to Recology SF transfer drop-off.",
			mrfImpactNote:
				"Prevents EPS micro-bead shattering inside collection compactor trucks.",
		};
	}
	if (item.category === "COMPOSTABLE") {
		return {
			bin: "COMPOST",
			reason:
				"All food scraps, coffee grounds, and untreated bamboo go into SF Mandatory Green Organics.",
			mrfImpactNote:
				"Cuts landfill methane emissions and produces regional agricultural compost.",
		};
	}
	if (item.category === "METAL") {
		return {
			bin: "RECYCLE",
			reason:
				"Metals (empty cans, clean balled foil, empty aerosols) have high recovery rates at Pier 96 MRF.",
			mrfImpactNote:
				"Eddy-current and magnetic separators recover >95% of clean aluminum and steel.",
		};
	}
	if (item.category === "GLASS") {
		if (item.id === "glass-ceramic-pyrex") {
			return {
				bin: "LANDFILL",
				reason:
					"Ceramics and Pyrex have higher melting points than bottle glass and must go to Landfill.",
				mrfImpactNote:
					"Protects glass cullet furnaces from stone/defect rejections.",
			};
		}
		return {
			bin: "RECYCLE",
			reason: "Container glass bottles and jars are recycled via SF Blue Bin.",
			mrfImpactNote: "Rinse out heavy sauces to protect co-mingled paper.",
		};
	}
	if (item.category === "PAPER_CARDBOARD") {
		if (item.id === "paper-thermal-receipt") {
			return {
				bin: "LANDFILL",
				reason:
					"BPA/BPS-coated thermal receipts contaminate recycled paper pulp and go to Landfill.",
				mrfImpactNote:
					"Prevents chemical developer transfer into recycled food-contact paper.",
			};
		}
		return {
			bin: "RECYCLE",
			reason:
				"Clean dry paper, corrugated cardboard, and rinsed cartons go in the SF Blue Bin.",
			mrfImpactNote: "Keep flat and dry to preserve fiber value.",
		};
	}
	if (item.category === "PLASTIC") {
		if (
			item.isRigidPlastic &&
			(item.resinCode === "#1 PET" ||
				item.resinCode === "#2 HDPE" ||
				item.resinCode === "#5 PP") &&
			item.id !== "pp-prescription-bottle"
		) {
			return {
				bin: "RECYCLE",
				reason: `Clean rigid ${item.resinCode} containers are accepted in SF Blue Bin recycling.`,
				mrfImpactNote:
					"Keep caps on and rinse residue to meet domestic reclaimer grade specs.",
			};
		}
		return {
			bin: "LANDFILL",
			reason: `${item.resinCode} film, foam, small utensils, or non-bottle mixed plastics lack curbside recovery in SF—place in Black Bin.`,
			mrfImpactNote: "Prevents wish-cycling bale downgrades at Pier 96.",
		};
	}
	return {
		bin: "LANDFILL",
		reason:
			"Non-recyclable multi-material residual waste belongs in the Black Landfill bin.",
		mrfImpactNote:
			"Keeps biohazards and tanglers out of clean recycling lines.",
	};
}

function evaluateNewYork(item: WasteItem): RuleEvaluation {
	if (item.category === "BATTERY_HAZARD" || item.category === "EWASTE") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"NY State Electronic Equipment Recycling & Reuse Act bans e-waste and lithium batteries from curbside.",
			mrfImpactNote:
				"Prevents truck fires and recovers hazardous heavy metals via DSNY SAFE Disposal.",
		};
	}
	if (item.id === "hdpe-motor-oil-jug") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"Motor oil and hazardous chemical containers must go to DSNY SAFE Disposal events.",
			mrfImpactNote:
				"Protects Sunset Park MRF plastic wash lines from oil contamination.",
		};
	}
	if (item.id === "misc-cotton-tshirt") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"Use NYC refashioNYC drop-off bins or thrift donation; textiles tangle MRF sorting equipment.",
			mrfImpactNote: "Avoids mechanical conveyor shutdowns at Sims MRF.",
		};
	}
	if (item.id === "ldpe-grocery-bag" || item.id === "ldpe-bubble-mailer") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"NY State Plastic Bag Waste Reduction Law requires clean film bags to return to grocery store drop-off bins.",
			mrfImpactNote:
				"DSNY strictly prohibits loose plastic bags in recycling bins due to star-screen entanglement.",
		};
	}
	if (item.isBioplasticPla) {
		return {
			bin: "LANDFILL",
			reason:
				"NYC DSNY Brown Compost bins accept food & yard waste only—PLA bioplastics do NOT break down fast enough in NYC digesters and must go to Trash.",
			mrfImpactNote:
				"Putting PLA in NYC Blue MGP ruins #1 PET bales; putting it in Brown Compost contaminates finished compost.",
		};
	}
	if (item.isGreasyPaper) {
		return {
			bin: "COMPOST",
			reason:
				"NYC DSNY Curbside Composting (Brown Bin) accepts food-soiled paper napkins and greasy pizza boxes.",
			mrfImpactNote:
				"Never put greasy pizza boxes in NYC Green Paper recycling—oil ruins paper mill batches.",
		};
	}
	if (item.id === "paper-coffee-cup") {
		return {
			bin: "LANDFILL",
			reason:
				"DSNY excludes plastic-lined hot paper coffee cups from Paper recycling (remove cardboard sleeve to recycle sleeve only).",
			mrfImpactNote:
				"Polyethylene cup lining rejects paper bales at regional mills.",
		};
	}
	if (
		item.id === "ps-red-party-cup" ||
		item.id === "ldpe-squeeze-bottle" ||
		item.id === "other-polycarbonate-bottle"
	) {
		return {
			bin: "RECYCLE",
			reason:
				"Unique to NYC: DSNY accepts ALL rigid non-foam plastics (including rigid #4, #6 cups, and #7 bottles) in the Blue MGP bin.",
			mrfImpactNote:
				"Sims Sunset Park MRF sorts rigid mixed plastics separately from banned EPS foam.",
		};
	}
	if (item.id === "pet-black-takeout-tray") {
		return {
			bin: "RECYCLE",
			reason:
				"NYC DSNY accepts rigid black takeout trays in the Blue MGP bin (rinse clean; no foam).",
			mrfImpactNote:
				"Sims MRF separates rigid trays mechanically in its mixed rigid plastics stream.",
		};
	}
	if (item.category === "COMPOSTABLE") {
		return {
			bin: "COMPOST",
			reason:
				"Food scraps, coffee grounds, and plain wooden utensils go in the NYC DSNY Brown Compost bin.",
			mrfImpactNote:
				"Diverts organics from landfills to anaerobic digestion and Staten Island composting.",
		};
	}
	if (item.category === "METAL") {
		return {
			bin: "RECYCLE",
			reason:
				"Metal cans, clean foil, and empty aerosols go in NYC Blue Metal/Glass/Plastic (MGP) recycling.",
			mrfImpactNote:
				"NYC dual-stream keeps metals separate from dry paper for cleaner bales.",
		};
	}
	if (item.category === "GLASS") {
		if (item.id === "glass-ceramic-pyrex") {
			return {
				bin: "LANDFILL",
				reason:
					"Ceramics, drinking glasses, and Pyrex are prohibited in DSNY Blue MGP—dispose in Trash.",
				mrfImpactNote: "Prevents cullet contamination.",
			};
		}
		return {
			bin: "RECYCLE",
			reason: "Glass bottles and jars belong in NYC Blue MGP recycling.",
			mrfImpactNote:
				"Sims MRF crushes container glass for clean secondary aggregate and cullet.",
		};
	}
	if (item.category === "PAPER_CARDBOARD") {
		if (item.id === "paper-thermal-receipt") {
			return {
				bin: "LANDFILL",
				reason:
					"Thermal receipts contain chemical coatings—place in DSNY Trash.",
				mrfImpactNote: "Protects clean paper fiber stream.",
			};
		}
		if (item.id === "paper-tetra-pak") {
			return {
				bin: "RECYCLE",
				reason:
					"NYC DSNY routes empty beverage cartons to the Blue MGP bin (NOT Paper bin!).",
				mrfImpactNote:
					"Cartons are separated optically in the MGP line at Sunset Park.",
			};
		}
		return {
			bin: "RECYCLE",
			reason:
				"Clean cardboard, office paper, and paperboard go in NYC Green Paper & Cardboard recycling.",
			mrfImpactNote:
				"Flatten corrugated boxes and tie or place cleanly in paper bin.",
		};
	}
	if (item.category === "PLASTIC") {
		if (
			item.isFoamPolystyrene ||
			item.isFilmOrTangler ||
			item.resinCode === "#3 PVC" ||
			item.id === "pp-plastic-cutlery" ||
			item.id === "other-toothpaste-tube"
		) {
			return {
				bin: "LANDFILL",
				reason:
					"NYC bans single-use EPS foam, film wrappers, #3 PVC, and disposable utensils from curbside recycling.",
				mrfImpactNote:
					"Prevents foam shattering and film tangling at Sims MRF.",
			};
		}
		if (item.isRigidPlastic && item.id !== "pp-prescription-bottle") {
			return {
				bin: "RECYCLE",
				reason: `Rigid ${item.resinCode} containers are accepted in NYC DSNY Blue MGP recycling.`,
				mrfImpactNote: "Empty and rinse; screw caps back on.",
			};
		}
		return {
			bin: "LANDFILL",
			reason: "Too small or composite for MRF capture—place in DSNY Trash.",
			mrfImpactNote: "Avoids small-item screen fall-through.",
		};
	}
	return {
		bin: "LANDFILL",
		reason: "Residual non-recyclable waste goes in DSNY Trash.",
		mrfImpactNote: "Keeps recycling streams clean.",
	};
}

function evaluateSeattle(item: WasteItem): RuleEvaluation {
	if (item.category === "BATTERY_HAZARD" || item.category === "EWASTE") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"King County & E-Cycle Washington require batteries and electronics at free certified drop-offs.",
			mrfImpactNote:
				"Eliminates MRF lithium fires and toxic mercury/lead leaching.",
		};
	}
	if (item.id === "hdpe-motor-oil-jug") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason: "Take motor oil jugs to SPU Hazardous Waste facilities.",
			mrfImpactNote: "Prevents petroleum contamination of residential HDPE.",
		};
	}
	if (item.id === "misc-cotton-tshirt") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason: "Donate or use King County Threadcycle drop-off boxes.",
			mrfImpactNote:
				"Prevents textile entanglement in SPU single-stream sorters.",
		};
	}
	if (
		item.id === "ldpe-grocery-bag" ||
		item.id === "ldpe-bubble-mailer" ||
		item.id === "ps-packing-blocks"
	) {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"SPU prohibits plastic bags, bubble mailers, and EPS foam blocks in curbside blue carts; return clean film to grocery drop-off or StyroRecycle.",
			mrfImpactNote:
				"Seattle enforces strict tangler & foam bans to keep contamination under 15%.",
		};
	}
	if (item.isBioplasticPla) {
		return {
			bin: "COMPOST",
			reason:
				"Seattle Cedar Grove industrial composting accepts Cedar Grove/BPI-approved PLA bioplastic cups in the Green Food & Yard Cart.",
			mrfImpactNote:
				"Never put PLA in Seattle Blue Recycling—it ruins #1 PET recovery.",
		};
	}
	if (item.isGreasyPaper) {
		return {
			bin: "COMPOST",
			reason:
				"SPU requires greasy pizza boxes and food-soiled paper napkins in the Green Food & Yard Waste Cart.",
			mrfImpactNote:
				"Keeps clean fiber bales free of grease while recovering organic carbon.",
		};
	}
	if (item.id === "paper-coffee-cup") {
		return {
			bin: "RECYCLE",
			reason:
				"Seattle SPU accepts empty, clean paper coffee cups in the Blue Cart (or Green Cart if Cedar Grove certified compostable).",
			mrfImpactNote: "Empty liquid completely and remove plastic lid/sleeve.",
		};
	}
	if (item.id === "pet-black-takeout-tray") {
		return {
			bin: "LANDFILL",
			reason:
				"SPU directs black plastic trays to Garbage because NIR optical sensors cannot identify carbon-black resin.",
			mrfImpactNote: "Prevents mis-sorted residue at Seattle MRFs.",
		};
	}
	if (item.category === "COMPOSTABLE") {
		return {
			bin: "COMPOST",
			reason:
				"Seattle mandates composting of food scraps, coffee grounds, and untreated wood in the Green Cart.",
			mrfImpactNote: "Supports Seattle zero-waste organics diversion targets.",
		};
	}
	if (item.category === "METAL") {
		return {
			bin: "RECYCLE",
			reason:
				"Clean aluminum cans, balled foil, steel cans, and empty aerosols go in SPU Blue Cart.",
			mrfImpactNote: "High-value metal recovery.",
		};
	}
	if (item.category === "GLASS") {
		if (item.id === "glass-ceramic-pyrex") {
			return {
				bin: "LANDFILL",
				reason: "Broken ceramics and Pyrex go in SPU Garbage.",
				mrfImpactNote: "Protects local glass bottle remanufacturing.",
			};
		}
		return {
			bin: "RECYCLE",
			reason: "Clean glass bottles and jars go in SPU Blue Recycling.",
			mrfImpactNote: "Do not bag glass.",
		};
	}
	if (item.category === "PAPER_CARDBOARD") {
		if (item.id === "paper-thermal-receipt") {
			return {
				bin: "LANDFILL",
				reason: "Thermal receipts go in Garbage due to BPA/BPS coatings.",
				mrfImpactNote: "Protects recycled fiber quality.",
			};
		}
		return {
			bin: "RECYCLE",
			reason:
				"Clean paper, flattened cardboard, and rinsed Tetra Pak cartons go in SPU Blue Cart.",
			mrfImpactNote: "Keep paper dry.",
		};
	}
	if (item.category === "PLASTIC") {
		if (
			item.isRigidPlastic &&
			(item.resinCode === "#1 PET" ||
				item.resinCode === "#2 HDPE" ||
				item.resinCode === "#5 PP") &&
			item.id !== "pp-prescription-bottle"
		) {
			return {
				bin: "RECYCLE",
				reason: `Clean rigid ${item.resinCode} bottles, jugs, and tubs are accepted in SPU Blue Cart.`,
				mrfImpactNote: "Empty, clean, dry; caps on.",
			};
		}
		return {
			bin: "LANDFILL",
			reason:
				"SPU routes #3 PVC, #6 PS, #7 mixed plastics, and small plastic items (<3 inches) to Garbage.",
			mrfImpactNote: "Eliminates low-value wish-cycling contamination.",
		};
	}
	return {
		bin: "LANDFILL",
		reason: "Non-recyclable residual waste goes in SPU Garbage.",
		mrfImpactNote: "Keeps blue & green streams pure.",
	};
}

function evaluateLondon(item: WasteItem): RuleEvaluation {
	if (item.category === "BATTERY_HAZARD" || item.category === "EWASTE") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"UK WEEE & Waste Batteries Regulations require drop-off at supermarket battery tubes or borough HWRC/Currys take-back.",
			mrfImpactNote:
				"UK councils report 1,200+ bin-lorry & MRF battery fires annually—never put vapes or Li-ion in kerbside bins.",
		};
	}
	if (item.id === "hdpe-motor-oil-jug") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"Hazardous oil/chemical containers must go to a London Borough Reuse & Recycling Centre (HWRC).",
			mrfImpactNote: "Protects UK HDPE recycling lines.",
		};
	}
	if (item.id === "misc-cotton-tshirt") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"Use UK charity shops or Traid / borough textile recycling banks.",
			mrfImpactNote: "Prevents fabric tangling in London MRFs.",
		};
	}
	if (
		item.id === "ldpe-grocery-bag" ||
		item.id === "ldpe-bubble-mailer" ||
		item.id === "other-chip-bag"
	) {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"UK Supermarket Front-of-Store Flexible Plastic collection (Tesco, Sainsbury’s, Co-op) accepts clean plastic bags, bubble wrap, and crisp packets.",
			mrfImpactNote:
				"London kerbside bins reject flexible film; supermarket take-back recovers film cleanly.",
		};
	}
	if (item.isBioplasticPla) {
		return {
			bin: "LANDFILL",
			reason:
				"WRAP UK guidance: London anaerobic digestion food caddies reject PLA bioplastics—put in General Waste.",
			mrfImpactNote:
				"PLA cannot break down in UK AD tanks and ruins #1 PET kerbside bales.",
		};
	}
	if (item.isGreasyPaper) {
		return {
			bin: "LANDFILL",
			reason:
				"WRAP UK rules: greasy pizza box bases and soiled paper towels go in Residual General Waste (tear off clean lid for recycling).",
			mrfImpactNote:
				"London food caddies use anaerobic digestion which rejects thick oily cardboard.",
		};
	}
	if (item.id === "paper-coffee-cup") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"Poly-lined coffee cups cannot go in London kerbside paper bins—return to UK National Cup Recycling Scheme points (Costa, Pret, Starbucks).",
			mrfImpactNote:
				"Specialized UK mills (James Cropper) separate the plastic liner only from dedicated cup collections.",
		};
	}
	if (item.id === "pet-black-takeout-tray") {
		return {
			bin: "LANDFILL",
			reason:
				"Carbon-black trays are invisible to UK MRF optical sorters—dispose in General Waste.",
			mrfImpactNote: "Avoids automatic optical rejection.",
		};
	}
	if (item.category === "COMPOSTABLE") {
		if (item.id === "compost-bamboo-chopsticks") {
			return {
				bin: "LANDFILL",
				reason:
					"Wood/bamboo cutlery is excluded from London food waste anaerobic digestion caddies.",
				mrfImpactNote: "Hard wood jams AD macerator blades.",
			};
		}
		return {
			bin: "COMPOST",
			reason:
				"Food scraps, coffee grounds, and leftovers go in the London Borough Food Waste Caddy for biogas generation.",
			mrfImpactNote:
				"Generates renewable electricity and bio-fertilizer via anaerobic digestion.",
		};
	}
	if (item.category === "METAL") {
		return {
			bin: "RECYCLE",
			reason:
				"Drinks cans, steel tins, clean scrunched foil, and empty aerosols are accepted in London Dry Recycling.",
			mrfImpactNote: "High recovery rate across London MRFs.",
		};
	}
	if (item.category === "GLASS") {
		if (item.id === "glass-ceramic-pyrex") {
			return {
				bin: "LANDFILL",
				reason:
					"Pyrex, mugs, and window glass must never enter UK glass recycling—place in General Waste.",
				mrfImpactNote: "Prevents glass furnace contamination.",
			};
		}
		return {
			bin: "RECYCLE",
			reason:
				"Rinsed glass bottles and jars belong in London Kerbside Recycling or neighborhood bottle banks.",
			mrfImpactNote: "Leave lids on or loosely separated per borough.",
		};
	}
	if (item.category === "PAPER_CARDBOARD") {
		if (item.id === "paper-thermal-receipt") {
			return {
				bin: "LANDFILL",
				reason: "Thermal till receipts go in General Waste.",
				mrfImpactNote: "Keeps BPA/BPS out of UK recycled paper.",
			};
		}
		return {
			bin: "RECYCLE",
			reason:
				"Clean cardboard, paper, and rinsed Tetra Pak cartons go in London Dry Recycling.",
			mrfImpactNote: "Keep paper clean and dry.",
		};
	}
	if (item.category === "PLASTIC") {
		if (
			item.isRigidPlastic &&
			(item.resinCode === "#1 PET" ||
				item.resinCode === "#2 HDPE" ||
				item.resinCode === "#5 PP") &&
			item.id !== "pp-prescription-bottle"
		) {
			return {
				bin: "RECYCLE",
				reason: `WRAP UK Simpler Recycling accepts clean rigid ${item.resinCode} bottles, pots, tubs, and trays in kerbside recycling.`,
				mrfImpactNote: "Squash bottles and replace lids.",
			};
		}
		return {
			bin: "LANDFILL",
			reason: `London kerbside excludes ${item.resinCode} foam, PVC, small cutlery, and mixed plastics—place in General Waste.`,
			mrfImpactNote: "Prevents MRF bale rejection.",
		};
	}
	return {
		bin: "LANDFILL",
		reason: "Non-recyclable residual waste goes in General Waste.",
		mrfImpactNote: "Protects dry recycling purity.",
	};
}

function evaluateHoChiMinhCity(item: WasteItem): RuleEvaluation {
	if (item.category === "BATTERY_HAZARD" || item.category === "EWASTE") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"Drop off batteries and e-waste at UEH Campus Green Box or Vietnam Recycles collection points (never general waste).",
			mrfImpactNote:
				"Prevents toxic leachate and fires in open sorting hubs and Da Phuoc landfill.",
		};
	}
	if (item.id === "hdpe-motor-oil-jug") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"Hazardous chemical/oil containers must go to designated hazardous waste take-back.",
			mrfImpactNote: "Protects local plastic recyclers from chemical exposure.",
		};
	}
	if (item.id === "misc-cotton-tshirt") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"Donate wearable clothes via campus charity drives or local textile reuse hubs.",
			mrfImpactNote: "Extends garment life and diverts textiles from landfill.",
		};
	}
	if (item.isBioplasticPla) {
		return {
			bin: "LANDFILL",
			reason:
				"HCMC currently lacks citywide 60°C industrial PLA composting—PLA cups contaminate PET/PP ve-chai streams and must go to Residual Waste.",
			mrfImpactNote: "Prevents PLA from ruining local PET/PP recycler pellets.",
		};
	}
	if (item.isGreasyPaper) {
		return {
			bin: "LANDFILL",
			reason:
				"Greasy pizza boxes and soiled tissues cannot be pulped by local paper recyclers—tear off clean lid for Recycling, bin greasy base in Residual.",
			mrfImpactNote:
				"Keeps clean campus cardboard high-value for recycling cooperatives.",
		};
	}
	if (item.id === "paper-tetra-pak") {
		return {
			bin: "SPECIAL_DROPOFF",
			reason:
				"Flatten and rinse Tetra Pak cartons for PRO Vietnam / Lagom Vietnam school & supermarket carton drop-off stations.",
			mrfImpactNote:
				"Dedicated carton collection turns milk cartons into recycled roofing panels and pulp.",
		};
	}
	if (item.id === "paper-coffee-cup") {
		return {
			bin: "LANDFILL",
			reason:
				"PE-lined paper cups cannot be processed by standard local paper mills—remove sleeve to recycle, bin cup in Residual.",
			mrfImpactNote: "Bring a reusable campus tumbler to eliminate cup waste.",
		};
	}
	if (item.category === "COMPOSTABLE") {
		if (item.id === "compost-cooked-leftovers") {
			return {
				bin: "COMPOST",
				reason:
					"Route campus canteen food scraps to the HCMC Campus Aerobic Composter / Black Soldier Fly organics hub (remove bones/plastics first).",
				mrfImpactNote:
					"Cuts wet organic contamination in HCMC recycling bins by over 40%.",
			};
		}
		return {
			bin: "COMPOST",
			reason:
				"Coffee grounds, fruit peels, and untreated bamboo go to the Campus Organics Composter.",
			mrfImpactNote:
				"Produces campus garden soil amendment and prevents landfill methane.",
		};
	}
	if (item.category === "METAL") {
		if (item.id === "metal-aerosol-can") {
			return {
				bin: "SPECIAL_DROPOFF",
				reason:
					"Pressurized aerosol cans pose manual-sorting hazards—route to Campus Hazardous Drop-off.",
				mrfImpactNote: "Protects informal and formal sorting workers.",
			};
		}
		return {
			bin: "RECYCLE",
			reason:
				"Aluminum cans, steel tins, and clean foil have near-100% recovery through HCMC recycling cooperatives and campus Blue Bins.",
			mrfImpactNote: "Highest economic & EPA WARM carbon payback.",
		};
	}
	if (item.category === "GLASS") {
		if (item.id === "glass-ceramic-pyrex") {
			return {
				bin: "LANDFILL",
				reason:
					"Broken ceramics and Pyrex go in Residual Waste (wrapped safely for collector safety).",
				mrfImpactNote: "Protects collectors from lacerations.",
			};
		}
		return {
			bin: "RECYCLE",
			reason:
				"Intact rinsed glass bottles and jars are recovered in the Campus Blue Bin / glass reuse stream.",
			mrfImpactNote: "Keep unbroken for safe manual handling.",
		};
	}
	if (item.category === "PAPER_CARDBOARD") {
		if (item.id === "paper-thermal-receipt") {
			return {
				bin: "LANDFILL",
				reason: "Thermal receipts go in Residual Waste.",
				mrfImpactNote: "Avoids chemical contamination.",
			};
		}
		return {
			bin: "RECYCLE",
			reason:
				"Clean cardboard, exam sheets, and magazines are recovered at high rates in HCMC Campus Blue Bins.",
			mrfImpactNote: "Keep dry away from food and drinks.",
		};
	}
	if (item.category === "PLASTIC") {
		if (
			item.isRigidPlastic &&
			(item.resinCode === "#1 PET" ||
				item.resinCode === "#2 HDPE" ||
				item.resinCode === "#5 PP") &&
			item.id !== "pet-black-takeout-tray" &&
			item.id !== "pp-prescription-bottle"
		) {
			return {
				bin: "RECYCLE",
				reason: `Clean rigid ${item.resinCode} bottles, jugs, and rinsed milk tea cups (#5 PP) have strong recovery demand in HCMC Campus Recycling & PRO Vietnam hubs.`,
				mrfImpactNote:
					"Empty liquid and peel off heat-seal film so local recyclers accept the PP cup.",
			};
		}
		return {
			bin: "LANDFILL",
			reason: `${item.resinCode} foam boxes (hộp xốp), thin nylon bags, PVC, black trays, and multi-layer snack wrappers have no clean local MRF market—route to Residual Waste.`,
			mrfImpactNote:
				"Stops low-grade plastic contamination in campus recycling stations.",
		};
	}
	return {
		bin: "LANDFILL",
		reason: "Non-recyclable residual waste goes in the Grey Bin.",
		mrfImpactNote: "Protects recyclable dry stream.",
	};
}

export function routeWasteItem(
	itemOrId: WasteItem | string,
	cityId: CityId,
): RoutingDecision {
	const item =
		typeof itemOrId === "string" ? getWasteItemById(itemOrId) : itemOrId;
	if (!item) {
		throw new Error(`Unknown waste item id: ${String(itemOrId)}`);
	}
	const city = MUNICIPALITIES[cityId];
	let evaluation: RuleEvaluation;

	switch (cityId) {
		case "san-francisco":
			evaluation = evaluateSanFrancisco(item);
			break;
		case "new-york":
			evaluation = evaluateNewYork(item);
			break;
		case "seattle":
			evaluation = evaluateSeattle(item);
			break;
		case "london":
			evaluation = evaluateLondon(item);
			break;
		case "ho-chi-minh-city":
			evaluation = evaluateHoChiMinhCity(item);
			break;
	}

	const contaminationWarning =
		item.contaminationRisk === "FIRE_HAZARD"
			? `FIRE HAZARD: ${item.contaminationNote}`
			: item.contaminationRisk === "HIGH"
				? `HIGH CONTAMINATION RISK: ${item.contaminationNote}`
				: item.contaminationRisk === "MODERATE"
					? `PREP REQUIRED: ${item.contaminationNote}`
					: null;

	// Diverted from landfill if routed to RECYCLE, COMPOST, or SPECIAL_DROPOFF
	const diversionEligible = evaluation.bin !== "LANDFILL";

	// Prevents a wish-cycling contamination batch when a HIGH or FIRE_HAZARD item is correctly kept OUT of curbside RECYCLE
	const preventsContamination =
		(item.contaminationRisk === "HIGH" ||
			item.contaminationRisk === "FIRE_HAZARD") &&
		evaluation.bin !== "RECYCLE";

	return {
		itemId: item.id,
		itemName: item.name,
		cityId,
		cityName: city.name,
		agency: city.agency,
		bin: evaluation.bin,
		binLabel: city.binLabels[evaluation.bin],
		reason: evaluation.reason,
		mrfImpactNote: evaluation.mrfImpactNote,
		contaminationWarning,
		prepChecklist: item.prepSteps,
		diversionEligible,
		preventsContamination,
	};
}

export interface CrossCityComparison {
	item: WasteItem;
	decisions: Record<CityId, RoutingDecision>;
	uniqueBins: BinType[];
	hasDivergence: boolean;
}

export function compareAcrossCities(
	itemOrId: WasteItem | string,
): CrossCityComparison {
	const item =
		typeof itemOrId === "string" ? getWasteItemById(itemOrId) : itemOrId;
	if (!item) {
		throw new Error(`Unknown waste item id: ${String(itemOrId)}`);
	}
	const decisions = {} as Record<CityId, RoutingDecision>;
	const binSet = new Set<BinType>();

	for (const city of CITY_LIST) {
		const decision = routeWasteItem(item, city.id);
		decisions[city.id] = decision;
		binSet.add(decision.bin);
	}

	const uniqueBins = Array.from(binSet);
	return {
		item,
		decisions,
		uniqueBins,
		hasDivergence: uniqueBins.length > 1,
	};
}

export function getDivergentItems(): CrossCityComparison[] {
	const highlightedIds = [
		"paper-greasy-pizza-box",
		"compost-pla-bioplastic-cup",
		"paper-coffee-cup",
		"pet-black-takeout-tray",
		"ps-red-party-cup",
		"ldpe-grocery-bag",
		"paper-tetra-pak",
		"other-chip-bag",
		"ps-packing-blocks",
		"compost-bamboo-chopsticks",
		"metal-aerosol-can",
		"pp-milk-tea-cup",
	];
	return highlightedIds.map((id) => compareAcrossCities(id));
}
