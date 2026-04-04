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
            <span className="landing-kicker">Job Search and Hiring Workspace</span>
            <h2 className="landing-hero-title">Manage applications, interviews, and recruiter workflows in one place</h2>
            <p className="landing-hero-subtitle">
              JobTracker brings together application tracking, resume tools, job listings, recruiter dashboards, and admin controls so every stage of the process stays organized.
            </p>
            <div className="landing-hero-actions">
              <button className="btn btn-primary" onClick={() => navigate("/login")}>Login</button>
              <button className="btn btn-secondary" onClick={() => navigate("/signup")}>Signup</button>
            </div>
          </div>

          <div className="landing-preview" aria-hidden="true">
            <div className="landing-preview-card">
              <p className="preview-label">Current Pipeline</p>
              <div className="preview-row">
                <span>Frontend Engineer at Atlas Labs</span>
                <span className="status-pill status-success">Interview</span>
              </div>
              <div className="preview-row">
                <span>Backend Developer at Northwind</span>
                <span className="status-pill status-pending">Applied</span>
              </div>
              <div className="preview-row">
                <span>Recruiter Review for Product Designer</span>
                <span className="status-pill status-danger">Pending</span>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <h3 className="landing-section-title">Features</h3>
          <div className="landing-feature-grid">
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">01</span>
              <h4>Application Tracker</h4>
              <p>Log new roles, update application status, and keep company search details in one organized view.</p>
            </article>
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">02</span>
              <h4>Resume & Profile Tools</h4>
              <p>Build resumes, upload documents, and use skill suggestions to tailor your profile for each role.</p>
            </article>
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">03</span>
              <h4>Job Seeker Portal</h4>
              <p>Browse listings, sign up as a job seeker, apply with a resume, and monitor your application dashboard.</p>
            </article>
            <article className="landing-feature-card surface-card">
              <span className="landing-icon">04</span>
              <h4>Recruiter & Admin Spaces</h4>
              <p>Recruiters can create job postings, review candidates, and view analytics while admins manage the platform.</p>
            </article>
          </div>
        </section>

        <section className="landing-section">
          <h3 className="landing-section-title">How It Works</h3>
          <div className="landing-steps">
            <article className="landing-step surface-card">
              <span className="landing-step-icon">+</span>
              <h4>Create Your Account</h4>
              <p>Sign in as a job seeker, recruiter, or admin to access the tools that match your workflow.</p>
            </article>
            <article className="landing-step surface-card">
              <span className="landing-step-icon">&gt;</span>
              <h4>Choose Your Workspace</h4>
              <p>Move between tracking, resume building, job listings, and recruiter dashboards from a single app.</p>
            </article>
            <article className="landing-step surface-card">
              <span className="landing-step-icon">#</span>
              <h4>Monitor Progress</h4>
              <p>Track applications, interview updates, hiring decisions, and analytics as everything moves forward.</p>
            </article>
          </div>
        </section>

        <section className="landing-cta surface-card">
          <h3>Keep your job search and hiring process in sync</h3>
          <p>Use one workspace to manage applications, prepare resumes, post jobs, and follow progress across every role.</p>
        </section>

        <footer className="landing-footer welcome-footer">
          <p>JobTracker {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}

export default Welcome;