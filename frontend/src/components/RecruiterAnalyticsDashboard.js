import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./JobPortal.css";

function RecruiterAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`/recruiter-analytics/${userId}`);
        setAnalytics(res.data || { summary: {}, jobs: [] });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/recruiter-signup");
      return;
    }
    fetchAnalytics();
  }, [navigate, userId]);

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

  const summary = analytics?.summary || {
    totalJobs: 0,
    totalApplicants: 0,
    totalAccepted: 0,
    totalRejected: 0,
    totalPending: 0
  };

  const totalForDecisionChart =
    summary.totalAccepted + summary.totalRejected + summary.totalPending;
  const acceptedPercent = totalForDecisionChart
    ? (summary.totalAccepted / totalForDecisionChart) * 100
    : 0;
  const rejectedPercent = totalForDecisionChart
    ? (summary.totalRejected / totalForDecisionChart) * 100
    : 0;
  const pendingPercent = totalForDecisionChart
    ? (summary.totalPending / totalForDecisionChart) * 100
    : 0;
  const maxApplicantsPerJob = Math.max(
    ...(analytics?.jobs?.map((job) => job.totalApplicants || 0) || [0])
  );

  return (
    <div
      className="recruiter-dashboard"
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
            Recruiter Analytics Dashboard 📊
          </h1>
          <p style={{ color: mutedText, fontSize: "14px" }}>
            Track job-level applicant volumes and acceptance decisions.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn btn-secondary" onClick={() => navigate("/recruiter-dashboard")}>Back to Dashboard</button>
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
        <div style={{ textAlign: "center", color: mutedText }}>Loading analytics...</div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "24px"
            }}
          >
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "12px", padding: "16px" }}>
              <p style={{ color: mutedText, margin: 0, fontSize: "13px" }}>Total Job Postings</p>
              <h2 style={{ color: textColor, margin: "6px 0 0", fontSize: "28px" }}>{summary.totalJobs}</h2>
            </div>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "12px", padding: "16px" }}>
              <p style={{ color: mutedText, margin: 0, fontSize: "13px" }}>Total Applicants</p>
              <h2 style={{ color: textColor, margin: "6px 0 0", fontSize: "28px" }}>{summary.totalApplicants}</h2>
            </div>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "12px", padding: "16px" }}>
              <p style={{ color: mutedText, margin: 0, fontSize: "13px" }}>Accepted</p>
              <h2 style={{ color: "#15803d", margin: "6px 0 0", fontSize: "28px" }}>{summary.totalAccepted}</h2>
            </div>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "12px", padding: "16px" }}>
              <p style={{ color: mutedText, margin: 0, fontSize: "13px" }}>Rejected</p>
              <h2 style={{ color: "#b91c1c", margin: "6px 0 0", fontSize: "28px" }}>{summary.totalRejected}</h2>
            </div>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "12px", padding: "16px" }}>
              <p style={{ color: mutedText, margin: 0, fontSize: "13px" }}>Pending</p>
              <h2 style={{ color: "#b45309", margin: "6px 0 0", fontSize: "28px" }}>{summary.totalPending}</h2>
            </div>
          </div>

          <div
            style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px"
            }}
          >
            <h3 style={{ color: textColor, marginTop: 0, marginBottom: "14px" }}>Decision Overview</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(220px, 280px) 1fr",
                gap: "20px",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    background: `conic-gradient(#16a34a 0% ${acceptedPercent}%, #dc2626 ${acceptedPercent}% ${acceptedPercent + rejectedPercent}%, #d97706 ${acceptedPercent + rejectedPercent}% 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "inset 0 0 0 18px rgba(255,255,255,0.65)"
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: textColor, margin: 0, fontSize: "13px", fontWeight: 600 }}>Applications</p>
                    <h3 style={{ color: textColor, margin: "6px 0 0", fontSize: "26px" }}>{totalForDecisionChart}</h3>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: textColor, fontSize: "14px", fontWeight: 600 }}>Accepted</span>
                  <span style={{ color: "#15803d", fontSize: "14px", fontWeight: 700 }}>{summary.totalAccepted} ({acceptedPercent.toFixed(0)}%)</span>
                </div>
                <div style={{ height: "8px", borderRadius: "999px", background: darkMode ? "#334155" : "#e5e7eb" }}>
                  <div style={{ width: `${acceptedPercent}%`, height: "100%", borderRadius: "999px", background: "#16a34a" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: textColor, fontSize: "14px", fontWeight: 600 }}>Rejected</span>
                  <span style={{ color: "#b91c1c", fontSize: "14px", fontWeight: 700 }}>{summary.totalRejected} ({rejectedPercent.toFixed(0)}%)</span>
                </div>
                <div style={{ height: "8px", borderRadius: "999px", background: darkMode ? "#334155" : "#e5e7eb" }}>
                  <div style={{ width: `${rejectedPercent}%`, height: "100%", borderRadius: "999px", background: "#dc2626" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: textColor, fontSize: "14px", fontWeight: 600 }}>Pending</span>
                  <span style={{ color: "#b45309", fontSize: "14px", fontWeight: 700 }}>{summary.totalPending} ({pendingPercent.toFixed(0)}%)</span>
                </div>
                <div style={{ height: "8px", borderRadius: "999px", background: darkMode ? "#334155" : "#e5e7eb" }}>
                  <div style={{ width: `${pendingPercent}%`, height: "100%", borderRadius: "999px", background: "#d97706" }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: "12px", padding: "20px" }}>
            <h3 style={{ color: textColor, marginTop: 0 }}>Applications by Job Posting</h3>

            {analytics?.jobs?.length ? (
              <div style={{ display: "grid", gap: "12px" }}>
                {analytics.jobs.map((job) => (
                  <div
                    key={job.job_id}
                    style={{
                      background: pageBg,
                      border: `1px solid ${borderColor}`,
                      borderRadius: "10px",
                      padding: "14px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                      <div>
                        <h4 style={{ color: textColor, margin: 0 }}>{job.position}</h4>
                        <p style={{ color: mutedText, margin: "6px 0 0", fontSize: "13px" }}>{job.company}</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ background: "#dbeafe", color: "#1d4ed8", borderRadius: "999px", padding: "4px 10px", fontSize: "12px", fontWeight: 600 }}>
                          Applicants: {job.totalApplicants}
                        </span>
                        <span style={{ background: "#dcfce7", color: "#166534", borderRadius: "999px", padding: "4px 10px", fontSize: "12px", fontWeight: 600 }}>
                          Accepted: {job.accepted}
                        </span>
                        <span style={{ background: "#fee2e2", color: "#991b1b", borderRadius: "999px", padding: "4px 10px", fontSize: "12px", fontWeight: 600 }}>
                          Rejected: {job.rejected}
                        </span>
                        <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: "999px", padding: "4px 10px", fontSize: "12px", fontWeight: 600 }}>
                          Pending: {job.pending}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: mutedText, fontSize: "12px" }}>Applicant Volume</span>
                        <span style={{ color: textColor, fontSize: "12px", fontWeight: 600 }}>
                          {job.totalApplicants} / {maxApplicantsPerJob || 0}
                        </span>
                      </div>
                      <div style={{ height: "8px", borderRadius: "999px", background: darkMode ? "#334155" : "#e5e7eb" }}>
                        <div
                          style={{
                            width: `${maxApplicantsPerJob ? (job.totalApplicants / maxApplicantsPerJob) * 100 : 0}%`,
                            height: "100%",
                            borderRadius: "999px",
                            background: "#2563eb"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: mutedText, padding: "20px" }}>
                No jobs posted yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default RecruiterAnalyticsDashboard;
