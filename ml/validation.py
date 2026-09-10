import json
import numpy as np
from statsmodels.stats.multitest import multipletests

def apply_fdr(screened_pairs: list[dict], alpha: float = 0.05) -> list[dict]:
    """
    Applies the Benjamini-Hochberg False Discovery Rate (FDR) correction
    to the p-values of the screened pairs. We use the Spearman p-value
    as our primary metric since it handles non-linear (monotonic) relationships
    better than Pearson, making it more robust for physics data.
    """
    # Filter out pairs where p_spearman is NaN
    valid_pairs = [p for p in screened_pairs if not np.isnan(p.get("p_spearman", np.nan))]
    
    if not valid_pairs:
        return []
        
    pvals = [p["p_spearman"] for p in valid_pairs]
    
    # Apply Benjamini-Hochberg FDR
    reject, pvals_corrected, _, _ = multipletests(pvals, alpha=alpha, method='fdr_bh')
    
    corrected_pairs = []
    for pair, is_significant, p_adj in zip(valid_pairs, reject, pvals_corrected):
        # We also enforce a strong effect size to avoid passing weak relationships to Symbolic Regression
        strong_effect = pair.get("dcor", 0) > 0.5 or abs(pair.get("spearman", 0)) > 0.5
        
        if is_significant and strong_effect:
            pair_copy = pair.copy()
            pair_copy["p_spearman_adj"] = float(p_adj)
            corrected_pairs.append(pair_copy)
            
    # Sort by the adjusted p-value (most significant first), then by dcor (strongest relationship)
    corrected_pairs.sort(key=lambda x: (x["p_spearman_adj"], -x.get("dcor", 0)))
    
    print(f"FDR Correction: {len(screened_pairs)} initial pairs -> {len(corrected_pairs)} significant pairs (alpha={alpha})")
    return corrected_pairs

if __name__ == '__main__':
    with open('output/screening_results.json', 'r') as f:
        pairs = json.load(f)
        
    corrected = apply_fdr(pairs)
    
    with open('output/corrected_pairs.json', 'w') as f:
        json.dump(corrected, f, indent=2)
    print(f"Saved {len(corrected)} corrected pairs to output/corrected_pairs.json")
