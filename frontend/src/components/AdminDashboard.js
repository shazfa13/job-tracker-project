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
  const [clientQuery, setClientQuery] = useState("");
  const [jobQuery, setJobQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
    setIsRefreshing(true);
    try {
      const [jobsRes, clientsRes] = await Promise.all([
        axios.get("http://127.0.0.1:5000/admin/jobs?role=admin"),
        axios.get("http://127.0.0.1:5000/admin/clients?role=admin")
      ]);
      setJobs(jobsRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const deleteClient = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client and all their jobs?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/admin/clients/${clientId}?role=admin`);
        alert("Client deleted successfully");
        fetchAllData();
      } catch (error) {
        alert("Error deleting client");
      }
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/admin/jobs/${jobId}?role=admin`);
      alert("Job deleted successfully");
      fetchAllData();
    } catch (error) {
      alert("Error deleting job");
    }
  };

  const bulkDeleteJobs = async () => {
    if (selectedJobIds.length === 0) {
      alert("No jobs selected.");
      return;
    }

    if (!window.confirm(`Delete ${selectedJobIds.length} selected jobs?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedJobIds.map((id) => axios.delete(`http://127.0.0.1:5000/admin/jobs/${id}?role=admin`))
      );
      alert("Selected jobs deleted successfully");
      setSelectedJobIds([]);
      fetchAllData();
    } catch (error) {
      alert("Error deleting selected jobs");
    }
  };

  const exportCsv = (rows, filename) => {
    if (!rows.length) {
      alert("No data to export");
      return;
    }
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  // Analytics calculations
  const applied = jobs.filter(j => j.status === "Applied").length;
  const interview = jobs.filter(j => j.status === "Interview").length;
  const offer = jobs.filter(j => ["Offer", "Accepted"].includes(j.status)).length;
  const rejected = jobs.filter(j => j.status === "Rejected").length;
  const pending = jobs.filter(j => ["Bookmarked", "Applying", "Negotiating"].includes(j.status)).length;

  const parseDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const now = new Date();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  const upcomingDeadlines = jobs.filter((job) => {
    const deadlineDate = parseDate(job.deadline);
    if (!deadlineDate) return false;
    const diff = deadlineDate.getTime() - now.getTime();
    return diff >= 0 && diff <= oneWeekMs;
  }).length;

  const overdueFollowups = jobs.filter((job) => {
    const followupDate = parseDate(job.followup);
    if (!followupDate) return false;
    return followupDate.getTime() < now.getTime() && !["Rejected", "Offer", "Accepted"].includes(job.status);
  }).length;

  const activeClients = clients.filter((client) => jobs.some((j) => j.user_id === client.id)).length;

  const chartData = {
    labels: ["Applied", "Interview", "Offer", "Rejected", "Pending"],
    datasets: [
      {
        data: [applied, interview, offer, rejected, pending],
        backgroundColor: [
          "#3b82f6",
          "#f59e0b",
          "#10b981",
          "#ef4444",
          "#8b5cf6"
        ]
      }
    ]
  };

  const clientJobs = selectedClient ? jobs.filter(j => j.user_id === selectedClient.id) : [];
  const filteredClients = clients.filter((client) => {
    const query = clientQuery.toLowerCase().trim();
    if (!query) return true;
    return client.username.toLowerCase().includes(query) || client.id.toLowerCase().includes(query);
  });

  const filteredClientJobs = clientJobs.filter((job) => {
    const query = jobQuery.toLowerCase().trim();
    const matchesQuery = !query ||
      job.company.toLowerCase().includes(query) ||
      job.role.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const availableStatuses = ["All", ...Array.from(new Set(clientJobs.map((job) => job.status).filter(Boolean)))] ;

  useEffect(() => {
    setSelectedJobIds([]);
  }, [selectedClient, jobQuery, statusFilter]);

  const toggleSelectJob = (jobId) => {
    setSelectedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const toggleSelectAllFiltered = () => {
    const ids = filteredClientJobs.map((job) => job.id);
    const allSelected = ids.length > 0 && ids.every((id) => selectedJobIds.includes(id));
    setSelectedJobIds(allSelected ? [] : ids);
  };

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
      case "Accepted":
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
      <div
        className={`app-page ui-page admin-dashboard-page ${darkMode ? "admin-dark" : "admin-light"}`}
        style={{
          background: bgColor,
          color: textColor,
          transition: "all 0.3s ease"
        }}
      >
        
        <div className="app-page-content admin-dashboard-content">
          
          {/* Header */}
          <div className="admin-header glass-panel" style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px"
          }}>
            <div>
              <h1 className="admin-title" style={{
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
                Platform insights, client operations, and governance controls
              </p>
            </div>

            <div className="admin-header-actions">
              <button className="btn btn-secondary" onClick={fetchAllData}>
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
              <button
                className="btn gradient-btn"
                onClick={() => exportCsv(
                  filteredClients.map((client) => ({
                    clientId: client.id,
                    username: client.username,
                    totalJobs: jobs.filter((j) => j.user_id === client.id).length
                  })),
                  "admin-clients.csv"
                )}
              >
                Export Clients CSV
              </button>
              <button
                onClick={toggleDarkMode}
                className="btn ghost-btn"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="admin-metrics-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "28px"
          }}>
            <div className="admin-metric-card" style={{
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

            <div className="admin-metric-card" style={{
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

            <div className="admin-metric-card" style={{
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

            <div className="admin-metric-card" style={{
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

            <div className="admin-metric-card" style={{
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

            <div className="admin-metric-card" style={{
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

            <div className="admin-metric-card" style={{ background: cardBg, padding: "25px", borderRadius: "16px", border: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: "14px", color: darkMode ? "#94a3b8" : "#64748b", marginBottom: "8px" }}>
                Active Clients
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#2563eb" }}>
                {activeClients}
              </div>
            </div>

            <div className="admin-metric-card" style={{ background: cardBg, padding: "25px", borderRadius: "16px", border: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: "14px", color: darkMode ? "#94a3b8" : "#64748b", marginBottom: "8px" }}>
                Overdue Follow-ups
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#f97316" }}>
                {overdueFollowups}
              </div>
            </div>

            <div className="admin-metric-card" style={{ background: cardBg, padding: "25px", borderRadius: "16px", border: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: "14px", color: darkMode ? "#94a3b8" : "#64748b", marginBottom: "8px" }}>
                Upcoming Deadlines (7d)
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#7c3aed" }}>
                {upcomingDeadlines}
              </div>
            </div>
          </div>

          {/* Chart and Table Section */}
          <div className="admin-main-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "30px",
            marginBottom: "28px"
          }}>
            <div className="admin-panel" style={{
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

              <div className="admin-insights" style={{ marginTop: "18px", display: "grid", gap: "10px" }}>
                <div className="admin-insight-row" style={{ color: darkMode ? "#cbd5e1" : "#334155" }}>
                  Pending pipeline items: <strong>{pending}</strong>
                </div>
                <div className="admin-insight-row" style={{ color: darkMode ? "#cbd5e1" : "#334155" }}>
                  Most common stage: <strong>{["Applied", "Interview", "Offer", "Rejected", "Pending"][[applied, interview, offer, rejected, pending].indexOf(Math.max(applied, interview, offer, rejected, pending))]}</strong>
                </div>
              </div>
            </div>

            <div className="admin-panel" style={{
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
              <div style={{ marginBottom: "14px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by username or client ID..."
                  value={clientQuery}
                  onChange={(e) => setClientQuery(e.target.value)}
                  style={{ maxWidth: "360px", background: darkMode ? "#1f2937" : "#ffffff", borderColor, color: textColor }}
                />
                <span style={{ color: darkMode ? "#94a3b8" : "#64748b", alignSelf: "center", fontSize: "14px" }}>
                  {filteredClients.length} client(s)
                </span>
              </div>
              <div style={{ overflowX: "auto", maxHeight: "400px" }}>
                <table className="admin-table" style={{
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
                    {filteredClients.map((client) => {
                      const clientJobCount = jobs.filter(j => j.user_id === client.id).length;
                      return (
                        <tr key={client.id} className="admin-table-row" style={{
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
                                className="btn gradient-btn"
                                style={{ padding: "8px 14px", minHeight: "34px" }}
                              >
                                👁 View Jobs
                              </button>
                              <button
                                onClick={() => deleteClient(client.id)}
                                className="btn btn-danger"
                                style={{ padding: "8px 14px", minHeight: "34px" }}
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
            <div className="admin-panel" style={{
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
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button className="btn btn-secondary" onClick={() => exportCsv(
                    filteredClientJobs.map((job) => ({
                      id: job.id,
                      company: job.company,
                      role: job.role,
                      status: job.status,
                      deadline: job.deadline || "",
                      dateApplied: job.date_applied || "",
                      followup: job.followup || ""
                    })),
                    `${selectedClient.username}-jobs.csv`
                  )}>
                    Export Jobs CSV
                  </button>
                  <button className="btn btn-danger" onClick={bulkDeleteJobs}>
                    Delete Selected ({selectedJobIds.length})
                  </button>
                  <button className="btn btn-secondary" onClick={() => setSelectedClient(null)}>
                    Clear Selection
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "14px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search company or role..."
                  value={jobQuery}
                  onChange={(e) => setJobQuery(e.target.value)}
                  style={{ maxWidth: "320px", background: darkMode ? "#1f2937" : "#ffffff", borderColor, color: textColor }}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="tracker-select"
                  style={{ background: darkMode ? "#1f2937" : "#ffffff", color: textColor, borderColor }}
                >
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button className="btn btn-ghost" onClick={toggleSelectAllFiltered}>
                  {filteredClientJobs.length > 0 && filteredClientJobs.every((job) => selectedJobIds.includes(job.id)) ? "Unselect All" : "Select All"}
                </button>
                <span style={{ alignSelf: "center", color: darkMode ? "#94a3b8" : "#64748b", fontSize: "14px" }}>
                  {filteredClientJobs.length} job(s)
                </span>
              </div>

              <div style={{ overflowX: "auto", maxHeight: "400px" }}>
                <table className="admin-table" style={{
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
                        <input
                          type="checkbox"
                          checked={filteredClientJobs.length > 0 && filteredClientJobs.every((job) => selectedJobIds.includes(job.id))}
                          onChange={toggleSelectAllFiltered}
                        />
                      </th>
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
                    {filteredClientJobs.length > 0 ? (
                      filteredClientJobs.map((job) => (
                        <tr key={job.id} className="admin-table-row" style={{
                          borderBottom: `1px solid ${borderColor}`,
                          transition: "all 0.2s ease"
                        }}>
                          <td style={{ padding: "16px" }}>
                            <input
                              type="checkbox"
                              checked={selectedJobIds.includes(job.id)}
                              onChange={() => toggleSelectJob(job.id)}
                            />
                          </td>
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
                              className="btn btn-danger"
                              style={{ minHeight: "34px", padding: "8px 14px" }}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{
                          padding: "40px 20px",
                          textAlign: "center",
                          color: darkMode ? "#94a3b8" : "#64748b"
                        }}>
                          <div style={{ fontSize: "24px", marginBottom: "10px" }}>📭</div>
                          <p style={{ margin: 0, fontSize: "16px" }}>
                            No jobs found for this client and filters
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