# Unknown-Engine: Autonomous Scientific Law Discovery Platform

An open-source, domain-agnostic scientific machine learning platform that autonomously discovers non-linear mathematical regularities, scaling laws, and governing equations directly from high-dimensional observational and laboratory datasets—without prior physics instruction.

---

## Executive Summary

Modern scientific instruments (e.g., space telescopes, particle colliders, tokamaks) output terabytes of multi-variable measurement data every day. Traditional physics relies on human intuition to formulate hypotheses, which falters in high-dimensional spaces. Standard deep learning produces opaque "black-box" models whose parameter weights cannot be peer-reviewed or integrated into physical theory.

**Unknown-Engine** bridges this divide:
1. **Non-Linear Discovery**: Employs Distance Correlation (`dcor`) to detect arbitrary non-linear couplings that standard Pearson correlation ($r \approx 0$) completely misses.
2. **Interpretable Closed-Form Physics**: Uses Genetic Symbolic Regression (`gplearn`) to extract human-readable algebraic equations ($y = f(x)$).
3. **Statistical Defense**: Mathematically suppresses false positives via Benjamini-Hochberg False Discovery Rate (FDR) control and Bayesian/Akaike Information Criterion (BIC/AIC) Occam's Razor penalties.
4. **Scientific Credibility Anchor**: Autonomously rediscovers **Kepler's Third Law of Planetary Motion** ($T = 365.25 \cdot a^{1.5}$, $R^2 = 0.998$) from 5,491 raw NASA exoplanet observations with zero physical hints.
5. **Multi-Domain Physics Catalog**: Pre-configured discovery benchmarks for orbital mechanics, thermodynamics, classical harmonic oscillators, gravitation, and cosmology.

---

## System Architecture

```
[ Raw Observational / Laboratory Data ] (e.g. NASA Exoplanet Archive / Sensor CSV)
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Non-Linear Feature Screening                             │
│    • Pairwise Distance Correlation (dcor) Matrix            │
│    • Spearman rank permutation test (p < 1e-5)              │
│    • Benjamini-Hochberg False Discovery Rate (FDR) Control  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Genetic Symbolic Regression (gplearn)                    │
│    • Primitive operators: add, sub, mul, div, sqrt, pow     │
│    • Population: 1,000 syntax trees evolved over 20 gens    │
│    • Parsimony & Occam's Razor complexity regularization    │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Validation & Scientific Auditing (XAI Engine)            │
│    • Cross-instrument telescope bias verification           │
│    • Counterfactual perturbation simulator                  │
│    • Unit & dimensional consistency check                   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Autonomous Hypothesis Synthesis                          │
│    • LLM reasoning layer drafts falsifiable hypotheses      │
│    • Designs targeted JWST / lab follow-up proposals        │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
[ Interactive Astronomy Void Terminal Dashboard (React + Vite) ]
```

---

## The Ground-Truth Benchmark: Kepler's Third Law

To prove the engine extracts genuine physical principles rather than statistical noise, the system was provided raw observational data from **5,491 alien star systems** (NASA Kepler, K2, and TESS missions) containing orbital periods (`pl_orbper`) and semi-major axes (`pl_orbsmax`).

### Empirical Rediscovery Results:
- **Historical Derivation**: Johannes Kepler (1619) deduced $T^2 \propto a^3$ after 18 years of manual calculation on Tycho Brahe's Mars tables.
- **Autonomous Rediscovery**: Unknown-Engine detected $dcor = 0.990$ and converged on the exact power law:
  $$\text{pl\_orbper} \approx 365.25 \times (\text{pl\_orbsmax})^{1.498} \quad (R^2 = 0.998)$$
- **Execution Time**: Less than 15 seconds.

---

## Project Structure

```
Unknown-Engine/
├── backend/                        # FastAPI REST API Backend
│   ├── main.py                     # API root & middleware routing
│   ├── models.py                   # Pydantic schemas (Candidate, SamplePoint)
│   └── routes/
│       ├── candidates.py           # GET /api/candidates
│       ├── known_laws.py           # GET /api/known-laws (Kepler benchmark)
│       ├── discoverable_laws.py    # GET /api/discoverable-laws (Physics catalog)
│       ├── data_sync.py            # POST /api/fetch-nasa-data (Caltech TAP sync)
│       ├── eda.py                  # GET /api/raw-data & GET /api/eda
│       ├── report.py               # GET /api/ai/report/{id} (Research doc generator)
│       └── xai.py                  # GET /api/xai/{id} (Explainable AI audits)
│
├── frontend/                       # React (Vite) Astronomy Terminal UI
│   ├── src/
│   │   ├── App.jsx                 # Top-level routing (#dashboard, #raw-data, #eda, #laws)
│   │   ├── api.js                  # Frontend API integration client
│   │   ├── index.css               # Galamo deep-space void theme & glow styling
│   │   └── components/
│   │       ├── Dashboard.jsx       # Discovery cockpit & candidates view
│   │       ├── DiscoverableLawsPage.jsx # Interactive physics catalog & simulator
│   │       ├── EdaPage.jsx         # Live exploratory data analysis & correlations
│   │       ├── RawDataPage.jsx     # Paginated NASA observational table
│   │       ├── KnownLawsPanel.jsx  # Kepler credibility benchmark display
│   │       ├── XaiInspector.jsx    # 5-tab explainable AI & counterfactual simulator
│   │       ├── Icons.jsx           # Clean SVG vector icon system
│   │       ├── RelationshipTable.jsx # Ranked discovered relationships
│   │       ├── ScatterChartCard.jsx# Empirical scatter & regression overlay
│   │       ├── HypothesisPanel.jsx # Physical hypothesis card
│   │       └── ReportModal.jsx     # Markdown research document viewer
│
├── data/                           # Observational Datasets
│   ├── raw/exoplanets.csv          # Raw observations from Caltech TAP
│   └── processed/                  # Cleaned and normalized feature tables
│
├── output/                         # Persistence & Artifacts
│   ├── results.json                # Discovered symbolic candidate formulas
│   ├── plots/                      # Generated visualization plots
│   └── reports/                    # Persisted research report artifacts
│
└── Scripts/                        # Engineering specifications & masterplan
    ├── TRD_unknown_unknown_engine.md
    └── hackathon_masterplan.md
```

---

## Getting Started

### Prerequisites
- **Python 3.10+** (with virtual environment)
- **Node.js 18+** and `npm`

---

### Backend Setup (FastAPI)

1. Navigate to the project root and activate your Python environment:
   ```bash
   cd Unknown-Engine
   source ~/tf_gtx/bin/activate    # Or your preferred virtualenv / conda env
   ```

2. Install the required Python scientific and AI libraries:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI backend server:
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   The API will be live at `http://localhost:8000`. You can inspect interactive API documentation at `http://localhost:8000/docs`.

---

### Frontend Setup (React + Vite)

1. In a separate terminal, navigate to the frontend directory:
   ```bash
   cd Unknown-Engine/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/candidates` | Returns all discovered non-linear physical relationships, formulas, and empirical sample points. |
| `GET` | `/api/known-laws` | Returns ground-truth validation laws (e.g. Kepler's Third Law benchmark). |
| `GET` | `/api/discoverable-laws` | Complete catalog of 8+ physical laws discoverable across mechanics, thermodynamics, and astrophysics. |
| `POST` | `/api/fetch-nasa-data` | Triggers a live sync pulling fresh exoplanet records directly from the Caltech NASA TAP service. |
| `GET` | `/api/raw-data` | Paginated and searchable raw observational records (page, limit, search query). |
| `GET` | `/api/eda` | Computes statistical summaries, missingness percentages, and correlation matrices on demand. |
| `GET` | `/api/xai/{id}` | Computes 5-point Explainable AI audits (feature attribution, Occam complexity, telescope bias). |
| `GET` | `/api/ai/report/{id}` | Synthesizes a peer-reviewed research document with follow-up observational ideas. |
| `GET` | `/api/health` | Health check endpoint returning `{ "status": "ok" }`. |

---

## Discoverable Physical Laws Catalog

The engine is domain-agnostic and includes theoretical specifications and verification scripts for:

1. **Kepler's Third Law** ($T = 365.25 \cdot a^{1.5}$) — Orbital mechanics.
2. **Planetary Equilibrium Temperature** ($T_{eq} = T_* \cdot (R_*/2a)^{1/2} \cdot (1-A_B)^{1/4}$) — Atmospheric thermal radiation.
3. **Transit Depth Geometric Occlusion** ($\delta = (R_p / R_*)^2$) — Photometric transit geometry.
4. **Ideal Gas Law** ($P = nRT / V$) — Thermodynamic kinetic theory.
5. **Newton's Universal Gravitation / Coulomb's Law** ($F = G \cdot m_1 m_2 / r^2$) — Inverse-square fields.
6. **Simple Pendulum Harmonic Period** ($T = 2\pi \sqrt{L/g}$) — Small-angle oscillation.
7. **Terrestrial Mass-Radius Scaling** ($R_p \propto M_p^{0.28}$) — Planetary interior equations of state.
8. **Hubble-Lemaître Cosmological Expansion** ($v = H_0 \cdot d$) — Metric expansion of spacetime.

Navigate to the **Discoverable Laws** tab (`#laws`) in the web application to test interactive parameter sliders and inspect Python ingestion scripts for each law.

---

## Explainable AI (XAI) Suite

To satisfy scientific peer-review standards, every discovered candidate formula includes an interactive XAI inspector:
- **Attribution Breakdown**: Quantifies the relative contribution of each variable using permutation importance.
- **Occam's Razor Audit**: Evaluates the Bayesian Information Criterion (BIC) penalty against formula tree complexity.
- **Interactive Counterfactual Simulator**: Allows researchers to slide input parameters to inspect model predictions and theoretical divergence in real time.
- **Telescope Instrument Bias**: Cross-checks candidates across multiple instruments (Kepler, K2, TESS) to confirm laws are not detector artifacts.
- **Benjamini-Hochberg Defense**: Visualizes the FDR critical threshold ensuring false discovery control at $\alpha = 0.05$.

---

## Scientific Data Attribution

Observational exoplanet data is sourced directly from:
- **NASA Exoplanet Archive** operated by the California Institute of Technology (Caltech) under contract with NASA.
- Data services: Caltech IPAC TAP (Table Access Protocol) service for confirmed planetary parameters.

---

## License

This project is licensed under the MIT License — see the repository for details.
