import React from "react";

export default function RelationshipTable({ candidates, onSelect, selectedId }) {
  if (!candidates || candidates.length === 0) {
    return <div>No candidates available.</div>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="nasa-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Var 1</th>
            <th>Var 2</th>
            <th>Score (dcor)</th>
            <th>P-value</th>
            <th>R²</th>
            <th>Equation</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr 
              key={c.id} 
              className={selectedId === c.id ? "selected" : ""}
              onClick={() => onSelect(c)}
            >
              <td><strong>{c.id}</strong></td>
              <td>{c.var1}</td>
              <td>{c.var2}</td>
              <td>{c.score?.toFixed(4)}</td>
              <td>{c.p_spearman_adj?.toExponential(2)}</td>
              <td>{c.train_r2?.toFixed(3)}</td>
              <td><code style={{ backgroundColor: "#f4f4f4", padding: "4px 8px", borderRadius: "4px", fontSize: "0.9em" }}>{c.expression}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}