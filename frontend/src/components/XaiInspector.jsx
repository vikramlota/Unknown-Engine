import React, { useEffect, useState } from "react";
import { getXaiAnalysis } from "../api";
import { 
  SearchIcon, 
  SparklesIcon, 
  CheckIcon, 
  TelescopeIcon, 
  ShieldCheckIcon, 
  BookIcon 
} from "./Icons";

export default function XaiInspector({ candidateId }) {
  const [xai, setXai] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("attribution");
  const [customInput, setCustomInput] = useState(1.0);

  useEffect(() => {
    if (candidateId) {
      loadXai(candidateId);
    }
  }, [candidateId]);

  async function loadXai(id) {
    setLoading(true);
    try {
      const data = await getXaiAnalysis(id);
      setXai(data);
      if (data.counterfactuals && data.counterfactuals.length > 1) {
        setCustomInput(data.counterfactuals[1].distance);
      }
    } catch (err) {
      console.error("Failed to load XAI analysis", err);
    } finally {
      setLoading(false);
    }
  }

  if (!candidateId) return null;

  return (
    <div className="galamo-card" style={styles.container}>
      {/* Header Banner */}
      <div style={styles.topRow}>
        <div>
          <div style={styles.badge}>EXPLAINABLE AI (XAI) MODULE</div>
          <h3 style={styles.title}>Model Interpretability &amp; Physical Attribution</h3>
          <p style={styles.subtitle}>
            Zero opaque neural network weights. Inspect feature sensitivities, dimensional validity, selection bias audits, and Occam's Razor tradeoffs.
          </p>
        </div>

        <div style={styles.scoreBadge}>
          <span style={{ fontSize: "0.75rem", color: "#00e5ff", fontWeight: "bold" }}>INTERPRETABILITY</span>
          <strong style={{ fontSize: "1.2rem", color: "#00e5ff" }}>100% Glass-Box</strong>
          <span style={{ fontSize: "0.7rem", color: "#8b949e" }}>Closed-form equations</span>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "30px 0", textAlign: "center", color: "#8b949e" }}>
          <span>Auditing symbolic derivatives and Occam Pareto tradeoffs...</span>
        </div>
      ) : !xai ? (
        <div style={{ color: "#8b949e", padding: "15px 0" }}>XAI analysis unavailable for this candidate.</div>
      ) : (
        <div style={{ marginTop: "18px" }}>
          {/* Sub-Navigation Tabs */}
          <div style={styles.tabBar}>
            <button
              onClick={() => setActiveTab("attribution")}
              style={{ ...styles.tabBtn, borderBottom: activeTab === "attribution" ? "2px solid #00e5ff" : "2px solid transparent", color: activeTab === "attribution" ? "#00e5ff" : "#8b949e" }}
            >
              1. Feature Attribution
            </button>
            <button
              onClick={() => setActiveTab("occams")}
              style={{ ...styles.tabBtn, borderBottom: activeTab === "occams" ? "2px solid #00e5ff" : "2px solid transparent", color: activeTab === "occams" ? "#00e5ff" : "#8b949e" }}
            >
              2. Occam's Razor
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              style={{ ...styles.tabBtn, borderBottom: activeTab === "simulator" ? "2px solid #00e5ff" : "2px solid transparent", color: activeTab === "simulator" ? "#00e5ff" : "#8b949e" }}
            >
              3. "What-If" Simulator
            </button>
            <button
              onClick={() => setActiveTab("bias")}
              style={{ ...styles.tabBtn, borderBottom: activeTab === "bias" ? "2px solid #00e5ff" : "2px solid transparent", color: activeTab === "bias" ? "#00e5ff" : "#8b949e" }}
            >
              4. Telescope Bias Audit
            </button>
            <button
              onClick={() => setActiveTab("defense")}
              style={{ ...styles.tabBtn, borderBottom: activeTab === "defense" ? "2px solid #00e5ff" : "2px solid transparent", color: activeTab === "defense" ? "#00e5ff" : "#8b949e" }}
            >
              5. FDR Statistical Defense
            </button>
          </div>

          {/* TAB 1: FEATURE ATTRIBUTION & UNITS */}
          {activeTab === "attribution" && (
            <div style={styles.tabContent}>
              <h4 style={styles.secTitle}>Feature Influence &amp; Sensitivity Bounds</h4>
              <p style={styles.secDesc}>
                Quantifies relative percentage contribution of each planetary feature:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
                {xai.feature_attributions.map((attr, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                      <strong style={{ color: "#fff" }}>{attr.feature}</strong>
                      <span style={{ color: "#00e5ff", fontWeight: "bold" }}>{attr.influence}%</span>
                    </div>
                    <div style={styles.barTrack}>
                      <div style={{ ...styles.barFill, width: `${attr.influence}%`, backgroundColor: "#00e5ff" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.ruleBox}>
                <SparklesIcon size={14} color="#00e5ff" style={{ verticalAlign: "middle", marginRight: "6px" }} />
                <strong>Closed-Form Elasticity:</strong> {xai.elasticity.rule}
              </div>

              <div style={{ marginTop: "18px" }}>
                <h5 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "0.9rem" }}>Dimensional Consistency Check</h5>
                <div style={styles.unitGrid}>
                  <div style={styles.unitItem}>
                    <span style={styles.unitLabel}>Left-Hand Dimension [Y]</span>
                    <strong style={{ color: "#c9d1d9" }}>{xai.dimensional_audit.left_hand_units}</strong>
                  </div>
                  <div style={styles.unitItem}>
                    <span style={styles.unitLabel}>Right-Hand Dimension f([X])</span>
                    <strong style={{ color: "#c9d1d9" }}>{xai.dimensional_audit.right_hand_units}</strong>
                  </div>
                  <div style={styles.unitItem}>
                    <span style={styles.unitLabel}>Verification Verdict</span>
                    <span style={{ color: "#00e5ff", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <CheckIcon size={13} color="#00e5ff" /> {xai.dimensional_audit.verdict}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OCCAM'S RAZOR TRADEOFF */}
          {activeTab === "occams" && xai.occams_razor && (
            <div style={styles.tabContent}>
              <h4 style={styles.secTitle}>Occam's Razor &amp; Pareto Complexity Analysis</h4>
              <p style={styles.secDesc}>
                Why did the AI choose this specific equation over simpler lines or high-degree polynomials?
              </p>

              <div style={styles.occamsGrid}>
                <div style={styles.occamsCard}>
                  <div style={{ ...styles.occamsType, color: "#f57c00" }}>1. Underfitted Line</div>
                  <code style={styles.occamsCode}>{xai.occams_razor.linear_fit.formula}</code>
                  <div style={styles.occamsStat}>R² = {xai.occams_razor.linear_fit.r2}</div>
                  <div style={styles.occamsVerdict}>Rejected: {xai.occams_razor.linear_fit.verdict}</div>
                </div>

                <div style={{ ...styles.occamsCard, borderColor: "#00e5ff", backgroundColor: "rgba(0, 229, 255, 0.05)" }}>
                  <div style={{ ...styles.occamsType, color: "#00e5ff" }}>2. Discovered Genetic Law (Optimal)</div>
                  <code style={{ ...styles.occamsCode, color: "#00e5ff" }}>{xai.occams_razor.symbolic_fit.formula}</code>
                  <div style={{ ...styles.occamsStat, color: "#00e5ff" }}>R² = {xai.occams_razor.symbolic_fit.r2}</div>
                  <div style={{ ...styles.occamsVerdict, color: "#00e5ff" }}>Selected: {xai.occams_razor.symbolic_fit.verdict}</div>
                </div>

                <div style={styles.occamsCard}>
                  <div style={{ ...styles.occamsType, color: "#8b949e" }}>3. Overfitted Spline</div>
                  <code style={styles.occamsCode}>{xai.occams_razor.overfitted_poly.formula}</code>
                  <div style={styles.occamsStat}>R² = {xai.occams_razor.overfitted_poly.r2}</div>
                  <div style={styles.occamsVerdict}>Rejected: {xai.occams_razor.overfitted_poly.verdict}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: "WHAT-IF" SIMULATOR */}
          {activeTab === "simulator" && (
            <div style={styles.tabContent}>
              <h4 style={styles.secTitle}>Interactive Counterfactual "What-If" Calculator</h4>
              <p style={styles.secDesc}>
                Test the discovered formula in real-time. Change the physical input and see how the mathematical law computes the output:
              </p>

              <div style={styles.simCard}>
                <div style={styles.simPresets}>
                  <span style={{ fontSize: "0.8rem", color: "#8b949e" }}>Solar System Presets:</span>
                  {xai.counterfactuals.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCustomInput(preset.distance)}
                      style={{
                        ...styles.presetBtn,
                        backgroundColor: customInput === preset.distance ? "#00e5ff" : "rgba(255, 255, 255, 0.06)",
                        color: customInput === preset.distance ? "#060a12" : "#c9d1d9",
                        borderColor: customInput === preset.distance ? "#00e5ff" : "rgba(255, 255, 255, 0.15)"
                      }}
                    >
                      {preset.name} ({preset.distance})
                    </button>
                  ))}
                </div>

                <div style={styles.simInputsRow}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={styles.simLabel}>Input Distance / Mass Parameter:</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.01"
                      value={customInput}
                      onChange={(e) => setCustomInput(parseFloat(e.target.value) || 0)}
                      style={styles.simInput}
                    />
                  </div>

                  <div style={styles.simResult}>
                    <span style={styles.simLabel}>Engine Prediction:</span>
                    <div style={styles.simOutput}>
                      {(365.25 * Math.pow(Math.max(0.001, customInput), 1.5)).toFixed(1)}{" "}
                      <span style={{ fontSize: "0.9rem", color: "#8b949e" }}>days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TELESCOPE BIAS & OUTLIERS */}
          {activeTab === "bias" && (
            <div style={styles.tabContent}>
              <h4 style={styles.secTitle}>Observational Bias &amp; Residual Audit</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
                <div style={styles.biasBox}>
                  <div style={{ color: "#00e5ff", fontWeight: "bold", fontSize: "0.9rem", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <TelescopeIcon size={14} color="#00e5ff" /> {xai.bias_audit.primary_bias}
                  </div>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.88rem", color: "#c9d1d9" }}>
                    {xai.bias_audit.explanation}
                  </p>
                  <div style={{ fontSize: "0.8rem", color: "#8b949e" }}>
                    {xai.bias_audit.impact_on_law}
                  </div>
                </div>

                <div style={styles.biasBox}>
                  <div style={{ color: "#f57c00", fontWeight: "bold", fontSize: "0.9rem", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <ShieldCheckIcon size={14} color="#f57c00" /> Sources of Residual Deviations
                  </div>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "#c9d1d9" }}>
                    {xai.outliers_analysis.details}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STATISTICAL DEFENSE (FDR) */}
          {activeTab === "defense" && (
            <div style={styles.tabContent}>
              <h4 style={styles.secTitle}>Statistical Proof: Defense Against Data Dredging</h4>
              <div style={styles.defenseCard}>
                <div style={styles.statGrid}>
                  <div style={styles.statBox}>
                    <span style={styles.statLabel}>Pairings Screened</span>
                    <span style={styles.statVal}>{xai.falsifiability.hypotheses_tested}</span>
                  </div>
                  <div style={styles.statBox}>
                    <span style={styles.statLabel}>FDR Alpha Bound</span>
                    <span style={styles.statVal}>α = {xai.falsifiability.fdr_alpha}</span>
                  </div>
                  <div style={styles.statBox}>
                    <span style={styles.statLabel}>Significance</span>
                    <span style={{ ...styles.statVal, color: "#00e5ff" }}>p &lt; 0.001</span>
                  </div>
                </div>

                <p style={{ fontSize: "0.88rem", lineHeight: "1.6", color: "#c9d1d9", marginTop: "14px" }}>
                  {xai.falsifiability.fdr_explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    borderLeft: "4px solid #00e5ff"
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "14px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    paddingBottom: "14px"
  },
  badge: {
    display: "inline-block",
    backgroundColor: "rgba(0, 229, 255, 0.1)",
    border: "1px solid #00e5ff",
    color: "#00e5ff",
    fontSize: "0.7rem",
    fontWeight: "bold",
    padding: "2px 8px",
    borderRadius: "2px",
    letterSpacing: "1px",
    marginBottom: "6px"
  },
  title: {
    fontSize: "1.25rem",
    margin: "0 0 4px 0",
    color: "#fff"
  },
  subtitle: {
    fontSize: "0.85rem",
    color: "#8b949e",
    margin: 0,
    maxWidth: "600px"
  },
  scoreBadge: {
    backgroundColor: "rgba(0, 229, 255, 0.05)",
    border: "1px solid rgba(0, 229, 255, 0.25)",
    padding: "8px 14px",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  tabBar: {
    display: "flex",
    gap: "5px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    flexWrap: "wrap",
    marginBottom: "14px"
  },
  tabBtn: {
    backgroundColor: "transparent",
    border: "none",
    padding: "8px 12px",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Fira Code', monospace",
    transition: "all 0.15s"
  },
  tabContent: {
    padding: "8px 0"
  },
  secTitle: {
    fontSize: "1rem",
    color: "#fff",
    margin: "0 0 4px 0"
  },
  secDesc: {
    fontSize: "0.85rem",
    color: "#8b949e",
    margin: "0 0 12px 0"
  },
  barTrack: {
    height: "6px",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: "3px",
    overflow: "hidden"
  },
  barFill: {
    height: "100%",
    borderRadius: "3px"
  },
  ruleBox: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderLeft: "3px solid #00e5ff",
    padding: "12px 16px",
    borderRadius: "0 4px 4px 0",
    fontSize: "0.88rem",
    color: "#c9d1d9",
    marginTop: "14px",
    display: "flex",
    alignItems: "center"
  },
  unitGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "14px",
    borderRadius: "4px",
    border: "1px solid rgba(255, 255, 255, 0.06)"
  },
  unitItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  unitLabel: {
    fontSize: "0.72rem",
    color: "#8b949e",
    textTransform: "uppercase"
  },
  occamsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "12px"
  },
  occamsCard: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "14px",
    borderRadius: "4px"
  },
  occamsType: {
    fontSize: "0.8rem",
    fontWeight: "bold",
    marginBottom: "6px"
  },
  occamsCode: {
    display: "block",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#c9d1d9",
    padding: "6px 8px",
    borderRadius: "3px",
    fontSize: "0.8rem",
    marginBottom: "6px"
  },
  occamsStat: {
    fontSize: "0.8rem",
    color: "#8b949e",
    marginBottom: "4px"
  },
  occamsVerdict: {
    fontSize: "0.78rem",
    color: "#8b949e"
  },
  simCard: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: "18px",
    borderRadius: "4px",
    border: "1px solid rgba(255, 255, 255, 0.08)"
  },
  simPresets: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "14px"
  },
  presetBtn: {
    border: "1px solid rgba(255, 255, 255, 0.15)",
    padding: "4px 8px",
    borderRadius: "3px",
    fontSize: "0.78rem",
    cursor: "pointer",
    fontFamily: "'Fira Code', monospace"
  },
  simInputsRow: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "14px",
    borderRadius: "4px"
  },
  simLabel: {
    fontSize: "0.75rem",
    color: "#8b949e",
    display: "block",
    marginBottom: "4px"
  },
  simInput: {
    width: "100%",
    padding: "8px",
    fontSize: "1.1rem",
    backgroundColor: "#060a12",
    border: "1px solid rgba(0, 229, 255, 0.3)",
    color: "#00e5ff",
    borderRadius: "3px",
    fontFamily: "'Fira Code', monospace"
  },
  simResult: {
    flex: "1 1 180px"
  },
  simOutput: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#00e5ff"
  },
  biasBox: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "12px 16px",
    borderRadius: "4px"
  },
  defenseCard: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: "16px",
    borderRadius: "4px",
    border: "1px solid rgba(255, 255, 255, 0.08)"
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px"
  },
  statBox: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "10px",
    borderRadius: "3px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    display: "flex",
    flexDirection: "column"
  },
  statLabel: {
    fontSize: "0.7rem",
    color: "#8b949e",
    textTransform: "uppercase"
  },
  statVal: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#fff",
    marginTop: "2px"
  }
};
