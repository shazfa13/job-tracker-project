import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function SearchCompany() {
  const [jobs, setJobs] = useState([]);
  const [searchCompany, setSearchCompany] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const role = localStorage.getItem("userRole");
    const id = localStorage.getItem("userId");

    if (!loggedIn) {
      navigate("/");
      return;
    }

    setUserRole(role);
    setUserId(id);
    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    setIsLoading(true);
    const role = localStorage.getItem("userRole");
    const id = localStorage.getItem("userId");

    try {
      const res = await axios.get(`/jobs?user_id=${id}&role=${role}`);
      setJobs(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesCompany = job.company.toLowerCase().includes(searchCompany.toLowerCase());
    const matchesStatus = selectedStatus === "All" || job.status === selectedStatus;
    return matchesCompany && matchesStatus;
  });

  const statuses = ["All", ...new Set(jobs.map((job) => job.status).filter(Boolean))];

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const bgColor = darkMode ? "#1f2937" : "#f8fafc";
  const textColor = darkMode ? "#f3f4f6" : "#1f2937";
  const cardBg = darkMode ? "#374151" : "#ffffff";
  const borderColor = darkMode ? "#4b5563" : "#e2e8f0";
  const primaryColor = "#3b82f6";
  const secondaryColor = darkMode ? "#6b7280" : "#64748b";

  return (
    <>
      <Navbar />
      <div
        className="app-page ui-page search-page"
        style={{
          background: bgColor,
          color: textColor,
          transition: "all 0.3s ease"
        }}
      >
        
        <div className="app-page-content">
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title" style={{ color: textColor }}>
                🔍 Search Company
              </h1>
              <p className="page-subtitle" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                Find and filter your job applications by company
              </p>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="btn btn-ghost"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>

          <div className="search-shell glass-panel" style={{ background: cardBg, borderColor }}>
            <div className="search-top">
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <div className="search-input-wrap" style={{ flex: 1, minWidth: "260px" }}>
                  <span className="search-icon">⌕</span>
                  <input
                    type="text"
                    placeholder="Search by company name..."
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                    className="form-control search-main-input"
                    style={{ borderColor, background: darkMode ? "#1f2937" : "#ffffff", color: textColor }}
                  />
                </div>
                <button
                  onClick={() => setSearchCompany("")}
                  className="btn btn-secondary"
                >
                  Clear
                </button>
                <button
                  onClick={() => console.log(filteredJobs)}
                  className="btn gradient-btn"
                >
                  Search
                </button>
              </div>

              <div className="chip-row">
                {statuses.map((status) => (
                  <button
                    key={status}
                    className={`chip-btn ${selectedStatus === status ? "active" : ""}`}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 14px",
                background: darkMode ? "#1f2937" : "#f8fafc",
                borderRadius: "10px",
                border: `1px solid ${borderColor}`,
                color: darkMode ? "#94a3b8" : "#64748b",
                fontSize: "14px"
              }}>
                <div><strong>Total Jobs:</strong> {jobs.length}</div>
                <div><strong>Filtered Results:</strong> {filteredJobs.length}</div>
              </div>
            </div>

            {isLoading ? (
              <div className="search-grid">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="skeleton-card" />
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="search-grid">
                {filteredJobs.map((job, index) => (
                  <article
                    key={job.id}
                    className="result-card"
                    style={{
                      background: darkMode ? "#374151" : "#ffffff",
                      borderColor,
                      animationDelay: `${index * 0.05}s`
                    }}
                  >
                    <div className="result-logo">{(job.company || "J").slice(0, 1).toUpperCase()}</div>
                    <h3 style={{ margin: "0 0 6px", color: textColor }}>{job.company}</h3>
                    <p style={{ margin: "0 0 8px", color: darkMode ? "#cbd5e1" : "#475569", fontWeight: 600 }}>{job.role}</p>
                    <p style={{ margin: 0, color: darkMode ? "#94a3b8" : "#64748b", fontSize: "14px" }}>
                      Status: <span style={{ color: getStatusColor(job.status), fontWeight: 700 }}>{job.status}</span>
                    </p>
                    <div className="result-actions">
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowDetails(true);
                        }}
                        className="btn gradient-btn"
                      >
                        View
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>🧭</div>
                <h3 style={{ color: textColor }}>No results found</h3>
                <p>
                  {searchCompany
                    ? `No jobs found for "${searchCompany}" with current filters.`
                    : "Start typing a company name to see matching jobs."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {showDetails && selectedJob && (
        <div className="modal-overlay">
          <div style={{
            background: cardBg,
            borderRadius: "16px",
            padding: "30px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "80vh",
            overflow: "auto",
            border: `1px solid ${borderColor}`,
            boxShadow: darkMode ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.2)"
          }}>
            {/* Modal Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px"
            }}>
              <h2 style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "bold",
                color: textColor
              }}>
                📋 Job Details
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: secondaryColor,
                  padding: "5px",
                  borderRadius: "8px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "none";
                }}
              >
                ✕
              </button>
            </div>

            {/* Job Information */}
            <div style={{
              display: "grid",
              gap: "20px"
            }}>
              <div style={{
                background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                padding: "20px",
                borderRadius: "12px",
                border: `1px solid ${borderColor}`
              }}>
                <h3 style={{
                  margin: "0 0 15px 0",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: textColor,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  🏢 Company Information
                </h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  <div>
                    <strong style={{ color: secondaryColor, fontSize: "14px" }}>Company:</strong>
                    <p style={{ margin: "5px 0 0 0", color: textColor, fontSize: "16px" }}>
                      {selectedJob.company}
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: secondaryColor, fontSize: "14px" }}>Position:</strong>
                    <p style={{ margin: "5px 0 0 0", color: textColor, fontSize: "16px" }}>
                      {selectedJob.role}
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: secondaryColor, fontSize: "14px" }}>Status:</strong>
                    <div style={{ marginTop: "5px" }}>
                      <span style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background: getStatusColor(selectedJob.status),
                        color: "white"
                      }}>
                        {selectedJob.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedJob.notes && (
                <div style={{
                  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  padding: "20px",
                  borderRadius: "12px",
                  border: `1px solid ${borderColor}`
                }}>
                  <h3 style={{
                    margin: "0 0 15px 0",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: textColor,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    📝 Notes
                  </h3>
                  <p style={{
                    margin: 0,
                    color: textColor,
                    fontSize: "16px",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap"
                  }}>
                    {selectedJob.notes}
                  </p>
                </div>
              )}

              {selectedJob.career_page && (
                <div style={{
                  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  padding: "20px",
                  borderRadius: "12px",
                  border: `1px solid ${borderColor}`
                }}>
                  <h3 style={{
                    margin: "0 0 15px 0",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: textColor,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    🔗 Career Page
                  </h3>
                  <a
                    href={selectedJob.career_page}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: primaryColor,
                      textDecoration: "none",
                      fontSize: "16px",
                      fontWeight: "500",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      border: `1px solid ${primaryColor}`,
                      borderRadius: "8px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = primaryColor;
                      e.target.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.color = primaryColor;
                    }}
                  >
                    Visit Career Page →
                  </a>
                </div>
              )}

              {selectedJob.follow_up && (
                <div style={{
                  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  padding: "20px",
                  borderRadius: "12px",
                  border: `1px solid ${borderColor}`
                }}>
                  <h3 style={{
                    margin: "0 0 15px 0",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: textColor,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    ⏰ Follow-up
                  </h3>
                  <p style={{
                    margin: 0,
                    color: textColor,
                    fontSize: "16px"
                  }}>
                    {selectedJob.follow_up}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{
              display: "flex",
              gap: "15px",
              marginTop: "30px",
              paddingTop: "20px",
              borderTop: `1px solid ${borderColor}`
            }}>
              <button
                onClick={() => {
                  setShowDetails(false);
                  navigate("/job-tracker");
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Edit in Job Tracker
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="btn btn-ghost"
                style={{ flex: 1, color: textColor, borderColor }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  function getStatusColor(status) {
    const statusColors = {
      "Bookmarked": "#6b7280",
      "Applying": "#3b82f6", 
      "Applied": "#8b5cf6",
      "Interview": "#f59e0b",
      "Negotiating": "#10b981",
      "Accepted": "#059669",
      "Rejected": "#ef4444"
    };
    return statusColors[status] || "#6b7280";
  }
}

export default SearchCompany;