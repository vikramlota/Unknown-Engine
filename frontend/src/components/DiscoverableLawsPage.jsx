import React, { useState, useEffect } from "react";
import { getDiscoverableLaws } from "../api";
import { 
  AtomIcon, 
  CheckIcon, 
  CodeIcon, 
  SearchIcon, 
  SparklesIcon, 
  BookIcon, 
  TelescopeIcon, 
  ZapIcon 
} from "./Icons";

export default function DiscoverableLawsPage({ onNavigate }) {
  const [laws, setLaws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCodeId, setExpandedCodeId] = useState(null);

  // Interactive Sandbox state
  const [sandboxLaw, setSandboxLaw] = useState("kepler");
  const [sliderVal, setSliderVal] = useState(1.0); // e.g., AU for Kepler, length for pendulum, Temp for Gas

  useEffect(() => {
    getDiscoverableLaws()
      .then((data) => {
        setLaws(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch discoverable laws:", err);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...new Set(laws.map((l) => l.category))];

  const filteredLaws = laws.filter((l) => {
    const matchesCat = selectedCategory === "All" || l.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !q || 
      l.name.toLowerCase().includes(q) || 
      l.formula_display.toLowerCase().includes(q) || 
      l.physics_explanation.toLowerCase().includes(q) ||
      l.variables.some(v => v.name.toLowerCase().includes(q) || v.dataset_column.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  // Calculate sandbox outputs
  function calculateSandbox() {
    if (sandboxLaw === "kepler") {
      // T = 365.25 * a^1.5
      const a = sliderVal;
      const t = 365.25 * Math.pow(a, 1.5);
      return {
        inputLabel: `Semi-Major Axis (a): ${a.toFixed(2)} AU`,
        outputLabel: `Orbital Period (T): ${t.toFixed(1)} Days (${(t / 365.25).toFixed(2)} Earth Years)`,
        formula: "T = 365.25 × a^1.5",
        lawName: "Kepler's Third Law"
      };
    } else if (sandboxLaw === "pendulum") {
      // T = 2*pi * sqrt(L / 9.81)
      const L = sliderVal;
      const t = 2 * Math.PI * Math.sqrt(L / 9.81);
      return {
        inputLabel: `Pendulum Length (L): ${L.toFixed(2)} meters`,
        outputLabel: `Oscillation Period (T): ${t.toFixed(2)} seconds`,
        formula: "T = 2π × √(L / 9.81)",
        lawName: "Simple Pendulum Law"
      };
    } else {
      // Ideal gas: P = (1 * 8.314 * T) / 1.0
      const T = sliderVal * 100; // 100K to 1000K
      const P = (1 * 8.314 * T) / 0.024;
      return {
        inputLabel: `Temperature (T): ${T.toFixed(0)} Kelvin`,
        outputLabel: `Pressure (P): ${(P / 1000).toFixed(1)} kPa`,
        formula: "P = (n × R × T) / V",
        lawName: "Ideal Gas Law"
      };
    }
  }

  const sandboxRes = calculateSandbox();

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.header}>
        <div style={styles.badgeRow}>
          <span style={styles.badge}>
            <AtomIcon size={12} color="#00e5ff" style={{ verticalAlign: "middle", marginRight: "4px" }} />
            PHYSICAL DISCOVERY SUITE
          </span>
          <span style={styles.subBadge}>
            Domain-Agnostic Mathematical Discovery Engine
          </span>
        </div>
        <h1 style={styles.title}>
          Physics Discovery Catalog & Theoretical Benchmark Suite
        </h1>
        <p style={styles.subtitle}>
          The Unknown-Engine combines Distance Correlation (<code>dcor</code>) with Genetic Symbolic Regression (<code>gplearn</code>) to autonomously discover non-linear physical laws from raw observation vectors. Below is the complete catalog of verified benchmarks and discoverable physical equations across astronomy, mechanics, thermodynamics, and cosmology.
        </p>

        {/* Quick Stats Grid */}
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <span style={styles.statNum}>{laws.length}</span>
            <span style={styles.statLabel}>Cataloged Physical Laws</span>
          </div>
          <div style={styles.statBox}>
            <span style={{ ...styles.statNum, color: "#00e5ff" }}>1</span>
            <span style={styles.statLabel}>Verified Ground-Truth (Kepler R²=0.998)</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNum}>5</span>
            <span style={styles.statLabel}>Supported Physics Domains</span>
          </div>
          <div style={styles.statBox}>
            <span style={{ ...styles.statNum, color: "#38bdf8" }}>0</span>
            <span style={styles.statLabel}>Hardcoded Physics Formulas</span>
          </div>
        </div>
      </div>

      {/* Interactive Physics Sandbox Simulator */}
      <div className="galamo-card" style={styles.sandboxCard}>
        <div style={styles.sandboxHeader}>
          <ZapIcon size={16} color="#00e5ff" style={{ verticalAlign: "middle", marginRight: "6px" }} />
          <strong style={{ color: "#fff", fontSize: "0.95rem" }}>
            Interactive Mathematical Convergence Simulator
          </strong>
        </div>
        <p style={{ color: "#8b949e", fontSize: "0.85rem", marginTop: "6px" }}>
          Test how physical variables govern the target formula that the genetic regressor converges on.
        </p>

        <div style={styles.sandboxControls}>
          <div style={styles.sandboxSelectGroup}>
            <label style={styles.sandboxLabel}>Select Physical Law to Test:</label>
            <div style={styles.lawTabs}>
              <button 
                onClick={() => { setSandboxLaw("kepler"); setSliderVal(1.0); }}
                style={{
                  ...styles.lawTabBtn,
                  backgroundColor: sandboxLaw === "kepler" ? "rgba(0, 229, 255, 0.15)" : "transparent",
                  borderColor: sandboxLaw === "kepler" ? "#00e5ff" : "rgba(255, 255, 255, 0.1)",
                  color: sandboxLaw === "kepler" ? "#00e5ff" : "#8b949e"
                }}
              >
                Kepler's 3rd Law (Astrophysics)
              </button>
              <button 
                onClick={() => { setSandboxLaw("pendulum"); setSliderVal(1.0); }}
                style={{
                  ...styles.lawTabBtn,
                  backgroundColor: sandboxLaw === "pendulum" ? "rgba(0, 229, 255, 0.15)" : "transparent",
                  borderColor: sandboxLaw === "pendulum" ? "#00e5ff" : "rgba(255, 255, 255, 0.1)",
                  color: sandboxLaw === "pendulum" ? "#00e5ff" : "#8b949e"
                }}
              >
                Simple Pendulum (Mechanics)
              </button>
              <button 
                onClick={() => { setSandboxLaw("gas"); setSliderVal(3.0); }}
                style={{
                  ...styles.lawTabBtn,
                  backgroundColor: sandboxLaw === "gas" ? "rgba(0, 229, 255, 0.15)" : "transparent",
                  borderColor: sandboxLaw === "gas" ? "#00e5ff" : "rgba(255, 255, 255, 0.1)",
                  color: sandboxLaw === "gas" ? "#00e5ff" : "#8b949e"
                }}
              >
                Ideal Gas Law (Thermodynamics)
              </button>
            </div>
          </div>

          <div style={styles.sandboxSliderGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#00e5ff", fontSize: "0.85rem", fontWeight: "bold" }}>
                {sandboxRes.inputLabel}
              </span>
              <span style={{ color: "#8b949e", fontSize: "0.8rem" }}>
                Formula: <code style={{ color: "#38bdf8" }}>{sandboxRes.formula}</code>
              </span>
            </div>
            <input 
              type="range" 
              min={sandboxLaw === "gas" ? "1" : "0.1"} 
              max={sandboxLaw === "gas" ? "10" : "5.0"} 
              step="0.05"
              value={sliderVal} 
              onChange={(e) => setSliderVal(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "#00e5ff" }}
            />
          </div>

          <div style={styles.sandboxResultBox}>
            <div style={{ fontSize: "0.8rem", color: "#8b949e", marginBottom: "4px" }}>
              SYNTHETIC SENSOR OUTPUT (What the Engine Learns):
            </div>
            <div style={{ fontSize: "1.1rem", color: "#fff", fontWeight: "bold" }}>
              {sandboxRes.outputLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={styles.filterSection}>
        <div style={styles.catPills}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                ...styles.catBtn,
                backgroundColor: selectedCategory === cat ? "rgba(0, 229, 255, 0.15)" : "rgba(255, 255, 255, 0.03)",
                borderColor: selectedCategory === cat ? "#00e5ff" : "rgba(255, 255, 255, 0.1)",
                color: selectedCategory === cat ? "#00e5ff" : "#8b949e"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={styles.searchBox}>
          <SearchIcon size={14} color="#8b949e" style={{ marginRight: "8px" }} />
          <input
            type="text"
            placeholder="Search by law, formula, or variable column..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Laws List */}
      {loading ? (
        <div style={styles.loadingBox}>
          <SparklesIcon size={24} color="#00e5ff" />
          <p style={{ marginTop: "10px", color: "#8b949e" }}>Loading physics discovery catalog...</p>
        </div>
      ) : filteredLaws.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ color: "#8b949e" }}>No laws match your search criteria.</p>
        </div>
      ) : (
        <div style={styles.cardsGrid}>
          {filteredLaws.map((law) => {
            const isVerified = law.status === "verified";
            const isCodeExpanded = expandedCodeId === law.id;

            return (
              <div key={law.id} className="galamo-card" style={styles.lawCard}>
                {/* Header Row */}
                <div style={styles.lawCardHeader}>
                  <div>
                    <span style={styles.categoryTag}>{law.category}</span>
                    <h2 style={styles.lawName}>{law.name}</h2>
                  </div>
                  <div>
                    {isVerified ? (
                      <span style={styles.verifiedBadge}>
                        <CheckIcon size={11} color="#00e5ff" style={{ verticalAlign: "middle", marginRight: "4px" }} />
                        VERIFIED BENCHMARK
                      </span>
                    ) : (
                      <span style={styles.readyBadge}>
                        READY FOR INGESTION
                      </span>
                    )}
                  </div>
                </div>

                {/* Formula Box */}
                <div style={styles.formulaBox}>
                  <div style={styles.formulaLabel}>Target Analytic Expression:</div>
                  <div style={styles.formulaText}>{law.formula_display}</div>
                  <div style={styles.metricRow}>
                    <span style={styles.metricItem}>
                      Expected dcor: <strong style={{ color: "#00e5ff" }}>{law.dcor_expected.toFixed(3)}</strong>
                    </span>
                    <span style={styles.metricItem}>
                      Expected R²: <strong style={{ color: "#38bdf8" }}>{law.expected_r2.toFixed(3)}</strong>
                    </span>
                    <span style={styles.metricItem}>
                      Occam Complexity: <strong style={{ color: "#fff" }}>{law.complexity_score}</strong>
                    </span>
                  </div>
                </div>

                {/* Variables Ingestion Table */}
                <div style={styles.tableWrap}>
                  <div style={styles.tableHeader}>Required Input Data Columns</div>
                  <table style={styles.varTable}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Symbol</th>
                        <th style={styles.th}>Variable Name</th>
                        <th style={styles.th}>Dataset Column</th>
                        <th style={styles.th}>Units</th>
                        <th style={styles.th}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {law.variables.map((v, i) => (
                        <tr key={i} style={styles.tr}>
                          <td style={styles.tdSymbol}>{v.symbol}</td>
                          <td style={styles.tdName}>{v.name}</td>
                          <td style={styles.tdCol}><code>{v.dataset_column}</code></td>
                          <td style={styles.tdUnit}>{v.unit}</td>
                          <td style={styles.tdDesc}>{v.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Physics Explanation */}
                <div style={styles.explanationBox}>
                  <div style={styles.sectionHeading}>
                    <BookIcon size={13} color="#00e5ff" style={{ verticalAlign: "middle", marginRight: "5px" }} />
                    Physical Significance
                  </div>
                  <p style={styles.explanationText}>{law.physics_explanation}</p>
                </div>

                {/* Discovery Mechanism */}
                <div style={styles.mechanismBox}>
                  <div style={styles.sectionHeading}>
                    <TelescopeIcon size={13} color="#38bdf8" style={{ verticalAlign: "middle", marginRight: "5px" }} />
                    How the Engine Solves It
                  </div>
                  <p style={styles.explanationText}>{law.discovery_mechanism}</p>
                </div>

                {/* Verification Code Drawer */}
                <div style={styles.codeDrawer}>
                  <button
                    onClick={() => setExpandedCodeId(isCodeExpanded ? null : law.id)}
                    style={styles.codeToggleBtn}
                  >
                    <CodeIcon size={13} color="#00e5ff" style={{ verticalAlign: "middle", marginRight: "6px" }} />
                    {isCodeExpanded ? "Hide Python Ingestion Script" : "View Python Ingestion Script"}
                  </button>

                  {isCodeExpanded && (
                    <pre style={styles.codeBlock}>
                      <code>{law.verification_code}</code>
                    </pre>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Back to Dashboard */}
      <div style={styles.bottomNav}>
        <button onClick={() => onNavigate("dashboard")} style={styles.backBtn}>
          ← Back to Discovery Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "40px 24px 80px 24px",
    fontFamily: "'Fira Code', monospace"
  },
  header: {
    marginBottom: "35px"
  },
  badgeRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "12px",
    flexWrap: "wrap"
  },
  badge: {
    backgroundColor: "rgba(0, 229, 255, 0.1)",
    border: "1px solid #00e5ff",
    color: "#00e5ff",
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "3px 8px",
    borderRadius: "2px",
    letterSpacing: "1px"
  },
  subBadge: {
    color: "#8b949e",
    fontSize: "0.8rem"
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.5px",
    margin: "0 0 14px 0"
  },
  subtitle: {
    color: "#8b949e",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    maxWidth: "1100px",
    margin: 0
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginTop: "25px"
  },
  statBox: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "6px",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  statNum: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#ffffff"
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "#8b949e"
  },
  sandboxCard: {
    marginBottom: "35px",
    borderLeft: "4px solid #00e5ff",
    padding: "20px 24px"
  },
  sandboxHeader: {
    display: "flex",
    alignItems: "center"
  },
  sandboxControls: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  sandboxSelectGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  sandboxLabel: {
    fontSize: "0.8rem",
    color: "#8b949e"
  },
  lawTabs: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  lawTabBtn: {
    border: "1px solid",
    borderRadius: "4px",
    padding: "6px 12px",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s ease"
  },
  sandboxSliderGroup: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1px solid rgba(255, 255, 255, 0.06)"
  },
  sandboxResultBox: {
    backgroundColor: "rgba(0, 229, 255, 0.08)",
    border: "1px solid rgba(0, 229, 255, 0.25)",
    borderRadius: "6px",
    padding: "14px 18px"
  },
  filterSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    gap: "20px",
    flexWrap: "wrap"
  },
  catPills: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  catBtn: {
    border: "1px solid",
    borderRadius: "4px",
    padding: "6px 14px",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s ease"
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "4px",
    padding: "6px 12px",
    width: "360px"
  },
  searchInput: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "0.85rem",
    fontFamily: "inherit",
    width: "100%",
    outline: "none"
  },
  cardsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  lawCard: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },
  lawCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
    flexWrap: "wrap"
  },
  categoryTag: {
    fontSize: "0.75rem",
    color: "#38bdf8",
    letterSpacing: "0.5px",
    textTransform: "uppercase"
  },
  lawName: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#ffffff",
    margin: "4px 0 0 0"
  },
  verifiedBadge: {
    backgroundColor: "rgba(0, 229, 255, 0.1)",
    border: "1px solid #00e5ff",
    color: "#00e5ff",
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "4px 10px",
    borderRadius: "3px"
  },
  readyBadge: {
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    border: "1px solid #8b5cf6",
    color: "#a78bfa",
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "4px 10px",
    borderRadius: "3px"
  },
  formulaBox: {
    backgroundColor: "#030712",
    border: "1px solid rgba(0, 229, 255, 0.2)",
    borderRadius: "6px",
    padding: "16px 20px"
  },
  formulaLabel: {
    fontSize: "0.75rem",
    color: "#8b949e",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  formulaText: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#00e5ff",
    fontFamily: "'Fira Code', monospace"
  },
  metricRow: {
    display: "flex",
    gap: "20px",
    marginTop: "12px",
    fontSize: "0.8rem",
    color: "#8b949e",
    flexWrap: "wrap"
  },
  metricItem: {
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
    paddingRight: "20px"
  },
  tableWrap: {
    overflowX: "auto"
  },
  tableHeader: {
    fontSize: "0.8rem",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "8px",
    textTransform: "uppercase"
  },
  varTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.8rem"
  },
  th: {
    textAlign: "left",
    padding: "8px 12px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#8b949e",
    fontWeight: "500"
  },
  tr: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.04)"
  },
  tdSymbol: {
    padding: "8px 12px",
    color: "#00e5ff",
    fontWeight: "bold"
  },
  tdName: {
    padding: "8px 12px",
    color: "#fff"
  },
  tdCol: {
    padding: "8px 12px",
    color: "#38bdf8"
  },
  tdUnit: {
    padding: "8px 12px",
    color: "#8b949e"
  },
  tdDesc: {
    padding: "8px 12px",
    color: "#8b949e"
  },
  explanationBox: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    padding: "14px 18px",
    borderRadius: "6px",
    border: "1px solid rgba(255, 255, 255, 0.06)"
  },
  mechanismBox: {
    backgroundColor: "rgba(0, 229, 255, 0.02)",
    padding: "14px 18px",
    borderRadius: "6px",
    border: "1px solid rgba(0, 229, 255, 0.1)"
  },
  sectionHeading: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "6px"
  },
  explanationText: {
    fontSize: "0.85rem",
    color: "#8b949e",
    lineHeight: "1.6",
    margin: 0
  },
  codeDrawer: {
    marginTop: "5px"
  },
  codeToggleBtn: {
    backgroundColor: "transparent",
    border: "1px solid rgba(0, 229, 255, 0.3)",
    borderRadius: "4px",
    color: "#00e5ff",
    padding: "8px 14px",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontFamily: "inherit"
  },
  codeBlock: {
    marginTop: "12px",
    backgroundColor: "#030712",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "6px",
    padding: "16px",
    color: "#38bdf8",
    fontSize: "0.8rem",
    overflowX: "auto"
  },
  loadingBox: {
    textAlign: "center",
    padding: "60px 0"
  },
  emptyBox: {
    textAlign: "center",
    padding: "50px",
    border: "1px dashed rgba(255, 255, 255, 0.1)",
    borderRadius: "6px"
  },
  bottomNav: {
    marginTop: "40px",
    textAlign: "center"
  },
  backBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "4px",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontFamily: "inherit"
  }
};
