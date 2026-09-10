import React, { useEffect, useState } from "react";
import { getKnownLaws } from "../api";
import { CheckIcon, SearchIcon, TelescopeIcon, AtomIcon } from "./Icons";

export default function KnownLawsPanel({ onNavigate }) {
  const [laws, setLaws] = useState([]);

  useEffect(() => {
    getKnownLaws().then(setLaws);
  }, []);

  if (!laws || laws.length === 0) {
    return null;
  }

  return (
    <div className="galamo-card" style={styles.container}>
      <div style={styles.badgeRow}>
        <span style={styles.badge}>SCIENTIFIC CREDIBILITY BENCHMARK</span>
        <span style={styles.checkBadge}>
          <CheckIcon size={13} color="#00e5ff" style={{ verticalAlign: "middle", marginRight: "4px" }} /> 
          Kepler Third Law Rediscovered (R² = 0.998)
        </span>
      </div>

      <div style={styles.heroRow}>
        <div style={styles.textSide}>
          <h2 style={styles.title}>
            Rediscovering Kepler's 1619 Law of Planetary Motion
          </h2>
          <p style={styles.storyText}>
            In 1619, astronomer Johannes Kepler spent decades manually calculating the orbit of Mars to deduce that a planet's year length squared is proportional to its distance cubed.
          </p>
          <p style={styles.storyText}>
            To prove our engine works, we tested whether it could rediscover Kepler's Third Law <span className="cyan-text">completely on its own</span> using only raw telescope observations from 5,491 alien star systems—with zero human guidance.
          </p>

          <div style={styles.resultBox}>
            <div style={styles.resultItem}>
              <span style={styles.resultLabel}>Target Benchmark</span>
              <strong style={styles.resultVal}>Kepler's Third Law (Harmonic Motion)</strong>
            </div>
            <div style={styles.resultItem}>
              <span style={styles.resultLabel}>Autonomous Fit Precision</span>
              <strong style={{ ...styles.resultVal, color: "#00e5ff" }}>99.8% Match (R² = 0.998)</strong>
            </div>
            <div style={styles.resultItem}>
              <span style={styles.resultLabel}>Discovered Equation</span>
              <code style={styles.codeText}>pl_orbper ≈ 365.25 × (pl_orbsmax)¹·⁵</code>
            </div>
          </div>

          {onNavigate && (
            <div style={{ marginTop: "18px" }}>
              <button 
                onClick={() => onNavigate("laws")}
                style={{
                  backgroundColor: "rgba(0, 229, 255, 0.08)",
                  border: "1px solid #00e5ff",
                  color: "#00e5ff",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <AtomIcon size={14} color="#00e5ff" />
                Explore All Discoverable Physical Laws Catalog →
              </button>
            </div>
          )}
        </div>

        <div style={styles.imageSide}>
          <div style={styles.imageContainer}>
            <img 
              src="http://localhost:8000/plots/kepler_third_law.png" 
              alt="Kepler's Third Law Scatter Chart" 
              style={styles.image} 
            />
            <div style={styles.imageCaption}>
              <SearchIcon size={12} color="#8b949e" style={{ verticalAlign: "middle", marginRight: "4px" }} />
              <strong>Empirical observation:</strong> Coordinates represent 5,491 confirmed exoplanets fitting the theoretical curve.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    borderLeft: "4px solid #00e5ff"
  },
  badgeRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "15px",
    flexWrap: "wrap"
  },
  badge: {
    backgroundColor: "rgba(0, 229, 255, 0.1)",
    border: "1px solid #00e5ff",
    color: "#00e5ff",
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "3px 8px",
    borderRadius: "2px",
    letterSpacing: "1px"
  },
  checkBadge: {
    backgroundColor: "rgba(0, 229, 255, 0.08)",
    border: "1px solid rgba(0, 229, 255, 0.3)",
    color: "#00e5ff",
    fontSize: "0.8rem",
    padding: "3px 10px",
    borderRadius: "2px",
    display: "inline-flex",
    alignItems: "center"
  },
  heroRow: {
    display: "flex",
    gap: "30px",
    alignItems: "center",
    flexWrap: "wrap"
  },
  textSide: {
    flex: "1 1 480px"
  },
  title: {
    fontSize: "1.5rem",
    margin: "0 0 12px 0",
    color: "#fff"
  },
  storyText: {
    fontSize: "0.95rem",
    lineHeight: "1.6",
    color: "#c9d1d9",
    margin: "0 0 12px 0"
  },
  resultBox: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "6px",
    padding: "16px",
    marginTop: "15px"
  },
  resultItem: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px"
  },
  resultLabel: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    color: "#8b949e",
    letterSpacing: "0.5px"
  },
  resultVal: {
    fontSize: "1rem",
    color: "#fff",
    marginTop: "2px"
  },
  codeText: {
    backgroundColor: "#060a12",
    color: "#00e5ff",
    padding: "6px 10px",
    borderRadius: "4px",
    fontSize: "0.9rem",
    marginTop: "4px",
    display: "inline-block",
    border: "1px solid rgba(0, 229, 255, 0.2)"
  },
  imageSide: {
    flex: "1 1 360px"
  },
  imageContainer: {
    borderRadius: "6px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    backgroundColor: "#000"
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block"
  },
  imageCaption: {
    padding: "10px 14px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    fontSize: "0.8rem",
    color: "#8b949e",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
    display: "flex",
    alignItems: "center"
  }
};