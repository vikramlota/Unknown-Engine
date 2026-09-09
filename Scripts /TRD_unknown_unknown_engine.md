# Technical Requirements Document (TRD)
## "Unknown Unknown" Engine — Autonomous Relationship Discovery for Astronomy Data

| Field | Value |
|---|---|
| Document version | 1.0 |
| Date | September 9, 2026 |
| Prepared by | AI/ML Lead |
| Project type | Hackathon prototype (Physics Department) |
| Status | Draft — locked for build duration |

---

## 1. Introduction

### 1.1 Purpose
This document specifies the technical requirements for building a system that autonomously screens astronomical variables for statistically significant relationships, attempts to fit symbolic expressions to them, generates human-readable hypotheses for candidate relationships, and presents results through a web dashboard. It is the single source of truth for scope, architecture, data contracts, and acceptance criteria during the hackathon build.

### 1.2 Project Overview
Rather than training a model to recognize known classes or known signatures, the system searches the *relationship space* between astronomical variables (mass, radius, period, temperature, metallicity, etc.) for statistically robust dependencies — including ones not explicitly programmed in — and flags them as candidate leads for human scientists. The system's credibility rests on demonstrating it can **independently rediscover known physical laws** (e.g. Kepler's third law) from raw data before any claim is made about novel candidates.

### 1.3 Definitions & Acronyms

| Term | Meaning |
|---|---|
| TRD | Technical Requirements Document (this document) |
| FDR | False Discovery Rate (multiple-comparisons correction) |
| dcor | Distance correlation — detects any statistical dependence, linear or not |
| RAG | Retrieval-Augmented Generation |
| LLM | Large Language Model |
| Known law | A relationship with an established physics formula, used to validate the pipeline |
| Candidate | Any screened relationship surfaced by the pipeline, known or novel |

### 1.4 Scope

**In scope:**
- Single dataset ingestion and cleaning (NASA Exoplanet Archive)
- Pairwise relationship screening (Pearson, Spearman, distance correlation)
- FDR-corrected statistical significance
- Symbolic regression on top candidates
- LLM-generated plausibility hypothesis per candidate
- Web dashboard displaying known-law rediscovery and candidate relationships
- Optional (stretch): RAG-based novelty check against a small curated abstract corpus

**Out of scope (explicitly, to prevent scope creep during the build):**
- Multi-dataset fusion or real-time data ingestion
- Model training/fine-tuning of any kind
- User authentication or multi-user support
- Production-grade deployment, autoscaling, or persistent database (MongoDB is a stretch-only addition, not required)
- Autonomous agent decision-making over which analysis to run (the pipeline is a fixed, deterministic sequence — see Section 8.4)
- Publishing or peer-review-grade validation of any discovered relationship

---

## 2. System Architecture

### 2.1 Architecture Diagram (textual)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────────┐
│   data/     │────▶│     ml/      │────▶│        ai/           │
│ acquisition │     │ screening    │     │ LangGraph pipeline    │
│ + cleaning  │     │ FDR          │     │ LangChain hypothesis  │
│             │     │ symbolic reg │     │ RAG novelty (stretch) │
└─────────────┘     └──────────────┘     └──────────┬───────────┘
                                                      │
                                                      ▼
                                          ┌───────────────────────┐
                                          │      output/          │
                                          │   results.json         │
                                          │   (shared contract)    │
                                          └───────────┬───────────┘
                                                      │
                                          ┌───────────▼───────────┐
                                          │      backend/          │
                                          │   FastAPI (read-only    │
                                          │   over output/)         │
                                          └───────────┬───────────┘
                                                      │  REST/JSON
                                          ┌───────────▼───────────┐
                                          │      frontend/          │
                                          │   React dashboard        │
                                          └─────────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Version constraint |
|---|---|---|
| Backend framework | FastAPI | latest stable |
| Backend server | uvicorn | latest stable |
| Frontend framework | React (via Vite) | latest stable |
| Charting | recharts | latest stable |
| Pipeline orchestration | LangGraph | latest stable |
| LLM integration | LangChain + `langchain-anthropic` | latest stable |
| LLM provider | Anthropic Claude API (`claude-sonnet-4-6`) | — |
| Statistics | `scipy`, `statsmodels`, `dcor` | latest stable |
| Symbolic regression | `gplearn` | latest stable (chosen over PySR to avoid a Julia dependency under time pressure) |
| Embeddings (RAG, stretch) | `sentence-transformers` (`all-MiniLM-L6-v2`) | latest stable |
| Vector index (RAG, stretch) | `faiss-cpu` | latest stable |
| Data acquisition | `astroquery`, `pandas` | latest stable |
| Storage | Local JSON files | — |

### 2.3 Component Ownership

| Component | Responsibility | Non-determinism? |
|---|---|---|
| `data/` | Acquisition, cleaning, feature engineering | No |
| `ml/` | Correlation screening, FDR correction, symbolic regression | No — fully reproducible |
| `ai/` | Pipeline orchestration (LangGraph), hypothesis generation (LangChain/Claude), novelty check (RAG) | Yes — LLM calls are non-deterministic by nature |
| `backend/` | Serves `output/*.json` over REST, no analysis logic | No |
| `frontend/` | Displays results | No |

**Architectural principle:** all statistical claims (correlation strength, p-values, fitted expressions, R²) are produced entirely by the deterministic `ml/` layer. The `ai/` layer only adds interpretive text (hypothesis) and optional literature context (novelty score) — it never alters or generates the underlying statistical result. This separation exists specifically so the demo is reproducible on stage: rerunning `ml/` gives identical numbers every time, even though `ai/`'s hypothesis wording may vary slightly between runs.

---

## 3. Functional Requirements

| ID | Requirement | Owner module |
|---|---|---|
| FR-1 | System shall acquire exoplanet data from the NASA Exoplanet Archive `pscomppars` table via HTTP CSV query | `data/` |
| FR-2 | System shall clean the raw dataset by removing null and physically invalid rows (negative mass/radius/period) | `data/` |
| FR-3 | System shall engineer log-transformed and ratio features from base columns | `data/` |
| FR-4 | System shall compute Pearson, Spearman, and distance correlation for every pairwise combination of specified columns | `ml/screening.py` |
| FR-5 | System shall apply Benjamini-Hochberg FDR correction across all pairwise tests before any pair is treated as significant | `ml/validation.py` |
| FR-6 | System shall attempt symbolic regression (via `gplearn`) on the top-N FDR-significant pairs and return a fitted expression with train/test R² | `ml/symbolic.py` |
| FR-7 | System shall generate a natural-language plausibility hypothesis for each significant candidate via a Claude API call, explicitly labeled as unvalidated | `ai/hypothesis.py` |
| FR-8 | System shall orchestrate FR-1 through FR-7 as a fixed, deterministic LangGraph state machine (no autonomous branching) | `ai/graph.py` |
| FR-9 (stretch) | System shall compute a novelty score for each candidate by embedding-similarity search against a curated abstract corpus | `ai/novelty.py` |
| FR-10 | System shall persist final results to `output/results.json` matching the schema in Section 6.2 | `ai/graph.py` (final node) |
| FR-11 | System shall expose `GET /api/candidates`, `GET /api/candidates/{id}`, and `GET /api/known-laws` returning data from `output/results.json` | `backend/` |
| FR-12 | System shall render a dashboard showing rediscovered known laws, a sortable candidate table, and a detail view with scatter plot + hypothesis text per candidate | `frontend/` |
| FR-13 | System shall visually and textually distinguish rediscovered known laws from unvalidated novel candidates, in both the API response (`is_known_law` flag) and the UI | `backend/`, `frontend/` |

---

## 4. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-1 | The `ml/` layer must produce identical numerical output on repeated runs against the same input data (reproducibility for live demo) |
| NFR-2 | Full pipeline execution (data → `results.json`) must complete in under 10 minutes on a standard laptop, so it can be rerun during Q&A if a judge asks |
| NFR-3 | The Anthropic API key must be loaded from environment variables (`.env`), never hardcoded or committed to version control |
| NFR-4 | The dashboard must load and render the candidate table in under 2 seconds against `output/results.json` (a static local file, so this is a low bar but should not be missed) |
| NFR-5 | Every LLM-generated hypothesis must be visually labeled as a hypothesis, not a finding, to maintain scientific honesty in front of a physics-department audience |
| NFR-6 | The system must degrade gracefully if the Claude API is unreachable during the demo — `hypothesis_text` fields may fall back to `"Hypothesis generation unavailable"` rather than crashing the pipeline |

---

## 5. Data Requirements

### 5.1 Source
NASA Exoplanet Archive, `pscomppars` (Planetary Systems Composite Parameters) table, accessed via TAP CSV query.

### 5.2 Required raw columns

| Column | Description |
|---|---|
| `pl_name` | Planet identifier |
| `pl_masse` | Planet mass (Earth masses) |
| `pl_rade` | Planet radius (Earth radii) |
| `pl_orbper` | Orbital period (days) |
| `pl_orbsmax` | Semi-major axis (AU) |
| `st_mass` | Stellar mass (solar masses) |
| `st_rad` | Stellar radius (solar radii) |
| `st_teff` | Stellar effective temperature (K) |
| `st_met` | Stellar metallicity [Fe/H] |

### 5.3 Engineered columns
`log_mass`, `log_radius`, `log_period` (base-10 logs), `mass_radius_ratio`.

### 5.4 Cleaning rules
Drop rows with nulls in any required column; drop rows with non-positive mass, radius, or period; drop duplicate planet names.

---

## 6. Data Contract: `output/results.json`

### 6.1 Purpose
This file is the single interface between the ML/AI side and the web side. Its schema is fixed before backend or frontend development begins, so both can be built in parallel against a hand-written placeholder matching this exact shape.

### 6.2 Schema

```json
[
  {
    "id": "string, unique per candidate",
    "var1": "string, column name",
    "var2": "string, column name",
    "method": "string, one of: pearson | spearman | dcor",
    "score": "float, correlation/dependence strength",
    "pvalue": "float, FDR-corrected p-value",
    "expression": "string, fitted symbolic expression or null",
    "hypothesis_text": "string, LLM-generated plausibility hypothesis",
    "train_r2": "float",
    "test_r2": "float",
    "is_known_law": "boolean",
    "known_law_name": "string or null",
    "sample_points": [{"x": "float", "y": "float"}, "... required for scatter chart"]
  }
]
```

Every field is required except `known_law_name`, which is `null` when `is_known_law` is `false`.

---

## 7. API Specification

| Method | Path | Description | Response |
|---|---|---|---|
| GET | `/api/health` | Liveness check | `{"status": "ok"}` |
| GET | `/api/candidates` | All candidates | Array matching Section 6.2 schema |
| GET | `/api/candidates/{id}` | Single candidate by id | Single object matching Section 6.2 schema, or `{"error": "not found"}` |
| GET | `/api/known-laws` | Subset where `is_known_law == true` | Array matching Section 6.2 schema |

All endpoints are read-only (`GET` only) — the pipeline runs offline ahead of the demo and writes `output/results.json` once; the API never triggers pipeline execution live. This is a deliberate simplification to avoid exposing pipeline runtime (up to 10 minutes, per NFR-2) through a synchronous HTTP request during judging.

---

## 8. Algorithm & Pipeline Specification

### 8.1 Screening formulas

| Method | Formula | Catches |
|---|---|---|
| Pearson | r = Σ(xᵢ−x̄)(yᵢ−ȳ) / √[Σ(xᵢ−x̄)²Σ(yᵢ−ȳ)²] | Linear only |
| Spearman | Pearson correlation computed on rank-transformed data | Monotonic nonlinear |
| Distance correlation | dCor(X,Y), pairwise-distance based; zero iff X,Y independent | Any dependence, linear or not |

### 8.2 FDR correction
Benjamini-Hochberg procedure: sort p-values ascending, find the largest rank k such that p₍k₎ ≤ (k/m)·α (α = 0.05, m = total number of pairwise tests), reject all null hypotheses up to rank k. Implemented via `statsmodels.stats.multitest.multipletests`.

### 8.3 Symbolic regression
`gplearn.genetic.SymbolicRegressor`, applied only to pairs surviving FDR correction. Fitness function is loss plus a complexity penalty (parsimony coefficient), to bias toward simple, physically plausible expressions over overfit ones. Output: best-fit expression string, train R², test R² (via held-out split).

### 8.4 Pipeline orchestration (LangGraph)
The pipeline is modeled as a `StateGraph` with a **fixed linear edge sequence** — no conditional routing, no autonomous stage selection:

```
load_data → generate_features → screen_relationships → fdr_correct
→ symbolic_regression → generate_hypothesis → novelty_check → validate → compile_output
```

State schema (`PipelineState`, TypedDict) carries: `raw_data`, `features`, `screened_pairs`, `corrected_pairs`, `symbolic_results`, `hypotheses`, `novelty_results`, `validation_results`, `final_output`.

This determinism is a deliberate architectural constraint (see Section 2.3): the sequence never changes based on LLM output, which keeps the numerical result of any given run fully reproducible.

### 8.5 Hypothesis generation
Single LangChain chain (`ChatPromptTemplate` → `ChatAnthropic`), invoked once per FDR-significant candidate. Temperature set low (0.3) to reduce run-to-run variance in wording. Output explicitly instructed to state plausibility, not certainty.

### 8.6 Novelty check (stretch)
`sentence-transformers` (`all-MiniLM-L6-v2`) embeds a curated corpus of 100–300 astro-ph abstracts into a `faiss.IndexFlatL2` index. Each candidate relationship's description is embedded and matched against the index; nearest-neighbor distance is reported as a rough novelty proxy, not a definitive literature check.

---

## 9. External Dependencies

| Dependency | Type | Notes |
|---|---|---|
| Anthropic Claude API | LLM provider | Requires `ANTHROPIC_API_KEY`; single point of failure for FR-7 — see NFR-6 for fallback behavior |
| NASA Exoplanet Archive TAP service | Data source | Public, no auth required; single point of failure for FR-1 — mitigate by caching the raw CSV locally after first successful pull |
| PyPI packages (Section 2.2) | Software dependencies | Pinned via `requirements.txt` generated on Hour 0 |

---

## 10. Assumptions & Constraints

- Single dataset (NASA Exoplanet Archive) for the full build; no live multi-source fusion.
- Internet access is available at demo time for the initial data pull, but the pipeline output (`output/results.json`) is pre-computed and does not require live internet access to demo the dashboard itself.
- Team consists of one experienced AI/ML lead, one beginner ML engineer (execution-level tasks only), and one beginner full-stack developer — task granularity throughout this TRD and the companion master plan is set accordingly.
- Time-boxed to a single hackathon (~24 hours); anything not explicitly listed as in-scope (Section 1.4) is deferred.

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Symbolic regression fails to converge on a clean expression for target known laws | Medium | High — undermines the core demo claim | Prioritize Kepler's third law first (simplest power-law relationship); have a manual fallback plot ready even if `gplearn` output is messy |
| Claude API rate limits or outage during build/demo | Low-Medium | Medium | Cache all hypothesis text to `output/hypotheses.json` ahead of time; dashboard never calls the API live (NFR-6) |
| FDR correction leaves zero significant pairs after correction (too conservative for small sample) | Medium | High | Pre-validate on the chosen dataset during Hour 0 spike; adjust α or pre-filter obviously-related column pairs (e.g. same-unit variables) if needed |
| Jr. ML engineer blocked waiting on lead's scripts | Medium | Low | Learning add-on tasks (Section 12 of master plan) fill idle time without blocking the critical path |
| Frontend/backend integration mismatch on JSON shape | Low | Medium | Schema fixed at Hour 1 (Section 6); backend/frontend build against a hand-written fixture matching it from Hour 0 |
| gplearn/PySR install failure under time pressure | Low | Medium | `gplearn` chosen specifically over PySR to avoid the Julia dependency (Section 2.2) |

---

## 12. Acceptance Criteria / Definition of Done

The build is considered demo-ready when all of the following hold:

1. `output/results.json` exists, validates against the Section 6.2 schema, and contains at least one entry with `is_known_law: true` whose `expression` matches the true physical formula (e.g. Kepler's third law) within reasonable numerical error.
2. All three API endpoints (Section 7) return live data from that file with no errors.
3. The dashboard renders the known-law panel, the full candidate table, and a working detail view (scatter chart + hypothesis text) for at least one non-obvious candidate.
4. The full pipeline (`data/` → `ml/` → `ai/` → `output/`) can be rerun end-to-end in under 10 minutes and produces the same statistical results (score, p-value, expression, R²) on each run.
5. Every hypothesis displayed in the UI is visibly labeled as an unvalidated AI-generated hypothesis.

---

## Appendix A — Reference Documents
- `astronomy_formulas_reference.md` — full list of target relationships and underlying statistical formulas
- `hackathon_masterplan.md` — role assignments, hour-by-hour schedule, and per-person task breakdown

## Appendix B — Repository Structure
See `hackathon_masterplan.md`, Section 2, for the full annotated folder tree (`ai/`, `ml/`, `data/`, `backend/`, `frontend/`, `output/`).
