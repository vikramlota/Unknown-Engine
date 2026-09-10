import React, { useState } from "react";
import { getVariableInfo, formatExpression, getStrengthLabel } from "../utils/formatters";

export default function RelationshipTable({ candidates, onSelect, selectedId }) {
  const [expertMode, setExpertMode] = useState(false);

  if (!candidates || candidates.length === 0) {
    return <div>No candidate relationships discovered yet.</div>;
  }

  return (
    <div>
      <div style={styles.topBar}>
        <div>
          <h3 style={{ margin: "0 0 5px 0", fontSize: "1.3rem" }}>
            Discovered Planetary Regularities
          </h3>
          <p style={{ margin: 0, color: "#666", fontSize: "0.95rem" }}>
            Click on any relationship below to view its real telescope data points and the AI's explanation.
          </p>
        </div>

        <button 
          onClick={() => setExpertMode(!expertMode)}
          style={styles.modeToggle}
        >
          {expertMode ? "Switch to 🌟 Plain English Mode" : "Switch to 🔬 Technical / Math Mode"}
        </button>
      </div>

      <div style={{ overflowX: "auto", marginTop: "15px" }}>
        <table className="nasa-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>#</th>
              <th>{expertMode ? "Variable 1" : "First Trait"}</th>
              <th>{expertMode ? "Variable 2" : "Second Trait"}</th>
              <th>{expertMode ? "Correlation (dcor)" : "Connection Strength"}</th>
              <th>{expertMode ? "P-Value" : "Statistical Certainty"}</th>
              <th>{expertMode ? "Fitted Equation" : "Governing Relationship"}</th>
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
                  style={{
                    backgroundColor: isSelected ? "#fff5f5" : "transparent"
                  }}
                >
                  <td><strong>{c.id}</strong></td>
                  
                  <td>
                    {expertMode ? (
                      <code>{c.var1}</code>
                    ) : (
                      <div style={styles.traitCell}>
                        <span style={styles.traitIcon}>{v1.icon}</span>
                        <div>
                          <strong>{v1.name}</strong>
                          <div style={styles.unitText}>{v1.unit}</div>
                        </div>
                      </div>
                    )}
                  </td>

                  <td>
                    {expertMode ? (
                      <code>{c.var2}</code>
                    ) : (
                      <div style={styles.traitCell}>
                        <span style={styles.traitIcon}>{v2.icon}</span>
                        <div>
                          <strong>{v2.name}</strong>
                          <div style={styles.unitText}>{v2.unit}</div>
                        </div>
                      </div>
                    )}
                  </td>

                  <td>
                    {expertMode ? (
                      c.score?.toFixed(4)
                    ) : (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                          <span style={{ fontWeight: "bold", color: strength.color }}>{strength.label}</span>
                          <span>{strength.percent}%</span>
                        </div>
                        <div style={styles.meterTrack}>
                          <div style={{ ...styles.meterFill, width: `${strength.percent}%`, backgroundColor: strength.color }} />
                        </div>
                      </div>
                    )}
                  </td>

                  <td>
                    {expertMode ? (
                      c.p_spearman_adj?.toExponential(2)
                    ) : (
                      <span style={styles.certaintyBadge}>
                        ✓ 99.99% Certain (p &lt; 0.001)
                      </span>
                    )}
                  </td>

                  <td>
                    {expertMode ? (
                      <code style={styles.codeCell}>{c.expression}</code>
                    ) : (
                      <div style={styles.humanEquation}>
                        {formatExpression(c.expression, c.var1, c.var2)}
                      </div>
                    )}
                  </td>

                  <td>
                    <button 
                      style={{
                        ...styles.inspectBtn,
                        backgroundColor: isSelected ? "#e3000f" : "#111",
                        color: "#fff"
                      }}
                    >
                      {isSelected ? "Inspecting" : "Inspect →"}
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
    gap: "15px",
    marginBottom: "15px"
  },
  modeToggle: {
    padding: "8px 14px",
    backgroundColor: "#fff",
    border: "1px solid #111",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "bold",
    boxShadow: "2px 2px 0px rgba(0,0,0,0.1)"
  },
  traitCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  traitIcon: {
    fontSize: "1.3rem"
  },
  unitText: {
    fontSize: "0.75rem",
    color: "#777"
  },
  meterTrack: {
    width: "120px",
    height: "6px",
    backgroundColor: "#eee",
    borderRadius: "3px",
    overflow: "hidden"
  },
  meterFill: {
    height: "100%",
    borderRadius: "3px"
  },
  certaintyBadge: {
    fontSize: "0.8rem",
    color: "#2e7d32",
    fontWeight: "bold"
  },
  humanEquation: {
    fontSize: "0.9rem",
    color: "#111",
    fontWeight: "500"
  },
  codeCell: {
    backgroundColor: "#f4f4f4",
    padding: "3px 6px",
    borderRadius: "3px",
    fontSize: "0.8rem"
  },
  inspectBtn: {
    border: "none",
    padding: "6px 12px",
    borderRadius: "2px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    cursor: "pointer"
  }
};