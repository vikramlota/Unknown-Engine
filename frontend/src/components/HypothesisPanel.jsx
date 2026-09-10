import React from "react";
import { getNoveltyInterpretation } from "../utils/formatters";
import { DocumentTextIcon, SparklesIcon } from "./Icons";

export default function HypothesisPanel({ candidate, onGenerateReport, isGeneratingReport }) {
  if (!candidate) return null;

  const { hypothesis_text, novelty_distance, id } = candidate;
  const novelty = getNoveltyInterpretation(novelty_distance);

  return (
    <div className="galamo-card" style={{ borderTop: "3px solid #00e5ff" }}>
      <div style={styles.topBadgeRow}>
        <span style={styles.badge}>ASTROPHYSICAL REASONING</span>
        {novelty && (
          <span style={{ 
            ...styles.noveltyTag, 
            backgroundColor: "rgba(0, 229, 255, 0.1)", 
            color: "#00e5ff",
            border: `1px solid rgba(0, 229, 255, 0.3)` 
          }}>
            {novelty.tag}
          </span>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
        <h3 style={styles.title}>Physical Interpretation</h3>
        
        <button
          onClick={() => onGenerateReport && onGenerateReport(id)}
          disabled={isGeneratingReport}
          className="astro-btn"
          style={{ fontSize: "0.8rem", padding: "6px 12px" }}
        >
          <DocumentTextIcon size={14} color="currentColor" />
          {isGeneratingReport ? "Synthesizing Report..." : "Full AI Report"}
        </button>
      </div>
      
      <div style={styles.textBox}>
        <p style={styles.hypothesisBody}>
          {hypothesis_text || "No physical hypothesis generated."}
        </p>
      </div>

      {novelty && (
        <div style={styles.noveltySection}>
          <div style={styles.noveltyHeader}>
            <span>Literature Novelty Audit (FAISS)</span>
            <span style={{ color: "#00e5ff", fontWeight: "bold" }}>
              Distance: {novelty_distance?.toFixed(2)}
            </span>
          </div>

          <p style={styles.noveltyDesc}>
            {novelty.explanation}
          </p>

          <div style={styles.noveltyBarTrack}>
            <div style={{
              ...styles.noveltyBarFill,
              width: `${Math.min(100, Math.max(15, (novelty_distance || 0) * 80))}%`,
              backgroundColor: "#00e5ff"
            }} />
          </div>
        </div>
      )}

      <div style={styles.disclaimer}>
        <SparklesIcon size={13} color="#00e5ff" style={{ verticalAlign: "middle", marginRight: "4px" }} />
        <strong>Neuro-Symbolic Architecture:</strong> Mathematical equations are derived deterministically via GP, while physical semantics are interpreted by Google Gemini.
      </div>
    </div>
  );
}

const styles = {
  topBadgeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    flexWrap: "wrap",
    gap: "8px"
  },
  badge: {
    backgroundColor: "rgba(0, 229, 255, 0.1)",
    border: "1px solid #00e5ff",
    color: "#00e5ff",
    padding: "2px 8px",
    fontSize: "0.7rem",
    fontWeight: "bold",
    borderRadius: "2px",
    letterSpacing: "1px"
  },
  noveltyTag: {
    fontSize: "0.72rem",
    fontWeight: "bold",
    padding: "2px 8px",
    borderRadius: "2px",
    letterSpacing: "0.5px"
  },
  title: {
    margin: 0,
    fontSize: "1.15rem",
    color: "#fff"
  },
  textBox: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderLeft: "3px solid #00e5ff",
    padding: "14px 18px",
    borderRadius: "0 4px 4px 0",
    marginBottom: "16px"
  },
  hypothesisBody: {
    fontSize: "0.95rem",
    lineHeight: "1.65",
    color: "#c9d1d9",
    margin: 0
  },
  noveltySection: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "14px",
    borderRadius: "4px",
    marginBottom: "16px"
  },
  noveltyHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    marginBottom: "6px",
    color: "#8b949e"
  },
  noveltyDesc: {
    fontSize: "0.82rem",
    color: "#8b949e",
    lineHeight: "1.4",
    margin: "0 0 10px 0"
  },
  noveltyBarTrack: {
    height: "6px",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: "3px",
    overflow: "hidden"
  },
  noveltyBarFill: {
    height: "100%",
    borderRadius: "3px"
  },
  disclaimer: {
    fontSize: "0.78rem",
    color: "#8b949e",
    lineHeight: "1.4",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    paddingTop: "10px",
    display: "flex",
    alignItems: "center"
  }
};