import {
	AlertTriangle,
	Camera,
	CheckCircle2,
	Flame,
	Info,
	PlusCircle,
	Recycle,
	Search,
	ShieldAlert,
	Sparkles,
	Upload,
} from "lucide-react";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import {
	analyzeImageFile,
	analyzeSamplePreset,
	matchWasteItemsFromAnalysis,
	SAMPLE_PHOTO_PRESETS,
} from "../engine/imageAnalyzer";
import { MUNICIPALITIES, routeWasteItem } from "../engine/municipalityRules";
import type {
	CityId,
	ImageAnalysisResult,
	ResinCode,
	RoutingDecision,
	WasteItem,
} from "../engine/types";
import {
	RESIN_CODE_GUIDE,
	RESIN_CODES,
	searchWasteCatalog,
	WASTE_CATALOG,
} from "../engine/wasteCatalog";

interface WasteScannerProps {
	cityId: CityId;
	onLogItem: (
		item: WasteItem,
		decision: RoutingDecision,
		quantity: number,
	) => void;
}

export const WasteScanner: React.FC<WasteScannerProps> = ({
	cityId,
	onLogItem,
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [resinFilter, setResinFilter] = useState<ResinCode | "ALL">("ALL");
	const [selectedItem, setSelectedItem] = useState<WasteItem>(
		WASTE_CATALOG[26],
	); // Greasy Pizza Box default to showcase impact immediately
	const [quantity, setQuantity] = useState(1);
	const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
	const [analysis, setAnalysis] = useState<ImageAnalysisResult | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [scanError, setScanError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const city = MUNICIPALITIES[cityId];

	const filteredItems = useMemo(
		() =>
			searchWasteCatalog(searchQuery, {
				resinCode: resinFilter,
			}),
		[searchQuery, resinFilter],
	);

	const decision = useMemo(
		() => routeWasteItem(selectedItem, cityId),
		[selectedItem, cityId],
	);

	const handleSelectItem = (item: WasteItem) => {
		setSelectedItem(item);
		setCheckedSteps({});
		setQuantity(1);
	};

	const handleResinOverride = (code: ResinCode | "ALL") => {
		setResinFilter(code);
		if (analysis && code !== "ALL") {
			const updated = matchWasteItemsFromAnalysis(
				analysis.visualProfile,
				analysis.sourceLabel,
				code,
			);
			setAnalysis(updated);
			handleSelectItem(updated.topMatch);
		} else if (code !== "ALL") {
			const firstInResin = WASTE_CATALOG.find(
				(item) => item.resinCode === code,
			);
			if (firstInResin) {
				handleSelectItem(firstInResin);
			}
		}
	};

	const handleFileUpload = async (file: File) => {
		setScanError(null);
		if (!file.type.startsWith("image/")) {
			setScanError("Please upload a JPG, PNG, or WebP waste photo.");
			return;
		}
		try {
			const objectUrl = URL.createObjectURL(file);
			setPreviewUrl(objectUrl);
			const result = await analyzeImageFile(
				file,
				resinFilter === "ALL" ? null : resinFilter,
			);
			setAnalysis(result);
			handleSelectItem(result.topMatch);
		} catch (err) {
			setScanError(
				err instanceof Error
					? err.message
					: "Unable to analyze uploaded image.",
			);
		}
	};

	const handleSamplePreset = (presetIndex: number) => {
		setScanError(null);
		setPreviewUrl(null);
		const preset = SAMPLE_PHOTO_PRESETS[presetIndex];
		const result = analyzeSamplePreset(preset);
		setAnalysis(result);
		setResinFilter(result.detectedResinOverride ?? "ALL");
		handleSelectItem(result.topMatch);
	};

	const estimatedCo2e = decision.diversionEligible
		? ((selectedItem.weightGrams * quantity) / 1000) *
			selectedItem.epaWarmFactorKgCo2ePerKg
		: decision.preventsContamination
			? 0.35 * quantity
			: 0;

	return (
		<div>
			<div className="section-header">
				<div>
					<h2>Smart Waste Sorter & Contamination Scanner</h2>
					<p>
						Active Rulebook: <strong>{city.name}</strong> ({city.agency} —{" "}
						{city.programName}) · Baseline wish-cycling rate:{" "}
						<span className="mono" style={{ fontWeight: 700 }}>
							{city.baselineContaminationRatePct}%
						</span>
					</p>
				</div>
				<span className="problem-tag">
					<Recycle size={14} /> {WASTE_CATALOG.length} Audited Waste Items
				</span>
			</div>

			<div className="scanner-grid">
				{/* LEFT COLUMN: Search + Resin Picker + Photo Scanner */}
				<div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
					{/* Photo Analyzer Card */}
					<div className="card">
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: 10,
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
								<Camera size={18} /> Client-Side Visual Waste Scanner
							</h3>
							<span
								className="mono"
								style={{ fontSize: "0.72rem", color: "var(--ink-muted)" }}
							>
								100% Local Canvas
							</span>
						</div>

						<div
							className={`dropzone ${isDragging ? "dragging" : ""}`}
							onClick={() => fileInputRef.current?.click()}
							onDragOver={(e) => {
								e.preventDefault();
								setIsDragging(true);
							}}
							onDragLeave={() => setIsDragging(false)}
							onDrop={(e) => {
								e.preventDefault();
								setIsDragging(false);
								const dropped = e.dataTransfer.files?.[0];
								if (dropped) void handleFileUpload(dropped);
							}}
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ")
									fileInputRef.current?.click();
							}}
						>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								style={{ display: "none" }}
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) void handleFileUpload(file);
								}}
							/>
							<Upload size={22} color="var(--accent-forest)" />
							<div
								style={{ fontWeight: 600, fontSize: "0.9rem", marginTop: 6 }}
							>
								Drop or click to scan a waste photo
							</div>
							<div
								style={{
									fontSize: "0.76rem",
									color: "var(--ink-muted)",
									marginTop: 2,
								}}
							>
								Extracts dominant pigment, texture & aspect heuristics + confirm
								resin #1–#7 below
							</div>
						</div>

						{scanError && (
							<div
								className="alert-box alert-FIRE_HAZARD"
								style={{ marginTop: 10, marginBottom: 0 }}
							>
								<AlertTriangle size={16} />
								<span>{scanError}</span>
							</div>
						)}

						<div style={{ marginTop: 12 }}>
							<div
								style={{
									fontSize: "0.76rem",
									fontWeight: 700,
									color: "var(--ink-muted)",
									textTransform: "uppercase",
									letterSpacing: "0.05em",
								}}
							>
								Or test tricky real-world sample scans:
							</div>
							<div className="sample-grid">
								{SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
									<button
										key={preset.id}
										type="button"
										className="sample-card"
										onClick={() => handleSamplePreset(idx)}
									>
										<span
											className="sample-swatch"
											style={{
												background: `linear-gradient(135deg, ${preset.swatchHex}, ${preset.secondaryHex})`,
											}}
										/>
										<span>
											<div className="sample-card-title">{preset.label}</div>
											<div className="sample-card-sub">{preset.subtitle}</div>
										</span>
									</button>
								))}
							</div>
						</div>

						{analysis && (
							<div
								style={{
									marginTop: 14,
									padding: 12,
									borderRadius: 10,
									background: "var(--bg-ivory)",
									border: "1px solid var(--border-subtle)",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										gap: 10,
									}}
								>
									<div
										style={{ display: "flex", alignItems: "center", gap: 10 }}
									>
										{previewUrl ? (
											<img
												src={previewUrl}
												alt="Uploaded waste sample"
												style={{
													width: 42,
													height: 42,
													objectFit: "cover",
													borderRadius: 8,
													border: "1px solid var(--border-strong)",
												}}
											/>
										) : (
											<span
												className="sample-swatch"
												style={{
													width: 34,
													height: 34,
													background: analysis.visualProfile.dominantHex,
												}}
											/>
										)}
										<div>
											<div style={{ fontSize: "0.8rem", fontWeight: 700 }}>
												Scanned:{" "}
												<span className="mono">{analysis.sourceLabel}</span>
											</div>
											<div
												className="mono"
												style={{
													fontSize: "0.72rem",
													color: "var(--ink-muted)",
												}}
											>
												Tone {analysis.visualProfile.dominantHex} · Surface:{" "}
												{analysis.visualProfile.detectedTexture} · Aspect{" "}
												{analysis.visualProfile.aspectRatio}
											</div>
										</div>
									</div>
									<span className="risk-pill risk-NONE">
										{analysis.candidates[0].confidence}% Match
									</span>
								</div>

								<div
									style={{
										marginTop: 10,
										display: "flex",
										flexWrap: "wrap",
										gap: 6,
									}}
								>
									{analysis.candidates.slice(0, 3).map((cand) => (
										<button
											key={cand.item.id}
											type="button"
											className="btn btn-secondary"
											style={{
												padding: "5px 10px",
												fontSize: "0.75rem",
												borderColor:
													cand.item.id === selectedItem.id
														? "var(--accent-forest)"
														: undefined,
												background:
													cand.item.id === selectedItem.id
														? "#e7f4ed"
														: undefined,
											}}
											onClick={() => handleSelectItem(cand.item)}
										>
											<Sparkles size={12} /> {cand.item.name.slice(0, 30)}
											{cand.item.name.length > 30 ? "…" : ""} ({cand.confidence}
											%)
										</button>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Search & Resin Picker Card */}
					<div className="card">
						<h3 style={{ fontSize: "1.08rem", marginBottom: 10 }}>
							Search Catalog or Pick Resin Code (#1–#7)
						</h3>
						<div className="search-input-wrap">
							<Search size={16} />
							<input
								type="text"
								className="text-input"
								placeholder="Search item, e.g. greasy pizza box, PLA cup, vape, milk tea, #5 PP..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<div className="resin-grid">
							<button
								type="button"
								className={`resin-btn ${resinFilter === "ALL" ? "active" : ""}`}
								onClick={() => handleResinOverride("ALL")}
							>
								<span className="resin-num">ALL</span>
								<span className="resin-short">
									{WASTE_CATALOG.length} Items
								</span>
							</button>
							{RESIN_CODES.map((code) => {
								const guide = RESIN_CODE_GUIDE[code];
								return (
									<button
										key={code}
										type="button"
										className={`resin-btn ${resinFilter === code ? "active" : ""}`}
										title={`${guide.fullName}: ${guide.examples}`}
										onClick={() => handleResinOverride(code)}
									>
										<span className="resin-num">♲ {guide.code}</span>
										<span className="resin-short">{guide.shortName}</span>
									</button>
								);
							})}
						</div>

						<div className="catalog-list">
							{filteredItems.length === 0 ? (
								<div
									style={{
										padding: 16,
										textAlign: "center",
										color: "var(--ink-muted)",
										fontSize: "0.86rem",
									}}
								>
									No items matched "{searchQuery}". Clear search or reset resin
									filter.
								</div>
							) : (
								filteredItems.map((item) => (
									<button
										key={item.id}
										type="button"
										className={`catalog-item-btn ${item.id === selectedItem.id ? "selected" : ""}`}
										onClick={() => handleSelectItem(item)}
									>
										<div>
											<div className="catalog-item-name">{item.name}</div>
											<div className="catalog-item-meta">
												{item.resinCode !== "NONE"
													? `${item.resinCode} · `
													: ""}
												{item.weightGrams}g · EPA WARM{" "}
												{item.epaWarmFactorKgCo2ePerKg.toFixed(2)} kg CO₂e/kg
											</div>
										</div>
										<span
											className={`risk-pill risk-${item.contaminationRisk}`}
										>
											{item.contaminationRisk.replace("_", " ")}
										</span>
									</button>
								))
							)}
						</div>
					</div>
				</div>

				{/* RIGHT COLUMN: Big Verdict + Contamination Alert + Prep Checklist + Log */}
				<div className="card" style={{ position: "sticky", top: 72 }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-start",
							gap: 12,
							marginBottom: 14,
						}}
					>
						<div>
							<div
								style={{
									fontSize: "0.75rem",
									fontWeight: 700,
									textTransform: "uppercase",
									letterSpacing: "0.06em",
									color: "var(--ink-muted)",
								}}
							>
								Selected Item · {selectedItem.category.replace("_", " ")}
								{selectedItem.resinCode !== "NONE"
									? ` · ${selectedItem.resinCode}`
									: ""}
							</div>
							<h3 style={{ fontSize: "1.35rem", marginTop: 4 }}>
								{selectedItem.name}
							</h3>
						</div>
						<span
							className={`risk-pill risk-${selectedItem.contaminationRisk}`}
						>
							{selectedItem.contaminationRisk === "FIRE_HAZARD"
								? "🔥 FIRE HAZARD"
								: `RISK: ${selectedItem.contaminationRisk}`}
						</span>
					</div>

					{/* BIG BIN VERDICT BANNER */}
					<div className={`verdict-banner verdict-${decision.bin}`}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								flexWrap: "wrap",
								gap: 8,
							}}
						>
							<span className={`verdict-badge badge-${decision.bin}`}>
								{decision.bin.replace("_", " ")}
							</span>
							<span
								className="mono"
								style={{
									fontSize: "0.76rem",
									fontWeight: 600,
									color: "var(--ink-secondary)",
								}}
							>
								{decision.cityName} · {decision.agency}
							</span>
						</div>
						<div className="verdict-bin-title">{decision.binLabel}</div>
						<p className="verdict-reason">{decision.reason}</p>
						<div
							style={{
								marginTop: 10,
								paddingTop: 10,
								borderTop: "1px solid rgba(20,40,33,0.12)",
								fontSize: "0.82rem",
								color: "var(--ink-secondary)",
								display: "flex",
								gap: 6,
								alignItems: "flex-start",
							}}
						>
							<Info size={15} style={{ flexShrink: 0, marginTop: 2 }} />
							<span>
								<strong>MRF Reality:</strong> {decision.mrfImpactNote}
							</span>
						</div>
					</div>

					{/* CONTAMINATION / FIRE HAZARD ALERT */}
					{decision.contaminationWarning && (
						<div
							className={`alert-box alert-${selectedItem.contaminationRisk}`}
						>
							{selectedItem.contaminationRisk === "FIRE_HAZARD" ? (
								<Flame size={20} style={{ flexShrink: 0, marginTop: 1 }} />
							) : (
								<ShieldAlert
									size={20}
									style={{ flexShrink: 0, marginTop: 1 }}
								/>
							)}
							<div>
								<div style={{ fontWeight: 700, marginBottom: 2 }}>
									{selectedItem.contaminationRisk === "FIRE_HAZARD"
										? "CRITICAL MRF THERMAL RUNAWAY FIRE ALERT"
										: selectedItem.contaminationRisk === "HIGH"
											? "WISH-CYCLING CONTAMINATION WARNING"
											: "CLEANLINESS PREP NOTICE"}
								</div>
								<div>{selectedItem.contaminationNote}</div>
							</div>
						</div>
					)}

					{/* PREP CHECKLIST */}
					<div>
						<div
							style={{
								fontSize: "0.8rem",
								fontWeight: 700,
								textTransform: "uppercase",
								letterSpacing: "0.05em",
								color: "var(--ink-muted)",
							}}
						>
							Required Prep Steps Before Binning
						</div>
						<ul className="prep-list">
							{decision.prepChecklist.map((step, index) => (
								<li key={step}>
									<label className="prep-item">
										<input
											type="checkbox"
											checked={Boolean(checkedSteps[index])}
											onChange={() =>
												setCheckedSteps((prev) => ({
													...prev,
													[index]: !prev[index],
												}))
											}
										/>
										<span
											style={{
												textDecoration: checkedSteps[index]
													? "line-through"
													: "none",
												color: checkedSteps[index]
													? "var(--ink-muted)"
													: "var(--ink-primary)",
											}}
										>
											{step}
										</span>
									</label>
								</li>
							))}
						</ul>
					</div>

					{/* EPA WARM METRICS & LOG BUTTON */}
					<div
						style={{
							marginTop: 18,
							paddingTop: 16,
							borderTop: "1px solid var(--border-subtle)",
							display: "flex",
							flexWrap: "wrap",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 14,
						}}
					>
						<div>
							<div
								style={{
									fontSize: "0.74rem",
									color: "var(--ink-muted)",
									fontWeight: 600,
								}}
							>
								EPA WARM v16 Impact ({selectedItem.epaWarmCategory})
							</div>
							<div
								className="mono"
								style={{
									fontSize: "0.96rem",
									fontWeight: 700,
									color: "var(--accent-forest)",
								}}
							>
								{((selectedItem.weightGrams * quantity) / 1000).toFixed(3)} kg ·{" "}
								{estimatedCo2e.toFixed(3)} kg CO₂e avoided
							</div>
						</div>

						<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
							<label
								style={{
									display: "flex",
									alignItems: "center",
									gap: 6,
									fontSize: "0.82rem",
									fontWeight: 600,
								}}
							>
								Qty
								<input
									type="number"
									min={1}
									max={50}
									value={quantity}
									onChange={(e) =>
										setQuantity(
											Math.max(1, Math.min(50, Number(e.target.value) || 1)),
										)
									}
									className="text-input mono"
									style={{ width: 64, padding: "7px 8px" }}
								/>
							</label>

							<button
								type="button"
								className="btn btn-primary"
								onClick={() => onLogItem(selectedItem, decision, quantity)}
							>
								<PlusCircle size={17} /> Log to Impact Ledger
							</button>
						</div>
					</div>

					{decision.preventsContamination && (
						<div
							style={{
								marginTop: 12,
								fontSize: "0.78rem",
								color: "var(--accent-forest)",
								display: "flex",
								alignItems: "center",
								gap: 6,
								fontWeight: 600,
							}}
						>
							<CheckCircle2 size={15} />
							Logging this item records 1 prevented wish-cycling MRF
							contamination incident.
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
