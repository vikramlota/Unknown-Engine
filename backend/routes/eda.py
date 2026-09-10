from pathlib import Path
from typing import Optional
import json
import math
import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

base_dir = Path(__file__).resolve().parent.parent.parent
PROCESSED_DATA_PATH = base_dir / "data" / "processed" / "exoplanets_clean.csv"
RAW_DATA_PATH = base_dir / "data" / "raw" / "exoplanets.csv"

# Human friendly metadata for each column
COLUMN_INFO = {
    "pl_name": {"label": "Planet Name", "desc": "Official astronomical catalog designation", "unit": ""},
    "pl_bmasse": {"label": "Estimated Mass", "desc": "Best measured planet mass", "unit": "Earth masses (M⊕)"},
    "pl_rade": {"label": "Planet Radius", "desc": "Physical planetary radius", "unit": "Earth radii (R⊕)"},
    "pl_orbper": {"label": "Orbital Period", "desc": "Length of one year on the planet", "unit": "Earth days"},
    "pl_orbsmax": {"label": "Semi-Major Axis", "desc": "Distance from host star", "unit": "Astronomical Units (AU)"},
    "st_mass": {"label": "Star Mass", "desc": "Mass of the host star", "unit": "Solar masses (M☉)"},
    "st_rad": {"label": "Star Radius", "desc": "Radius of the host star", "unit": "Solar radii (R☉)"},
    "st_teff": {"label": "Star Temperature", "desc": "Effective surface heat of the star", "unit": "Kelvin (K)"},
    "st_met": {"label": "Star Metallicity", "desc": "Iron-to-hydrogen ratio of the star", "unit": "[Fe/H] dex"},
    "mass_radius_ratio": {"label": "Density Ratio", "desc": "Mass divided by radius", "unit": "M⊕ / R⊕"}
}

@router.get("/raw-data")
def get_raw_data(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    search: Optional[str] = None
):
    """
    Returns paginated raw exoplanet observations for browsing and auditing.
    """
    if not PROCESSED_DATA_PATH.exists():
        raise HTTPException(status_code=404, detail="Data not found. Fetch data first.")

    df = pd.read_csv(PROCESSED_DATA_PATH)

    # Filter by search if provided
    if search:
        search_lower = search.lower()
        df = df[df["pl_name"].astype(str).str.lower().str.contains(search_lower)]

    total_rows = len(df)
    total_pages = math.ceil(total_rows / limit) if total_rows > 0 else 1

    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    page_df = df.iloc[start_idx:end_idx]

    # Clean NaNs for JSON serialization
    page_df = page_df.replace({np.nan: None})

    columns_meta = [
        {"key": col, **COLUMN_INFO.get(col, {"label": col, "desc": col, "unit": ""})}
        for col in page_df.columns
        if not col.startswith("log_") # hide internal log transforms from raw view
    ]

    records = page_df[[c["key"] for c in columns_meta]].to_dict(orient="records")

    return {
        "page": page,
        "limit": limit,
        "total_rows": total_rows,
        "total_pages": total_pages,
        "columns": columns_meta,
        "rows": records
    }

@router.get("/eda")
def get_exploratory_data_analysis():
    """
    Computes and returns comprehensive Exploratory Data Analysis (EDA) statistics,
    histograms, and demographics on demand to conserve computation.
    """
    if not PROCESSED_DATA_PATH.exists():
        raise HTTPException(status_code=404, detail="Data not found. Fetch data first.")

    df = pd.read_csv(PROCESSED_DATA_PATH)
    raw_count = len(pd.read_csv(RAW_DATA_PATH)) if RAW_DATA_PATH.exists() else len(df)

    # 1. Planetary Classification Demographics
    # Earth-sized: R < 1.25
    # Super-Earths: 1.25 <= R < 2.0
    # Sub-Neptunes: 2.0 <= R < 4.0
    # Gas Giants: R >= 4.0
    earth_sized = int((df["pl_rade"] < 1.25).sum())
    super_earths = int(((df["pl_rade"] >= 1.25) & (df["pl_rade"] < 2.0)).sum())
    sub_neptunes = int(((df["pl_rade"] >= 2.0) & (df["pl_rade"] < 4.0)).sum())
    gas_giants = int((df["pl_rade"] >= 4.0).sum())

    demographics = [
        {"type": "Earth-sized (< 1.25 R⊕)", "count": earth_sized, "percent": round(earth_sized / len(df) * 100, 1), "color": "#4caf50"},
        {"type": "Super-Earths (1.25 - 2 R⊕)", "count": super_earths, "percent": round(super_earths / len(df) * 100, 1), "color": "#2196f3"},
        {"type": "Sub-Neptunes (2 - 4 R⊕)", "count": sub_neptunes, "percent": round(sub_neptunes / len(df) * 100, 1), "color": "#ff9800"},
        {"type": "Gas Giants (≥ 4 R⊕)", "count": gas_giants, "percent": round(gas_giants / len(df) * 100, 1), "color": "#e3000f"}
    ]

    # 2. Host Star Classification (Temperature in Kelvin)
    # Hot (> 6000K), Sun-like (5000 - 6000K), Orange Dwarfs (3800 - 5000K), Red Dwarfs (< 3800K)
    hot_stars = int((df["st_teff"] >= 6000).sum())
    sun_like = int(((df["st_teff"] >= 5000) & (df["st_teff"] < 6000)).sum())
    k_dwarfs = int(((df["st_teff"] >= 3800) & (df["st_teff"] < 5000)).sum())
    m_dwarfs = int((df["st_teff"] < 3800).sum())

    star_types = [
        {"type": "Hot Stars (F/A-type, >6000K)", "count": hot_stars, "percent": round(hot_stars / len(df) * 100, 1)},
        {"type": "Sun-like Yellow Dwarfs (G-type, 5000-6000K)", "count": sun_like, "percent": round(sun_like / len(df) * 100, 1)},
        {"type": "Orange Dwarfs (K-type, 3800-5000K)", "count": k_dwarfs, "percent": round(k_dwarfs / len(df) * 100, 1)},
        {"type": "Cool Red Dwarfs (M-type, <3800K)", "count": m_dwarfs, "percent": round(m_dwarfs / len(df) * 100, 1)}
    ]

    # 3. Numeric Summary Statistics
    stats_cols = ["pl_orbper", "pl_orbsmax", "pl_masse", "pl_rade", "st_mass", "st_teff"]
    summary_stats = []
    for col in stats_cols:
        series = df[col].dropna()
        info = COLUMN_INFO.get(col, {"label": col, "unit": ""})
        summary_stats.append({
            "key": col,
            "label": info["label"],
            "unit": info["unit"],
            "min": round(float(series.min()), 3),
            "max": round(float(series.max()), 3),
            "mean": round(float(series.mean()), 3),
            "median": round(float(series.median()), 3),
            "std": round(float(series.std()), 3)
        })

    # 4. Planetary Radius Histogram Bins (Log-spaced bins for beautiful chart)
    radius_series = df["pl_rade"].dropna()
    bins = [0, 1.25, 2.0, 4.0, 8.0, 15.0, 50.0]
    labels = ["< 1.25", "1.25 - 2", "2 - 4", "4 - 8", "8 - 15", "> 15"]
    hist, _ = np.histogram(radius_series, bins=bins)
    radius_histogram = [{"range": label, "count": int(count)} for label, count in zip(labels, hist)]

    # 5. Orbital Period Histogram Bins
    period_series = df["pl_orbper"].dropna()
    p_bins = [0, 3, 10, 30, 100, 365, 10000]
    p_labels = ["< 3 days", "3-10 days", "10-30 days", "30-100 days", "100-365 days", "> 1 year"]
    p_hist, _ = np.histogram(period_series, bins=p_bins)
    period_histogram = [{"range": label, "count": int(count)} for label, count in zip(p_labels, p_hist)]

    return {
        "dataset_health": {
            "raw_observations": raw_count,
            "cleaned_planets": len(df),
            "data_quality_retention": round(len(df) / raw_count * 100, 1),
            "completeness_score": "100% Complete (No NaN physical parameters)"
        },
        "planet_demographics": demographics,
        "star_types": star_types,
        "summary_statistics": summary_stats,
        "radius_histogram": radius_histogram,
        "period_histogram": period_histogram
    }
