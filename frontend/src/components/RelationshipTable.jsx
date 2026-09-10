import React, { useState } from "react";
import { getVariableInfo, formatExpression, getStrengthLabel } from "../utils/formatters";
import { ClockIcon, OrbitIcon, ScaleIcon, PlanetIcon, SunIcon, ChartBarIcon, SparklesIcon, CheckIcon } from "./Icons";

function renderTraitIcon(type) {
  switch (type) {
    case "clock": return <ClockIcon size={16} color="#38bdf8" />;
    case "orbit": return <OrbitIcon size={16} color="#00e5ff" />;
    case "scale": return <ScaleIcon size={16} color="#ffb703" />;
    case "planet": return <PlanetIcon size={16} color="#38bdf8" />;
    case "sun": return <SunIcon size={16} color="#fb8500" />;
    default: return <ChartBarIcon size={16} color="#8b949e" />;
  }
}

export default function RelationshipTable({ candidates, onSelect, selectedId }) {
  const [expertMode, setExpertMode] = useState(false);

  if (!candidates || candidates.length === 0) {
    return <div style={{ color: "#8b949e", padding: "20px 0" }}>No candidate relationships discovered yet.</div>;
  }

  return (
    <div>
      <div style={styles.topBar}>
        <div style={{ fontSize: "0.85rem", color: "#8b949e" }}>
          Showing top statistically significant relationships (Survives Benjamini-Hochberg FDR p &lt; 0.001)
        </div>

        <button 
          onClick={() => setExpertMode(!expertMode)}
          className="astro-btn"
          style={{ fontSize: "0.8rem", padding: "6px 12px" }}
        >
          {expertMode ? "Switch to Plain English" : "Switch to Terminal / Math Mode"}
        </button>
      </div>

      <div style={{ overflowX: "auto", marginTop: "12px" }}>
        <table className="nasa-table">
          <thead>
            <tr>
              <th style={{ width: "50px" }}>#</th>
              <th>{expertMode ? "Variable 1" : "First Trait"}</th>
              <th>{expertMode ? "Variable 2" : "Second Trait"}</th>
              <th>{expertMode ? "Score (dcor)" : "Strength"}</th>
              <th>{expertMode ? "P-Value" : "Significance"}</th>
              <th>{expertMode ? "Fitted Equation" : "Governing Equation"}</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => {
              const v1 = getVariableInfo(c.var1);
              const v2 = getVariableInfo(c.var2);
              const strength = getStrengthLabel(c.score);
              const isSelected = selectedId === c.id;

              return (
                <tr 
                  key={c.id} 
                  className={isSelected ? "selected" : ""}
                  onClick={() => onSelect(c)}
                >
                  <td style={{ color: "#8b949e" }}>{c.id}</td>
                  
                  <td>
                    {expertMode ? (
                      <code style={styles.rawCode}>{c.var1}</code>
                    ) : (
                      <div style={styles.traitCell}>
                        {renderTraitIcon(v1.iconType)}
                        <div>
                          <strong style={{ color: "#fff" }}>{v1.name}</strong>
                          <div style={styles.unitText}>{v1.unit}</div>
                        </div>
                      </div>
                    )}
                  </td>

                  <td>
                    {expertMode ? (
                      <code style={styles.rawCode}>{c.var2}</code>
                    ) : (
                      <div style={styles.traitCell}>
                        {renderTraitIcon(v2.iconType)}
                        <div>
                          <strong style={{ color: "#fff" }}>{v2.name}</strong>
                          <div style={styles.unitText}>{v2.unit}</div>
                        </div>
                      </div>
                    )}
                  </td>

                  <td>
                    {expertMode ? (
                      <span className="cyan-text">{c.score?.toFixed(4)}</span>
                    ) : (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "3px" }}>
                          <span style={{ color: strength.color }}>{strength.label}</span>
                          <span style={{ color: "#8b949e" }}>{strength.percent}%</span>
                        </div>
                        <div style={styles.meterTrack}>
                          <div style={{ ...styles.meterFill, width: `${strength.percent}%`, backgroundColor: strength.color }} />
                        </div>
                      </div>
                    )}
                  </td>

                  <td>
                    {expertMode ? (
                      <span style={{ color: "#8b949e", fontSize: "0.85rem" }}>{c.p_spearman_adj?.toExponential(2)}</span>
                    ) : (
                      <span style={{ color: "#00e5ff", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <CheckIcon size={13} color="#00e5ff" /> p &lt; 0.001
                      </span>
                    )}
                  </td>

                  <td>
                    {expertMode ? (
                      <code style={styles.codeCell}>{c.expression}</code>
                    ) : (
                      <div style={{ color: "#38bdf8", fontSize: "0.88rem" }}>
                        {formatExpression(c.expression, c.var1, c.var2)}
                      </div>
                    )}
                  </td>

                  <td>
                    <button 
                      style={{
                        ...styles.inspectBtn,
                        backgroundColor: isSelected ? "#00e5ff" : "rgba(255, 255, 255, 0.06)",
                        color: isSelected ? "#060a12" : "#c9d1d9",
                        border: `1px solid ${isSelected ? "#00e5ff" : "rgba(255, 255, 255, 0.15)"}`
                      }}
                    >
                      {isSelected ? "Inspecting" : "Inspect"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "10px"
  },
  rawCode: {
    color: "#38bdf8",
    fontSize: "0.85rem"
  },
  traitCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  unitText: {
    fontSize: "0.72rem",
    color: "#8b949e"
  },
  meterTrack: {
    width: "110px",
    height: "5px",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: "3px",
    overflow: "hidden"
  },
  meterFill: {
    height: "100%",
    borderRadius: "3px"
  },
  codeCell: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#00e5ff",
    padding: "3px 6px",
    borderRadius: "3px",
    fontSize: "0.8rem",
    border: "1px solid rgba(0, 229, 255, 0.15)"
  },
  inspectBtn: {
    padding: "4px 10px",
    borderRadius: "3px",
    fontSize: "0.78rem",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "'Fira Code', monospace"
  }
};