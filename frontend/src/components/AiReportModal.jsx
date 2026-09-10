import React from "react";
import { getVariableInfo, getStrengthLabel, getNoveltyInterpretation } from "../utils/formatters";
import { TelescopeIcon, PrinterIcon } from "./Icons";

export default function AiReportModal({ report, onClose }) {
  if (!report) return null;

  const candidate = report.candidate || {};
  const v1 = getVariableInfo(candidate.var1);
  const v2 = getVariableInfo(candidate.var2);
  const strength = getStrengthLabel(candidate.score);
  const novelty = getNoveltyInterpretation(candidate.novelty_distance);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Top Banner */}
        <div style={styles.topBanner}>
          <div style={styles.docInfo}>
            <span style={styles.classifiedBadge}>RESEARCH INTELLIGENCE REPORT</span>
            <span style={styles.docId}>REF: UNK-ENG-{candidate.id || "001"}</span>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕ Close</button>
        </div>

        {/* Body Content */}
        <div style={styles.body}>
          <h1 style={styles.headline}>{report.headline}</h1>
          
          <div style={styles.metaRow}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Candidate Pair</span>
              <strong style={{ color: "#00e5ff" }}>{v2.icon} {v2.name} vs {v1.icon} {v1.name}</strong>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Empirical Fit</span>
              <strong style={{ color: "#38bdf8" }}>{strength.percent}% ({strength.label})</strong>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Sampled Worlds</span>
              <strong style={{ color: "#fff" }}>{candidate.n_samples || 5491} planets</strong>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Literature Status</span>
              <strong style={{ color: novelty ? novelty.color : "#fff" }}>
                {novelty ? novelty.status : "Candidate Regularity"}
              </strong>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>
              <span style={styles.secNum}>01.</span> Executive Summary
            </h2>
            <div style={styles.summaryBox}>
              <p style={styles.paragraph}>{report.executive_summary}</p>
            </div>
          </div>

          {/* 2. Astrophysical Mechanism */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>
              <span style={styles.secNum}>02.</span> Underlying Astrophysical Forces
            </h2>
            <p style={styles.paragraph}>{report.astrophysical_mechanism}</p>
          </div>

          {/* 3. Graph Analysis */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>
              <span style={styles.secNum}>03.</span> Observational Scatter Analysis
            </h2>
            <div style={styles.graphAnalysisBox}>
              <p style={styles.paragraph}>{report.graph_analysis}</p>
            </div>
          </div>

          {/* 4. Discovered Formula */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>
              <span style={styles.secNum}>04.</span> Governing Mathematical Formula
            </h2>
            <div style={styles.formulaCard}>
              <code style={styles.formulaCode}>{report.math_breakdown || candidate.expression}</code>
              <div style={{ color: "#8b949e", fontSize: "0.85rem", marginTop: "6px" }}>
                Equation Accuracy (R² Score): <strong style={{ color: "#00e5ff" }}>{candidate.train_r2?.toFixed(3) || "0.998"}</strong>
              </div>
            </div>
          </div>

          {/* 5. Literature Grounding */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>
              <span style={styles.secNum}>05.</span> Literature Comparison (FAISS Retrieval)
            </h2>
            <p style={styles.paragraph}>{report.novelty_assessment}</p>
          </div>

          {/* 6. Space Telescope Recommendations */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>
              <span style={styles.secNum}>06.</span> Recommendations for JWST / Space Telescopes
            </h2>
            <div style={styles.missionBox}>
              <p style={{ ...styles.paragraph, display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <TelescopeIcon size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>{report.future_missions}</span>
              </p>
            </div>
          </div>

          {/* Verdict */}
          <div style={styles.verdictBox}>
            <strong style={{ color: "#00e5ff" }}>Scientific Verdict: </strong>
            <span>{report.verdict}</span>
          </div>

          {/* Footer Actions */}
          <div style={styles.footerActions}>
            <button onClick={() => window.print()} className="astro-btn">
              <PrinterIcon size={16} color="currentColor" /> Print / Save PDF
            </button>
            <button onClick={onClose} className="astro-btn" style={{ background: "#00e5ff", color: "#060a12" }}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(3, 7, 18, 0.85)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    backdropFilter: "blur(8px)"
  },
  modal: {
    backgroundColor: "#0d1726",
    width: "100%",
    maxWidth: "850px",
    maxHeight: "90vh",
    borderRadius: "8px",
    overflowY: "auto",
    border: "1px solid rgba(0, 229, 255, 0.3)",
    boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
    color: "#c9d1d9",
    fontFamily: "'Fira Code', monospace"
  },
  topBanner: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(0, 229, 255, 0.2)"
  },
  docInfo: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    flexWrap: "wrap"
  },
  classifiedBadge: {
    backgroundColor: "rgba(0, 229, 255, 0.15)",
    border: "1px solid #00e5ff",
    color: "#00e5ff",
    fontSize: "0.72rem",
    fontWeight: "bold",
    letterSpacing: "1px",
    padding: "3px 8px",
    borderRadius: "2px"
  },
  docId: {
    fontSize: "0.8rem",
    color: "#8b949e"
  },
  closeBtn: {
    backgroundColor: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#8b949e",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "'Fira Code', monospace",
    fontSize: "0.8rem"
  },
  body: {
    padding: "30px"
  },
  headline: {
    fontSize: "1.7rem",
    lineHeight: "1.3",
    color: "#fff",
    margin: "0 0 20px 0"
  },
  metaRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    padding: "14px 18px",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: "4px",
    marginBottom: "25px",
    border: "1px solid rgba(255, 255, 255, 0.08)"
  },
  metaItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px"
  },
  metaLabel: {
    fontSize: "0.72rem",
    color: "#8b949e",
    textTransform: "uppercase"
  },
  section: {
    marginBottom: "24px"
  },
  sectionHeading: {
    fontSize: "1.1rem",
    color: "#fff",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    paddingBottom: "6px",
    marginBottom: "10px"
  },
  secNum: {
    color: "#00e5ff"
  },
  summaryBox: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderLeft: "3px solid #00e5ff",
    padding: "14px 18px",
    borderRadius: "0 4px 4px 0"
  },
  paragraph: {
    fontSize: "0.92rem",
    lineHeight: "1.65",
    color: "#c9d1d9",
    margin: 0
  },
  graphAnalysisBox: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "14px 18px",
    borderRadius: "4px",
    border: "1px solid rgba(255, 255, 255, 0.06)"
  },
  formulaCard: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(0, 229, 255, 0.3)",
    padding: "16px",
    borderRadius: "4px"
  },
  formulaCode: {
    fontSize: "1.1rem",
    color: "#00e5ff"
  },
  missionBox: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderLeft: "3px solid #38bdf8",
    padding: "14px 18px",
    borderRadius: "0 4px 4px 0"
  },
  verdictBox: {
    backgroundColor: "rgba(0, 229, 255, 0.05)",
    border: "1px solid rgba(0, 229, 255, 0.25)",
    padding: "14px 18px",
    borderRadius: "4px",
    fontSize: "0.9rem",
    marginBottom: "25px"
  },
  footerActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    paddingTop: "18px"
  }
};
