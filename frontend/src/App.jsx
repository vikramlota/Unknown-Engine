import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import RawDataPage from "./components/RawDataPage";
import EdaPage from "./components/EdaPage";
import DiscoverableLawsPage from "./components/DiscoverableLawsPage";
import { SparklesIcon, TableIcon, ChartBarIcon, AtomIcon } from "./components/Icons";

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    return ["dashboard", "raw-data", "eda", "laws"].includes(hash) ? hash : "dashboard";
  });

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.replace("#", "");
      if (["dashboard", "raw-data", "eda", "laws"].includes(hash)) {
        setCurrentView(hash);
      }
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function handleNavigate(view) {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      {/* Top Galamo-Style Astro Navigation Bar */}
      <header style={styles.navBar}>
        <div style={styles.navContainer}>
          <div 
            onClick={() => handleNavigate("dashboard")} 
            style={styles.brand}
          >
            <span style={styles.brandTitle}>
              unknown-engine <SparklesIcon size={15} color="#00e5ff" style={{ verticalAlign: "middle" }} />
            </span>
          </div>

          <nav style={styles.navLinks}>
            <button
              onClick={() => handleNavigate("dashboard")}
              style={{
                ...styles.navBtn,
                borderBottom: currentView === "dashboard" ? "2px solid #00e5ff" : "2px solid transparent",
                color: currentView === "dashboard" ? "#00e5ff" : "#8b949e"
              }}
            >
              <SparklesIcon size={13} color="currentColor" style={{ verticalAlign: "middle", marginRight: "5px" }} />
              Discovery
            </button>
            <button
              onClick={() => handleNavigate("raw-data")}
              style={{
                ...styles.navBtn,
                borderBottom: currentView === "raw-data" ? "2px solid #00e5ff" : "2px solid transparent",
                color: currentView === "raw-data" ? "#00e5ff" : "#8b949e"
              }}
            >
              <TableIcon size={13} color="currentColor" style={{ verticalAlign: "middle", marginRight: "5px" }} />
              Live Raw Data
            </button>
            <button
              onClick={() => handleNavigate("eda")}
              style={{
                ...styles.navBtn,
                borderBottom: currentView === "eda" ? "2px solid #00e5ff" : "2px solid transparent",
                color: currentView === "eda" ? "#00e5ff" : "#8b949e"
              }}
            >
              <ChartBarIcon size={13} color="currentColor" style={{ verticalAlign: "middle", marginRight: "5px" }} />
              EDA Analytics
            </button>
            <button
              onClick={() => handleNavigate("laws")}
              style={{
                ...styles.navBtn,
                borderBottom: currentView === "laws" ? "2px solid #00e5ff" : "2px solid transparent",
                color: currentView === "laws" ? "#00e5ff" : "#8b949e"
              }}
            >
              <AtomIcon size={13} color="currentColor" style={{ verticalAlign: "middle", marginRight: "5px" }} />
              Discoverable Laws
            </button>
          </nav>
        </div>
      </header>

      {/* Main Page Routing */}
      <main>
        {currentView === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
        {currentView === "raw-data" && <RawDataPage onNavigate={handleNavigate} />}
        {currentView === "eda" && <EdaPage onNavigate={handleNavigate} />}
        {currentView === "laws" && <DiscoverableLawsPage onNavigate={handleNavigate} />}
      </main>
    </div>
  );
}

const styles = {
  navBar: {
    backgroundColor: "rgba(6, 10, 18, 0.9)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backdropFilter: "blur(12px)"
  },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "54px"
  },
  brand: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
  },
  brandTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: "1.05rem",
    fontFamily: "'Fira Code', monospace",
    letterSpacing: "-0.5px",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  navLinks: {
    display: "flex",
    gap: "10px"
  },
  navBtn: {
    backgroundColor: "transparent",
    border: "none",
    padding: "14px 12px",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Fira Code', monospace",
    transition: "color 0.2s",
    display: "inline-flex",
    alignItems: "center"
  }
};