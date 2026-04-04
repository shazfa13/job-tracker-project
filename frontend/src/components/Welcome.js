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
            <span className="landing-kicker">Complete Job Tracking Platform</span>
            <h2 className="landing-hero-title">Track every application deadline, status update, and hiring step from one dashboard</h2>
            <p className="landing-hero-subtitle">
              JobTracker helps job seekers and recruiters manage the full process: add jobs, set deadlines, upload resumes, apply through listings, review candidates, and monitor analytics.
            </p>
            <div className="landing-hero-actions">
              <button className="btn btn-primary" onClick={() => navigate("/login")}>Login</button>
              <button className="btn btn-secondary" onClick={() => navigate("/signup")}>Signup</button>
            </div>
          </div>

          <div className="landing-preview" aria-hidden="true">
            <div className="landing-preview-card">
              <p className="preview-label">Application Timeline</p>
              <div className="preview-row">
                <span>Software Engineer - Application Submitted</span>
                <span className="status-pill status-success">Interview</span>
              </div>
              <div className="preview-row">
                <span>Data Analyst - Resume Sent</span>
                <span className="status-pill status-pending">Applied</span>
              </div>
              <div className="preview-row">
                <span>Product Designer - Deadline Near</span>
                <span className="status-pill status-danger">Follow-up</span>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <h3 className="landing-section-title">Features</h3>
          <div className="landing-feature-grid">
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">01</span>
              <h4>Smart Job Tracker</h4>
              <p>Add jobs, manage statuses, and keep notes, links, and follow-up dates in one timeline.</p>
            </article>
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">02</span>
              <h4>Resume Workspace</h4>
              <p>Create resumes, upload files, and use skill suggestions to improve each application.</p>
            </article>
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">03</span>
              <h4>Job Portal Flow</h4>
              <p>Browse listings, apply with resume details, and track application outcomes in real time.</p>
            </article>
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">04</span>
              <h4>Recruiter + Admin Panels</h4>
              <p>Post jobs, review applicants, and monitor hiring analytics with role-based dashboards.</p>
            </article>
          </div>
        </section>

        <section className="landing-section">
          <h3 className="landing-section-title">How It Works</h3>
          <div className="landing-steps">
            <article className="landing-step surface-card">
              <span className="landing-step-icon">+</span>
              <h4>Sign In by Role</h4>
              <p>Access job seeker, recruiter, or admin tools with secure login and signup flows.</p>
            </article>
            <article className="landing-step surface-card">
              <span className="landing-step-icon">&gt;</span>
              <h4>Use the Right Modules</h4>
              <p>Work with tracking, resume, listings, and recruiter features from one connected system.</p>
            </article>
            <article className="landing-step surface-card">
              <span className="landing-step-icon">#</span>
              <h4>Track Results Clearly</h4>
              <p>See deadlines, interview progress, and final decisions through simple dashboards.</p>
            </article>
          </div>
        </section>

        <section className="landing-cta surface-card">
          <h3>One place to manage your full hiring journey</h3>
          <p>From first application to final offer, JobTracker keeps your process clear, organized, and deadline-focused.</p>
        </section>

        <footer className="landing-footer welcome-footer">
          <p>JobTracker {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}

export default Welcome;