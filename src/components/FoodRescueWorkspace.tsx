import {
	CheckCircle2,
	Clock,
	HeartHandshake,
	Leaf,
	Plus,
	Utensils,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import {
	EPA_WARM_FOOD_COMPOST_FACTOR,
	EPA_WARM_FOOD_DONATION_FACTOR,
	evaluateFoodRescue,
	sortFoodRescueByUrgency,
} from "../engine/foodRescueRouter";
import type { FoodCategory, FoodRescuePlan } from "../engine/types";

interface FoodRescueWorkspaceProps {
	items: FoodRescuePlan[];
	onAddFoodItem: (plan: FoodRescuePlan) => void;
	onLogFoodRescue: (plan: FoodRescuePlan) => void;
}

const FOOD_CATEGORIES: Array<{ value: FoodCategory; label: string }> = [
	{ value: "PREPARED_MEAL", label: "Prepared Meal / Cafe Surplus" },
	{ value: "PRODUCE", label: "Fresh Produce / Greens" },
	{ value: "BAKERY", label: "Bakery / Bread" },
	{ value: "DAIRY_EGGS", label: "Dairy & Eggs" },
	{ value: "BEVERAGE", label: "Sealed Beverages / Oat Milk" },
	{ value: "PACKAGED_DRY", label: "Packaged Dry Goods" },
];

export const FoodRescueWorkspace: React.FC<FoodRescueWorkspaceProps> = ({
	items,
	onAddFoodItem,
	onLogFoodRescue,
}) => {
	const [name, setName] = useState("");
	const [category, setCategory] = useState<FoodCategory>("PREPARED_MEAL");
	const [weightKg, setWeightKg] = useState(1.5);
	const [daysToExpiry, setDaysToExpiry] = useState(1);
	const [isOpened, setIsOpened] = useState(false);
	const [sourceLocation, setSourceLocation] = useState("Campus Student Union");

	const sortedItems = useMemo(() => sortFoodRescueByUrgency(items), [items]);

	const totals = useMemo(() => {
		const pending = items.filter((i) => i.status === "PENDING");
		const mealsPotential = pending.reduce(
			(sum, i) => sum + i.mealEquivalents,
			0,
		);
		const co2ePotential = pending.reduce((sum, i) => sum + i.co2eAvoidedKg, 0);
		return {
			pendingCount: pending.length,
			mealsPotential: mealsPotential.toFixed(1),
			co2ePotential: co2ePotential.toFixed(2),
		};
	}, [items]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;
		const plan = evaluateFoodRescue({
			name,
			category,
			weightKg,
			daysToExpiry,
			isOpened,
			sourceLocation,
		});
		onAddFoodItem(plan);
		setName("");
	};

	return (
		<div>
			<div className="section-header">
				<div>
					<h2>Campus & Household Food Rescue Router</h2>
					<p>
						Prevent edible surplus from landfilling: routes food by expiration
						urgency and safety gates, calculating USDA meal equivalents and EPA
						WARM CO₂e avoided ({EPA_WARM_FOOD_DONATION_FACTOR} kg CO₂e/kg
						donated vs {EPA_WARM_FOOD_COMPOST_FACTOR} kg composted).
					</p>
				</div>
				<span className="problem-tag">
					<Utensils size={14} /> {totals.pendingCount} Active ·{" "}
					{totals.mealsPotential} Meals · {totals.co2ePotential} kg CO₂e
				</span>
			</div>

			<div className="food-grid">
				{/* LEFT: Add Expiring Food Form */}
				<form className="card" onSubmit={handleSubmit}>
					<h3 style={{ fontSize: "1.1rem", marginBottom: 14 }}>
						Register Expiring Surplus
					</h3>

					<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
						<div>
							<label
								style={{
									display: "block",
									fontSize: "0.8rem",
									fontWeight: 700,
									marginBottom: 4,
								}}
							>
								Food Item Description
							</label>
							<input
								type="text"
								className="text-input"
								placeholder="e.g., Unsold Bento Boxes (8 trays)"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 10,
							}}
						>
							<div>
								<label
									style={{
										display: "block",
										fontSize: "0.8rem",
										fontWeight: 700,
										marginBottom: 4,
									}}
								>
									Category
								</label>
								<select
									className="select-input"
									value={category}
									onChange={(e) => setCategory(e.target.value as FoodCategory)}
								>
									{FOOD_CATEGORIES.map((c) => (
										<option key={c.value} value={c.value}>
											{c.label}
										</option>
									))}
								</select>
							</div>
							<div>
								<label
									style={{
										display: "block",
										fontSize: "0.8rem",
										fontWeight: 700,
										marginBottom: 4,
									}}
								>
									Weight (kg)
								</label>
								<input
									type="number"
									step="0.1"
									min="0.1"
									max="100"
									className="text-input mono"
									value={weightKg}
									onChange={(e) =>
										setWeightKg(Math.max(0.1, Number(e.target.value) || 0.5))
									}
								/>
							</div>
						</div>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 10,
							}}
						>
							<div>
								<label
									style={{
										display: "block",
										fontSize: "0.8rem",
										fontWeight: 700,
										marginBottom: 4,
									}}
								>
									Days to Expiry (negative = expired)
								</label>
								<input
									type="number"
									min="-14"
									max="90"
									className="text-input mono"
									value={daysToExpiry}
									onChange={(e) => setDaysToExpiry(Number(e.target.value))}
								/>
							</div>
							<div>
								<label
									style={{
										display: "block",
										fontSize: "0.8rem",
										fontWeight: 700,
										marginBottom: 4,
									}}
								>
									Source Location
								</label>
								<input
									type="text"
									className="text-input"
									value={sourceLocation}
									onChange={(e) => setSourceLocation(e.target.value)}
								/>
							</div>
						</div>

						<label
							style={{
								display: "flex",
								alignItems: "center",
								gap: 8,
								fontSize: "0.85rem",
								padding: "8px 10px",
								borderRadius: 8,
								background: "var(--bg-ivory)",
								cursor: "pointer",
							}}
						>
							<input
								type="checkbox"
								checked={isOpened}
								onChange={(e) => setIsOpened(e.target.checked)}
								style={{
									width: 16,
									height: 16,
									accentColor: "var(--accent-forest)",
								}}
							/>
							Package already opened (triggers food safety check for same-day
							perishables)
						</label>

						<button
							type="submit"
							className="btn btn-primary"
							style={{ marginTop: 4 }}
						>
							<Plus size={16} /> Route Surplus Food Item
						</button>
					</div>
				</form>

				{/* RIGHT: Priority Rescue Queue */}
				<div>
					{sortedItems.map((plan) => (
						<div key={plan.id} className="food-card">
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
									gap: 10,
									flexWrap: "wrap",
								}}
							>
								<div>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: 8,
											flexWrap: "wrap",
										}}
									>
										<span
											className={`risk-pill urgency-${plan.urgencyTier}`}
											style={{ border: "1px solid" }}
										>
											{plan.urgencyTier.replace("_", " ")}
										</span>
										<span
											className="mono"
											style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}
										>
											<Clock
												size={12}
												style={{ verticalAlign: "-2px", marginRight: 3 }}
											/>
											{plan.daysToExpiry < 0
												? `Expired ${Math.abs(plan.daysToExpiry)}d ago`
												: plan.daysToExpiry === 0
													? "Expires TODAY"
													: `${plan.daysToExpiry}d remaining`}
										</span>
										<span
											style={{ fontSize: "0.76rem", color: "var(--ink-muted)" }}
										>
											· {plan.sourceLocation}
										</span>
									</div>
									<h4 style={{ fontSize: "1.08rem", marginTop: 6 }}>
										{plan.name}
									</h4>
								</div>

								{plan.status !== "PENDING" ? (
									<span
										className="risk-pill risk-NONE"
										style={{
											display: "inline-flex",
											alignItems: "center",
											gap: 4,
											padding: "5px 10px",
										}}
									>
										<CheckCircle2 size={14} /> {plan.status} IN LEDGER
									</span>
								) : (
									<button
										type="button"
										className="btn btn-primary"
										style={{ padding: "7px 12px", fontSize: "0.82rem" }}
										onClick={() => onLogFoodRescue(plan)}
									>
										{plan.urgencyTier === "COMPOST_ONLY" ? (
											<>
												<Leaf size={14} /> Log Compost to Ledger
											</>
										) : (
											<>
												<HeartHandshake size={14} /> Log Rescue to Ledger
											</>
										)}
									</button>
								)}
							</div>

							<div
								style={{
									marginTop: 10,
									padding: "9px 12px",
									borderRadius: 8,
									background: "var(--bg-ivory)",
									fontSize: "0.84rem",
								}}
							>
								<div>
									<strong>Recommended Channel:</strong> {plan.donationChannel}
								</div>
								<div style={{ color: "var(--ink-secondary)", marginTop: 3 }}>
									{plan.handlingAdvice}
								</div>
							</div>

							<div
								className="mono"
								style={{
									marginTop: 10,
									display: "flex",
									flexWrap: "wrap",
									gap: 14,
									fontSize: "0.78rem",
									color: "var(--accent-forest)",
									fontWeight: 600,
								}}
							>
								<span>Weight: {plan.weightKg.toFixed(2)} kg</span>
								<span>Meals Rescued: {plan.mealEquivalents.toFixed(2)}</span>
								<span>CO₂e Avoided: {plan.co2eAvoidedKg.toFixed(2)} kg</span>
								<span style={{ color: "var(--ink-muted)", fontWeight: 500 }}>
									{plan.epaWarmBasis}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
