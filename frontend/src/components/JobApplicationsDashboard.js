import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./JobPortal.css";

function JobApplicationsDashboard() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/job-seeker-signup");
      return;
    }
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/job-applications/${userId}`
      );
      setApplications(res.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawApplication = async (applicationId) => {
    const shouldWithdraw = window.confirm(
      "Do you want to withdraw this job application?"
    );

    if (!shouldWithdraw) {
      return;
    }

    setWithdrawingId(applicationId);
    try {
      await axios.delete(`http://127.0.0.1:5000/job-applications/${applicationId}`, {
        params: { user_id: userId }
      });
      setApplications((prev) => prev.filter((app) => app._id !== applicationId));
      alert("Application withdrawn successfully.");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to withdraw application");
    } finally {
      setWithdrawingId(null);
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
  const mutedText = darkMode ? "#9ca3af" : "#6b7280";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return { bg: "#dcfce7", text: "#15803d" };
      case "rejected":
        return { bg: "#fee2e2", text: "#991b1b" };
      case "pending":
        return { bg: "#fef3c7", text: "#b45309" };
      default:
        return { bg: "#e0e7ff", text: "#3730a3" };
    }
  };

  return (
    <div
      className="applications-dashboard"
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
            My Applications 📧
          </h1>
          <p style={{ color: mutedText, fontSize: "14px" }}>
            Track your job applications and their status
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/job-listings")}
          >
            Browse Jobs
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/resume-upload")}
          >
            My Resume
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

      {isLoading ? (
        <div style={{ textAlign: "center", color: mutedText }}>
          Loading applications...
        </div>
      ) : (
        <>
          <div
            style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "32px"
            }}
          >
            <h3 style={{ color: textColor, marginBottom: "12px", fontSize: "20px" }}>
              Total Applications: {applications.length}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px"
              }}
            >
              <div
                style={{
                  background: pageBg,
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center"
                }}
              >
                <div
                  style={{ fontSize: "32px", marginBottom: "8px" }}
                >
                  📨
                </div>
                <p style={{ color: mutedText, fontSize: "14px" }}>Total Sent</p>
                <p style={{ color: textColor, fontSize: "24px", fontWeight: "600" }}>
                  {applications.length}
                </p>
              </div>
              <div
                style={{
                  background: pageBg,
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center"
                }}
              >
                <div
                  style={{ fontSize: "32px", marginBottom: "8px" }}
                >
                  ⏳
                </div>
                <p style={{ color: mutedText, fontSize: "14px" }}>Pending</p>
                <p style={{ color: textColor, fontSize: "24px", fontWeight: "600" }}>
                  {applications.filter((a) => a.status?.toLowerCase() === "pending").length}
                </p>
              </div>
              <div
                style={{
                  background: pageBg,
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center"
                }}
              >
                <div
                  style={{ fontSize: "32px", marginBottom: "8px" }}
                >
                  ✅
                </div>
                <p style={{ color: mutedText, fontSize: "14px" }}>Accepted</p>
                <p style={{ color: textColor, fontSize: "24px", fontWeight: "600" }}>
                  {applications.filter((a) => a.status?.toLowerCase() === "accepted").length}
                </p>
              </div>
              <div
                style={{
                  background: pageBg,
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center"
                }}
              >
                <div
                  style={{ fontSize: "32px", marginBottom: "8px" }}
                >
                  ❌
                </div>
                <p style={{ color: mutedText, fontSize: "14px" }}>Rejected</p>
                <p style={{ color: textColor, fontSize: "24px", fontWeight: "600" }}>
                  {applications.filter((a) => a.status?.toLowerCase() === "rejected").length}
                </p>
              </div>
            </div>
          </div>

          {applications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 32px",
                background: cardBg,
                borderRadius: "12px",
                border: `1px solid ${borderColor}`
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
              <h3 style={{ color: textColor, marginBottom: "8px" }}>No Applications Yet</h3>
              <p style={{ color: mutedText, marginBottom: "24px" }}>
                Start browsing and applying to jobs to see them here
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/job-listings")}
              >
                Browse Job Listings
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "16px"
              }}
            >
              {applications.map((app) => {
                const statusColor = getStatusColor(app.status);
                return (
                  <div
                    key={app._id}
                    style={{
                      background: cardBg,
                      border: `1px solid ${borderColor}`,
                      borderRadius: "12px",
                      padding: "16px",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0, 0, 0, 0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{ marginBottom: "12px" }}>
                      <h4 style={{ color: textColor, marginBottom: "4px" }}>
                        {app.job_title}
                      </h4>
                      <p style={{ color: mutedText, fontSize: "14px" }}>
                        {app.company_name}
                      </p>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          background: statusColor.bg,
                          color: statusColor.text,
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}
                      >
                        {app.status || "Pending"}
                      </span>
                    </div>

                    <div style={{ fontSize: "12px", color: mutedText }}>
                      <p>
                        Applied:{" "}
                        {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div style={{ marginTop: "12px" }}>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleWithdrawApplication(app._id)}
                        disabled={withdrawingId === app._id}
                        style={{
                          width: "100%",
                          opacity: withdrawingId === app._id ? 0.6 : 1
                        }}
                      >
                        {withdrawingId === app._id
                          ? "Withdrawing..."
                          : "Withdraw Application"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default JobApplicationsDashboard;
