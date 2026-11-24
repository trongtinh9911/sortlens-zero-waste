import {
	BarChart3,
	Download,
	FileJson,
	Flame,
	RotateCcw,
	Trash2,
} from "lucide-react";
import type React from "react";
import {
	exportLedgerToCsv,
	exportLedgerToJson,
} from "../engine/impactCalculator";
import type { ImpactSummary, LedgerEntry } from "../engine/types";

interface ImpactLedgerProps {
	entries: LedgerEntry[];
	summary: ImpactSummary;
	onDeleteEntry: (id: string) => void;
	onResetDemoData: () => void;
	onClearLedger: () => void;
}

function triggerFileDownload(
	content: string,
	filename: string,
	mimeType: string,
) {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export const ImpactLedger: React.FC<ImpactLedgerProps> = ({
	entries,
	summary,
	onDeleteEntry,
	onResetDemoData,
	onClearLedger,
}) => {
	const maxCategoryCo2 = Math.max(
		0.001,
		...summary.categoryBreakdown.map((c) => c.co2eAvoidedKg),
	);

	const handleExportCsv = () => {
		const csv = exportLedgerToCsv(entries);
		triggerFileDownload(
			csv,
			"sortlens-epa-warm-audit.csv",
			"text/csv;charset=utf-8;",
		);
	};

	const handleExportJson = () => {
		const json = exportLedgerToJson(entries);
		triggerFileDownload(
			json,
			"sortlens-epa-warm-audit.json",
			"application/json;charset=utf-8;",
		);
	};

	return (
		<div>
			<div className="section-header">
				<div>
					<h2>EPA WARM v16 Diversion & Contamination Impact Ledger</h2>
					<p>
						Auditable carbon, landfill diversion, and MRF contamination
						prevention ledger ready for campus sustainability offices or
						household audits.
					</p>
				</div>

				<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
					<button
						type="button"
						className="btn btn-primary"
						onClick={handleExportCsv}
						disabled={entries.length === 0}
					>
						<Download size={16} /> Export .CSV Audit
					</button>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={handleExportJson}
						disabled={entries.length === 0}
					>
						<FileJson size={16} /> Export .JSON Report
					</button>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={onResetDemoData}
					>
						<RotateCcw size={15} /> Seed Audit Sample
					</button>
					<button
						type="button"
						className="btn btn-danger-ghost"
						onClick={onClearLedger}
					>
						<Trash2 size={15} /> Clear
					</button>
				</div>
			</div>

			{/* KPI Cards */}
			<div className="kpi-grid">
				<div className="kpi-card">
					<div className="kpi-card-label">Diverted from Landfill</div>
					<div className="kpi-card-value">
						{summary.totalWeightDivertedKg.toFixed(2)} kg
					</div>
					<div className="kpi-card-sub">
						Total processed: {summary.totalWeightProcessedKg.toFixed(2)} kg
					</div>
				</div>

				<div className="kpi-card">
					<div className="kpi-card-label">CO₂e Avoided (EPA WARM)</div>
					<div
						className="kpi-card-value"
						style={{ color: "var(--accent-forest)" }}
					>
						{summary.totalCo2eAvoidedKg.toFixed(2)} kg
					</div>
					<div className="kpi-card-sub">
						≈ {(summary.totalCo2eAvoidedKg * 2.48).toFixed(1)} car miles offset
					</div>
				</div>

				<div className="kpi-card">
					<div className="kpi-card-label">Diversion Rate</div>
					<div className="kpi-card-value">
						{summary.diversionRatePct.toFixed(1)}%
					</div>
					<div className="kpi-card-sub">
						{summary.totalItemsLogged} logged audit events
					</div>
				</div>

				<div className="kpi-card">
					<div className="kpi-card-label">MRF Contamination Blocked</div>
					<div
						className="kpi-card-value"
						style={{ color: "var(--accent-amber)" }}
					>
						{summary.contaminatedBatchesPrevented}
					</div>
					<div className="kpi-card-sub">
						{summary.fireHazardsPrevented > 0 ? (
							<span style={{ color: "var(--accent-crimson)", fontWeight: 700 }}>
								<Flame size={12} style={{ verticalAlign: "-2px" }} />{" "}
								{summary.fireHazardsPrevented} Li-Ion fire hazard(s) ·{" "}
							</span>
						) : null}
						~${summary.estimatedMrfCostSavedUsd.toFixed(2)} MRF cost saved
					</div>
				</div>

				<div className="kpi-card">
					<div className="kpi-card-label">Edible Meals Rescued</div>
					<div
						className="kpi-card-value"
						style={{ color: "var(--accent-cobalt)" }}
					>
						{summary.mealsRescued.toFixed(1)}
					</div>
					<div className="kpi-card-sub">USDA 0.544 kg / meal basis</div>
				</div>
			</div>

			{/* Material Breakdown Bar Chart */}
			<div className="card" style={{ marginBottom: 20 }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 14,
						flexWrap: "wrap",
						gap: 8,
					}}
				>
					<h3
						style={{
							fontSize: "1.08rem",
							display: "flex",
							alignItems: "center",
							gap: 8,
						}}
					>
						<BarChart3 size={18} /> CO₂e Avoided by Material Stream (EPA WARM
						v16)
					</h3>
					<span
						className="mono"
						style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}
					>
						Sorted by kg CO₂e avoided
					</span>
				</div>

				{summary.categoryBreakdown.length === 0 ? (
					<div
						style={{
							color: "var(--ink-muted)",
							fontSize: "0.9rem",
							padding: "12px 0",
						}}
					>
						Log waste items in the Smart Sorter or rescue surplus food to see
						live EPA WARM emissions breakdown.
					</div>
				) : (
					summary.categoryBreakdown.map((cat) => {
						const pct = Math.max(
							4,
							Math.round((cat.co2eAvoidedKg / maxCategoryCo2) * 100),
						);
						return (
							<div key={cat.category} className="bar-row">
								<div style={{ fontSize: "0.84rem", fontWeight: 600 }}>
									{cat.label}{" "}
									<span style={{ color: "var(--ink-muted)", fontWeight: 500 }}>
										({cat.itemCount})
									</span>
								</div>
								<div className="bar-track">
									<div className="bar-fill" style={{ width: `${pct}%` }} />
								</div>
								<div
									className="mono"
									style={{
										fontSize: "0.78rem",
										textAlign: "right",
										fontWeight: 600,
									}}
								>
									{cat.co2eAvoidedKg.toFixed(2)} kg CO₂e
									<div
										style={{
											fontSize: "0.7rem",
											color: "var(--ink-muted)",
											fontWeight: 400,
										}}
									>
										{cat.weightKg.toFixed(2)} kg mass
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>

			{/* Audit Log Table */}
			<div className="table-scroll">
				<table className="data-table">
					<thead>
						<tr>
							<th>Item & Type</th>
							<th>Municipality</th>
							<th>Routed Bin</th>
							<th>Weight</th>
							<th>EPA Factor</th>
							<th>CO₂e Avoided</th>
							<th>Contamination Guard</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{entries.length === 0 ? (
							<tr>
								<td
									colSpan={8}
									style={{
										textAlign: "center",
										padding: 24,
										color: "var(--ink-muted)",
									}}
								>
									No ledger entries yet. Log an item from the Smart Sorter or
									Food Rescue Router, or click "Seed Audit Sample".
								</td>
							</tr>
						) : (
							entries.map((entry) => (
								<tr key={entry.id}>
									<td>
										<div style={{ fontWeight: 700 }}>{entry.itemName}</div>
										<div
											className="mono"
											style={{ fontSize: "0.72rem", color: "var(--ink-muted)" }}
										>
											{new Date(entry.timestamp).toLocaleString()} ·{" "}
											{entry.entryType.replace("_", " ")}
										</div>
									</td>
									<td>{entry.cityName}</td>
									<td>
										<span
											className={`verdict-badge badge-${entry.bin}`}
											style={{ fontSize: "0.68rem" }}
										>
											{entry.bin.replace("_", " ")}
										</span>
									</td>
									<td className="mono">{entry.weightKg.toFixed(3)} kg</td>
									<td className="mono">{entry.epaWarmFactor.toFixed(2)}</td>
									<td
										className="mono"
										style={{ fontWeight: 700, color: "var(--accent-forest)" }}
									>
										{entry.co2eAvoidedKg.toFixed(3)} kg
									</td>
									<td>
										{entry.preventedFireHazard ? (
											<span className="risk-pill risk-FIRE_HAZARD">
												FIRE PREVENTED
											</span>
										) : entry.preventedContamination ? (
											<span className="risk-pill risk-HIGH">
												CONTAM. BLOCKED
											</span>
										) : entry.mealEquivalents > 0 ? (
											<span className="risk-pill risk-NONE">
												{entry.mealEquivalents.toFixed(1)} MEALS
											</span>
										) : (
											<span
												style={{
													color: "var(--ink-muted)",
													fontSize: "0.76rem",
												}}
											>
												Clean stream
											</span>
										)}
									</td>
									<td>
										<button
											type="button"
											className="btn btn-secondary"
											style={{ padding: "4px 8px" }}
											title="Remove ledger entry"
											onClick={() => onDeleteEntry(entry.id)}
										>
											<Trash2 size={14} />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
