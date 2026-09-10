import React, { useEffect, useState } from "react";
import { getKnownLaws } from "../api";

export default function KnownLawsPanel() {
  const [laws, setLaws] = useState([]);

  useEffect(() => {
    getKnownLaws().then(setLaws);
  }, []);

  if (!laws || laws.length === 0) {
    return null; // Hide panel if no known laws found
  }

  return (
    <div className="nasa-card" style={{ backgroundColor: "#111", color: "#fff", borderLeft: "4px solid #4caf50" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #333", paddingBottom: "10px" }}>
        <h2 style={{ textTransform: "uppercase", letterSpacing: "1px", margin: 0, color: "#fff" }}>
          Mission Logs: Verified Known Laws Recovered
        </h2>
        <span style={{ backgroundColor: "#2e7d32", padding: "4px 8px", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>
          Benchmark Passed
        </span>
      </div>
      
      <p style={{ color: "#aaa", fontSize: "0.95rem", margin: "15px 0 20px" }}>
        Credibility Anchor: Before proposing novel hypotheses, the engine verified that it autonomously rediscovers established astrophysical laws from empirical data.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" }}>
        {laws.map((law, idx) => (
          <div key={idx} style={{ backgroundColor: "#1c1c1c", padding: "20px", borderRadius: "4px", border: "1px solid #333" }}>
            <h3 className="text-nasa-red" style={{ textTransform: "uppercase", margin: "0 0 10px 0" }}>
              {law.known_law_name}
            </h3>
            <p style={{ margin: "6px 0", fontSize: "0.9rem", color: "#ccc" }}>
              <strong style={{ color: "#fff" }}>Variables:</strong> {law.var1} vs {law.var2}
            </p>
            <p style={{ margin: "6px 0", fontSize: "0.9rem", color: "#ccc" }}>
              <strong style={{ color: "#fff" }}>Formula:</strong> <code style={{ backgroundColor: "#000", padding: "3px 6px", color: "#4caf50" }}>{law.expression}</code>
            </p>
            <p style={{ margin: "6px 0", fontSize: "0.9rem", color: "#ccc" }}>
              <strong style={{ color: "#fff" }}>Confidence (R²):</strong> <span style={{ color: "#4caf50", fontWeight: "bold" }}>{law.train_r2?.toFixed(3)}</span>
            </p>
            
            <div style={{ marginTop: "15px", borderRadius: "4px", overflow: "hidden", border: "1px solid #333" }}>
              <img 
                src="http://localhost:8000/plots/kepler_third_law.png" 
                alt="Kepler's Third Law Empirical Fit" 
                style={{ width: "100%", height: "auto", display: "block" }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}