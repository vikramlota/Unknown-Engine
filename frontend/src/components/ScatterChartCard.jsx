import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getVariableInfo } from "../utils/formatters";
import { TelescopeIcon, SparklesIcon } from "./Icons";

export default function ScatterChartCard({ candidate }) {
  if (!candidate) {
    return (
      <div className="galamo-card" style={styles.placeholderCard}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <TelescopeIcon size={32} color="#00e5ff" />
        </div>
        <h3 style={{ color: "#fff" }}>Select a relationship above to view empirical data</h3>
        <p style={{ color: "#8b949e", fontSize: "0.85rem" }}>Each cyan coordinate corresponds to a confirmed exoplanet in the NASA catalog.</p>
      </div>
    );
  }

  const { var1, var2, sample_points } = candidate;
  const v1 = getVariableInfo(var1);
  const v2 = getVariableInfo(var2);

  return (
    <div className="galamo-card">
      <div style={styles.header}>
        <div>
          <span style={styles.badge}>TELESCOPE SCATTER PLOT</span>
          <h3 style={styles.title}>
            <span style={{ color: "#00e5ff" }}>{v2.name}</span> vs <span style={{ color: "#38bdf8" }}>{v1.name}</span>
          </h3>
          <p style={styles.subtitle}>
            Sampled across NASA space telescope photometric observations.
          </p>
        </div>
      </div>

      {(!sample_points || sample_points.length === 0) ? (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "#8b949e" }}>
          No sample points available for this pair.
        </div>
      ) : (
        <div style={{ width: "100%", height: 320, marginTop: "10px" }}>
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={v1.name} 
                tick={{ fill: "#8b949e", fontSize: 11 }} 
                axisLine={{ stroke: "rgba(255, 255, 255, 0.15)" }}
                label={{ 
                  value: `${v1.name} (${v1.unit}) →`, 
                  position: "insideBottom", 
                  offset: -15,
                  style: { fill: "#8b949e", fontSize: 11, fontFamily: "'Fira Code', monospace" }
                }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name={v2.name} 
                tick={{ fill: "#8b949e", fontSize: 11 }} 
                axisLine={{ stroke: "rgba(255, 255, 255, 0.15)" }}
                label={{ 
                  value: `↑ ${v2.name}`, 
                  angle: -90, 
                  position: "insideLeft",
                  style: { fill: "#8b949e", fontSize: 11, fontFamily: "'Fira Code', monospace" }
                }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: "3 3" }} 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={styles.tooltip}>
                        <div style={{ color: "#00e5ff", fontWeight: "bold", marginBottom: "4px" }}>Exoplanet Observation</div>
                        <div>{v1.name}: <strong>{data.x.toFixed(2)}</strong> {v1.unit}</div>
                        <div>{v2.name}: <strong>{data.y.toFixed(2)}</strong> {v2.unit}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Exoplanets" data={sample_points} fill="#00e5ff" opacity={0.75} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={styles.explainerFooter}>
        <SparklesIcon size={14} color="#00e5ff" style={{ verticalAlign: "middle", marginRight: "4px" }} />
        <strong>Statistical regularities:</strong> Collinear clustering verifies deterministic mathematical dependence.
      </div>
    </div>
  );
}

const styles = {
  placeholderCard: {
    textAlign: "center",
    padding: "60px 20px"
  },
  header: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    paddingBottom: "12px"
  },
  badge: {
    display: "inline-block",
    backgroundColor: "rgba(0, 229, 255, 0.1)",
    border: "1px solid #00e5ff",
    color: "#00e5ff",
    fontSize: "0.7rem",
    fontWeight: "bold",
    padding: "2px 6px",
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
    margin: 0,
    fontSize: "0.85rem",
    color: "#8b949e"
  },
  tooltip: {
    backgroundColor: "rgba(6, 10, 18, 0.95)",
    border: "1px solid #00e5ff",
    padding: "10px 14px",
    borderRadius: "4px",
    fontSize: "0.8rem",
    color: "#e6edf3",
    boxShadow: "0 4px 16px rgba(0,0,0,0.5)"
  },
  explainerFooter: {
    marginTop: "12px",
    padding: "10px 14px",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: "4px",
    borderLeft: "3px solid #00e5ff",
    fontSize: "0.8rem",
    color: "#8b949e",
    display: "flex",
    alignItems: "center"
  }
};