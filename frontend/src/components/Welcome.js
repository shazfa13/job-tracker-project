import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const bgColor = darkMode ? "#111827" : "#f3f4f6";
  const textColor = darkMode ? "#f3f4f6" : "#111827";
  const surface = darkMode ? "#1f2937" : "#ffffff";
  const borderColor = darkMode ? "#374151" : "#e5e7eb";
  const mutedColor = darkMode ? "#9ca3af" : "#6b7280";

  return (
    <div
      className={`public-shell welcome-page ${darkMode ? "welcome-dark" : "welcome-light"}`}
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
        <button className="btn btn-ghost ghost-btn" onClick={toggleDarkMode}>
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>

      <div className="public-content home-landing-content welcome-content">
        <section className="landing-hero surface-card">
          <div>
            <span className="landing-kicker">Job Application Tracking System</span>
            <h2 className="landing-hero-title">Track Your Job Applications Effortlessly</h2>
            <p className="landing-hero-subtitle">
              JobTracker includes auth, analytics dashboards, job tracking tools, search, resume tools, job portal flows, and recruiter management in one workspace.
            </p>
            <div className="landing-hero-actions">
              <button className="btn btn-primary" onClick={() => navigate("/login")}>Login</button>
              <button className="btn btn-secondary" onClick={() => navigate("/signup")}>Signup</button>
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
              <h4>Core Tracker Modules</h4>
              <p>Dashboard, Add Job, Job Tracker, and Search Company help manage and monitor every application stage.</p>
            </article>
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">02</span>
              <h4>Resume & AI Tools</h4>
              <p>Resume Builder and AI Skills suggestions help optimize profiles and tailor applications faster.</p>
            </article>
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">03</span>
              <h4>Job Seeker Portal</h4>
              <p>Job seeker signup/login, job listings, apply with resume-cover-referral, applications dashboard, and withdraw support.</p>
            </article>
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">04</span>
              <h4>Recruiter & Admin Spaces</h4>
              <p>Recruiters can post jobs, review applicants, accept/reject, and view analytics. Admin dashboard manages platform data.</p>
            </article>
          </div>
        </section>

        <section className="landing-section">
          <h3 className="landing-section-title">How It Works</h3>
          <div className="landing-steps">
            <article className="landing-step surface-card">
              <span className="landing-step-icon">+</span>
              <h4>Start with Authentication</h4>
              <p>Use Welcome, Login, and Signup to enter either general tracking flows or role-based portal flows.</p>
            </article>
            <article className="landing-step surface-card">
              <span className="landing-step-icon">&gt;</span>
              <h4>Choose Your Workflow</h4>
              <p>Pick user tools (tracker, search, resume) or job portal role (job seeker or recruiter).</p>
            </article>
            <article className="landing-step surface-card">
              <span className="landing-step-icon">#</span>
              <h4>Track Outcomes</h4>
              <p>Monitor applications, interview progress, recruiter decisions, and analytics from dedicated dashboards.</p>
            </article>
          </div>
        </section>

        <section className="landing-cta surface-card">
          <h3>Start managing your job applications today</h3>
          <p>From welcome to admin, every component is connected to give a complete job-seeking and recruiting experience.</p>
        </section>

        <footer className="landing-footer welcome-footer">
          <p>JobTracker {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}

export default Welcome;