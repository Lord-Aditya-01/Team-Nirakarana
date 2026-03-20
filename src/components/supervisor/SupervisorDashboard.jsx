import { useEffect, useState } from "react";
import WorkersMap from "./WorkersMap";
import WorkerList from "./WorkerList";
import "./supervisor.css";
import socket from "../../socket";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";

// ─── Custom Tooltip for Pie Chart ───────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          background: "#0A0D12",
          border: "1px solid rgba(168,184,204,0.25)",
          borderRadius: "6px",
          padding: "8px 14px",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "12px",
          color: "#EEF2F7",
        }}
      >
        <b>{payload[0].name}</b>: {payload[0].value}
      </div>
    );
  }
  return null;
};

// ─── Status color mapping ────────────────────────────────────────────────────
const STATUS_COLORS = {
  SAFE: {
    accent: "#3CB371",
    bg: "rgba(60,179,113,0.07)",
    border: "rgba(60,179,113,0.3)",
  },
  ALERT: {
    accent: "#FFD700",
    bg: "rgba(255,215,0,0.07)",
    border: "rgba(255,215,0,0.3)",
  },
  DANGER: {
    accent: "#D93025",
    bg: "rgba(217,48,37,0.07)",
    border: "rgba(217,48,37,0.3)",
  },
};

const SupervisorDashboard = () => {
  // ── States ────────────────────────────────────────────────────────────────
  const [file, setFile] = useState(null);
  const [aiResults, setAiResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState({});
  const [selectedWorker, setSelectedWorker] = useState(null);

  // ── Socket ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("join-supervisor");

    const handleInitialWorkers = (data) => {
      if (!Array.isArray(data)) return;
      const formatted = {};
      data.forEach((w) => {
        if (w?.id) formatted[w.id] = w;
      });
      setWorkers(formatted);
    };

    const handleLocation = (data) => {
      if (!data?.id) return;
      setWorkers((prev) => ({
        ...prev,
        [data.id]: { ...prev[data.id], ...data },
      }));
    };

    const handleOffline = ({ workerId }) => {
      setWorkers((prev) => {
        const c = { ...prev };
        delete c[workerId];
        return c;
      });
    };

    socket.on("initial-workers", handleInitialWorkers);
    socket.on("receive-location", handleLocation);
    socket.on("worker-offline", handleOffline);
    socket.on("new-alert", (data) => alert(data.message));

    return () => {
      socket.off("initial-workers", handleInitialWorkers);
      socket.off("receive-location", handleLocation);
      socket.off("worker-offline", handleOffline);
      socket.off("new-alert");
    };
  }, []);

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/ai/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "AI processing failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        alert("Invalid AI response format");
        setLoading(false);
        return;
      }
      setAiResults(data);
    } catch {
      alert("Server not reachable");
    }

    setLoading(false);
  };

  // ── PDF Export ────────────────────────────────────────────────────────────
  const downloadPDF = () => {
    if (aiResults.length === 0) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("AI Sewer Safety Report", 20, 20);

    let y = 40;

    aiResults.forEach((item, index) => {
      doc.setFontSize(12);
      doc.text(`Report #${index + 1}`, 20, y);
      y += 8;
      doc.text(`Status: ${item.final_status}`, 20, y);
      y += 8;
      doc.text(`Risk Score: ${item.risk_score}`, 20, y);
      y += 8;
      doc.text(`Entry Decision: ${item.entry_decision}`, 20, y);
      y += 8;
      doc.text(`Safe Work Time: ${item.safe_work_time_minutes} min`, 20, y);
      y += 8;
      doc.text(`Reason: ${item.risk_reason}`, 20, y);
      y += 8;
      doc.text(`Decision Note: ${item.decision_reason}`, 20, y);
      y += 12;

      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    });

    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, y + 10);
    doc.save("Safety_Report.pdf");
  };

  // ── Derived data ──────────────────────────────────────────────────────────
  const safe = aiResults.filter((r) => r.final_status === "SAFE").length;
  const alert_ = aiResults.filter((r) => r.final_status === "ALERT").length;
  const danger = aiResults.filter((r) => r.final_status === "DANGER").length;

  const chartData = [
    { name: "SAFE", value: safe },
    { name: "ALERT", value: alert_ },
    { name: "DANGER", value: danger },
  ];
  const PIE_COLORS = ["#3CB371", "#FFD700", "#D93025"];

  const firstDecision = aiResults[0]?.entry_decision;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="supervisor-dashboard">
      {/* ── NAVBAR ── */}
      <nav className="supervisor-navbar">
        <div className="supervisor-title">
          <span>⚠ SafeDepth Command</span>
          <span className="badge-gov">GOV-GRADE</span>
        </div>

        <div className="nav-right">
          <div className="system-status-badge">
            <span className="status-dot" />
            SYSTEM ONLINE
          </div>

          <button className="btn-pdf" onClick={downloadPDF}>
            📄 Export PDF
          </button>

          {/* If logout exists */}
          {/* <button className="supervisor-logout-btn">Logout</button> */}
        </div>
      </nav>

      {/* ── FILE UPLOAD ── */}
      <div className="upload-zone">
        <input type="file" onChange={handleFileChange} />

        <button
          className="btn-primary"
          onClick={handleUpload}
          style={{ marginLeft: "4px" }}
        >
          ▶ Run AI Analysis
        </button>

        {loading && <p>🧠 AI Analyzing Sensor Data…</p>}
      </div>

      {/* ── ENTRY DECISION BANNER ── */}
      {aiResults.length > 0 && firstDecision && (
        <div
          className={`entry-decision-banner ${firstDecision === "ALLOW" ? "allow" : "deny"}`}
        >
          {firstDecision === "ALLOW" ? "✅" : "🚫"}
          ENTRY DECISION: {firstDecision}
        </div>
      )}

      {/* ── SUMMARY CARDS ── */}
      {aiResults.length > 0 && (
        <>
          <div className="section-label">Summary Overview</div>

          <div className="summary-cards">
            <div className="summary-card safe">
              <div className="card-number">{safe}</div>
              <div className="card-label">✓ Safe</div>
            </div>
            <div className="summary-card alert">
              <div className="card-number">{alert_}</div>
              <div className="card-label">⚠ Alert</div>
            </div>
            <div className="summary-card danger">
              <div className="card-number">{danger}</div>
              <div className="card-label">✕ Danger</div>
            </div>

            {/* PIE CHART inline with cards */}
            <div
              style={{
                background: "rgba(10,13,18,0.7)",
                border: "1px solid rgba(168,184,204,0.12)",
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 160px",
              }}
            >
              <div className="chart-label" style={{ marginBottom: "6px" }}>
                Distribution
              </div>
              <ResponsiveContainer width={120} height={100}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={44}
                    innerRadius={22}
                    strokeWidth={0}
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* ── AI RESULT ITEMS ── */}
      {aiResults.length > 0 && (
        <>
          <div className="section-label">Field Analysis Reports</div>

          <div className="result-list">
            {aiResults.map((item, index) => {
              const s = STATUS_COLORS[item.final_status] || STATUS_COLORS.SAFE;
              return (
                <div
                  key={index}
                  className={`result-item ${item.final_status}`}
                  style={{ background: s.bg, borderColor: s.border }}
                >
                  {/* Header row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <h3 style={{ color: s.accent, margin: 0 }}>
                      {item.final_status === "DANGER"
                        ? "✕"
                        : item.final_status === "ALERT"
                          ? "⚠"
                          : "✓"}
                      &nbsp;
                      {item.final_status}
                    </h3>
                    <span
                      style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: "11px",
                        color: "#A8B8CC",
                        background: "rgba(168,184,204,0.08)",
                        border: "1px solid rgba(168,184,204,0.15)",
                        padding: "2px 8px",
                        borderRadius: "3px",
                      }}
                    >
                      REPORT #{index + 1}
                    </span>
                  </div>

                  {/* Meta chips */}
                  <div className="result-meta">
                    <span>📊 RISK SCORE: {item.risk_score}</span>
                    <span>🚪 ENTRY: {item.entry_decision}</span>
                    <span>⏱ SAFE TIME: {item.safe_work_time_minutes} MIN</span>
                  </div>

                  {/* Risk factors */}
                  <div style={{ marginBottom: "8px" }}>
                    <p style={{ marginBottom: "4px" }}>
                      <b>⚠ Risk Factors</b>
                    </p>
                    <ul>
                      {item.risk_reason.split(",").map((r, i) => (
                        <li key={i}>{r.trim()}</li>
                      ))}
                    </ul>
                  </div>

                  <p>📌 {item.decision_reason}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── MAP + WORKER PANEL ── */}
      <div className="section-label">Live Field Operations</div>

      <div className="supervisor-content">
        <div className="supervisor-map">
          <WorkersMap
            workers={Object.values(workers)}
            selectedWorker={selectedWorker}
          />
        </div>

        <div className="supervisor-panel">
          <WorkerList
            workers={Object.values(workers)}
            onSelect={setSelectedWorker}
          />
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="supervisor-footer">
        <span>SafeDepth AI · Sewer Worker Protection System · v2.0.0</span>
        <span className="system-online">LIVE MONITORING ACTIVE</span>
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "11px",
            color: "#A8B8CC",
          }}
        >
          {new Date().toLocaleString()}
        </span>
      </footer>
    </div>
  );
};

export default SupervisorDashboard;
