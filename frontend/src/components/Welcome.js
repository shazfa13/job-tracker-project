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
        "--welcome-surface": surface,
        "--welcome-border": borderColor,
        "--welcome-muted": mutedColor,
        "--welcome-text": textColor
      }}
    >
      <div className="public-topbar" style={{ background: surface, borderBottom: `1px solid ${borderColor}` }}>
        <h1 className="public-brand" style={{ color: textColor }}>JobTracker Pro</h1>
        <button className="btn btn-ghost ghost-btn" onClick={toggleDarkMode}>
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>

      <div className="public-content welcome-content">
        <div className="welcome-hero" style={{ textAlign: "center", marginBottom: "42px" }}>
          <h2 className="hero-title welcome-hero-title" style={{ color: textColor }}>Track Your Job Search Clearly</h2>
          <p className="hero-copy" style={{ color: mutedColor }}>
            Organize applications, monitor interview progress, and keep everything in one polished workspace built for focused job searching.
          </p>
        </div>

        <div className="feature-grid welcome-feature-grid" style={{ marginBottom: "24px" }}>
          <div className="feature-card welcome-feature-card" style={{ background: surface, border: `1px solid ${borderColor}` }}>
            <h3>Analytics Dashboard</h3>
            <p>See job-search momentum with clear visual insights.</p>
          </div>
          <div className="feature-card welcome-feature-card" style={{ background: surface, border: `1px solid ${borderColor}` }}>
            <h3>Pipeline Tracking</h3>
            <p>Track every application stage from bookmark to offer.</p>
          </div>
          <div className="feature-card welcome-feature-card" style={{ background: surface, border: `1px solid ${borderColor}` }}>
            <h3>Smart Workspace</h3>
            <p>Store notes, links, and follow-ups in one place.</p>
          </div>
          <div className="feature-card welcome-feature-card" style={{ background: surface, border: `1px solid ${borderColor}` }}>
            <h3>Resume Toolkit</h3>
            <p>Prepare resume content and improve fit for each role.</p>
          </div>
        </div>

        <div className="surface-card welcome-cta" style={{ padding: "28px", textAlign: "center", background: surface, border: `1px solid ${borderColor}` }}>
          <h3 className="welcome-cta-title" style={{ marginTop: 0, fontSize: "24px", color: textColor }}>Get Started</h3>
          <p className="welcome-cta-copy" style={{ color: mutedColor, marginTop: 0, marginBottom: "20px" }}>
            Sign in to continue or create an account to begin tracking your applications.
          </p>
          <div className="welcome-cta-actions" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary gradient-btn" onClick={() => navigate("/login")}>Sign In</button>
            <button className="btn btn-ghost ghost-btn" onClick={() => navigate("/signup")}>Create Account</button>
          </div>
        </div>

        <div className="welcome-footer" style={{ textAlign: "center", marginTop: "32px", color: mutedColor, fontSize: "14px" }}>
          JobTracker Pro | Organize, Track, Succeed
        </div>
      </div>
    </div>
  );
}

export default Welcome;