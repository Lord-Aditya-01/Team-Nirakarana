import { useNavigate } from "react-router-dom";
import "./CentralDashboard.css";

const CentralDashboard = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="dashboard">
      {/* NAVBAR - ADDED LOGIN OPTIONS */}
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

      {/* HERO - 50/50 SPLIT: LEFT TEXT, RIGHT MOCK + SMALLER LOGIN/SIGNUP CARDS */}
      <section className="hero">
        {/* Subtle floating 3D background elements */}
        <div className="hero-float-bg">
          <div className="float-shape shape-1"></div>
          <div className="float-shape shape-2"></div>
          <div className="float-shape shape-3"></div>
        </div>

        <div className="hero-grid">
          {/* LEFT – text content (unchanged) */}
          <div className="hero-left">
            <div className="hero-badge">TEAM ID: 30F4837E • PROBLEM ID-04</div>
            <h1>Team NIRAKARANA Presents</h1>
            <h2>Smart Safety &amp; Assistance System</h2>
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

          {/* RIGHT – only mockup (removed role-container) */}
          <div className="hero-right">
            <div className="hero-mock">
              <div className="mock-header">
                <span>Smart Safety Platform</span>
                <span className="live-dot">LIVE</span>
              </div>
              <div className="mock-content">
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
                    <div className="bar" style={{ height: "70%" }}></div>
                    <div className="bar" style={{ height: "40%" }}></div>
                    <div className="bar" style={{ height: "90%" }}></div>
                    <p>Risk Levels Over Time</p>
                  </div>
                  <div className="mock-chart line-chart">
                    <svg viewBox="0 0 100 50">
                      <polyline
                        fill="none"
                        stroke="#0f0"
                        strokeWidth="2"
                        points="0,50 20,30 40,40 60,20 80,30 100,10"
                      />
                    </svg>
                    <p>Sensor Data Trend</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* signup and login cards */}
      <section>
        <div className="role-container">
          <div
            className="role-card"
            onClick={() => navigate("/supervisor-login")}
          >
            <div className="icon">👷‍♂️</div>
            <h3>Login as Supervisor</h3>
            <p>AI Risk Scoring • Digital Approvals • Live Monitoring</p>
            <span className="enter">Supervisor Dashboard →</span>
          </div>

          <div className="role-card" onClick={() => navigate("/worker-login")}>
            <div className="icon">🛡️</div>
            <h3>Login as Worker</h3>
            <p>Real-time Alerts • SOS Button • Portable IoT Unit</p>
            <span className="enter">Worker Safety App →</span>
          </div>

          <div
            className="role-card signup-card"
            onClick={() => navigate("/signup")}
          >
            <div className="icon">✨</div>
            <h3>New User? Sign Up</h3>
            <p>Create account for Supervisor or Worker role</p>
            <span className="enter">Create Account →</span>
          </div>
        </div>
      </section>
      {/* PROBLEM */}
      <section id="problem" className="content-section">
        <h2 className="section-title">Problem We Are Solving</h2>
        <p className="section-desc">
          Sanitation workers are frequently required to enter sewers, manholes,
          and other confined spaces that pose severe risks due to toxic gases,
          oxygen deficiency, extreme temperatures, and sudden flooding. Existing
          safety mechanisms are manual, reactive, and fragmented, lacking
          predictive risk assessment, real-time monitoring, and centralized
          accountability.
        </p>
        <div className="card-grid">
          {[
            "Workers enter toxic sewers & manholes with no prior warning",
            "Manual, reactive safety — zero predictive intelligence",
            "Frequent preventable fatalities due to gas, oxygen deficiency & flooding",
            "No centralized digital authorization or real-time monitoring",
            "Aging infrastructure + inconsistent data = high risk",
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

      {/* HOW IT WORKS - CONNECTED DOTS TIMELINE */}
      <section className="content-section timeline-section">
        <h2 className="section-title">How Our System Works</h2>
        <p className="section-desc">
          Intelligent Sewer Safety & Worker Monitoring Platform: SMC (Smart
          Safety, Monitoring & Assistance System) an AI-driven platform designed
          to ensure safe and controlled sewer and manhole operations for
          sanitation workers using predictive intelligence and real-time
          validation.
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
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-step">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="section-desc">
          How it addresses the problem: Divides safety control between
          Supervisor (authorization) and System (AI decision engine). Digitally
          approves or blocks sewer entry based on risk score. Uses real-time
          sensor validation to prevent unsafe exposure. Ensures instant alerts
          and emergency response during anomalies.
        </p>
      </section>

      {/* CHALLENGES */}
      <section id="challenges" className="content-section">
        <h2 className="section-title">Challenges Faced &amp; Solutions</h2>
        <p className="section-desc">
          Potential Challenges and Risks: Worker timing or location data entered
          by supervisors may affect monitoring accuracy. Different manholes and
          sewer locations have varying depth, gas exposure risk, structural
          condition, and safe working time, making it difficult to apply uniform
          safety rules across all sites.
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
              safety thresholds and time limits. Uses risk levels and historical
              incident data to adapt monitoring rules for each manhole.
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

      {/* IMPACT */}
      <section id="impact" className="content-section impact-section">
        <h2 className="section-title">Impact &amp; Benefits</h2>
        <div className="impact-wrapper">
          <div className="impact-left">
            <h3>For Sanitation Workers</h3>
            <ul>
              <li>
                Structural Reduction in Fatalities: AI-based risk prediction and
                enforced digital authorization create a long-term decline in
                sewer-related deaths and injuries.
              </li>
              <li>
                Safer Work Culture: Continuous monitoring and accountability
                shift sanitation work from unsafe manual practices to
                system-guided operations.
              </li>
              <li>
                Restored Dignity &amp; Trust: Digitally approved, monitored
                entry promotes dignity, safety confidence, and trust in
                municipal systems.
              </li>
            </ul>
          </div>
          <div className="impact-center">
            <div className="impact-badge">LIVES SAVED</div>
          </div>
          <div className="impact-right">
            <h3>For Supervisors &amp; Authorities</h3>
            <ul>
              <li>
                Predictive Safety Governance: Safety decisions move from
                experience-based judgment to data-driven, AI-assisted
                governance.
              </li>
              <li>
                Institutional Accountability: Digital permits, audit logs, and
                incident records create transparent responsibility and
                traceability.
              </li>
              <li>
                Reduced Crisis Dependency: Fewer emergencies and faster response
                reduce operational stress and administrative risk.
              </li>
            </ul>
          </div>
        </div>
        <div className="government-benefits">
          <h3>For City Administration &amp; Government</h3>
          <ul>
            <li>
              City-Wide Safety Intelligence: Historical and real-time data
              builds long-term urban safety intelligence for planning and policy
              making.
            </li>
            <li>
              Ethical &amp; Compliant Urban Management: Supports ethical
              sanitation practices aligned with national worker-safety and
              governance standards.
            </li>
            <li>
              Scalable Public Safety Framework: Creates a reusable AI-based
              framework for other high-risk municipal operations.
            </li>
          </ul>
        </div>
      </section>

      {/* BUSINESS MODEL */}
      <section className="content-section business-section">
        <h2 className="section-title">Business Model</h2>
        <div className="business-connector">
          <div className="biz-card gov">
            <div className="biz-icon">🏛️</div>
            <h4>Government Deployment</h4>
            <p>
              Government-funded platform for municipal corporations under Smart
              City and worker safety programs.
            </p>
          </div>
          <div className="biz-card saas">
            <div className="biz-icon">💳</div>
            <h4>Subscription-Based SaaS Model</h4>
            <p>
              Cities pay monthly or yearly fees based on workforce size,
              locations monitored, and scale of operations.
            </p>
          </div>
          <div className="biz-card integration">
            <div className="biz-icon">🔗</div>
            <h4>Integration &amp; Customization Services</h4>
            <p>
              Additional charges for connecting with existing ERP, GIS, and
              emergency systems, plus city-specific customization.
            </p>
          </div>
          <div className="biz-card ppp">
            <div className="biz-icon">🤝</div>
            <h4>Public-Private Partnership (PPP) Model</h4>
            <p>
              Technology partners operate the platform while municipalities
              handle on-ground execution and regulatory compliance.
            </p>
          </div>
        </div>
      </section>

      {/* FUTURE SCOPE */}
      <section className="content-section future-section">
        <h2 className="section-title">Future Scope</h2>

        <div className="future-diagram">
          <div className="center-circle">
            <div className="center-text">FUTURE VISION</div>
          </div>
          <div className="ray ray1"></div>
          <div className="ray ray2"></div>
          <div className="ray ray3"></div>
          <div className="ray ray4"></div>
        </div>

        <div className="future-boxes">
          <div className="future-box">
            <div className="box-icon">🚨</div>
            <h4>Emergency Services Integration</h4>
            <p>
              Direct linkage with hospitals, fire brigades, and
              disaster-response systems for rapid data sharing and faster rescue
              actions.
            </p>
          </div>
          <div className="future-box">
            <div className="box-icon">🔮</div>
            <h4>Advanced AI Hazard Forecasting</h4>
            <p>
              Use of predictive models to anticipate gas leaks, flooding, and
              oxygen depletion based on weather and historical data.
            </p>
          </div>
          <div className="future-box">
            <div className="box-icon">🌍</div>
            <h4>State-Level and National Deployment</h4>
            <p>
              Scaling the platform for multi-city, state, and nationwide
              monitoring through centralized control systems.
            </p>
          </div>
          <div className="future-box">
            <div className="box-icon">🛠️</div>
            <h4>Predictive Infrastructure Maintenance</h4>
            <p>
              Analysis of risk patterns to schedule preventive sewer repairs and
              reduce future hazards.
            </p>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section id="tech" className="content-section tech-section">
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

      {/* TEAM - CENTRAL IMAGE WITH DOTTED LINES + MENTOR BELOW */}
      <section id="team" className="content-section team-section">
        <h2 className="section-title">Team NIRAKARANA</h2>
        <div className="team-orbit">
          <div className="center-team">
            <div className="center-circle-image">
              <img
                className="center-image"
                src="https://via.placeholder.com/220?text=Team+Photo"
                alt="Team Photo"
              />
            </div>
          </div>

          {/* MEMBERS POSITIONED AROUND CENTER */}
          <div className="member member-top-left">
            <div className="member-circle-wrapper">
              <div className="member-circle yellow">Harshini Bhandary</div>
              <div className="role">Team Leader</div>
            </div>
          </div>
          <div className="member member-top-right">
            <div className="member-circle-wrapper">
              <div className="member-circle blue">Parth Shingane</div>
              <div className="role">Backend & AI</div>
            </div>
          </div>
          <div className="member member-bottom-left">
            <div className="member-circle-wrapper">
              <div className="member-circle purple">Madhura Patil</div>
              <div className="role">Frontend & UX</div>
            </div>
          </div>
          <div className="member member-bottom-right">
            <div className="member-circle-wrapper">
              <div className="member-circle orange">Om Devar</div>
              <div className="role">IoT & Hardware</div>
            </div>
          </div>
          <div className="member member-left-middle">
            <div className="member-circle-wrapper">
              <div className="member-circle green">Aditya Girhe</div>
              <div className="role">ML & Integration</div>
            </div>
          </div>

          {/* MENTOR AT BOTTOM */}
          <div className="mentor-bottom">
            <div className="member-circle-wrapper">
              <div className="member-circle pink">Mrs. Shubhangi Kale</div>
              <div className="role">Mentor & Guide</div>
            </div>
          </div>
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
