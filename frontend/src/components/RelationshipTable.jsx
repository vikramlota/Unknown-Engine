export default function RelationshipTable({ candidates, onSelect }) {
  return (
    <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Var 1</th>
          <th>Var 2</th>
          <th>Method</th>
          <th>Score</th>
          <th>P-value</th>
          <th>Expression</th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((c) => (
          <tr key={c.id} onClick={() => onSelect(c)} style={{ cursor: "pointer" }}>
            <td>{c.var1}</td>
            <td>{c.var2}</td>
            <td>{c.method}</td>
            <td>{c.score.toFixed(2)}</td>
            <td>{c.pvalue}</td>
            <td>{c.expression ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}