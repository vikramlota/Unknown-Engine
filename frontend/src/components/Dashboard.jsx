import { useEffect, useState } from "react";
import { getCandidates, triggerNasaFetch, getAiReport } from "../api";
import { 
  GearIcon, 
  BookIcon, 
  DownloadIcon, 
  DocumentTextIcon, 
  SparklesIcon 
} from "./Icons";
import KnownLawsPanel from "./KnownLawsPanel";
import RelationshipTable from "./RelationshipTable";
import ScatterChartCard from "./ScatterChartCard";
import HypothesisPanel from "./HypothesisPanel";
import AiReportModal from "./AiReportModal";
import XaiInspector from "./XaiInspector";

export default function Dashboard({ onNavigate }) {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(null);

  // State for AI Report Modal
  const [activeReport, setActiveReport] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    loadCandidates();
  }, []);

  async function loadCandidates() {
    try {
      const data = await getCandidates();
      setCandidates(data);
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
      message: "Connecting to Caltech/IPAC NASA TAP Archive and streaming telemetry..."
    });

    try {
      const result = await triggerNasaFetch();
      setFetchStatus({
        type: "success",
        message: result.message
      });
      await loadCandidates();
    } catch (err) {
      setFetchStatus({
        type: "error",
        message: "Error fetching live NASA data. Please verify network connectivity."
      });
    } finally {
      setIsFetching(false);
    }
  }

  async function handleGenerateReport(candidateId) {
    setIsGeneratingReport(true);
    try {
      const report = await getAiReport(candidateId);
      setActiveReport(report);
    } catch (err) {
      alert("Failed to generate AI research report. Please verify backend connection.");
    } finally {
      setIsGeneratingReport(false);
    }
  }

  return (
    <div>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <strong>NEW:</strong> Live autonomous discovery model trained on the NASA Exoplanet Survey! Note: 5,491 alien worlds analyzed with zero human intervention. <a href="#candidates-section">Explore candidates below.</a>
      </div>

      <div className="galamo-container">
        {/* Main Title & Description */}
        <div style={{ marginBottom: "35px" }}>
          <h1 style={{ fontSize: "2.8rem", color: "#38bdf8", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            unknown-engine <SparklesIcon size={26} color="#38bdf8" />
            
          </h1>


          <p style={{ fontSize: "0.95rem", color: "#8b949e", margin: 0 }}>
            Please remember to <span className="cyan-text">acknowledge and cite</span> the use of Unknown-Engine!
          </p>
        </div>

        {/* 4 Action Cards Full-Width Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {/* Tile 1: About */}
          <div className="action-tile" onClick={() => {
            const el = document.getElementById("kepler-section");
            el && el.scrollIntoView({ behavior: "smooth" });
          }}>
            <div className="tile-icon-circle">
              <GearIcon size={22} color="#00e5ff" />
            </div>
            <h3 className="tile-title">About</h3>
            <p className="tile-desc">Learn about the engine, its backend language and modules.</p>
          </div>

          {/* Tile 2: Documentation */}
          <div className="action-tile" onClick={() => {
            const el = document.getElementById("candidates-section");
            el && el.scrollIntoView({ behavior: "smooth" });
          }}>
            <div className="tile-icon-circle">
              <BookIcon size={22} color="#00e5ff" />
            </div>
            <h3 className="tile-title">Results</h3>
            <p className="tile-desc">Discovered laws reference, fitted equations, and formulas.</p>
          </div>

          {/* Tile 3: Live NASA Data Fetch */}
          <div className="action-tile" onClick={handleFetchNasaData}>
            <div className="tile-icon-circle">
              <DownloadIcon size={22} color="#00e5ff" />
            </div>
            <h3 className="tile-title">{isFetching ? "Streaming..." : "Live NASA Fetch"}</h3>
            <p className="tile-desc">Pull real-time observation records directly from Caltech TAP.</p>
          </div>

          {/* Tile 4: AI Research Report */}
          <div className="action-tile" onClick={() => selected && handleGenerateReport(selected.id)}>
            <div className="tile-icon-circle">
              <DocumentTextIcon size={22} color="#00e5ff" />
            </div>
            <h3 className="tile-title">{isGeneratingReport ? "Synthesizing..." : "AI Report"}</h3>
            <p className="tile-desc">Generate peer-reviewed report with Gemini and JWST ideas.</p>
          </div>
        </div>

        {/* Live Fetch Notification Banner if active */}
        {fetchStatus && (
          <div style={{
            marginBottom: "35px",
            padding: "14px 20px",
            borderRadius: "6px",
            backgroundColor: fetchStatus.type === "error" ? "rgba(227, 0, 15, 0.15)" : "rgba(0, 229, 255, 0.1)",
            border: `1px solid ${fetchStatus.type === "error" ? "#e3000f" : "#00e5ff"}`,
            color: "#fff",
            fontSize: "0.9rem"
          }}>
            {fetchStatus.message}
          </div>
        )}

        {/* The Credibility Anchor: Kepler Benchmark */}
        <div id="kepler-section">
          <KnownLawsPanel onNavigate={onNavigate} />
        </div>

        {/* Discovered Candidate Relationships */}
        <div id="candidates-section" className="galamo-card" style={{ marginTop: "35px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
            <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#38bdf8" }}>
              Discovered Universal Regularities
            </h2>
            <span style={{ fontSize: "0.85rem", color: "#8b949e" }}>
              Autonomously deduced from 5,491 NASA Exoplanet observations
            </span>
          </div>

          <RelationshipTable 
            candidates={candidates} 
            onSelect={setSelected} 
            selectedId={selected?.id} 
          />
        </div>

        {/* Interactive Exploration, Chart & AI Hypothesis */}
        {selected && (
          <div style={{ marginTop: "30px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "25px" }}>
              <ScatterChartCard candidate={selected} />
              <HypothesisPanel 
                candidate={selected} 
                onGenerateReport={handleGenerateReport}
                isGeneratingReport={isGeneratingReport}
              />
            </div>

            {/* Explainable AI (XAI) Inspector */}
            <XaiInspector candidateId={selected.id} />
          </div>
        )}

        {/* The AI Deep Research Report Modal */}
        {activeReport && (
          <AiReportModal 
            report={activeReport} 
            onClose={() => setActiveReport(null)} 
          />
        )}
      </div>
    </div>
  );
}