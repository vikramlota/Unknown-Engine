# Product Requirements Document (PRD)
## "Unknown Unknown" Engine — Autonomous Relationship Discovery for Astronomy Data

| Field | Value |
|---|---|
| Document version | 1.0 |
| Date | September 9, 2026 |
| Prepared by | AI/ML Lead |
| Project type | Hackathon prototype (Physics Department) |
| Companion documents | `TRD_unknown_unknown_engine.md` (technical spec), `hackathon_masterplan.md` (roles & schedule), `astronomy_formulas_reference.md` (formulas) |

---

## 1. Executive Summary

Most machine learning applied to astronomy is built to recognize patterns humans already know how to describe — classify a spectral type, detect a known transit shape, flag a statistical outlier. This product takes a different angle: it searches for **relationships between variables that no one explicitly told it to look for**, validates them statistically, and — where possible — proves its own credibility by independently rediscovering laws physicists already know (like Kepler's third law) before surfacing anything novel. The deliverable is a working prototype and live demo for a physics-department hackathon.

---

## 2. Problem Statement

Astronomical datasets (stellar catalogs, exoplanet archives) contain dozens of measured variables per object. Researchers typically test specific, hypothesis-driven relationships they already suspect exist. Relationships nobody thought to test in the first place are structurally invisible to this workflow — not because the data doesn't support them, but because no one asked the question. Existing ML tooling in this space (classifiers, anomaly detectors) doesn't address this gap either: both are still built around categories or definitions humans provided upfront.

**The gap:** there is no accessible tool that systematically searches relationship-space itself and separates statistically robust candidates from noise, without requiring a researcher to specify what to look for in advance.

---

## 3. Goals & Objectives

### 3.1 Hackathon goals (primary — this build)
- Deliver a working, demoable system within the hackathon timeframe.
- Convincingly demonstrate the pipeline can rediscover at least one established physical law from raw data alone, as proof the method is sound rather than spurious.
- Present a small set of statistically validated candidate relationships, clearly separated from confirmed physics, as "leads for follow-up."
- Win credibility with a physics-literate judging panel by being transparent about statistical rigor (FDR correction, cross-validation) rather than overclaiming discovery.

### 3.2 Longer-term product vision (out of scope for this build, stated for context)
- Extendable to additional astronomical catalogs beyond exoplanets (stellar, variable star, galaxy survey data).
- Usable by researchers as a lead-generation tool that feeds into, rather than replaces, human hypothesis-driven investigation.
- Potential to formalize the novelty-check step into an actual literature-grounded discovery-support tool.

---

## 4. Target Users

### 4.1 Primary user (for this hackathon build)
**Hackathon judges / physics department faculty and students** evaluating the project live. They are domain experts, skeptical of unsubstantiated ML claims, and will respond well to statistical rigor and poorly to overclaiming.

### 4.2 Secondary/aspirational user (product vision, not this build)
**Astronomy researchers** looking for candidate relationships worth investigating manually, who would use this as a triage tool rather than a source of truth.

### 4.3 User Personas

**Persona 1 — "The Skeptical Judge"**
A physics faculty member reviewing the project. Wants to see: is this real statistics or an LLM making things up? Is the pipeline reproducible? Does it distinguish known physics from speculation clearly?

**Persona 2 — "The Curious Researcher"** (aspirational)
A grad student or postdoc who has access to a dataset and wants a fast first pass at "what's worth looking into here" before committing time to a specific hypothesis.

---

## 5. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-1 | Judge | See the system rediscover a known physical law from raw data | I can trust the pipeline isn't just producing noise |
| US-2 | Judge | See exactly how statistical significance was determined (method, p-value, correction applied) | I can evaluate scientific rigor, not just take a claim on faith |
| US-3 | Judge | Clearly distinguish which results are confirmed physics vs. AI-generated speculation | I don't mistake a hypothesis for a finding |
| US-4 | Researcher (aspirational) | Browse a ranked list of candidate relationships in my dataset | I can quickly identify what's worth investigating further |
| US-5 | Researcher (aspirational) | See a plain-language explanation for why a relationship might exist | I can form an initial hypothesis faster than starting from scratch |
| US-6 | Researcher (aspirational) | See whether a candidate relationship resembles something already published | I don't waste time "rediscovering" known literature |

---

## 6. Scope

### 6.1 In scope (MVP for this hackathon)

| Feature | Priority | Description |
|---|---|---|
| Known-law rediscovery demo | P0 | Pipeline independently recovers at least one established relationship (e.g. Kepler's third law) from raw data |
| Relationship screening | P0 | Pairwise statistical screening (Pearson, Spearman, distance correlation) across dataset variables |
| Multiple-comparisons correction | P0 | FDR correction applied before any result is treated as significant |
| Symbolic expression fitting | P0 | Best-effort functional form fitted to significant candidate pairs |
| Candidate dashboard | P0 | Web UI showing known laws and candidate relationships, sortable and browsable |
| AI-generated hypothesis text | P1 | Plain-language plausibility explanation per candidate, clearly labeled as unvalidated |
| Scatter plot per candidate | P1 | Visual evidence supporting each relationship, not just a numeric score |
| Novelty check against literature | P2 (stretch) | Rough similarity check against a small curated abstract corpus |

### 6.2 Out of scope (explicitly, for this build)

- Multiple datasets or live/streaming data ingestion
- Any model training or fine-tuning
- User accounts, authentication, or multi-user collaboration
- Formal peer-review-grade statistical validation of any specific discovered relationship
- Autonomous agent decision-making over pipeline steps (the pipeline is fixed and deterministic — see companion TRD Section 8.4)
- Production deployment, scaling, or persistent database infrastructure

---

## 7. Key User Flows

### 7.1 Demo flow (judge-facing)
1. Judge opens the dashboard.
2. Sees the known-law panel first — a rediscovered relationship (e.g. Kepler's third law) with its fitted expression and fit quality, presented as proof of validity.
3. Browses the candidate table of all statistically significant relationships found.
4. Clicks into a non-obvious candidate — sees a scatter plot, the correlation strength/p-value, the fitted expression, and an AI-generated hypothesis clearly labeled as speculative.
5. (If built) sees a novelty indicator suggesting whether this resembles existing literature.
6. Comes away understanding: this is a statistically disciplined lead-generation tool, not a claim of new discovery.

### 7.2 Aspirational flow (researcher, future vision)
1. Researcher uploads or points to their own dataset.
2. Reviews ranked candidates.
3. Reads hypothesis + novelty signal for a candidate of interest.
4. Exports the candidate list to follow up on manually.

(Flow 7.2 is not built in this hackathon — the dataset is fixed to the NASA Exoplanet Archive for the demo, per Section 6.2.)

---

## 8. Success Metrics

| Metric | Target for this hackathon |
|---|---|
| Known-law rediscovery | At least 1 established relationship correctly recovered with a matching functional form |
| Statistical rigor demonstrated | FDR correction visibly applied and explainable on request |
| Reproducibility | Pipeline produces identical statistical results (score, p-value, expression, R²) on repeat runs |
| Dashboard functionality | All P0 and P1 features (Section 6.1) working end-to-end without crashes during the live demo |
| Judge comprehension | Judges can articulate, unprompted, the distinction between "rediscovered known law" and "unvalidated candidate" after the demo |

There is no numeric target for "number of novel discoveries," deliberately — this product's success is about the credibility of the *method*, not a claim of scientific discovery within a 24-hour window.

---

## 9. Assumptions & Constraints

- Single, publicly available dataset (NASA Exoplanet Archive) is sufficient to support the demo narrative.
- The judging panel is physics-literate and will value statistical transparency over a flashier but unsubstantiated claim.
- Team composition (one experienced AI/ML lead, two beginners) constrains the feature set to what's achievable within ~24 hours — see companion master plan for the detailed schedule.
- Internet access is available for the initial data pull ahead of the demo; the live demo itself can run against pre-computed results if needed.

---

## 10. Risks (Product-Level)

| Risk | Impact on product goals | Mitigation |
|---|---|---|
| Symbolic regression doesn't cleanly recover a known law | Undermines the entire credibility narrative (US-1) | Prioritize the simplest, most reliable target (Kepler's third law) first; have a manual/visual fallback ready |
| AI-generated hypotheses read as overclaiming discovery | Damages trust with a skeptical, expert audience (US-3) | Explicit UI labeling and consistent language ("hypothesis," "candidate," never "discovery") throughout the product, not just in the pitch |
| Dashboard breaks or lags during live demo | Directly undermines the demo experience | Pipeline runs offline ahead of time; dashboard reads only static pre-computed results, no live pipeline execution during judging |
| Judges perceive the tool as "just correlation, so what" | Weakens perceived value (US-4, US-5) | Lead with the known-law rediscovery as concrete proof of method validity before showing any candidate results |

---

## 11. Timeline & Milestones

Tied to the hackathon's ~24-hour build window (see `hackathon_masterplan.md` for the full hour-by-hour breakdown):

| Milestone | Target time | Gate |
|---|---|---|
| Data pipeline + screening functional | Hour 9 | `ml/` layer complete |
| Full pipeline wired end-to-end | Hour 14 | LangGraph pipeline runs without error |
| **Known-law rediscovery confirmed** | Hour 18 | **Critical go/no-go checkpoint — Section 6.1 P0 requirement** |
| Dashboard functional against real data | Hour 21 | P0 + P1 features working |
| Demo-ready | Hour 24 | All Section 8 success metrics met |

---

## 12. Stakeholders

| Role | Person | Responsibility |
|---|---|---|
| Product & AI/ML Lead | You | Overall product direction, `ai/` + `ml/` build, pitch narrative |
| ML Engineering (execution) | Jr. ML Engineer | Data pipeline execution, plotting, script running |
| Full-Stack Development | Full-Stack Dev | Dashboard (frontend) and API (backend) |
| Evaluators | Hackathon judges / physics faculty | Assess technical rigor and demo credibility |

---

## Appendix — Companion Documents
- `TRD_unknown_unknown_engine.md` — full technical specification, API contracts, algorithm details
- `hackathon_masterplan.md` — folder structure, detailed role assignments, hour-by-hour schedule
- `astronomy_formulas_reference.md` — target relationships and underlying statistical formulas
