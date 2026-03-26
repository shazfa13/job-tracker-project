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
      const userRole = localStorage.getItem("userRole");

      if (!userId) {
        alert("User ID not found. Please log in again.");
        navigate("/");
        return;
      }

      await axios.post("http://127.0.0.1:5000/jobs", {
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

      <div style={{
        padding: "40px",
        background: bgColor,
        color: textColor,
        minHeight: "100vh",
        transition: "all 0.3s ease"
      }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>Add New Job</h1>
            <p style={{ color: "#6b7280", margin: 0 }}>Track a new job application</p>
          </div>
          <button 
            onClick={toggleDarkMode}
            style={{
              padding: "12px 16px",
              background: darkMode ? "#fbbf24" : "#1f2937",
              color: darkMode ? "black" : "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div style={{ 
          maxWidth: "600px", 
          margin: "0 auto",
          background: cardBg,
          padding: "40px",
          borderRadius: "12px",
          border: `1px solid ${borderColor}`
        }}>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Company *
            </label>
            <input
              type="text"
              placeholder="Enter company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${borderColor}`,
                borderRadius: "8px",
                background: darkMode ? "#1f2937" : "#ffffff",
                color: textColor,
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Job Position *
            </label>
            <input
              type="text"
              placeholder="Enter job position/role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${borderColor}`,
                borderRadius: "8px",
                background: darkMode ? "#1f2937" : "#ffffff",
                color: textColor,
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${borderColor}`,
                borderRadius: "8px",
                background: darkMode ? "#1f2937" : "#ffffff",
                color: textColor,
                fontSize: "14px"
              }}
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

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Application Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${borderColor}`,
                borderRadius: "8px",
                background: darkMode ? "#1f2937" : "#ffffff",
                color: textColor,
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Date Applied
            </label>
            <input
              type="date"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${borderColor}`,
                borderRadius: "8px",
                background: darkMode ? "#1f2937" : "#ffffff",
                color: textColor,
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Follow-up Date
            </label>
            <input
              type="date"
              value={followup}
              onChange={(e) => setFollowup(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${borderColor}`,
                borderRadius: "8px",
                background: darkMode ? "#1f2937" : "#ffffff",
                color: textColor,
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
              Career Page URL
            </label>
            <input
              type="url"
              placeholder="https://company.com/careers"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${borderColor}`,
                borderRadius: "8px",
                background: darkMode ? "#1f2937" : "#ffffff",
                color: textColor,
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <button 
              onClick={addJob}
              style={{
                flex: 1,
                padding: "14px 20px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500"
              }}
            >
              Add Job
            </button>
            <button 
              onClick={() => navigate("/job-tracker")}
              style={{
                flex: 1,
                padding: "14px 20px",
                background: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500"
              }}
            >
              Cancel
            </button>
          </div>

        </div>

      </div>
    </>
  );
}

export default AddJob;

