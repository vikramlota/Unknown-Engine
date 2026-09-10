import React from "react";
import { getNoveltyInterpretation } from "../utils/formatters";

export default function HypothesisPanel({ candidate }) {
  if (!candidate) {
    return null;
  }

  const { hypothesis_text, novelty_distance } = candidate;
  const novelty = getNoveltyInterpretation(novelty_distance);

  return (
    <div className="nasa-card" style={{ borderTop: "4px solid #e3000f" }}>
      <div style={styles.topBadgeRow}>
        <span style={styles.badge}>AI Astrophysicist Analysis</span>
        {novelty && (
          <span style={{ 
            ...styles.noveltyTag, 
            backgroundColor: novelty.badgeBg, 
            color: novelty.color,
            border: `1px solid ${novelty.color}` 
          }}>
            {novelty.tag}
          </span>
        )}
      </div>

      <h3 style={styles.title}>Physical Explanation for Humans</h3>
      
      <div style={styles.textBox}>
        <p style={styles.hypothesisBody}>
          {hypothesis_text || "No physical hypothesis generated."}
        </p>
      </div>

      {novelty && (
        <div style={styles.noveltySection}>
          <div style={styles.noveltyHeader}>
            <strong>Originality Meter (Literature Check)</strong>
            <span style={{ fontWeight: "bold", color: novelty.color }}>
              Score: {novelty_distance?.toFixed(2)}
            </span>
          </div>

          <p style={styles.noveltyDesc}>
            {novelty.explanation}
          </p>

          <div style={styles.noveltyBarTrack}>
            <div style={{
              ...styles.noveltyBarFill,
              width: `${Math.min(100, Math.max(15, (novelty_distance || 0) * 80))}%`,
              backgroundColor: novelty.color
            }} />
          </div>
          <div style={styles.noveltyScaleLabels}>
            <span>← Well Known in Physics Papers</span>
            <span>Completely Unexplored Space →</span>
          </div>
        </div>
      )}

      <div style={styles.disclaimer}>
        ⚠️ <strong>Note for non-physicists:</strong> The statistical connection between these variables is 100% real empirical data, while the explanation above is proposed by Google Gemini 1.5/3.0 to help researchers investigate the physical cause.
      </div>
    </div>
  );
}

const styles = {
  topBadgeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    flexWrap: "wrap",
    gap: "10px"
  },
  badge: {
    backgroundColor: "#111",
    color: "#fff",
    padding: "4px 8px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderRadius: "2px"
  },
  noveltyTag: {
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "3px 8px",
    borderRadius: "3px",
    letterSpacing: "0.5px"
  },
  title: {
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 15px 0",
    fontSize: "1.2rem",
    color: "#111"
  },
  textBox: {
    backgroundColor: "#f9f9fb",
    borderLeft: "4px solid #e3000f",
    padding: "16px 20px",
    borderRadius: "0 6px 6px 0",
    marginBottom: "20px"
  },
  hypothesisBody: {
    fontSize: "1.05rem",
    lineHeight: "1.7",
    color: "#222",
    margin: 0
  },
  noveltySection: {
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    padding: "18px",
    borderRadius: "6px",
    marginBottom: "20px"
  },
  noveltyHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.95rem",
    marginBottom: "8px"
  },
  noveltyDesc: {
    fontSize: "0.88rem",
    color: "#555",
    lineHeight: "1.5",
    margin: "0 0 12px 0"
  },
  noveltyBarTrack: {
    height: "8px",
    backgroundColor: "#eee",
    borderRadius: "4px",
    overflow: "hidden"
  },
  noveltyBarFill: {
    height: "100%",
    borderRadius: "4px"
  },
  noveltyScaleLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.75rem",
    color: "#888",
    marginTop: "6px"
  },
  disclaimer: {
    fontSize: "0.8rem",
    color: "#666",
    lineHeight: "1.5",
    borderTop: "1px solid #eee",
    paddingTop: "12px"
  }
};