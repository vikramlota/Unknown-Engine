import itertools
import numpy as np
import pandas as pd
from scipy.stats import pearsonr, spearmanr
import dcor

def run_screening(df: pd.DataFrame) -> list[dict]:
    """
    Computes pairwise correlations (Pearson, Spearman, Distance Correlation)
    for all numerical features in the dataframe.
    """
    results = []
    
    # Select only numeric columns
    numeric_df = df.select_dtypes(include=[np.number])
    cols = numeric_df.columns.tolist()
    
    print(f"Screening {len(cols)} numerical columns...")
    
    # Iterate over all unique pairs
    for col1, col2 in itertools.combinations(cols, 2):
        # Drop NaNs for the pair
        pair_df = numeric_df[[col1, col2]].dropna()
        if len(pair_df) < 10:
            continue
            
        x = pair_df[col1].values
        y = pair_df[col2].values
        
        # Avoid zero variance
        if np.std(x) == 0 or np.std(y) == 0:
            continue
            
        # Pearson
        try:
            pearson_corr, p_pearson = pearsonr(x, y)
        except Exception:
            pearson_corr, p_pearson = np.nan, np.nan
            
        # Spearman
        try:
            spearman_corr, p_spearman = spearmanr(x, y)
        except Exception:
            spearman_corr, p_spearman = np.nan, np.nan
            
        # Distance correlation
        try:
            dc = dcor.distance_correlation(x, y)
        except Exception:
            dc = np.nan
            
        results.append({
            "var1": col1,
            "var2": col2,
            "pearson": float(pearson_corr),
            "p_pearson": float(p_pearson),
            "spearman": float(spearman_corr),
            "p_spearman": float(p_spearman),
            "dcor": float(dc),
            "n_samples": len(x)
        })
        
    print(f"Computed metrics for {len(results)} pairs.")
    return results

if __name__ == '__main__':
    df = pd.read_csv('data/processed/exoplanets_clean.csv')
    res = run_screening(df)
    import json
    with open('output/screening_results.json', 'w') as f:
        json.dump(res, f, indent=2)
    print(f"Saved {len(res)} results to output/screening_results.json")
