from pathlib import Path
import pandas as pd


def fetch_data():
    base_dir = Path(__file__).resolve().parent.parent
    output_path = base_dir / "data" / "raw" / "exoplanets.csv"
    try:
        output_path.parent.mkdir(parents=True, exist_ok=True)
    except OSError:
        pass

    url = (
        "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query="
        "select+pl_name,pl_bmasse,pl_rade,pl_orbper,pl_orbsmax,"
        "st_mass,st_rad,st_teff,st_met+from+pscomppars&format=csv"
    )
    print(f"Fetching exoplanet data from NASA TAP API...")
    df = pd.read_csv(url)
    try:
        df.to_csv(output_path, index=False)
        print(f"Saved {len(df)} records to: {output_path}")
    except OSError:
        print("Read-only filesystem detected; skipping local CSV write.")
    print(f"Columns: {df.columns.tolist()}")
    return df


if __name__ == "__main__":
    fetch_data()
