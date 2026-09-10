import os
from pathlib import Path
import numpy as np
import pandas as pd


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean exoplanet dataset according to physical and completeness requirements."""
    df = df.copy()

    # Map pl_bmasse to pl_masse if needed (NASA TAP returns pl_bmasse as best mass estimate)
    if "pl_masse" not in df.columns and "pl_bmasse" in df.columns:
        df["pl_masse"] = df["pl_bmasse"]
    elif "pl_bmasse" not in df.columns and "pl_masse" in df.columns:
        df["pl_bmasse"] = df["pl_masse"]

    # 1. Drop missing physical values
    cols_to_check = [
        "pl_masse",
        "pl_rade",
        "pl_orbper",
        "pl_orbsmax",
        "st_mass",
        "st_rad",
        "st_teff",
    ]
    df = df.dropna(subset=cols_to_check)

    # 2. Filter physically invalid values (must be strictly positive)
    df = df[
        (df["pl_masse"] > 0)
        & (df["pl_rade"] > 0)
        & (df["pl_orbper"] > 0)
        & (df["pl_orbsmax"] > 0)
        & (df["st_mass"] > 0)
        & (df["st_rad"] > 0)
        & (df["st_teff"] > 0)
    ]

    # 3. Drop duplicate planet entries
    df = df.drop_duplicates(subset=["pl_name"])

    # 4. Feature Engineering (Log transforms & ratios)
    df["log_mass"] = np.log10(df["pl_masse"])
    df["log_radius"] = np.log10(df["pl_rade"])
    df["log_period"] = np.log10(df["pl_orbper"])
    df["mass_radius_ratio"] = df["pl_masse"] / df["pl_rade"]

    return df


def clean_and_engineer(raw_path: str = None, output_path: str = None) -> pd.DataFrame:
    """Load raw exoplanet data, clean & engineer features, and save to processed directory."""
    base_dir = Path(__file__).resolve().parent.parent

    if raw_path is None:
        raw_path = base_dir / "data" / "raw" / "exoplanets.csv"
    else:
        raw_path = Path(raw_path)

    if output_path is None:
        output_path = base_dir / "data" / "processed" / "exoplanets_clean.csv"
    else:
        output_path = Path(output_path)

    print(f"Loading raw exoplanet data from: {raw_path}")
    df = pd.read_csv(raw_path)
    initial_count = len(df)

    cleaned_df = clean_data(df)

    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)
    cleaned_df.to_csv(output_path, index=False)

    print("--- Processing Complete ---")
    print(f"Raw rows: {initial_count}")
    print(f"Cleaned rows remaining: {len(cleaned_df)}")
    print(f"Saved to: {output_path}")

    return cleaned_df


if __name__ == "__main__":
    clean_and_engineer()