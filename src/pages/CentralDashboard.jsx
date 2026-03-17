import { useNavigate } from "react-router-dom";
import "./CentralDashboard.css";

const CentralDashboard = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Team member positions around center (700x560 canvas, center ~350,280)
  // photo center: 350, 280
  const cx = 350,
    cy = 260;

  const members = [
    // Team Lead – above center
    {
      name: "Harshini Bhandary",
      role: "Team Leader",
      x: cx,
      y: cy - 210,
      color: "bubble-leader",
    },
    // Left side
    {
      name: "Parth Shingane",
      role: "Backend & AI",
      x: cx - 220,
      y: cy - 80,
      color: "bubble-blue",
    },
    {
      name: "Madhura Patil",
      role: "Frontend & UX",
      x: cx - 220,
      y: cy + 80,
      color: "bubble-teal",
    },
    // Right side
    {
      name: "Aditya Girhe",
      role: "ML & Integration",
      x: cx + 220,
      y: cy - 80,
      color: "bubble-orange",
    },
    {
      name: "Om Devar",
      role: "IoT & Hardware",
      x: cx + 220,
      y: cy + 80,
      color: "bubble-green",
    },
    // Mentor – below center
    {
      name: "Mrs. Shubhangi Kale",
      role: "Mentor & Guide",
      x: cx,
      y: cy + 220,
      color: "bubble-mentor",
    },
  ];

  const impactData = [
    {
      category: "For Sanitation Workers",
      items: [
        {
          icon: "🛡️",
          title: "Structural Reduction in Fatalities",
          desc: "AI-based risk prediction and enforced digital authorization create a long-term decline in sewer-related deaths and injuries.",
        },
        {
          icon: "🔄",
          title: "Safer Work Culture",
          desc: "Continuous monitoring shifts sanitation work from unsafe manual practices to system-guided operations.",
        },
        {
          icon: "🤝",
          title: "Restored Dignity & Trust",
          desc: "Digitally approved, monitored entry promotes dignity, safety confidence, and trust in municipal systems.",
        },
      ],
    },
    {
      category: "For Supervisors & Authorities",
      items: [
        {
          icon: "📊",
          title: "Predictive Safety Governance",
          desc: "Safety decisions move from experience-based judgment to data-driven, AI-assisted governance.",
        },
        {
          icon: "📋",
          title: "Institutional Accountability",
          desc: "Digital permits, audit logs, and incident records create transparent responsibility and traceability.",
        },
        {
          icon: "⚡",
          title: "Reduced Crisis Dependency",
          desc: "Fewer emergencies and faster response reduce operational stress and administrative risk.",
        },
      ],
    },
    {
      category: "For City Administration & Government",
      items: [
        {
          icon: "🏙️",
          title: "City-Wide Safety Intelligence",
          desc: "Historical and real-time data builds long-term urban safety intelligence for planning and policy making.",
        },
        {
          icon: "⚖️",
          title: "Ethical & Compliant Urban Management",
          desc: "Supports ethical sanitation practices aligned with national worker-safety and governance standards.",
        },
        {
          icon: "🌐",
          title: "Scalable Public Safety Framework",
          desc: "Creates a reusable AI-based framework for other high-risk municipal operations.",
        },
      ],
    },
  ];

  return (
    <div className="dashboard">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-text">NIRAKARANA</span>
        </div>
        <div className="nav-links">
          <button onClick={() => scrollToSection("problem")}>Problem</button>
          <button onClick={() => scrollToSection("challenges")}>
            Challenges
          </button>
          <button onClick={() => scrollToSection("impact")}>Impact</button>
          <button onClick={() => scrollToSection("tech")}>Tech Stack</button>
          <button onClick={() => scrollToSection("team")}>Team</button>
        </div>
        <div className="nav-login">
          <button
            className="nav-btn supervisor"
            onClick={() => navigate("/supervisor-login")}
          >
            Supervisor Login
          </button>
          <button
            className="nav-btn worker"
            onClick={() => navigate("/worker-login")}
          >
            Worker Login
          </button>
          <button
            className="nav-btn signup"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-float-bg">
          <div className="float-shape shape-1" />
          <div className="float-shape shape-2" />
          <div className="float-shape shape-3" />
        </div>
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-badge">TEAM ID: 30F4837E • PROBLEM ID-04</div>
            <h1>Team NIRAKARANA Presents</h1>
            <h2>
              Smart Safety &amp; <span>Assistance</span> System
            </h2>
            <p className="hero-desc">
              AI-powered predictive intelligence + real-time IoT monitoring.
              <br />
              Preventing accidents before they happen for sanitation workers of
              Solapur Municipal Corporation.
            </p>
            <div className="feature-grid">
              <div className="feature-pill">AI Risk Prediction</div>
              <div className="feature-pill">Real-time IoT Sensors</div>
              <div className="feature-pill">Digital Work Permits</div>
              <div className="feature-pill">Instant SOS Escalation</div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-mock">
              <div className="mock-header">
                <span>Smart Safety Platform</span>
                <span className="live-dot">LIVE</span>
              </div>
              <div className="mock-risk">
                <div className="risk-score">92%</div>
                <div className="risk-label">SAFE TO ENTER</div>
              </div>
              <div className="mock-sensors">
                <div>
                  O₂ <span className="good">21.4%</span>
                </div>
                <div>
                  Gas <span className="good">0.8 ppm</span>
                </div>
                <div>
                  Temp <span className="good">28°C</span>
                </div>
                <div>
                  Water <span className="good">LOW</span>
                </div>
              </div>
              <div className="mock-alert">
                ✅ All Clear • Safe Working Time: 45 mins
              </div>
              <div className="mock-charts">
                <div className="mock-chart bar-chart">
                  <div className="bars">
                    <div className="bar" style={{ height: "70%" }} />
                    <div className="bar" style={{ height: "40%" }} />
                    <div className="bar" style={{ height: "90%" }} />
                    <div className="bar" style={{ height: "55%" }} />
                  </div>
                  <p>Risk Levels</p>
                </div>
                <div className="mock-chart line-chart">
                  <svg viewBox="0 0 100 50">
                    <polyline
                      fill="none"
                      stroke="#e85d04"
                      strokeWidth="2.5"
                      points="0,50 20,30 40,40 60,20 80,30 100,10"
                    />
                  </svg>
                  <p>Sensor Trend</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGIN / SIGNUP CARDS */}
      <section>
        <div className="role-container">
          <div
            className="role-card"
            onClick={() => navigate("/supervisor-login")}
          >
            <div className="icon">👷‍♂️</div>
            <div className="card-text">
              <h3>Login as Supervisor</h3>
              <p>AI Risk Scoring • Digital Approvals • Live Monitoring</p>
            </div>
            <span className="enter">Supervisor Dashboard →</span>
          </div>

          <div className="role-card" onClick={() => navigate("/worker-login")}>
            <div className="icon">🛡️</div>
            <div className="card-text">
              <h3>Login as Worker</h3>
              <p>Real-time Alerts • SOS Button • Portable IoT Unit</p>
            </div>
            <span className="enter">Worker Safety App →</span>
          </div>

          <div
            className="role-card signup-card"
            onClick={() => navigate("/signup")}
          >
            <div className="icon">✨</div>
            <div className="card-text">
              <h3>New User? Sign Up</h3>
              <p>Create account for Supervisor or Worker role</p>
            </div>
            <span className="enter">Create Account →</span>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="content-section">
        <h2 className="section-title">Problem We Are Solving</h2>
        <p className="section-desc">
          Sanitation workers enter sewers and manholes with severe risks — toxic
          gases, oxygen deficiency, extreme temperatures, and sudden flooding.
          Existing safety mechanisms are manual, reactive, and fragmented with
          zero predictive capability.
        </p>
        <div className="card-grid">
          {[
            "Workers enter toxic sewers & manholes with no prior warning",
            "Manual, reactive safety — zero predictive intelligence",
            "Frequent preventable fatalities due to gas, oxygen deficiency & flooding",
            "No centralized digital authorization or real-time monitoring",
            "Aging infrastructure + inconsistent data = persistently high risk",
          ].map((item, i) => (
            <div key={i} className="problem-card">
              <div className="card-number">
                {String(i + 1).padStart(2, "0")}
              </div>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="content-section timeline-section">
        <h2 className="section-title">How Our System Works</h2>
        <p className="section-desc">
          An AI-driven platform that ensures safe, controlled sewer and manhole
          operations using predictive intelligence and real-time validation for
          Solapur Municipal Corporation.
        </p>
        <div className="beautiful-timeline">
          {[
            "AI analyzes historical data, weather & GIS → Risk Score + Safe Duration",
            "Supervisor reviews & issues digital work permit",
            "Worker enters with portable ESP32 IoT unit",
            "Live sensors stream gas, O₂, temperature & water level",
            "Any anomaly triggers instant alert + SOS escalation",
            "All data logged for audit & municipal intelligence",
          ].map((text, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-step">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CHALLENGES */}
      <section id="challenges" className="content-section">
        <h2 className="section-title">Challenges Faced &amp; Solutions</h2>
        <p className="section-desc">
          Worker timing or location data entered by supervisors may affect
          monitoring accuracy. Different manholes have varying depth, gas
          exposure risk, structural condition, and safe working time.
        </p>
        <div className="challenge-grid">
          <div className="challenge-card">
            <div className="challenge-title">
              Data Accuracy &amp; Variable Conditions
            </div>
            <p>
              Different manholes have unique risks. Historical data is
              inconsistent.
            </p>
            <div className="solution">
              Solution: Location data through supervisor approval. Safety Time
              predictions using AI. Supports location-specific configuration of
              safety thresholds and time limits.
            </div>
          </div>
          <div className="challenge-card">
            <div className="challenge-title">Underground Connectivity</div>
            <p>Signal drops in deep sewers.</p>
            <div className="solution">
              Solution: Local buffering on ESP32 + auto-sync + offline alert
              mode
            </div>
          </div>
          <div className="challenge-card">
            <div className="challenge-title">Limited Municipal Data</div>
            <p>Incomplete records make pure ML unreliable.</p>
            <div className="solution">
              Solution: Random Forest + Isolation Forest + Custom Rule Engine +
              Gemini suggestions
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT – viewport-fit grid */}
      <section
        id="impact"
        className="content-section"
        style={{ maxWidth: "100%", background: "var(--deep-blue)" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 className="section-title" style={{ color: "#fff" }}>
            Impact &amp; Benefits
          </h2>
          {impactData.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 36 }}>
              <div className="impact-category-title">
                <span>{group.category}</span>
              </div>
              <div className="impact-grid">
                {group.items.map((item, ii) => (
                  <div key={ii} className="impact-card">
                    <div className="impact-card-icon">{item.icon}</div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BUSINESS MODEL */}
      <section className="content-section business-section">
        <h2 className="section-title">Business Model</h2>
        <div className="business-list">
          <div className="biz-card">
            <div className="biz-icon">🏛️</div>
            <div>
              <h4>Government Deployment</h4>
              <p>
                Government-funded platform for municipal corporations under
                Smart City and worker safety programs.
              </p>
            </div>
          </div>
          <div className="biz-card">
            <div className="biz-icon">💳</div>
            <div>
              <h4>Subscription-Based SaaS Model</h4>
              <p>
                Cities pay monthly or yearly fees based on workforce size,
                locations monitored, and scale of operations.
              </p>
            </div>
          </div>
          <div className="biz-card">
            <div className="biz-icon">🔗</div>
            <div>
              <h4>Integration &amp; Customization Services</h4>
              <p>
                Additional charges for connecting with existing ERP, GIS, and
                emergency systems, plus city-specific customization.
              </p>
            </div>
          </div>
          <div className="biz-card">
            <div className="biz-icon">🤝</div>
            <div>
              <h4>Public-Private Partnership (PPP) Model</h4>
              <p>
                Technology partners operate the platform while municipalities
                handle on-ground execution and regulatory compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FUTURE SCOPE */}
      <section className="content-section future-section">
        <h2 className="section-title">Future Scope</h2>
        <div className="future-diagram">
          <div className="center-circle">
            <div className="center-text">
              FUTURE
              <br />
              VISION
            </div>
          </div>
          <div className="ray ray1" />
          <div className="ray ray2" />
          <div className="ray ray3" />
          <div className="ray ray4" />
        </div>
        <div className="future-boxes">
          {[
            {
              icon: "🚨",
              title: "Emergency Services Integration",
              desc: "Direct linkage with hospitals, fire brigades, and disaster-response systems for rapid data sharing and faster rescue actions.",
            },
            {
              icon: "🔮",
              title: "Advanced AI Hazard Forecasting",
              desc: "Use of predictive models to anticipate gas leaks, flooding, and oxygen depletion based on weather and historical data.",
            },
            {
              icon: "🌍",
              title: "State-Level and National Deployment",
              desc: "Scaling the platform for multi-city, state, and nationwide monitoring through centralized control systems.",
            },
            {
              icon: "🛠️",
              title: "Predictive Infrastructure Maintenance",
              desc: "Analysis of risk patterns to schedule preventive sewer repairs and reduce future hazards.",
            },
          ].map((box, i) => (
            <div key={i} className="future-box">
              <div className="box-icon">{box.icon}</div>
              <h4>{box.title}</h4>
              <p>{box.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section id="tech" className="content-section">
        <h2 className="section-title">Tech Stack Used</h2>
        <div className="tech-columns">
          <div className="tech-col">
            <div className="tech-col-header">Frontend</div>
            <ul>
              <li>Next.js + NextAuth</li>
            </ul>
          </div>
          <div className="tech-col">
            <div className="tech-col-header">Backend &amp; Database</div>
            <ul>
              <li>Node.js</li>
              <li>MongoDB</li>
            </ul>
          </div>
          <div className="tech-col">
            <div className="tech-col-header">AI &amp; Algorithms</div>
            <ul>
              <li>Python + Scikit-learn</li>
              <li>Random Forest + Isolation Forest</li>
              <li>Custom Rule Engine</li>
              <li>Google Gemini</li>
            </ul>
          </div>
          <div className="tech-col">
            <div className="tech-col-header">IoT &amp; Deployment</div>
            <ul>
              <li>ESP32 + MQTT</li>
              <li>Docker + Vercel</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TEAM – graph layout with SVG dotted lines */}
      <section id="team" className="content-section">
        <h2 className="section-title">Team NIRAKARANA</h2>
        <div className="team-graph">
          {/* SVG dotted connector lines */}
          <svg aria-hidden="true">
            {members.map((m, i) => (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={m.x}
                y2={m.y}
                stroke={i === 0 || i === 5 ? "#f5c800" : "#1a4a7a"}
                strokeWidth="2"
                strokeDasharray="6 5"
                opacity="0.55"
              />
            ))}
          </svg>

          {/* Center team photo */}
          <div className="team-photo-wrap">
            <div className="team-photo-circle">
              <img
                src="https://via.placeholder.com/220?text=Team+Photo"
                alt="Team NIRAKARANA"
              />
            </div>
          </div>

          {/* Member nodes */}
          {members.map((m, i) => (
            <div
              key={i}
              className="team-member-node"
              style={{ left: m.x, top: m.y }}
            >
              <div className={`member-bubble ${m.color}`}>
                <div className="member-name">{m.name}</div>
                <div className="member-role">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="copyright">
          © 2026 All Rights Reserved • Joint Initiative: MIT Vishwaprayag
          University &amp; Solapur Municipal Corporation
          <br />
          Original work submitted for SAMVED-2026
        </div>
      </footer>
    </div>
  );
};

export default CentralDashboard;
