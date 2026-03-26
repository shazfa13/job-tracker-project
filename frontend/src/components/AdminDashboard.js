import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const role = localStorage.getItem("userRole");

    if (!loggedIn || role !== "admin") {
      navigate("/");
      return;
    }

    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    try {
      const [jobsRes, clientsRes] = await Promise.all([
        axios.get("http://127.0.0.1:5000/admin/jobs?role=admin"),
        axios.get("http://127.0.0.1:5000/admin/clients?role=admin")
      ]);
      setJobs(jobsRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteClient = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client and all their jobs?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/admin/clients/${clientId}`);
        alert("Client deleted successfully");
        fetchAllData();
      } catch (error) {
        alert("Error deleting client");
      }
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/admin/jobs/${jobId}`);
      alert("Job deleted successfully");
      fetchAllData();
    } catch (error) {
      alert("Error deleting job");
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  // Analytics calculations
  const applied = jobs.filter(j => j.status === "Applied").length;
  const interview = jobs.filter(j => j.status === "Interview").length;
  const offer = jobs.filter(j => j.status === "Offer").length;
  const rejected = jobs.filter(j => j.status === "Rejected").length;

  const chartData = {
    labels: ["Applied", "Interview", "Offer", "Rejected"],
    datasets: [
      {
        data: [applied, interview, offer, rejected],
        backgroundColor: [
          "#3b82f6",
          "#f59e0b",
          "#10b981",
          "#ef4444"
        ]
      }
    ]
  };

  const clientJobs = selectedClient ? jobs.filter(j => j.user_id === selectedClient.id) : [];

  const bgColor = darkMode ? "#1f2937" : "#f8fafc";
  const textColor = darkMode ? "#f3f4f6" : "#1f2937";
  const cardBg = darkMode ? "#374151" : "#ffffff";
  const borderColor = darkMode ? "#4b5563" : "#e2e8f0";
  const primaryColor = "#3b82f6";

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "#3b82f6";
      case "Interview":
        return "#f59e0b";
      case "Offer":
        return "#10b981";
      case "Rejected":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

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
          maxWidth: "1400px",
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
                📊 Admin Dashboard
              </h1>
              <p style={{
                margin: "8px 0 0 0",
                color: darkMode ? "#94a3b8" : "#64748b",
                fontSize: "16px"
              }}>
                Full analytics and client management
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

          {/* Stats Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "40px"
          }}>
            <div style={{
              background: cardBg,
              padding: "25px",
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{
                fontSize: "14px",
                color: darkMode ? "#94a3b8" : "#64748b",
                marginBottom: "8px"
              }}>
                Total Clients
              </div>
              <div style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: primaryColor
              }}>
                {clients.length}
              </div>
            </div>

            <div style={{
              background: cardBg,
              padding: "25px",
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{
                fontSize: "14px",
                color: darkMode ? "#94a3b8" : "#64748b",
                marginBottom: "8px"
              }}>
                Total Jobs
              </div>
              <div style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: primaryColor
              }}>
                {jobs.length}
              </div>
            </div>

            <div style={{
              background: cardBg,
              padding: "25px",
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{
                fontSize: "14px",
                color: darkMode ? "#94a3b8" : "#64748b",
                marginBottom: "8px"
              }}>
                Applied
              </div>
              <div style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#8b5cf6"
              }}>
                {applied}
              </div>
            </div>

            <div style={{
              background: cardBg,
              padding: "25px",
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{
                fontSize: "14px",
                color: darkMode ? "#94a3b8" : "#64748b",
                marginBottom: "8px"
              }}>
                Interviews
              </div>
              <div style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#f59e0b"
              }}>
                {interview}
              </div>
            </div>

            <div style={{
              background: cardBg,
              padding: "25px",
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{
                fontSize: "14px",
                color: darkMode ? "#94a3b8" : "#64748b",
                marginBottom: "8px"
              }}>
                Offers
              </div>
              <div style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#10b981"
              }}>
                {offer}
              </div>
            </div>

            <div style={{
              background: cardBg,
              padding: "25px",
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{
                fontSize: "14px",
                color: darkMode ? "#94a3b8" : "#64748b",
                marginBottom: "8px"
              }}>
                Rejected
              </div>
              <div style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#ef4444"
              }}>
                {rejected}
              </div>
            </div>
          </div>

          {/* Chart and Table Section */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "30px",
            marginBottom: "40px"
          }}>
            <div style={{
              background: cardBg,
              padding: "30px",
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{
                margin: "0 0 20px 0",
                color: textColor,
                fontSize: "20px",
                fontWeight: "600"
              }}>
                📈 Application Status Distribution
              </h2>
              <div style={{ height: "300px", display: "flex", justifyContent: "center" }}>
                <Pie data={chartData} />
              </div>
            </div>

            <div style={{
              background: cardBg,
              padding: "30px",
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{
                margin: "0 0 20px 0",
                color: textColor,
                fontSize: "20px",
                fontWeight: "600"
              }}>
                👥 Manage Clients
              </h2>
              <div style={{ overflowX: "auto", maxHeight: "400px" }}>
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
                        Client ID
                      </th>
                      <th style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: `2px solid ${borderColor}`,
                        color: textColor
                      }}>
                        Username
                      </th>
                      <th style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: `2px solid ${borderColor}`,
                        color: textColor
                      }}>
                        Total Jobs
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
                    {clients.map((client) => {
                      const clientJobCount = jobs.filter(j => j.user_id === client.id).length;
                      return (
                        <tr key={client.id} style={{
                          borderBottom: `1px solid ${borderColor}`,
                          transition: "all 0.2s ease"
                        }}>
                          <td style={{
                            padding: "16px",
                            fontWeight: "500"
                          }}>
                            {client.id.slice(-8)}
                          </td>
                          <td style={{
                            padding: "16px",
                            color: darkMode ? "#94a3b8" : "#64748b"
                          }}>
                            {client.username}
                          </td>
                          <td style={{
                            padding: "16px"
                          }}>
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "500",
                              background: primaryColor,
                              color: "white"
                            }}>
                              {clientJobCount}
                            </span>
                          </td>
                          <td style={{
                            padding: "16px"
                          }}>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                onClick={() => setSelectedClient(client)}
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
                                👁 View Jobs
                              </button>
                              <button
                                onClick={() => deleteClient(client.id)}
                                style={{
                                  padding: "8px 16px",
                                  background: "#ef4444",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  transition: "all 0.2s ease"
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.background = "#dc2626";
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.background = "#ef4444";
                                }}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Selected Client Jobs */}
          {selectedClient && (
            <div style={{
              background: cardBg,
              padding: "30px",
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px"
              }}>
                <h2 style={{
                  margin: 0,
                  color: textColor,
                  fontSize: "20px",
                  fontWeight: "600"
                }}>
                  📋 Jobs for {selectedClient.username}
                </h2>
                <button
                  onClick={() => setSelectedClient(null)}
                  style={{
                    padding: "10px 20px",
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
                  ✖ Clear Selection
                </button>
              </div>

              <div style={{ overflowX: "auto", maxHeight: "400px" }}>
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
                    {clientJobs.length > 0 ? (
                      clientJobs.map((job) => (
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
                              onClick={() => deleteJob(job.id)}
                              style={{
                                padding: "8px 16px",
                                background: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "500",
                                transition: "all 0.2s ease"
                              }}
                              onMouseOver={(e) => {
                                e.target.style.background = "#dc2626";
                              }}
                              onMouseOut={(e) => {
                                e.target.style.background = "#ef4444";
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{
                          padding: "40px 20px",
                          textAlign: "center",
                          color: darkMode ? "#94a3b8" : "#64748b"
                        }}>
                          <div style={{ fontSize: "24px", marginBottom: "10px" }}>📭</div>
                          <p style={{ margin: 0, fontSize: "16px" }}>
                            No jobs found for this client
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;