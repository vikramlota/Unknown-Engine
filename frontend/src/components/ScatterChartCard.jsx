import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ScatterChartCard({ candidate }) {
  if (!candidate) {
    return <div className="nasa-card">Select a candidate to view the scatter plot.</div>;
  }

  const { var1, var2, sample_points } = candidate;

  if (!sample_points || sample_points.length === 0) {
    return (
      <div className="nasa-card">
        <h3 style={{ textTransform: "uppercase", letterSpacing: "1px", borderBottom: "2px solid #111", paddingBottom: "10px" }}>
          Empirical Data
        </h3>
        <p><i>Sample points data is currently missing from the backend payload.</i></p>
      </div>
    );
  }

  return (
    <div className="nasa-card">
      <h3 style={{ textTransform: "uppercase", letterSpacing: "1px", borderBottom: "2px solid #111", paddingBottom: "10px", marginBottom: "20px" }}>
        Empirical Data: <span className="text-nasa-red">{var2}</span> vs <span className="text-nasa-red">{var1}</span>
      </h3>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis type="number" dataKey="x" name={var1} tick={{ fill: "#666" }} axisLine={{ stroke: "#111" }} />
            <YAxis type="number" dataKey="y" name={var2} tick={{ fill: "#666" }} axisLine={{ stroke: "#111" }} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ borderRadius: "2px", border: "1px solid #111", boxShadow: "4px 4px 0px rgba(0,0,0,0.1)" }} />
            <Scatter name="Data" data={sample_points} fill="#e3000f" opacity={0.7} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}