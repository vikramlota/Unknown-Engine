# Reference Sheet: Formulas & Methods for the "Unknown Unknown" Engine

A working reference for the hackathon: target relationships to rediscover (proof the pipeline works) and the statistical/ML machinery underneath it.

---

## Part A — Target Astrophysical Relationships

Use these as **ground truth**. If your system can rediscover them from raw data without being told the formula, that's your strongest demo evidence.

### A1. Stellar Relationships (best with Gaia / HR diagram data)

| Relationship | Formula | Variables | Notes |
|---|---|---|---|
| Stefan-Boltzmann law | L = 4πR²σT⁴ | L: luminosity, R: radius, T: temperature, σ: Stefan-Boltzmann constant | Clean 3-variable relation; good first test |
| Mass-luminosity relation | L ∝ M^3.5 (main sequence) | L: luminosity, M: mass | Power-law; exponent varies slightly by mass range (2.3–4) |
| Wien's displacement law | λ_max·T = b | λ_max: peak wavelength, T: temperature, b ≈ 2.898×10⁻³ m·K | Simple inverse relation |
| Distance modulus | m − M = 5·log₁₀(d) − 5 | m: apparent mag, M: absolute mag, d: distance (pc) | Tests log-relationship recovery |
| Parallax-distance | d = 1/p | d: distance (pc), p: parallax (arcsec) | Simplest inverse law; good sanity check |
| Boltzmann/Planck relation (photon energy) | E = hν = hc/λ | E: photon energy, ν: frequency, λ: wavelength | Useful if working with spectral data |
| Luminosity-flux relation | F = L / (4πd²) | F: flux, L: luminosity, d: distance | Inverse-square law; foundational |

### A2. Exoplanet Relationships (best with NASA Exoplanet Archive / Kepler / TESS)

| Relationship | Formula | Variables | Notes |
|---|---|---|---|
| Kepler's third law | P² = 4π²a³ / [G(M★+Mp)] | P: period, a: semi-major axis, M: masses, G: gravitational constant | The classic "we rediscovered Kepler" demo moment |
| Transit depth | ΔF/F = (Rp/R★)² | ΔF/F: fractional flux drop, Rp: planet radius, R★: star radius | Direct, testable against real light curves |
| Equilibrium temperature | T_eq = T★·√(R★/2a)·(1−A)^(1/4) | T★: stellar temp, R★: stellar radius, a: orbital distance, A: albedo | Multi-variable nonlinear; good symbolic regression stress test |
| Mass-radius relation (planets) | Rp ∝ Mp^β, β ≈ 0.5–0.7 | Rp: planet radius, Mp: planet mass | Regime-dependent — check if the system finds a kink/break |
| Radial velocity Doppler shift | Δλ/λ = v/c | Δλ: wavelength shift, v: velocity, c: speed of light | Simple, exact |
| Transit duration | T_dur ≈ (P/π)·arcsin[(R★+Rp)/a] | T_dur: transit duration, P: period, a: semi-major axis | Combines period and geometry |
| Habitable zone boundary (rough) | a_hz ∝ √(L★) | a_hz: HZ distance, L★: stellar luminosity | Simplified; real versions use flux limits, not just √L |

### A3. Stretch Targets (genuine empirical discoveries, not textbook derivations)

These weren't derived from first principles — they were *found* in data, which makes rediscovering them a stronger "our system does real science" story.

| Relationship | Description | Reference |
|---|---|---|
| Giant planet occurrence vs. metallicity | Occurrence rate rises roughly exponentially with stellar [Fe/H] | Fischer & Valenti (2005) |
| Fulton radius gap | Bimodal gap in exoplanet radius distribution near ~1.5–2 R⊕ | Fulton et al. (2017) — a *shape* discovery, needs distribution analysis not just pairwise correlation |
| Period-luminosity relation (Cepheids) | log(L) ∝ log(P) | Leavitt's Law — relevant only if pulling variable star data |
| Titius-Bode-like spacing | Rough geometric progression in planetary orbital spacing | Contested/approximate — good "known but debated" example |

---

## Part B — Pipeline Math (the machinery)

### B1. Relationship Screening (before symbolic regression)

| Method | Formula / Concept | What it catches |
|---|---|---|
| Pearson correlation | r = Σ(xᵢ−x̄)(yᵢ−ȳ) / √[Σ(xᵢ−x̄)²Σ(yᵢ−ȳ)²] | Linear relationships only — fast first pass |
| Spearman rank correlation | Pearson correlation on ranked data | Monotonic nonlinear relationships |
| Distance correlation | dCor(X,Y), based on distances between all sample pairs | **Any** dependence, linear or not; zero iff truly independent — use the `dcor` package |
| Mutual information | I(X;Y) = ΣΣ p(x,y)·log[p(x,y)/(p(x)p(y))] | General statistical dependence; good complement to distance correlation |

### B2. Multiple-Comparisons Correction (important — expect this question from judges)

Testing hundreds of variable pairs means some "significant" correlations will be pure noise. Control for this explicitly:

- **Benjamini-Hochberg FDR procedure**: sort p-values p₁ ≤ p₂ ≤ ... ≤ p_m. Find the largest k such that p_k ≤ (k/m)·α. Reject all null hypotheses up to that k.
- This controls the *false discovery rate* across all tests, rather than relying on an uncorrected p < 0.05 per pair.

### B3. Symbolic Regression Fitness

- **Complexity-penalized fitness**: Fitness = Loss(fit) + λ·Complexity(expression)
- The λ·Complexity term is your Occam's razor — without it, symbolic regression overfits with absurd, overly complex expressions.
- Both `PySR` and `gplearn` expose this as a tunable parsimony coefficient.

### B4. Validation

- **Train/test split**: report R² and residuals on held-out data, not just training fit.
- **Cross-dataset replication**: fit on one dataset (e.g. Kepler), check the same functional form holds on an independent dataset (e.g. TESS). This is your strongest evidence against p-hacking / overfitting.

---

## Suggested Priority Order for the Hackathon

1. Parallax-distance and distance modulus (simplest — validates pipeline plumbing)
2. Stefan-Boltzmann law and mass-luminosity relation (stellar data track)
3. Kepler's third law and transit depth (exoplanet data track)
4. Equilibrium temperature (nonlinear multi-variable stress test)
5. Metallicity-occurrence relation (stretch target, strongest "real science" story if recovered)
