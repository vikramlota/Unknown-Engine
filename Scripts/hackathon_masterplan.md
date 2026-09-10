# Master Plan: "Unknown Unknown" Engine — Physics Hackathon

Team: AI/ML Lead (you) · Jr. ML Engineer (very beginner) · Full-Stack Dev (beginner, React + FastAPI)

This document is written so each person can work from it directly without researching anything outside it. Read Section 1 and 2 fully, then jump to your own role section.

---

## 1. Tech Stack (locked — do not deviate mid-hackathon)

| Layer | Choice | Why |
|---|---|---|
| Frontend | **React** (Vite) | Standard, fast to scaffold |
| Backend | **FastAPI** (Python) only — no Node/Express | Single language across ML + API, no cross-language bridge |
| AI (orchestration + LLM) | **LangGraph** + **LangChain** + Anthropic Claude API | LangGraph models the pipeline as an explicit graph; LangChain handles the hypothesis-generation prompt |
| ML (deterministic core) | `scipy`, `statsmodels`, `dcor`, `gplearn` | Correlation screening, FDR correction, symbolic regression — no LLM involved, fully reproducible |
| Data | `astroquery` / direct CSV, `pandas` | Acquisition + cleaning |
| RAG (novelty check, stretch) | **FAISS** + `sentence-transformers` | Local, in-memory, no external vector DB |
| Storage | Local JSON files | No MongoDB — one less service to debug during judging |

---

## 2. Repository Structure — organized by domain

Five top-level folders, one per area of ownership, plus a shared `output/` folder that connects them.

```
hackathon-project/
│
├── ai/                            # OWNER: AI/ML Lead
│   ├── __init__.py                #   LLM + agentic layer: LangGraph orchestration,
│   ├── graph.py                   #   LangChain hypothesis chain, RAG novelty check.
│   ├── hypothesis.py              #   Nothing here runs without an Anthropic API call.
│   └── novelty.py
│
├── ml/                             # OWNER: AI/ML Lead
│   ├── __init__.py                 #   Deterministic stats layer: correlation/MI
│   ├── screening.py                #   screening, FDR correction, symbolic regression.
│   ├── validation.py               #   No LLM calls here — pure numpy/scipy, fully
│   └── symbolic.py                 #   reproducible on every run.
│
├── data/                           # OWNER: Jr. ML Engineer (execution) /
│   ├── raw/                        #        AI/ML Lead (design/review)
│   │   └── exoplanets.csv          #   Acquisition, cleaning, feature engineering.
│   ├── processed/
│   │   └── exoplanets_clean.csv
│   ├── abstracts.json              #   RAG corpus (stretch goal)
│   ├── fetch_data.py
│   └── clean_data.py
│
├── backend/                        # OWNER: Full-Stack Dev
│   ├── __init__.py                 #   Thin FastAPI layer only. Reads output/*.json
│   ├── main.py                     #   and serves it. Contains NO ML/stats/LLM logic.
│   ├── models.py
│   └── routes/
│       ├── __init__.py
│       ├── candidates.py
│       └── known_laws.py
│
├── frontend/                       # OWNER: Full-Stack Dev
│   └── src/                        #   React dashboard.
│       ├── App.jsx
│       ├── api.js
│       └── components/
│           ├── Dashboard.jsx
│           ├── RelationshipTable.jsx
│           ├── ScatterChartCard.jsx
│           ├── HypothesisPanel.jsx
│           └── KnownLawsPanel.jsx
│
├── output/                         # SHARED — written by ai/ + ml/, read by backend/
│   ├── results.json                #   This folder is the contract between the ML
│   ├── screening_results.json      #   side and the web side. Its schema (Section 6)
│   ├── corrected_pairs.json        #   is fixed on Hour 0 so both sides can build in
│   ├── hypotheses.json             #   parallel without waiting on each other.
│   └── plots/
│       └── kepler_third_law.png
│
├── requirements.txt
└── README.md
```

**Why this layout:** `ai/` and `ml/` are separated on purpose — `ml/` is deterministic and reproducible (safe to demo live, reruns give identical results), `ai/` involves LLM calls (non-deterministic, used only for hypothesis text and novelty checks, never for the core statistical claims). `backend/` never contains analysis logic — it only reads `output/` and serves JSON. This means frontend and backend work can start on Hour 0 against placeholder files, without waiting for the real pipeline to finish.

---

## 3. Environment Setup (run once, exact commands, from repo root)

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install fastapi uvicorn pandas numpy scipy statsmodels
pip install scikit-learn gplearn dcor
pip install langchain langchain-anthropic langgraph
pip install sentence-transformers faiss-cpu
pip install astroquery matplotlib
pip freeze > requirements.txt
```

Create `.env` in repo root:
```
ANTHROPIC_API_KEY=your_key_here
```

Add empty `__init__.py` files to `ai/`, `ml/`, `backend/`, `backend/routes/` so they're importable as packages.

Run backend from repo root (not from inside `backend/`):
```bash
uvicorn backend.main:app --reload --port 8000
```

Frontend:
```bash
cd frontend
npm create vite@latest . -- --template react
npm install axios recharts
npm run dev
```

---

## 4. Roles & Ownership — Overview

| Folder | Primary Owner | Support | Touches LLM? |
|---|---|---|---|
| `ai/` | AI/ML Lead | — | Yes (Claude API via LangChain) |
| `ml/` | AI/ML Lead | — | No — pure stats |
| `data/` | Jr. ML Engineer | AI/ML Lead (design) | No |
| `backend/` | Full-Stack Dev | — | No — only serves JSON |
| `frontend/` | Full-Stack Dev | — | No |
| `output/` | Shared contract | Schema fixed by AI/ML Lead on Hour 0 | — |

**Golden rule for the team:** if you're not the listed owner of a folder, don't edit files inside it — ask the owner. This avoids merge conflicts and, more importantly, avoids a beginner accidentally editing statistics code they don't yet have the background to debug.

---

## 5. Role in Detail — AI/ML Lead (You)

**Owns:** `ai/`, `ml/`, the `output/` schema, final pipeline integration, pitch narrative.

**Does not need to touch:** `frontend/`, `backend/` internals (only tells the Full-Stack Dev what JSON shape to expect).

### Responsibilities
- Define the exact `output/results.json` schema (Section 6) by Hour 1, so backend and frontend can build against it immediately.
- Build the entire `ml/` layer: screening functions, FDR correction, symbolic regression.
- Build the entire `ai/` layer: LangGraph pipeline graph, LangChain hypothesis chain, RAG novelty check.
- Hand off small, pre-written, runnable scripts to the Jr. ML Engineer (they execute, you design).
- Confirm the pipeline rediscovers at least one known law (Section 7.2) — this is the single most important checkpoint in the whole hackathon.
- Own final integration testing and the demo/pitch.

### Detailed task list

| # | Task | File | Hour |
|---|---|---|---|
| 1 | Repo + env setup, confirm Claude API key works | root | 0-1 |
| 2 | Define & document `output/results.json` schema | `output/` | 1 |
| 3 | Pick dataset, do a first manual pull yourself to confirm it works | `data/` | 1 |
| 4 | Write `pearson_screen`, `spearman_screen`, `distance_corr_screen` | `ml/screening.py` | 1-4 |
| 5 | Write `fdr_correct(pairs, alpha=0.05)` | `ml/validation.py` | 4-5 |
| 6 | Write `gplearn` wrapper for symbolic regression | `ml/symbolic.py` | 5-9 |
| 7 | Build LangGraph `StateGraph` wiring all pipeline stages | `ai/graph.py` | 9-12 |
| 8 | Write + test LangChain hypothesis-generation chain | `ai/hypothesis.py` | 12-14 |
| 9 | **Run full pipeline end-to-end — confirm known-law rediscovery** | — | 14-18 |
| 10 | Build FAISS RAG novelty check (stretch) | `ai/novelty.py` | 18-21 |
| 11 | Write final `output/results.json` from real pipeline output | `output/` | as soon as #9 passes |
| 12 | Integration pass with both teammates | — | 21-23 |
| 13 | Pitch deck + demo script | — | 23-24 |

### Definition of done
`output/results.json` exists, matches the schema in Section 6, and contains at least one entry with `is_known_law: true` whose fitted expression matches the real physics formula within reasonable error.

---

## 6. `output/results.json` Schema (fixed Hour 1 — this is the contract)

```json
[
  {
    "id": "1",
    "var1": "pl_orbsmax",
    "var2": "pl_orbper",
    "method": "dcor",
    "score": 0.94,
    "pvalue": 0.0001,
    "expression": "y = 2.98 * x^1.5",
    "hypothesis_text": "This relationship reflects gravitational dynamics...",
    "train_r2": 0.97,
    "test_r2": 0.95,
    "is_known_law": true,
    "known_law_name": "Kepler's Third Law",
    "sample_points": [{"x": 0.1, "y": 12.3}, {"x": 0.2, "y": 34.5}]
  }
]
```

`sample_points` is required — it's what the frontend's scatter chart plots. Without it, `ScatterChartCard.jsx` has nothing to render.

---

## 7. Role in Detail — Jr. ML Engineer (Very Beginner)

**Owns:** `data/` folder (acquisition, cleaning, feature engineering scripts), plus running (not designing) finished scripts handed to you from `ml/` and `ai/`.

**Does not design:** any statistics, any LangChain/LangGraph code, any FastAPI or React code. You run what's handed to you and report the output.

### 7.1 Task 1 — Environment setup (Hour 0)
Run Section 3's setup commands. Confirm with:
```bash
python -c "import gplearn, dcor, langchain; print('ok')"
```

### 7.2 Task 2 — Data acquisition (Hour 0-2)
File: `data/fetch_data.py`
```python
import pandas as pd

url = ("https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query="
       "select+pl_name,pl_masse,pl_rade,pl_orbper,pl_orbsmax,"
       "st_mass,st_rad,st_teff,st_met+from+pscomppars&format=csv")
df = pd.read_csv(url)
df.to_csv("data/raw/exoplanets.csv", index=False)
print(df.shape, df.columns.tolist())
```
Run it, confirm `data/raw/exoplanets.csv` exists, report row count and columns to the lead.

### 7.3 Task 3 — Data cleaning (Hour 2-4)
File: `data/clean_data.py`
```python
import pandas as pd

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.dropna(subset=["pl_masse", "pl_rade", "pl_orbper", "pl_orbsmax", "st_mass", "st_rad", "st_teff"])
    df = df[(df["pl_masse"] > 0) & (df["pl_rade"] > 0) & (df["pl_orbper"] > 0)]
    df = df.drop_duplicates(subset=["pl_name"])
    return df

if __name__ == "__main__":
    df = pd.read_csv("data/raw/exoplanets.csv")
    clean = clean_data(df)
    clean.to_csv("data/processed/exoplanets_clean.csv", index=False)
    print(f"Cleaned: {len(clean)} rows remain (from {len(df)})")
```
Run it, report the row count to the lead.

### 7.4 Task 4 — Feature engineering (Hour 4-6)
Add to the same `clean_data.py`, after cleaning:
```python
import numpy as np
df["log_mass"] = np.log10(df["pl_masse"])
df["log_radius"] = np.log10(df["pl_rade"])
df["log_period"] = np.log10(df["pl_orbper"])
df["mass_radius_ratio"] = df["pl_masse"] / df["pl_rade"]
```
Save to `data/processed/exoplanets_clean.csv`, overwriting.

### 7.5 Task 5 — Run the screening functions (Hour 6-9)
The lead hands you a finished `ml/screening.py`. You run:
```python
from ml.screening import pearson_screen, spearman_screen, distance_corr_screen
import itertools, json, pandas as pd

df = pd.read_csv("data/processed/exoplanets_clean.csv")
columns = ["pl_masse", "pl_rade", "pl_orbper", "pl_orbsmax", "st_mass", "st_rad", "st_teff",
           "log_mass", "log_radius", "log_period"]

results = []
for col1, col2 in itertools.combinations(columns, 2):
    results.append({
        "var1": col1, "var2": col2,
        "pearson": pearson_screen(df, col1, col2),
        "spearman": spearman_screen(df, col1, col2),
        "dcor": distance_corr_screen(df, col1, col2)
    })

with open("output/screening_results.json", "w") as f:
    json.dump(results, f, indent=2)
```
Run it, hand `output/screening_results.json` back to the lead. Do not interpret the numbers yourself.

### 7.6 Task 6 — Plot known relationships (Hour 9-13)
```python
import matplotlib.pyplot as plt

def plot_relationship(df, xcol, ycol, title, filename):
    plt.figure(figsize=(6, 5))
    plt.scatter(df[xcol], df[ycol], alpha=0.5, s=10)
    plt.xscale("log")
    plt.yscale("log")
    plt.xlabel(xcol)
    plt.ylabel(ycol)
    plt.title(title)
    plt.savefig(f"output/plots/{filename}.png", dpi=150)
    plt.close()

plot_relationship(df, "pl_orbsmax", "pl_orbper", "Kepler's Third Law", "kepler_third_law")
plot_relationship(df, "pl_masse", "pl_rade", "Mass-Radius Relation", "mass_radius")
```
Save all plots into `output/plots/`.

### 7.7 Task 7 — Run the hypothesis chain (Hour 13-16)
The lead hands you a finished `ai/hypothesis.py`. You run:
```python
from ai.hypothesis import generate_hypothesis_node
import json

with open("output/corrected_pairs.json") as f:
    corrected_pairs = json.load(f)

result = generate_hypothesis_node({"corrected_pairs": corrected_pairs})

with open("output/hypotheses.json", "w") as f:
    json.dump(result["hypotheses"], f, indent=2)
```
Run it, check `hypothesis_text` fields read as coherent sentences, hand the file back.

### 7.8 Task 8 (stretch) — Collect RAG abstract corpus
Manually copy 100-300 abstracts from arXiv astro-ph listings relevant to exoplanets into `data/abstracts.json`:
```json
[{"title": "...", "abstract": "..."}]
```

### Definition of done
`data/processed/exoplanets_clean.csv` exists with engineered columns; `output/screening_results.json`, `output/hypotheses.json`, and all plots in `output/plots/` exist and were handed to the lead.

---

## 8. Role in Detail — Full-Stack Dev (Beginner)

**Owns:** `backend/` and `frontend/` entirely.

**Does not need:** any understanding of the statistics inside `ml/` or `ai/` — you only need to know the JSON shape from Section 6.

### 8.1 Backend tasks

`backend/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import candidates, known_laws

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.include_router(candidates.router, prefix="/api")
app.include_router(known_laws.router, prefix="/api")

@app.get("/api/health")
def health():
    return {"status": "ok"}
```

`backend/routes/candidates.py`:
```python
from fastapi import APIRouter
import json

router = APIRouter()

@router.get("/candidates")
def get_candidates():
    with open("output/results.json") as f:
        return json.load(f)

@router.get("/candidates/{candidate_id}")
def get_candidate(candidate_id: str):
    with open("output/results.json") as f:
        data = json.load(f)
    return next((c for c in data if c["id"] == candidate_id), {"error": "not found"})
```

`backend/routes/known_laws.py` — same pattern, filters for `is_known_law == true`.

**Hour 0 unblock trick:** before the real `output/results.json` exists, create a hand-written fake one with 2-3 entries matching the Section 6 schema exactly. Build and test both endpoints against it. Swap in the real file later — nothing else changes.

### 8.2 Frontend tasks

`frontend/src/api.js`:
```javascript
const BASE_URL = "http://localhost:8000/api";
export async function getCandidates() {
  const res = await fetch(`${BASE_URL}/candidates`);
  return res.json();
}
export async function getKnownLaws() {
  const res = await fetch(`${BASE_URL}/known-laws`);
  return res.json();
}
```

| Component | What it does |
|---|---|
| `KnownLawsPanel.jsx` | Fetches `getKnownLaws()`. Renders each as a card: law name, variables, fitted expression, R², and the plot image from `output/plots/`. This is the credibility anchor of the demo — build it first. |
| `RelationshipTable.jsx` | Table of all candidates: Var 1, Var 2, Method, Score, P-value, Expression. Row click selects a candidate. |
| `ScatterChartCard.jsx` | `recharts` `ScatterChart` using a candidate's `sample_points`. |
| `HypothesisPanel.jsx` | Displays `hypothesis_text`, clearly labeled "AI-generated hypothesis — not a confirmed finding." |
| `Dashboard.jsx` | Layout: `KnownLawsPanel` on top, `RelationshipTable` below, selecting a row shows `ScatterChartCard` + `HypothesisPanel`. |
| `App.jsx` | Renders `<Dashboard />`. |

### Definition of done
Both endpoints return live data from `output/results.json`; `Dashboard.jsx` renders known laws, the full table, and a working scatter chart + hypothesis panel on row click.

---

## 9. Hour-by-Hour Schedule

| Hours | AI/ML Lead | Jr. ML Engineer | Full-Stack Dev |
|---|---|---|---|
| 0-1 | Repo setup, define `output/` schema | Env setup | Env setup, scaffold FastAPI + React, write fake `results.json` |
| 1-4 | `ml/screening.py` | Data acquisition + cleaning | Build endpoints against fake JSON |
| 4-6 | `ml/validation.py` (FDR) | Feature engineering | React scaffolding against fake JSON |
| 6-9 | `ml/symbolic.py` | Run screening functions | ScatterChartCard + HypothesisPanel against fake JSON |
| 9-12 | `ai/graph.py` (LangGraph) | Plot known relationships | Wire real endpoints, keep fake JSON as fallback |
| 12-14 | `ai/hypothesis.py` | Support lead | KnownLawsPanel, table sorting |
| 14-18 | **Full pipeline run — critical checkpoint** | Run hypothesis chain | Full integration test with real data |
| 18-21 | `ai/novelty.py` (stretch) | Collect abstracts (stretch) | Styling, loading/error states |
| 21-23 | Final integration with team | Bug fixes | Bug fixes, responsive check |
| 23-24 | Pitch deck + demo script | Support demo prep | Support demo prep |

---

## 10. Demo Script

1. Frame the problem: most ML recognizes known patterns; this searches relationship-space itself.
2. Open on `KnownLawsPanel` — "Kepler's third law, independently rediscovered from raw data." Credibility anchor.
3. Show `RelationshipTable` — full screened, FDR-corrected candidate list.
4. Click a non-obvious candidate — scatter plot, fitted expression, AI-generated hypothesis, clearly labeled unvalidated.
5. If built: novelty check against literature.
6. Close: this generates leads for human scientists, not confirmed discoveries.

---

## 11. Stretch Goals (only after Section 5's Hour 14-18 checkpoint passes)

- `ai/novelty.py` RAG novelty check
- Cross-dataset validation using TESS as a second dataset
- Metallicity-occurrence relationship (harder target, stronger "real science" story if recovered)
- MongoDB persistence instead of flat JSON files
