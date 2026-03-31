import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home(){

  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(()=>{

    const loggedIn = localStorage.getItem("loggedIn");

    if(!loggedIn){
      navigate("/");
    }

  },[navigate]);

  const logout = ()=>{

    localStorage.removeItem("loggedIn");

    navigate("/");

  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", String(next));
  };

  const bgColor = darkMode ? "#111827" : "#f3f4f6";
  const surface = darkMode ? "#1f2937" : "#ffffff";
  const textColor = darkMode ? "#f3f4f6" : "#111827";
  const mutedColor = darkMode ? "#9ca3af" : "#6b7280";
  const borderColor = darkMode ? "#374151" : "#e5e7eb";

  return(
    <div
      className="public-shell home-page"
      style={{
        background: bgColor,
        color: textColor,
        "--landing-surface": surface,
        "--landing-text": textColor,
        "--landing-muted": mutedColor,
        "--landing-border": borderColor,
        "--landing-bg": bgColor
      }}
    >
      <div className="public-topbar" style={{ background: surface, borderBottom: `1px solid ${borderColor}` }}>
        <h1 className="public-brand" style={{ color: textColor }}>JobTracker</h1>
        <div className="landing-topbar-actions">
          <button className="btn btn-ghost" onClick={toggleDarkMode}>
            {darkMode ? "Light" : "Dark"}
          </button>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="public-content home-landing-content">
        <section className="landing-hero surface-card">
          <div>
            <span className="landing-kicker">Job Application Tracking System</span>
            <h2 className="landing-hero-title">Track Your Job Applications Effortlessly</h2>
            <p className="landing-hero-subtitle">
              Keep every role, status update, and interview note in one focused workspace built for students and early professionals.
            </p>
            <div className="landing-hero-actions">
              <button className="btn btn-primary" onClick={()=>navigate("/dashboard")}>View Dashboard</button>
              <button className="btn btn-secondary" onClick={()=>navigate("/add-job")}>Add Job</button>
            </div>
          </div>

          <div className="landing-preview" aria-hidden="true">
            <div className="landing-preview-card">
              <p className="preview-label">Recent Activity</p>
              <div className="preview-row">
                <span>Frontend Developer</span>
                <span className="status-pill status-success">Interview</span>
              </div>
              <div className="preview-row">
                <span>Software Engineer Intern</span>
                <span className="status-pill status-pending">Applied</span>
              </div>
              <div className="preview-row">
                <span>UI/UX Designer</span>
                <span className="status-pill status-danger">Rejected</span>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <h3 className="landing-section-title">Features</h3>
          <div className="landing-feature-grid">
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">01</span>
              <h4>Track Applications</h4>
              <p>Record every role and never lose track of opportunities.</p>
            </article>
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">02</span>
              <h4>Manage Status</h4>
              <p>Update each application from applied to final decision.</p>
            </article>
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">03</span>
              <h4>Organize Notes</h4>
              <p>Keep interview feedback and reminders in one place.</p>
            </article>
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">04</span>
              <h4>Simple Dashboard</h4>
              <p>Get a quick summary of your progress at a glance.</p>
            </article>
          </div>
        </section>

        <section className="landing-section">
          <h3 className="landing-section-title">How It Works</h3>
          <div className="landing-steps">
            <article className="landing-step surface-card">
              <span className="landing-step-icon">+</span>
              <h4>Add Job Application</h4>
              <p>Create an entry with role, company, and details.</p>
            </article>
            <article className="landing-step surface-card">
              <span className="landing-step-icon">&gt;</span>
              <h4>Track Progress</h4>
              <p>Update status as you move through each stage.</p>
            </article>
            <article className="landing-step surface-card">
              <span className="landing-step-icon">#</span>
              <h4>Stay Organized</h4>
              <p>Use the dashboard to stay focused and prepared.</p>
            </article>
          </div>
        </section>

        <section className="landing-cta surface-card">
          <h3>Start managing your job applications today</h3>
          <p>Build a consistent workflow and move through your job search with confidence.</p>
          <button className="btn btn-primary" onClick={()=>navigate("/dashboard")}>Go to Dashboard</button>
        </section>

        <footer className="landing-footer">
          <p>JobTracker {new Date().getFullYear()}</p>
          <div className="landing-footer-links">
            <button className="btn btn-ghost" onClick={()=>navigate("/dashboard")}>Dashboard</button>
            <button className="btn btn-ghost" onClick={()=>navigate("/add-job")}>Add Job</button>
          </div>
        </footer>
      </div>
    </div>

  );

}

export default Home;
