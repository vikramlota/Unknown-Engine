import { useEffect, useState } from "react";
import { getCandidates, triggerNasaFetch } from "../api";
import StoryExplainer from "./StoryExplainer";
import KnownLawsPanel from "./KnownLawsPanel";
import RelationshipTable from "./RelationshipTable";
import ScatterChartCard from "./ScatterChartCard";
import HypothesisPanel from "./HypothesisPanel";

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  async function loadCandidates() {
    try {
      const data = await getCandidates();
      setCandidates(data);
      // Auto-select Kepler's law or first candidate so the chart is populated immediately
      if (data && data.length > 0) {
        const defaultChoice = data.find((c) => c.is_known_law) || data[0];
        setSelected(defaultChoice);
      }
    } catch (err) {
      console.error("Failed to load candidates", err);
    }
  }

  async function handleFetchNasaData() {
    setIsFetching(true);
    setFetchStatus({
      type: "loading",
      message: "📡 Connecting to Caltech/IPAC NASA TAP Archive & pulling live telemetry..."
    });

    try {
      const result = await triggerNasaFetch();
      setFetchStatus({
        type: "success",
        message: `✓ ${result.message}`
      });
      await loadCandidates();
    } catch (err) {
      setFetchStatus({
        type: "error",
        message: "⚠️ Error fetching live NASA data. Please verify network connectivity."
      });
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <div>
      {/* Space Hero Header */}
      <div className="nasa-hero">
        <div style={{ maxWidth: "850px" }}>
          <div style={{ 
            display: "inline-block", 
            backgroundColor: "#e3000f", 
            color: "#fff", 
            fontSize: "0.75rem", 
            fontWeight: "bold", 
            padding: "4px 10px", 
            letterSpacing: "1px", 
            textTransform: "uppercase", 
            marginBottom: "15px",
            borderRadius: "2px"
          }}>
            Autonomous Science Discovery Engine
          </div>
          <h1 style={{ fontSize: "3.2rem", lineHeight: "1.1", marginBottom: "18px" }}>
            Hunting For Alien Physics
          </h1>
          <p style={{ fontSize: "1.15rem", lineHeight: "1.6", color: "#ddd" }}>
            Can an artificial intelligence discover the physical laws of nature without human guidance? 
            By analyzing 5,491 deep-space planets discovered by NASA telescopes, our system hunts for hidden patterns, derives mathematical laws, and explains their physical meaning.
          </p>

          <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap", marginTop: "25px" }}>
            <button 
              className="nasa-button"
              onClick={handleFetchNasaData}
              disabled={isFetching}
              style={{
                backgroundColor: isFetching ? "#444" : "#e3000f",
                cursor: isFetching ? "not-allowed" : "pointer"
              }}
            >
              {isFetching ? "📡 Pulling Telemetry..." : "🛰️ Fetch Live NASA Data"}
            </button>
            
            <a 
              href="#candidates-section" 
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "0.95rem",
                fontWeight: "bold",
                borderBottom: "1px solid #fff",
                paddingBottom: "2px"
              }}
            >
              Explore Discoveries Below ↓
            </a>
          </div>

          {fetchStatus && (
            <div style={{
              marginTop: "20px",
              padding: "12px 18px",
              borderRadius: "4px",
              backgroundColor: fetchStatus.type === "error" ? "rgba(255, 0, 0, 0.25)" : (fetchStatus.type === "success" ? "rgba(46, 125, 50, 0.35)" : "rgba(255, 255, 255, 0.1)"),
              border: `1px solid ${fetchStatus.type === "error" ? "#e3000f" : (fetchStatus.type === "success" ? "#4caf50" : "#888")}`,
              color: "#fff",
              fontFamily: "monospace",
              fontSize: "0.95rem"
            }}>
              {fetchStatus.message}
            </div>
          )}
        </div>
      </div>

      <div className="content-wrapper">
        {/* Visual 4-Step Storyline for General Audience */}
        <StoryExplainer />

        {/* The Credibility Anchor: Kepler Benchmark */}
        <KnownLawsPanel />

        {/* Candidate Exploration Section */}
        <div id="candidates-section" className="nasa-card">
          <RelationshipTable 
            candidates={candidates} 
            onSelect={setSelected} 
            selectedId={selected?.id} 
          />
        </div>

        {/* Interactive Exploration & AI Hypothesis */}
        {selected && (
          <div style={{ display: "flex", gap: "25px", flexWrap: "wrap", marginTop: "20px" }}>
            <div style={{ flex: "1 1 550px" }}>
              <ScatterChartCard candidate={selected} />
            </div>
            <div style={{ flex: "1 1 450px" }}>
              <HypothesisPanel candidate={selected} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}