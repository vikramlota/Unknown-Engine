from pathlib import Path
import matplotlib.pyplot as plt
import pandas as pd


def generate_plots():
    base_dir = Path(__file__).resolve().parent.parent
    data_path = base_dir / "data" / "processed" / "exoplanets_clean.csv"
    output_dir = base_dir / "output" / "plots"
    output_dir.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(data_path)

    # Kepler's Third Law
    plt.figure(figsize=(6, 5))
    plt.scatter(
        df["pl_orbsmax"], df["pl_orbper"], alpha=0.5, s=10, color="royalblue"
    )
    plt.xscale("log")
    plt.yscale("log")
    plt.xlabel("Semi-Major Axis [AU]")
    plt.ylabel("Orbital Period [Days]")
    plt.title("Kepler's Third Law")
    plt.tight_layout()
    plt.savefig(output_dir / "kepler_third_law.png", dpi=150)
    plt.close()

    # Mass-Radius Relation
    plt.figure(figsize=(6, 5))
    plt.scatter(
        df["pl_masse"], df["pl_rade"], alpha=0.5, s=10, color="darkmagenta"
    )
    plt.xscale("log")
    plt.yscale("log")
    plt.xlabel("Planet Mass [Earth Mass]")
    plt.ylabel("Planet Radius [Earth Radius]")
    plt.title("Mass-Radius Relation")
    plt.tight_layout()
    plt.savefig(output_dir / "mass_radius.png", dpi=150)
    plt.close()

    print(f"Plots generated and saved to {output_dir}")


if __name__ == "__main__":
    generate_plots()