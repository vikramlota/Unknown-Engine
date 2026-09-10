import json
import numpy as np
import pandas as pd
from gplearn.genetic import SymbolicRegressor

def fit_expressions(pairs: list[dict], df: pd.DataFrame, top_k: int = 5) -> list[dict]:
    """
    Takes the top FDR-corrected pairs and runs Symbolic Regression (gplearn)
    to find a mathematical equation relating var1 and var2.
    """
    # Sort pairs by adjusted p-value (ascending) and then dcor (descending)
    sorted_pairs = sorted(pairs, key=lambda x: (x.get("p_spearman_adj", 1.0), -x.get("dcor", 0)))
    
    # Take only the top_k relationships to save time
    top_pairs = sorted_pairs[:top_k]
    
    results = []
    print(f"Running Symbolic Regression on top {len(top_pairs)} pairs...")
    
    for i, pair in enumerate(top_pairs):
        var1 = pair["var1"]
        var2 = pair["var2"]
        print(f"\n[{i+1}/{len(top_pairs)}] Fitting equation for {var2} = f({var1})")
        
        # Extract data and drop NaNs for this specific pair
        pair_df = df[[var1, var2]].dropna()
        if len(pair_df) < 10:
            print("Not enough data points, skipping.")
            continue
            
        X = pair_df[var1].values.reshape(-1, 1)
        y = pair_df[var2].values
        
        # Initialize Symbolic Regressor
        # We use a relatively small population/generations to keep the hackathon demo fast
        est_gp = SymbolicRegressor(
            population_size=1000,
            generations=10,
            stopping_criteria=0.01,
            p_crossover=0.7, p_subtree_mutation=0.1,
            p_hoist_mutation=0.05, p_point_mutation=0.1,
            max_samples=0.9, verbose=0,
            parsimony_coefficient=0.01, random_state=42,
            feature_names=[var1]
        )
        
        try:
            est_gp.fit(X, y)
            expression = str(est_gp._program)
            r2 = est_gp.score(X, y)
            
            # Extract a downsampled set of points for the scatter plot (max 100 points)
            sample_df = pair_df.sample(n=min(100, len(pair_df)), random_state=42)
            sample_points = [{"x": float(row[var1]), "y": float(row[var2])} for _, row in sample_df.iterrows()]
            
            pair_copy = pair.copy()
            pair_copy["expression"] = expression
            pair_copy["train_r2"] = float(r2)
            pair_copy["sample_points"] = sample_points
            results.append(pair_copy)
            print(f"Result: {var2} = {expression} (R^2 = {r2:.3f})")
            
        except Exception as e:
            print(f"Error fitting {var1} vs {var2}: {e}")
            
    return results

if __name__ == '__main__':
    with open('output/corrected_pairs.json', 'r') as f:
        pairs = json.load(f)
        
    df = pd.read_csv('data/processed/exoplanets_clean.csv')
    
    symbolic_results = fit_expressions(pairs, df, top_k=5)
    
    with open('output/results.json', 'w') as f:
        json.dump(symbolic_results, f, indent=2)
    print(f"\nSaved {len(symbolic_results)} symbolic results to output/results.json")
