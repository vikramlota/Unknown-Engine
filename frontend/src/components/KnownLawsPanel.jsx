import { useEffect, useState } from "react";
import { getKnownLaws } from "../api";

export default function KnownLawsPanel() {
  const [laws, setLaws] = useState([]);

  useEffect(() => {
    getKnownLaws().then(setLaws);
  }, []);

  if (laws.length === 0) return <p>No known laws recovered yet.</p>;

  return (
    <div>
      <h2>Rediscovered Known Laws</h2>
      {laws.map((law) => (
        <div key={law.id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px" }}>
          <h3>{law.known_law_name}</h3>
          <p>{law.var1} vs {law.var2}</p>
          <p><strong>Expression:</strong> {law.expression}</p>
          <p><strong>Train R²:</strong> {law.train_r2} &nbsp; <strong>Test R²:</strong> {law.test_r2}</p>
        </div>
      ))}
    </div>
  );
}