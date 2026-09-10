import React from "react";

export default function HypothesisPanel({ candidate }) {
  if (!candidate) {
    return null;
  }

  const { hypothesis_text, novelty_distance } = candidate;

  return (
    <div className="nasa-card" style={{ borderTop: "4px solid #e3000f" }}>
      <div style={{ display: "inline-block", backgroundColor: "#111", color: "#fff", padding: "4px 8px", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>
        AI-Generated Hypothesis
      </div>
      
      <h3 style={{ textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>Physical Plausibility</h3>
      <p style={{ fontSize: "1.1rem", lineHeight: "1.7", color: "#333" }}>
        {hypothesis_text || "No hypothesis available."}
      </p>
      
      {novelty_distance !== undefined && novelty_distance !== null && (
        <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#f4f4f4", borderLeft: "4px solid #111" }}>
          <strong style={{ textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px" }}>Novelty Distance (FAISS)</strong> 
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "5px" }}>{novelty_distance.toFixed(4)}</div>
          <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "5px" }}>Higher value = further from known physics abstracts.</div>
        </div>
      )}
    </div>
  );
}