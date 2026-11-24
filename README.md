# SortLens Zero

**Municipal Waste Contamination Eliminator, Food Rescue Router & EPA WARM v16 Impact Ledger**

Built for **Arbiter Hacks V1 — Theme Track: "Rethinking Waste"**.

- **Live App:** https://trongtinh9911.github.io/sortlens-zero-waste/
- **License:** MIT

---

## 1. The Waste Problem We Solve

Roughly **25% of residential and campus single-stream recycling loads** are rejected at Material Recovery Facilities (MRFs) and landfilled because of **"wish-cycling"**—tossing questionable items into the blue bin hoping they get recycled.

Four concrete failure modes drive that rejection rate:
1. **Geo-Divergent Municipal Rules:** A BPI-certified PLA bioplastic cold cup belongs in **Green Compost** in San Francisco and Seattle (60°C industrial composters), but **must go to Landfill** in New York City, London, and Ho Chi Minh City (where anaerobic digesters reject PLA and PET recyclers reject PLA bales).
2. **MRF Mechanical Tanglers & Optical Blind Spots:** Loose `#4 LDPE` grocery bags wrap around rotating star-screen shafts, forcing daily manual shutdowns; carbon-black takeout trays absorb near-infrared (NIR) optical sorter beams.
3. **Lithium-Ion MRF Thermal Runaway Fires:** Crushed power banks, loose 18650 cells, and disposable vapes trigger thousands of waste-truck and MRF fires annually.
4. **Preventable Campus & Household Food Waste:** Edible surplus goes straight to landfill methane instead of rapid donation, forfeiting a **6.3× higher carbon benefit** (EPA WARM donation `3.66 kg CO₂e/kg` vs composting `0.58 kg CO₂e/kg`).

---

## 2. How SortLens Zero Measures Real Impact (EPA WARM v16 Methodology)

Every action logged in SortLens Zero is converted into auditable environmental metrics using published **U.S. EPA Waste Reduction Model (WARM v16)** emission factors (kg CO₂e avoided per kg diverted from landfill):

| Material Stream | EPA WARM v16 Factor (kg CO₂e / kg) |
| --- | ---: |
| Aluminum Beverage Cans | `9.13` |
| Food Rescue / Donation (Source Reduction) | `3.66` |
| Clean Office Paper | `3.55` |
| Clean Corrugated Cardboard | `3.14` |
| Personal Electronics / E-Waste | `2.85` |
| Clean Textiles (Reuse / Recycle) | `2.38` |
| Lithium-Ion Battery Safe Recovery | `2.15` |
| Steel Tin Cans | `1.83` |
| `#1 PET` Rigid Containers | `1.13` |
| `#5 PP` Rigid Tubs & Cups | `1.01` |
| `#2 HDPE` Jugs & Bottles | `0.87` |
| Food Waste Composting | `0.58` |
| Container Glass | `0.28` |

Additional verifiable impact metrics:
- **Contaminated MRF Batches Prevented:** Tracks every `HIGH` and `FIRE_HAZARD` wish-cycling item correctly kept out of curbside recycling (`0.35 kg CO₂e` contamination-protection credit + estimated MRF sorting/fire cost avoided).
- **Rescued Meal Equivalents:** Computed using the USDA / Feeding America standard (`1 meal = 0.544 kg` / `1.2 lbs`).
- **1-Click Audit Exports:** Generates RFC-4180 `.csv` spreadsheets and structured `.json` EPA WARM audit reports for campus sustainability offices or household tracking.

---

## 3. Core Architecture

Zero backend, zero API keys, 100% client-side TypeScript + React 18 + Vite:

- `src/engine/wasteCatalog.ts` — 58 structured household & campus waste items across Resin Codes `#1`–`#7`, paper/cardboard, metals, glass, compostables, e-waste, and lithium-ion fire hazards.
- `src/engine/municipalityRules.ts` — 5 authentic municipal rulebooks: **San Francisco (Recology)**, **New York City (DSNY)**, **Seattle (SPU)**, **London (WRAP / Recycle Now)**, and **Ho Chi Minh City (Campus Zero-Waste Pilot)**.
- `src/engine/imageAnalyzer.ts` — Client-side HTML5 Canvas pixel analyzer extracting dominant hex tone, luminance, saturation, aspect ratio, and surface texture heuristics + keyword/resin `#1`–`#7` override matching.
- `src/engine/foodRescueRouter.ts` — Expiration urgency router (`CRITICAL_24H`, `SOON_72H`, `FRESH_STOCK`, `COMPOST_ONLY`) with food-safety gating for opened perishables.
- `src/engine/impactCalculator.ts` — EPA WARM v16 ledger engine with material breakdowns and `.csv` / `.json` audit exports.

---

## 4. Local Development & Testing

```bash
npm install
npm test        # Runs 37 Vitest unit tests across all 5 engine modules
npm run dev     # Starts local Vite dev server
npm run build   # Type-checks with tsc -b and bundles production dist/
```
