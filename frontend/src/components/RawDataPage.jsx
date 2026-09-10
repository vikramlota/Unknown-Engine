import React, { useEffect, useState } from "react";
import { getRawData } from "../api";
import { TelescopeIcon } from "./Icons";

export default function RawDataPage({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPage(page, searchTerm);
  }, [page, searchTerm]);

  async function loadPage(p, s) {
    setLoading(true);
    try {
      const res = await getRawData(p, 50, s);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
    setSearchTerm(search);
  }

  return (
    <div className="galamo-container">
      {/* Header Banner */}
      <div style={{ marginBottom: "30px" }}>
        <button onClick={() => onNavigate("dashboard")} className="astro-btn" style={{ marginBottom: "20px" }}>
          ← Return to Discovery Engine
        </button>

        <h1 style={{ fontSize: "2.4rem", color: "#38bdf8", marginBottom: "8px" }}>
          Raw Planetary Telemetry Catalog
        </h1>
        <p style={{ color: "#8b949e", fontSize: "0.95rem", margin: 0, maxWidth: "800px" }}>
          Direct observation stream of 5,491 verified exoplanetary systems from the NASA Caltech TAP archive. Filtered and validated for physical consistency.
        </p>
      </div>

      <div className="galamo-card">
        {/* Controls Bar */}
        <div style={styles.controlsRow}>
          <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
            <input
              type="text"
              placeholder="Search planet name (e.g. Kepler, TOI, TRAPPIST)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" className="astro-btn">
              Search
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={() => { setSearch(""); setSearchTerm(""); setPage(1); }}
                className="astro-btn"
                style={{ borderColor: "rgba(255, 255, 255, 0.2)", color: "#8b949e" }}
              >
                Clear
              </button>
            )}
          </form>

          <div style={styles.metaInfo}>
            {data && (
              <span>
                Showing <strong>{((page - 1) * 50) + 1}</strong> - <strong>{Math.min(page * 50, data.total_rows)}</strong> of <strong className="cyan-text">{data.total_rows.toLocaleString()}</strong> planets
              </span>
            )}
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div style={styles.loadingBox}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <TelescopeIcon size={16} color="#00e5ff" /> Streaming observation records from database...
            </span>
          </div>
        ) : !data || data.rows.length === 0 ? (
          <div style={styles.loadingBox}>No planets found matching "{searchTerm}".</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="nasa-table">
              <thead>
                <tr>
                  {data.columns.map((col) => (
                    <th key={col.key} title={col.desc}>
                      {col.label}
                      {col.unit && <div style={styles.headerUnit}>{col.unit}</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, idx) => (
                  <tr key={idx}>
                    {data.columns.map((col) => {
                      const val = row[col.key];
                      const isNumeric = typeof val === "number";
                      return (
                        <td key={col.key}>
                          {col.key === "pl_name" ? (
                            <strong style={{ color: "#00e5ff" }}>{val}</strong>
                          ) : isNumeric ? (
                            val.toFixed ? val.toFixed(3) : val
                          ) : (
                            val ?? "—"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {data && data.total_pages > 1 && (
          <div style={styles.paginationRow}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="astro-btn"
            >
              ← Previous
            </button>
            <span style={{ fontSize: "0.85rem", color: "#8b949e" }}>
              Page <strong style={{ color: "#fff" }}>{page}</strong> of <strong style={{ color: "#fff" }}>{data.total_pages}</strong>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
              disabled={page === data.total_pages}
              className="astro-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  controlsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "18px",
    paddingBottom: "14px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
  },
  searchForm: {
    display: "flex",
    gap: "8px",
    flex: "1 1 350px"
  },
  searchInput: {
    flex: 1,
    padding: "8px 12px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#fff",
    borderRadius: "4px",
    fontFamily: "'Fira Code', monospace",
    fontSize: "0.88rem"
  },
  metaInfo: {
    fontSize: "0.85rem",
    color: "#8b949e"
  },
  headerUnit: {
    fontSize: "0.68rem",
    color: "#8b949e",
    fontWeight: "normal",
    textTransform: "none",
    marginTop: "2px"
  },
  loadingBox: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#8b949e",
    fontSize: "1rem"
  },
  paginationRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)"
  }
};
