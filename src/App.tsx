import {
	BarChart3,
	CheckCircle2,
	GitCompareArrows,
	HeartHandshake,
	Leaf,
	MapPin,
	ScanLine,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { CityComparator } from "./components/CityComparator";
import { FoodRescueWorkspace } from "./components/FoodRescueWorkspace";
import { ImpactLedger } from "./components/ImpactLedger";
import { WasteScanner } from "./components/WasteScanner";
import { getSeedFoodRescueItems } from "./engine/foodRescueRouter";
import {
	computeImpactSummary,
	createFoodRescueLedgerEntry,
	createWasteLedgerEntry,
	getSeedLedgerEntries,
} from "./engine/impactCalculator";
import { CITY_LIST } from "./engine/municipalityRules";
import type {
	CityId,
	FoodRescuePlan,
	LedgerEntry,
	RoutingDecision,
	WasteItem,
} from "./engine/types";

type WorkspaceTab = "scanner" | "comparator" | "food" | "ledger";

const STORAGE_KEY_LEDGER = "sortlens_zero_ledger_v1";
const STORAGE_KEY_CITY = "sortlens_zero_city_v1";

function loadInitialLedger(): LedgerEntry[] {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY_LEDGER);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) return parsed as LedgerEntry[];
		}
	} catch {
		// Fallback to realistic seed audit dataset
	}
	return getSeedLedgerEntries("san-francisco");
}

function loadInitialCity(): CityId {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY_CITY);
		if (raw && CITY_LIST.some((c) => c.id === raw)) {
			return raw as CityId;
		}
	} catch {
		// Ignore storage read errors
	}
	return "san-francisco";
}

export const App: React.FC = () => {
	const [activeTab, setActiveTab] = useState<WorkspaceTab>("scanner");
	const [cityId, setCityId] = useState<CityId>(loadInitialCity);
	const [ledger, setLedger] = useState<LedgerEntry[]>(loadInitialLedger);
	const [foodItems, setFoodItems] = useState<FoodRescuePlan[]>(() =>
		getSeedFoodRescueItems(),
	);
	const [toastMsg, setToastMsg] = useState<string | null>(null);

	useEffect(() => {
		try {
			window.localStorage.setItem(STORAGE_KEY_LEDGER, JSON.stringify(ledger));
		} catch {
			// Ignore quota errors
		}
	}, [ledger]);

	useEffect(() => {
		try {
			window.localStorage.setItem(STORAGE_KEY_CITY, cityId);
		} catch {
			// Ignore storage errors
		}
	}, [cityId]);

	const showToast = (msg: string) => {
		setToastMsg(msg);
		window.setTimeout(() => {
			setToastMsg((current) => (current === msg ? null : current));
		}, 3200);
	};

	const summary = useMemo(() => computeImpactSummary(ledger), [ledger]);
	const pendingFoodCount = useMemo(
		() => foodItems.filter((f) => f.status === "PENDING").length,
		[foodItems],
	);

	const handleLogWasteItem = (
		item: WasteItem,
		decision: RoutingDecision,
		quantity: number,
	) => {
		const entry = createWasteLedgerEntry(item, decision, quantity);
		setLedger((prev) => [entry, ...prev]);
		showToast(
			`Logged ${entry.itemName} → ${decision.bin.replace("_", " ")} (${entry.co2eAvoidedKg.toFixed(2)} kg CO₂e)`,
		);
	};

	const handleAddFoodItem = (plan: FoodRescuePlan) => {
		setFoodItems((prev) => [plan, ...prev]);
		showToast(`Routed "${plan.name}" → ${plan.donationChannel}`);
	};

	const handleLogFoodRescue = (plan: FoodRescuePlan) => {
		const entry = createFoodRescueLedgerEntry(plan, cityId);
		setLedger((prev) => [entry, ...prev]);
		setFoodItems((prev) =>
			prev.map((item) =>
				item.id === plan.id
					? {
							...item,
							status:
								plan.urgencyTier === "COMPOST_ONLY" ? "COMPOSTED" : "RESCUED",
						}
					: item,
			),
		);
		showToast(
			`Logged food rescue: ${plan.weightKg.toFixed(1)} kg (${plan.co2eAvoidedKg.toFixed(2)} kg CO₂e avoided)`,
		);
	};

	const handleDeleteEntry = (id: string) => {
		setLedger((prev) => prev.filter((entry) => entry.id !== id));
	};

	const handleResetDemoData = () => {
		setLedger(getSeedLedgerEntries(cityId));
		showToast("Loaded verified sample EPA WARM audit dataset");
	};

	const handleClearLedger = () => {
		setLedger([]);
		showToast("Cleared impact ledger");
	};

	return (
		<div className="app-shell">
			<header className="topbar">
				<div className="topbar-inner">
					<div className="brand-group">
						<div className="brand-mark">
							<Leaf size={24} />
						</div>
						<div>
							<div className="brand-title">SortLens Zero</div>
							<div className="brand-sub">
								Municipal Waste Contamination Eliminator · Food Rescue · EPA
								WARM v16 Ledger
							</div>
						</div>
					</div>

					<div className="topbar-controls">
						<div className="city-pill-select">
							<MapPin size={16} color="#9ad9be" />
							<label htmlFor="city-select">Rulebook</label>
							<select
								id="city-select"
								value={cityId}
								onChange={(e) => setCityId(e.target.value as CityId)}
							>
								{CITY_LIST.map((c) => (
									<option key={c.id} value={c.id}>
										{c.name} ({c.agency})
									</option>
								))}
							</select>
						</div>

						<div className="live-kpi-strip">
							<div className="live-kpi-item">
								<span className="live-kpi-label">Diverted</span>
								<span className="live-kpi-value">
									{summary.totalWeightDivertedKg.toFixed(2)} kg
								</span>
							</div>
							<div className="live-kpi-item">
								<span className="live-kpi-label">CO₂e Avoided</span>
								<span className="live-kpi-value">
									{summary.totalCo2eAvoidedKg.toFixed(2)} kg
								</span>
							</div>
							<div className="live-kpi-item">
								<span className="live-kpi-label">Contam. Blocked</span>
								<span className="live-kpi-value">
									{summary.contaminatedBatchesPrevented}
								</span>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="problem-banner">
				<div className="problem-banner-inner">
					<div>
						<strong>Why this exists:</strong> Roughly{" "}
						<strong>25% of curbside recycling loads</strong> are rejected to
						landfill due to "wish-cycling" contamination (greasy cardboard,
						plastic film tanglers, PLA bioplastics, and MRF-igniting lithium
						batteries).
					</div>
					<span className="problem-tag">
						EPA WARM v16 · 5 Real City Rulebooks · Zero Backend
					</span>
				</div>
			</div>

			<nav className="nav-tabs-wrap" aria-label="Primary workspaces">
				<div className="nav-tabs">
					<button
						type="button"
						className={`nav-tab ${activeTab === "scanner" ? "active" : ""}`}
						onClick={() => setActiveTab("scanner")}
					>
						<ScanLine size={17} /> Smart Sorter & Scanner
					</button>
					<button
						type="button"
						className={`nav-tab ${activeTab === "comparator" ? "active" : ""}`}
						onClick={() => setActiveTab("comparator")}
					>
						<GitCompareArrows size={17} /> 5-City Rule Comparator
					</button>
					<button
						type="button"
						className={`nav-tab ${activeTab === "food" ? "active" : ""}`}
						onClick={() => setActiveTab("food")}
					>
						<HeartHandshake size={17} /> Food Rescue Router
						<span className="tab-count">{pendingFoodCount}</span>
					</button>
					<button
						type="button"
						className={`nav-tab ${activeTab === "ledger" ? "active" : ""}`}
						onClick={() => setActiveTab("ledger")}
					>
						<BarChart3 size={17} /> EPA WARM Impact Ledger
						<span className="tab-count">{ledger.length}</span>
					</button>
				</div>
			</nav>

			<main className="main-content">
				{activeTab === "scanner" && (
					<WasteScanner cityId={cityId} onLogItem={handleLogWasteItem} />
				)}
				{activeTab === "comparator" && <CityComparator />}
				{activeTab === "food" && (
					<FoodRescueWorkspace
						items={foodItems}
						onAddFoodItem={handleAddFoodItem}
						onLogFoodRescue={handleLogFoodRescue}
					/>
				)}
				{activeTab === "ledger" && (
					<ImpactLedger
						entries={ledger}
						summary={summary}
						onDeleteEntry={handleDeleteEntry}
						onResetDemoData={handleResetDemoData}
						onClearLedger={handleClearLedger}
					/>
				)}
			</main>

			<footer className="footer">
				<div className="footer-inner">
					<div>
						<strong>SortLens Zero</strong> — Built for Arbiter Hacks V1
						("Rethinking Waste" Theme Track). 100% static client-side web app
						with local audit storage.
					</div>
					<div className="mono">
						Factors: U.S. EPA WARM v16 · USDA 0.544 kg/meal · Recology / DSNY /
						SPU / WRAP / HCMC
					</div>
				</div>
			</footer>

			{toastMsg && (
				<div className="toast" role="status" aria-live="polite">
					<CheckCircle2 size={18} color="#7fe0b6" />
					<span>{toastMsg}</span>
				</div>
			)}
		</div>
	);
};

export default App;
