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
    const role = localStorage.getItem("userRole");
    const id = localStorage.getItem("userId");

    const res = await axios.get(`http://127.0.0.1:5000/jobs?user_id=${id}&role=${role}`);
    setJobs(res.data);
  };

  const filteredJobs = jobs.filter((job) => {
    return job.company.toLowerCase().includes(searchCompany.toLowerCase());
  });

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

  return (
    <>
      <Navbar />
      <div style={{
        background: bgColor,
        color: textColor,
        minHeight: "100vh",
        padding: "40px 20px",
        transition: "all 0.3s ease"
      }}>
        
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px"
          }}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: "bold",
                color: textColor
              }}>
                🔍 Search Company
              </h1>
              <p style={{
                margin: "8px 0 0 0",
                color: darkMode ? "#94a3b8" : "#64748b",
                fontSize: "16px"
              }}>
                Find and filter your job applications by company
              </p>
            </div>
            
            <button
              onClick={toggleDarkMode}
              style={{
                padding: "10px 15px",
                background: darkMode ? "#fbbf24" : "#1f2937",
                color: darkMode ? "black" : "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Search Section */}
          <div style={{
            background: cardBg,
            padding: "30px",
            borderRadius: "16px",
            border: `1px solid ${borderColor}`,
            marginBottom: "30px",
            boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: textColor
                }}>
                  Search by Company Name:
                </label>
                <div style={{
                  display: "flex",
                  gap: "10px"
                }}>
                  <input
                    type="text"
                    placeholder="Enter company name..."
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      border: `1px solid ${borderColor}`,
                      borderRadius: "8px",
                      background: darkMode ? "#1f2937" : "#ffffff",
                      color: textColor,
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.2s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = primaryColor;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = borderColor;
                    }}
                  />
                  <button
                    onClick={() => setSearchCompany("")}
                    style={{
                      padding: "12px 20px",
                      background: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#4b5563";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#6b7280";
                    }}
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => console.log(filteredJobs)}
                    style={{
                      padding: "12px 20px",
                      background: primaryColor,
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#2563eb";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = primaryColor;
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px",
              background: darkMode ? "#1f2937" : "#f8fafc",
              borderRadius: "8px",
              border: `1px solid ${borderColor}`
            }}>
              <div style={{
                fontSize: "14px",
                color: darkMode ? "#94a3b8" : "#64748b"
              }}>
                <strong>Total Jobs:</strong> {jobs.length}
              </div>
              <div style={{
                fontSize: "14px",
                color: darkMode ? "#94a3b8" : "#64748b"
              }}>
                <strong>Filtered Results:</strong> {filteredJobs.length}
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div style={{
            background: cardBg,
            borderRadius: "16px",
            border: `1px solid ${borderColor}`,
            overflow: "hidden",
            boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            {filteredJobs.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px"
                }}>
                  <thead>
                    <tr style={{
                      background: darkMode ? "#1f2937" : "#f8fafc"
                    }}>
                      <th style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: `2px solid ${borderColor}`,
                        color: textColor
                      }}>
                        Company
                      </th>
                      <th style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: `2px solid ${borderColor}`,
                        color: textColor
                      }}>
                        Position
                      </th>
                      <th style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: `2px solid ${borderColor}`,
                        color: textColor
                      }}>
                        Status
                      </th>
                      <th style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: `2px solid ${borderColor}`,
                        color: textColor
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job, index) => (
                      <tr key={job.id} style={{
                        borderBottom: `1px solid ${borderColor}`,
                        transition: "all 0.2s ease"
                      }}>
                        <td style={{
                          padding: "16px",
                          fontWeight: "500"
                        }}>
                          {job.company}
                        </td>
                        <td style={{
                          padding: "16px",
                          color: darkMode ? "#94a3b8" : "#64748b"
                        }}>
                          {job.role}
                        </td>
                        <td style={{
                          padding: "16px"
                        }}>
                          <span style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "500",
                            background: getStatusColor(job.status),
                            color: "white"
                          }}>
                            {job.status}
                          </span>
                        </td>
                        <td style={{
                          padding: "16px"
                        }}>
                          <button
                            onClick={() => navigate(`/job-tracker`)}
                            style={{
                              padding: "8px 16px",
                              background: primaryColor,
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "500",
                              transition: "all 0.2s ease"
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = "#2563eb";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = primaryColor;
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                padding: "60px 20px",
                textAlign: "center",
                color: darkMode ? "#94a3b8" : "#64748b"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔍</div>
                <h3 style={{ margin: "0 0 10px 0", color: textColor }}>
                  No jobs found
                </h3>
                <p style={{ margin: 0, fontSize: "16px" }}>
                  {searchCompany 
                    ? `No jobs found for "${searchCompany}"`
                    : "Enter a company name to search for jobs"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
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