import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function AddJob() {

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [followup, setFollowup] = useState("");
  const [url, setUrl] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  const navigate = useNavigate();

  useEffect(() => {

    const loggedIn = localStorage.getItem("loggedIn");

    if (!loggedIn) {
      navigate("/");
    }

  }, [navigate]);

  const addJob = async () => {

    if (!company || !role || !status) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("User ID not found. Please log in again.");
        navigate("/");
        return;
      }

      await axios.post("/jobs", {
        user_id: userId,
        company,
        role,
        status,
        deadline,
        date_applied: dateApplied,
        followup,
        url
      });

      alert("Job Added Successfully");

      setCompany("");
      setRole("");
      setStatus("");
      setDeadline("");
      setDateApplied("");
      setFollowup("");
      setUrl("");

      navigate("/job-tracker");
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Error adding job. Please try again.");
      }
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const bgColor = darkMode ? "#1f2937" : "#f9fafb";
  const textColor = darkMode ? "#f3f4f6" : "#1f2937";
  const cardBg = darkMode ? "#374151" : "#ffffff";
  const borderColor = darkMode ? "#4b5563" : "#e5e7eb";

  return (
    <>
      <Navbar />

      <div
        className="app-page ui-page add-job-page"
        style={{
          background: bgColor,
          color: textColor,
          transition: "all 0.3s ease"
        }}
      >

        <div className="app-page-content add-job-content">

        <div className="page-header">
          <div>
            <h1 className="page-title add-job-title">Add New Job</h1>
            <p className="page-subtitle">Track a new job application</p>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="btn btn-ghost ghost-btn"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>

        <div className="add-job-card glass-panel" style={{ 
          maxWidth: "600px", 
          margin: "0 auto",
          background: cardBg,
          padding: "40px",
          borderRadius: "12px",
          border: `1px solid ${borderColor}`
        }}>

          <div className="add-job-field" style={{ marginBottom: "20px" }}>
            <label className="field-label">
              Company *
            </label>
            <input
              type="text"
              placeholder="Enter company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="form-control"
              style={{ borderColor, background: darkMode ? "#1f2937" : "#ffffff", color: textColor }}
            />
          </div>

          <div className="add-job-field" style={{ marginBottom: "20px" }}>
            <label className="field-label">
              Job Position *
            </label>
            <input
              type="text"
              placeholder="Enter job position/role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-control"
              style={{ borderColor, background: darkMode ? "#1f2937" : "#ffffff", color: textColor }}
            />
          </div>

          <div className="add-job-field" style={{ marginBottom: "20px" }}>
            <label className="field-label">
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-control add-job-select"
              style={{ borderColor, background: darkMode ? "#1f2937" : "#ffffff", color: textColor }}
            >
              <option value="">Select Status</option>
              <option value="Bookmarked">Bookmarked</option>
              <option value="Applying">Applying</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interviewing</option>
              <option value="Negotiating">Negotiating</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="add-job-field" style={{ marginBottom: "20px" }}>
            <label className="field-label">
              Application Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="form-control"
              style={{ borderColor, background: darkMode ? "#1f2937" : "#ffffff", color: textColor }}
            />
          </div>

          <div className="add-job-field" style={{ marginBottom: "20px" }}>
            <label className="field-label">
              Date Applied
            </label>
            <input
              type="date"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              className="form-control"
              style={{ borderColor, background: darkMode ? "#1f2937" : "#ffffff", color: textColor }}
            />
          </div>

          <div className="add-job-field" style={{ marginBottom: "30px" }}>
            <label className="field-label">
              Follow-up Date
            </label>
            <input
              type="date"
              value={followup}
              onChange={(e) => setFollowup(e.target.value)}
              className="form-control"
              style={{ borderColor, background: darkMode ? "#1f2937" : "#ffffff", color: textColor }}
            />
          </div>

          <div className="add-job-field" style={{ marginBottom: "30px" }}>
            <label className="field-label">
              Career Page URL
            </label>
            <input
              type="url"
              placeholder="https://company.com/careers"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="form-control"
              style={{ borderColor, background: darkMode ? "#1f2937" : "#ffffff", color: textColor }}
            />
          </div>

          <div className="form-row">
            <button 
              onClick={addJob}
              className="btn btn-primary gradient-btn"
              style={{ flex: 1 }}
            >
              Add Job
            </button>
            <button 
              onClick={() => navigate("/job-tracker")}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>

        </div>

        </div>

      </div>
    </>
  );
}

export default AddJob;

