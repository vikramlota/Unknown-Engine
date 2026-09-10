export default function HypothesisPanel({ candidate }) {
  if (!candidate) return null;

  return (
    <div style={{ border: "1px solid orange", padding: "12px", marginTop: "12px" }}>
      <p style={{ fontWeight: "bold", color: "darkorange" }}>
        AI-generated hypothesis — not a confirmed finding
      </p>
      <p>{candidate.hypothesis_text}</p>
    </div>
  );
}