import React, { useEffect, useState } from "react";
import { getEdaAnalysis } from "../api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ZapIcon } from "./Icons";

export default function EdaPage({ onNavigate }) {
  const [eda, setEda] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEda();
  }, []);

  async function loadEda() {
    setLoading(true);
    try {
      const data = await getEdaAnalysis();
      setEda(data);
    } catch (err) {
      console.error("Failed to load EDA", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="galamo-container">
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <button onClick={() => onNavigate("dashboard")} className="astro-btn" style={{ marginBottom: "20px" }}>
          ← Return to Discovery Engine
        </button>

        <h1 style={{ fontSize: "2.4rem", color: "#38bdf8", marginBottom: "8px" }}>
          Exploratory Data Analysis (EDA)
        </h1>
        <p style={{ color: "#8b949e", fontSize: "0.95rem", margin: 0, maxWidth: "800px" }}>
          Statistical distributions, completeness profiles, and astrophysical demographics computed live across 5,491 exoplanetary systems.
        </p>
      </div>

      {loading ? (
        <div className="galamo-card" style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <ZapIcon size={32} color="#00e5ff" />
          </div>
          <h3 style={{ color: "#fff" }}>Computing Astrophysical Demographics On Demand...</h3>
          <p style={{ color: "#8b949e" }}>Running distribution checks and dataset integrity audits.</p>
        </div>
      ) : !eda ? (
        <div className="galamo-card" style={{ textAlign: "center", padding: "40px", color: "#8b949e" }}>
          Failed to compute EDA. Please verify the backend is active.
        </div>
      ) : (
        <>
          {/* 1. Observation Integrity */}
          <div className="galamo-card">
            <h2 style={styles.cardHeading}>01. Observation Integrity &amp; Health</h2>
            <div style={styles.healthGrid}>
              <div style={styles.healthStat}>
                <span style={styles.healthLabel}>Raw Observations</span>
                <span style={styles.healthVal}>{eda.dataset_health.raw_observations.toLocaleString()}</span>
                <span style={styles.healthSub}>Direct from NASA TAP</span>
              </div>
              <div style={styles.healthStat}>
                <span style={styles.healthLabel}>Cleaned Physical Worlds</span>
                <span style={{ ...styles.healthVal, color: "#00e5ff" }}>
                  {eda.dataset_health.cleaned_planets.toLocaleString()}
                </span>
                <span style={styles.healthSub}>Physical (&gt;0) numbers</span>
              </div>
              <div style={styles.healthStat}>
                <span style={styles.healthLabel}>Quality Retention</span>
                <span style={styles.healthVal}>{eda.dataset_health.data_quality_retention}%</span>
                <span style={styles.healthSub}>Deduplicated</span>
              </div>
              <div style={styles.healthStat}>
                <span style={styles.healthLabel}>Completeness</span>
                <span style={{ ...styles.healthVal, color: "#38bdf8" }}>
                  100%
                </span>
                <span style={styles.healthSub}>Zero missing parameters</span>
              </div>
            </div>
          </div>

          {/* 2. Planetary Demographics */}
          <div className="galamo-card">
            <h2 style={styles.cardHeading}>02. Exoplanet Architecture Demographics</h2>
            <p style={{ color: "#8b949e", fontSize: "0.85rem", marginBottom: "18px" }}>
              Classification of sampled worlds based on physical planetary radii (compared to Earth).
            </p>

            <div style={styles.demoGrid}>
              {eda.planet_demographics.map((demo, idx) => (
                <div key={idx} style={{ ...styles.demoCard, borderTop: `3px solid ${demo.color}` }}>
                  <div style={styles.demoType}>{demo.type}</div>
                  <div style={{ ...styles.demoCount, color: demo.color }}>
                    {demo.count.toLocaleString()}
                  </div>
                  <div style={styles.demoPercent}>{demo.percent}% of catalog</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Radius & Period Histograms */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "25px", marginBottom: "24px" }}>
            <div className="galamo-card" style={{ margin: 0 }}>
              <h3 style={styles.subHeading}>Planet Radius Distribution (Earth Radii)</h3>
              <p style={{ fontSize: "0.8rem", color: "#8b949e", marginBottom: "12px" }}>
                Reveals the cosmic abundance of Sub-Neptunes and the Fulton Radius Gap.
              </p>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={eda.radius_histogram} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                    <XAxis dataKey="range" tick={{ fill: "#8b949e", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#060a12", border: "1px solid #00e5ff", fontSize: "0.8rem" }} />
                    <Bar dataKey="count" fill="#00e5ff" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="galamo-card" style={{ margin: 0 }}>
              <h3 style={styles.subHeading}>Orbital Year Length Distribution (Days)</h3>
              <p style={{ fontSize: "0.8rem", color: "#8b949e", marginBottom: "12px" }}>
                Most detected planets orbit closely due to geometric transit selection effects.
              </p>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={eda.period_histogram} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                    <XAxis dataKey="range" tick={{ fill: "#8b949e", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#8b949e", fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#060a12", border: "1px solid #38bdf8", fontSize: "0.8rem" }} />
                    <Bar dataKey="count" fill="#38bdf8" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 4. Five-Number Summary Table */}
          <div className="galamo-card">
            <h2 style={styles.cardHeading}>03. Five-Number Summary Statistics</h2>
            <div style={{ overflowX: "auto" }}>
              <table className="nasa-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Unit</th>
                    <th>Minimum</th>
                    <th>Median</th>
                    <th>Mean</th>
                    <th>Maximum</th>
                    <th>Std Dev</th>
                  </tr>
                </thead>
                <tbody>
                  {eda.summary_statistics.map((stat) => (
                    <tr key={stat.key}>
                      <td><strong style={{ color: "#fff" }}>{stat.label}</strong></td>
                      <td style={{ color: "#8b949e" }}>{stat.unit}</td>
                      <td>{stat.min}</td>
                      <td><strong style={{ color: "#00e5ff" }}>{stat.median}</strong></td>
                      <td>{stat.mean}</td>
                      <td>{stat.max.toLocaleString()}</td>
                      <td>±{stat.std}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  cardHeading: {
    fontSize: "1.25rem",
    margin: "0 0 16px 0",
    color: "#38bdf8",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    paddingBottom: "8px"
  },
  subHeading: {
    fontSize: "1rem",
    margin: "0 0 4px 0",
    color: "#fff"
  },
  healthGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px"
  },
  healthStat: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: "16px",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    border: "1px solid rgba(255, 255, 255, 0.06)"
  },
  healthLabel: {
    fontSize: "0.72rem",
    textTransform: "uppercase",
    color: "#8b949e",
    fontWeight: "bold"
  },
  healthVal: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#fff",
    margin: "6px 0 2px"
  },
  healthSub: {
    fontSize: "0.75rem",
    color: "#8b949e"
  },
  demoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px"
  },
  demoCard: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: "16px",
    borderRadius: "4px",
    border: "1px solid rgba(255, 255, 255, 0.06)"
  },
  demoType: {
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "#c9d1d9",
    marginBottom: "8px"
  },
  demoCount: {
    fontSize: "1.8rem",
    fontWeight: "700",
    lineHeight: "1",
    marginBottom: "4px"
  },
  demoPercent: {
    fontSize: "0.8rem",
    color: "#8b949e"
  }
};
