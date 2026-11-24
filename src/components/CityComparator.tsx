import { GitCompareArrows, Info, Search } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import {
	CITY_LIST,
	compareAcrossCities,
	getDivergentItems,
} from "../engine/municipalityRules";
import type { CityId, RoutingDecision } from "../engine/types";
import { WASTE_CATALOG } from "../engine/wasteCatalog";

export const CityComparator: React.FC = () => {
	const [filterText, setFilterText] = useState("");
	const [showAllCatalog, setShowAllCatalog] = useState(false);
	const [inspectedDecision, setInspectedDecision] = useState<RoutingDecision>(
		() =>
			compareAcrossCities("compost-pla-bioplastic-cup").decisions["new-york"],
	);

	const comparisons = useMemo(() => {
		const base = showAllCatalog
			? WASTE_CATALOG.map((item) => compareAcrossCities(item))
			: getDivergentItems();

		const q = filterText.trim().toLowerCase();
		if (!q) return base;
		return base.filter((row) =>
			[row.item.name, row.item.resinCode, ...row.item.aliases]
				.join(" ")
				.toLowerCase()
				.includes(q),
		);
	}, [filterText, showAllCatalog]);

	return (
		<div>
			<div className="section-header">
				<div>
					<h2>5-City Municipal Rulebook Comparator</h2>
					<p>
						Why wish-cycling happens: the exact same cup or pizza box routes to
						different bins depending on local MRF optical sorters and industrial
						compost infrastructure.
					</p>
				</div>

				<div
					style={{
						display: "flex",
						gap: 10,
						flexWrap: "wrap",
						alignItems: "center",
					}}
				>
					<div className="search-input-wrap" style={{ width: 250 }}>
						<Search size={15} />
						<input
							type="text"
							className="text-input"
							placeholder="Filter items..."
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
						/>
					</div>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() => setShowAllCatalog((prev) => !prev)}
					>
						<GitCompareArrows size={15} />
						{showAllCatalog
							? "Show 12 Tricky Divergent Items"
							: `Compare All ${WASTE_CATALOG.length} Items`}
					</button>
				</div>
			</div>

			{/* Inspected Cell Detail Banner */}
			<div
				className={`verdict-banner verdict-${inspectedDecision.bin}`}
				style={{ padding: 16, marginBottom: 18 }}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						flexWrap: "wrap",
						gap: 8,
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
						<span className={`verdict-badge badge-${inspectedDecision.bin}`}>
							{inspectedDecision.bin.replace("_", " ")}
						</span>
						<strong>
							{inspectedDecision.itemName} in {inspectedDecision.cityName}
						</strong>
					</div>
					<span
						className="mono"
						style={{ fontSize: "0.78rem", color: "var(--ink-secondary)" }}
					>
						{inspectedDecision.agency}
					</span>
				</div>
				<p style={{ margin: "8px 0 4px", fontSize: "0.9rem" }}>
					<strong>Rule Explanation:</strong> {inspectedDecision.reason}
				</p>
				<div
					style={{
						fontSize: "0.82rem",
						color: "var(--ink-secondary)",
						display: "flex",
						gap: 6,
						alignItems: "center",
					}}
				>
					<Info size={14} /> <span>{inspectedDecision.mrfImpactNote}</span>
				</div>
			</div>

			{/* Side-by-Side 5-City Matrix */}
			<div className="table-scroll">
				<table className="data-table">
					<thead>
						<tr>
							<th style={{ minWidth: 230 }}>Waste Item & Resin</th>
							{CITY_LIST.map((city) => (
								<th key={city.id} style={{ minWidth: 155 }}>
									<div>{city.name}</div>
									<div
										style={{
											fontSize: "0.7rem",
											fontWeight: 500,
											color: "var(--ink-muted)",
										}}
									>
										{city.agency}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{comparisons.map((row) => (
							<tr key={row.item.id}>
								<td>
									<div style={{ fontWeight: 700, color: "var(--ink-primary)" }}>
										{row.item.name}
									</div>
									<div
										style={{
											display: "flex",
											gap: 6,
											marginTop: 4,
											flexWrap: "wrap",
										}}
									>
										{row.item.resinCode !== "NONE" && (
											<span
												className="mono"
												style={{
													fontSize: "0.72rem",
													color: "var(--ink-secondary)",
												}}
											>
												{row.item.resinCode}
											</span>
										)}
										{row.hasDivergence ? (
											<span className="risk-pill risk-HIGH">
												Diverges ({row.uniqueBins.length} routes)
											</span>
										) : (
											<span className="risk-pill risk-NONE">
												Universal Rule
											</span>
										)}
									</div>
								</td>

								{CITY_LIST.map((city) => {
									const dec = row.decisions[city.id as CityId];
									const isSelected =
										inspectedDecision.itemId === dec.itemId &&
										inspectedDecision.cityId === dec.cityId;
									return (
										<td key={city.id}>
											<button
												type="button"
												className={`matrix-cell-btn cell-${dec.bin}`}
												style={{
													outline: isSelected
														? "2px solid var(--ink-primary)"
														: undefined,
												}}
												onClick={() => setInspectedDecision(dec)}
											>
												<div>{dec.bin.replace("_", " ")}</div>
												<div
													style={{
														fontWeight: 500,
														fontSize: "0.7rem",
														opacity: 0.88,
														marginTop: 2,
													}}
												>
													Click for MRF why →
												</div>
											</button>
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
