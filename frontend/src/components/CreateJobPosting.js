import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./JobPortal.css";

function CreateJobPosting() {
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!position.trim() || !description.trim() || !requirements.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const requirementsList = requirements
        .split("\n")
        .map((req) => req.trim())
        .filter((req) => req);

      await axios.post("/create-job-posting", {
        recruiter_id: userId,
        position: position.trim(),
        company: company.trim(),
        description: description.trim(),
        requirements: requirementsList
      });

      setSuccessMessage("Job posting created successfully!");
      setPosition("");
      setCompany("");
      setDescription("");
      setRequirements("");

      setTimeout(() => {
        navigate("/recruiter-dashboard");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "An error occurred while creating the job posting"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const pageBg = darkMode ? "#111827" : "#f3f4f6";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const textColor = darkMode ? "#f3f4f6" : "#111827";
  const borderColor = darkMode ? "#374151" : "#d1d5db";
  const inputBg = darkMode ? "#111827" : "#ffffff";
  const mutedText = darkMode ? "#9ca3af" : "#6b7280";

  return (
    <div
      className="create-job-posting"
      style={{
        background: pageBg,
        minHeight: "100vh",
        padding: "32px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <h1 style={{ color: textColor, fontSize: "28px", marginBottom: "8px" }}>
            Create Job Posting 📝
          </h1>
          <p style={{ color: mutedText, fontSize: "14px" }}>
            Post a new job opportunity to attract candidates
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/recruiter-dashboard")}
          >
            Dashboard
          </button>
          <button className="btn btn-ghost ghost-btn" onClick={toggleDarkMode}>
            {darkMode ? "Light" : "Dark"}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              localStorage.removeItem("loggedIn");
              localStorage.removeItem("userId");
              localStorage.removeItem("portalRole");
              navigate("/job-portal");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          background: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: "12px",
          padding: "32px"
        }}
      >
        {successMessage && (
          <div
            style={{
              background: "#dcfce7",
              color: "#15803d",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px"
            }}
          >
            ✓ {successMessage}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px"
            }}
          >
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: mutedText, fontSize: "14px", fontWeight: "600" }}>
              Job Position *
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="form-control"
              placeholder="e.g., Senior Frontend Developer"
              style={{
                background: inputBg,
                color: textColor,
                borderColor: borderColor,
                marginTop: "6px"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: mutedText, fontSize: "14px", fontWeight: "600" }}>
              Company Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="form-control"
              placeholder="e.g., TechCorp Inc."
              style={{
                background: inputBg,
                color: textColor,
                borderColor: borderColor,
                marginTop: "6px"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: mutedText, fontSize: "14px", fontWeight: "600" }}>
              Job Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              placeholder="Describe the role, responsibilities, and about your company..."
              rows="6"
              style={{
                background: inputBg,
                color: textColor,
                borderColor: borderColor,
                marginTop: "6px",
                fontFamily: "inherit"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: mutedText, fontSize: "14px", fontWeight: "600" }}>
              Requirements *
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="form-control"
              placeholder="Enter each requirement on a new line. Example:&#10;5+ years of experience in JavaScript&#10;Strong React knowledge&#10;Experience with Node.js"
              rows="6"
              style={{
                background: inputBg,
                color: textColor,
                borderColor: borderColor,
                marginTop: "6px",
                fontFamily: "inherit"
              }}
            />
            <p style={{ color: mutedText, fontSize: "12px", marginTop: "6px" }}>
              Enter each requirement on a separate line
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? "Creating..." : "Create Job Posting"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/recruiter-dashboard")}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPosting;
