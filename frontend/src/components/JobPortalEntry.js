import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JobPortal.css";

function JobPortalEntry() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const pageBg = darkMode ? "#111827" : "#f3f4f6";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const textColor = darkMode ? "#f3f4f6" : "#111827";
  const borderColor = darkMode ? "#374151" : "#d1d5db";
  const mutedText = darkMode ? "#9ca3af" : "#6b7280";

  return (
    <div
      className="job-portal-entry"
      style={{
        background: pageBg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div className="job-portal-header">
        <button
          className="btn btn-ghost ghost-btn"
          onClick={() => navigate("/dashboard")}
          style={{ marginBottom: "20px" }}
        >
          ← Back to Home
        </button>
        <button
          className="btn btn-ghost ghost-btn"
          onClick={toggleDarkMode}
          style={{ marginBottom: "20px" }}
        >
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>

      <div
        className="job-portal-choice-container"
        style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "600px",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}
      >
        <h1 style={{ color: textColor, marginBottom: "16px", fontSize: "28px" }}>
          Welcome to Job Portal 💼
        </h1>
        <p style={{ color: mutedText, marginBottom: "40px", fontSize: "16px" }}>
          Choose your role to get started
        </p>

        <div className="job-portal-options">
          <div
            className="job-portal-option"
            onClick={() => navigate("/job-seeker-signup")}
            style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: "12px",
              padding: "24px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              marginBottom: "20px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 8px 16px rgba(47, 108, 229, 0.2)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>👨‍💼</div>
            <h2 style={{ color: textColor, marginBottom: "8px", fontSize: "20px" }}>
              Job Seeker
            </h2>
            <p style={{ color: mutedText, fontSize: "14px", marginBottom: "16px" }}>
              Browse and apply to job postings
            </p>
            <button className="btn btn-primary" style={{ marginTop: "12px" }}>
              Continue as Job Seeker
            </button>
          </div>

          <div
            className="job-portal-option"
            onClick={() => navigate("/recruiter-signup")}
            style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: "12px",
              padding: "24px",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 8px 16px rgba(47, 108, 229, 0.2)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏢</div>
            <h2 style={{ color: textColor, marginBottom: "8px", fontSize: "20px" }}>
              Recruiter
            </h2>
            <p style={{ color: mutedText, fontSize: "14px", marginBottom: "16px" }}>
              Post jobs and attract candidates
            </p>
            <button className="btn btn-primary" style={{ marginTop: "12px" }}>
              Continue as Recruiter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobPortalEntry;
