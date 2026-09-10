import { useEffect, useState } from "react";
import { getCandidates, triggerNasaFetch } from "../api";
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
      <div className="nasa-hero">
        <div style={{ maxWidth: "800px" }}>
          <div style={{ 
            display: "inline-block", 
            backgroundColor: "#e3000f", 
            color: "#fff", 
            fontSize: "0.75rem", 
            fontWeight: "bold", 
            padding: "4px 8px", 
            letterSpacing: "1px", 
            textTransform: "uppercase", 
            marginBottom: "15px" 
          }}>
            NASA TAP Telemetry Sync
          </div>
          <h1>Discovering Space</h1>
          <p>
            The Unknown Unknown Engine autonomously discovers physical laws from exoplanetary observation archives. Pull real-time observations directly from Caltech/NASA or inspect verified mathematical laws below.
          </p>

          <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
            <button 
              className="nasa-button"
              onClick={handleFetchNasaData}
              disabled={isFetching}
              style={{
                backgroundColor: isFetching ? "#444" : "#e3000f",
                cursor: isFetching ? "not-allowed" : "pointer"
              }}
            >
              {isFetching ? "📡 Streaming NASA Data..." : "🛰️ Fetch Live NASA Data"}
            </button>
          </div>

          {fetchStatus && (
            <div style={{
              marginTop: "20px",
              padding: "12px 18px",
              borderRadius: "4px",
              backgroundColor: fetchStatus.type === "error" ? "rgba(255, 0, 0, 0.2)" : (fetchStatus.type === "success" ? "rgba(46, 125, 50, 0.3)" : "rgba(255, 255, 255, 0.1)"),
              border: `1px solid ${fetchStatus.type === "error" ? "#e3000f" : (fetchStatus.type === "success" ? "#4caf50" : "#666")}`,
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
        <KnownLawsPanel />

        <div className="nasa-card">
          <h2 style={{ borderBottom: "2px solid #e3000f", display: "inline-block", paddingBottom: "8px", marginBottom: "20px" }}>
            Candidate Physical Laws
          </h2>
          <RelationshipTable candidates={candidates} onSelect={setSelected} selectedId={selected?.id} />
        </div>

        {selected && (
          <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 500px" }}>
              <ScatterChartCard candidate={selected} />
            </div>
            <div style={{ flex: "1 1 400px" }}>
              <HypothesisPanel candidate={selected} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}