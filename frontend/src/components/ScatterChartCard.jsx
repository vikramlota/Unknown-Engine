import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getVariableInfo } from "../utils/formatters";

export default function ScatterChartCard({ candidate }) {
  if (!candidate) {
    return (
      <div className="nasa-card" style={styles.placeholderCard}>
        <span style={{ fontSize: "2rem" }}>👈</span>
        <h3>Select any planetary relationship above to explore its data</h3>
        <p style={{ color: "#777" }}>Each point on the chart represents a real planet discovered in deep space.</p>
      </div>
    );
  }

  const { var1, var2, sample_points } = candidate;
  const v1 = getVariableInfo(var1);
  const v2 = getVariableInfo(var2);

  return (
    <div className="nasa-card">
      <div style={styles.header}>
        <div>
          <span style={styles.badge}>Real Telescope Observations</span>
          <h3 style={styles.title}>
            {v2.icon} {v2.name} vs {v1.icon} {v1.name}
          </h3>
          <p style={styles.subtitle}>
            Each red dot is a real alien planet measured by NASA space telescopes.
          </p>
        </div>
      </div>

      {(!sample_points || sample_points.length === 0) ? (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "#666" }}>
          <p>No sample points available for this pair.</p>
        </div>
      ) : (
        <div style={{ width: "100%", height: 380, marginTop: "10px" }}>
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={v1.name} 
                tick={{ fill: "#666", fontSize: 12 }} 
                axisLine={{ stroke: "#111" }}
                label={{ 
                  value: `${v1.name} (${v1.unit}) →`, 
                  position: "insideBottom", 
                  offset: -20,
                  style: { fill: "#111", fontWeight: "bold", fontSize: 12 }
                }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name={v2.name} 
                tick={{ fill: "#666", fontSize: 12 }} 
                axisLine={{ stroke: "#111" }}
                label={{ 
                  value: `↑ ${v2.name} (${v2.unit})`, 
                  angle: -90, 
                  position: "insideLeft",
                  style: { fill: "#111", fontWeight: "bold", fontSize: 12 }
                }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: "3 3" }} 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={styles.tooltip}>
                        <strong>Exoplanet Observation</strong>
                        <div style={{ marginTop: "4px" }}>
                          {v1.name}: <strong>{data.x.toFixed(2)}</strong> {v1.unit}
                        </div>
                        <div>
                          {v2.name}: <strong>{data.y.toFixed(2)}</strong> {v2.unit}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Planets" data={sample_points} fill="#e3000f" opacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={styles.explainerFooter}>
        💡 <strong>What this means:</strong> When the dots form a clear line or curve instead of a scattered cloud, it proves these two traits are bound by a universal physical law.
      </div>
    </div>
  );
}

const styles = {
  placeholderCard: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#444"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "1px solid #eee",
    paddingBottom: "15px"
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#111",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "3px 8px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderRadius: "2px",
    marginBottom: "8px"
  },
  title: {
    fontSize: "1.4rem",
    margin: "0 0 5px 0",
    color: "#111"
  },
  subtitle: {
    margin: 0,
    fontSize: "0.95rem",
    color: "#666"
  },
  tooltip: {
    backgroundColor: "#fff",
    border: "2px solid #111",
    padding: "10px 14px",
    boxShadow: "3px 3px 0px rgba(0,0,0,0.15)",
    fontSize: "0.85rem"
  },
  explainerFooter: {
    marginTop: "15px",
    padding: "12px 16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    borderLeft: "4px solid #111",
    fontSize: "0.9rem",
    color: "#444",
    lineHeight: "1.5"
  }
};