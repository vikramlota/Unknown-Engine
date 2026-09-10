import React from "react";

export default function StoryExplainer() {
  const steps = [
    {
      step: "01",
      icon: "🔭",
      title: "Real NASA Telescopes",
      desc: "We stream 5,491 genuine exoplanets discovered by space missions (Kepler, TESS) from NASA's archives."
    },
    {
      step: "02",
      icon: "⚡",
      title: "Pattern Hunting",
      desc: "Our statistical screening checks 78 combinations of planet features to find traits that move in lockstep."
    },
    {
      step: "03",
      icon: "📐",
      title: "Evolving Equations",
      desc: "Symbolic AI evolves actual mathematical formulas directly from data points, just like human physicists do."
    },
    {
      step: "04",
      icon: "🤖",
      title: "AI Scientist Review",
      desc: "Gemini explains the physical cause in plain English, and FAISS checks if it's already in science history."
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.badge}>How It Works</span>
        <h2 style={styles.title}>Autonomous Scientific Discovery in 4 Steps</h2>
        <p style={styles.subtitle}>
          This engine takes raw telescope observations and autonomously discovers the underlying laws of the universe—no humans telling it what to find.
        </p>
      </div>

      <div style={styles.grid}>
        {steps.map((s, idx) => (
          <div key={idx} style={styles.stepCard}>
            <div style={styles.stepHeader}>
              <span style={styles.stepNum}>{s.step}</span>
              <span style={styles.icon}>{s.icon}</span>
            </div>
            <h3 style={styles.cardTitle}>{s.title}</h3>
            <p style={styles.cardDesc}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "30px",
    marginBottom: "35px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    border: "1px solid #e0e0e0"
  },
  header: {
    marginBottom: "25px",
    textAlign: "center"
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#111",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "4px 10px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    borderRadius: "2px",
    marginBottom: "10px"
  },
  title: {
    fontSize: "1.8rem",
    color: "#111",
    margin: "5px 0 10px"
  },
  subtitle: {
    fontSize: "1.05rem",
    color: "#666",
    maxWidth: "750px",
    margin: "0 auto",
    lineHeight: "1.5"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px"
  },
  stepCard: {
    backgroundColor: "#f9f9fb",
    padding: "20px",
    borderRadius: "6px",
    borderLeft: "4px solid #e3000f",
    transition: "transform 0.2s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
  },
  stepHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  stepNum: {
    fontSize: "1.3rem",
    fontWeight: "900",
    color: "#e3000f"
  },
  icon: {
    fontSize: "1.8rem"
  },
  cardTitle: {
    fontSize: "1.1rem",
    margin: "0 0 8px 0",
    color: "#111"
  },
  cardDesc: {
    fontSize: "0.9rem",
    color: "#555",
    lineHeight: "1.5",
    margin: 0
  }
};
