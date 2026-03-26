import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [editingJob, setEditingJob] = useState(null);
  const [notesJobId, setNotesJobId] = useState(null);
  const [notes, setNotes] = useState("");
  const [editForm, setEditForm] = useState({
    company: "",
    role: "",
    status: "",
    deadline: "",
    date_applied: "",
    followup: "",
    url: "",
    notes: ""
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

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    await axios.delete(`http://127.0.0.1:5000/jobs/${id}?user_id=${userId}&role=${userRole}`);
    fetchJobs();
  };

  const startEdit = (job) => {
    setEditingJob(job.id);
    setEditForm({
      company: job.company,
      role: job.role,
      status: job.status,
      deadline: job.deadline || "",
      date_applied: job.date_applied || "",
      followup: job.followup || "",
      url: job.url || "",
      notes: job.notes || ""
    });
  };

  const updateJob = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/jobs/${editingJob}`, {
        user_id: userId,
        user_role: userRole,
        company: editForm.company,
        job_role: editForm.role,
        status: editForm.status,
        deadline: editForm.deadline,
        date_applied: editForm.date_applied,
        followup: editForm.followup,
        url: editForm.url,
        notes: editForm.notes
      });
      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      alert("Error updating job");
    }
  };

  const cancelEdit = () => {
    setEditingJob(null);
    setEditForm({
      company: "",
      role: "",
      status: "",
      deadline: "",
      date_applied: "",
      followup: "",
      url: "",
      notes: ""
    });
  };

  const openNotes = async (job) => {
    setNotesJobId(job.id);
    setNotes(job.notes || "");
  };

  const saveNotes = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/jobs/${notesJobId}`, {
        user_id: userId,
        user_role: userRole,
        company: jobs.find(j => j.id === notesJobId)?.company,
        job_role: jobs.find(j => j.id === notesJobId)?.role,
        status: jobs.find(j => j.id === notesJobId)?.status,
        notes
      });
      alert("Notes saved successfully");
      setNotesJobId(null);
      setNotes("");
      fetchJobs();
    } catch (error) {
      alert("Error saving notes");
    }
  };

  const toggleJobSelection = (jobId) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const bgColor = darkMode ? "#1f2937" : "#ffffff";
  const textColor = darkMode ? "#f3f4f6" : "#1f2937";
  const cardBg = darkMode ? "#374151" : "#ffffff";
  const borderColor = darkMode ? "#4b5563" : "#e5e7eb";
  const headerBg = darkMode ? "#374151" : "#f9fafb";
  const primaryColor = "#3b82f6";

  // Stage counts
  const stages = [
    { name: "Bookmarked", count: jobs.filter(j => j.status === "Bookmarked").length, color: "#6b7280" },
    { name: "Applying", count: jobs.filter(j => j.status === "Applying").length, color: "#3b82f6" },
    { name: "Applied", count: jobs.filter(j => j.status === "Applied").length, color: "#8b5cf6" },
    { name: "Interviewing", count: jobs.filter(j => j.status === "Interview").length, color: "#f59e0b" },
    { name: "Negotiating", count: jobs.filter(j => j.status === "Negotiating").length, color: "#10b981" },
    { name: "Accepted", count: jobs.filter(j => j.status === "Accepted").length, color: "#059669" }
  ];

  const filteredJobs = jobs.filter(job => 
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div style={{ 
        background: bgColor,
        color: textColor,
        minHeight: "100vh",
        transition: "all 0.3s ease"
      }}>
        {/* Navigation Tabs */}
        <div style={{ 
          background: headerBg,
          borderBottom: `1px solid ${borderColor}`,
          padding: "0 40px"
        }}>
          <div style={{ display: "flex", alignItems: "center", height: "60px" }}>
            <div style={{ display: "flex", gap: "30px" }}>
              <button 
                style={{ 
                  background: "none", 
                  border: "none", 
                  color: textColor, 
                  fontSize: "16px", 
                  fontWeight: "500",
                  cursor: "pointer",
                  padding: "8px 0",
                  borderBottom: "2px solid #3b82f6"
                }}
              >
                Jobs
              </button>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "20px" }}>
            <button 
              onClick={toggleDarkMode}
              style={{
                padding: "8px 12px",
                background: darkMode ? "#fbbf24" : "#1f2937",
                color: darkMode ? "black" : "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Stage Progress Bar */}
        <div style={{ padding: "40px 40px 20px" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center", overflowX: "auto" }}>
            {stages.map((stage, index) => (
              <div key={stage.name} style={{ display: "flex", alignItems: "center", minWidth: "120px" }}>
                <div style={{ 
                  background: stage.color,
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  textAlign: "center",
                  minWidth: "100px"
                }}>
                  {stage.name} ({stage.count})
                </div>
                {index < stages.length - 1 && (
                  <div style={{ 
                    width: "30px", 
                    height: "2px", 
                    background: borderColor,
                    margin: "0 5px"
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Search and Actions Bar */}
        <div style={{ padding: "0 40px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "10px 15px",
                border: `1px solid ${borderColor}`,
                borderRadius: "8px",
                background: darkMode ? "#374151" : "#ffffff",
                color: textColor,
                width: "300px"
              }}
            />
            <span style={{ color: darkMode ? "#94a3b8" : "#6b7280", fontSize: "14px" }}>
              {selectedJobs.length} selected
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/add-job")}
              style={{
                padding: "8px 16px",
                background: primaryColor,
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              + Add Job
            </button>
          </div>
        </div>

        {/* Jobs Table */}
        <div style={{ padding: "0 40px 40px" }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse",
            background: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <thead>
              <tr style={{ background: headerBg, borderBottom: `1px solid ${borderColor}` }}>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "500" }}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedJobs(filteredJobs.map(j => j.id));
                      } else {
                        setSelectedJobs([]);
                      }
                    }}
                    style={{ marginRight: "8px" }}
                  />
                  Job Position
                </th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "500" }}>Company</th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "500" }}>Max. Salary</th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "500" }}>Location</th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "500" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "500" }}>Date Saved</th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "500" }}>Deadline</th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "500" }}>Date Applied</th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "500" }}>Follow up</th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "500" }}>URL</th>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: "500" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job, index) => (
                <tr key={job.id} style={{ 
                  borderBottom: `1px solid ${borderColor}`,
                  background: darkMode ? (index % 2 === 0 ? "#1f2937" : "#374151") : (index % 2 === 0 ? "#ffffff" : "#f9fafb")
                }}>
                  <td style={{ padding: "12px", color: darkMode ? "#f3f4f6" : "#1f2937" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job.id)}
                        onChange={() => toggleJobSelection(job.id)}
                        style={{ marginRight: "12px" }}
                      />
                      <span>{job.role}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px", color: darkMode ? "#f3f4f6" : "#1f2937" }}>{job.company}</td>
                  <td style={{ padding: "12px", color: darkMode ? "#94a3b8" : "#6b7280" }}>-</td>
                  <td style={{ padding: "12px", color: darkMode ? "#94a3b8" : "#6b7280" }}>-</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      background: job.status === "Accepted" ? "#10b981" : 
                                 job.status === "Interview" ? "#f59e0b" : 
                                 job.status === "Applied" ? "#3b82f6" : "#6b7280",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px"
                    }}>
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: darkMode ? "#94a3b8" : "#6b7280" }}>-</td>
                  <td style={{ padding: "12px", color: darkMode ? "#94a3b8" : "#6b7280" }}>{job.deadline || "-"}</td>
                  <td style={{ padding: "12px", color: darkMode ? "#94a3b8" : "#6b7280" }}>{job.date_applied || "-"}</td>
                  <td style={{ padding: "12px", color: darkMode ? "#94a3b8" : "#6b7280" }}>{job.followup || "-"}</td>
                  <td style={{ padding: "12px" }}>
                    {job.url ? (
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: primaryColor, textDecoration: "none" }}
                      >
                        🔗 Career Page
                      </a>
                    ) : (
                      <span style={{ color: darkMode ? "#94a3b8" : "#6b7280" }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button 
                        onClick={() => startEdit(job)}
                        style={{ padding: "6px 10px", background: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => openNotes(job)}
                        style={{ padding: "6px 10px", background: "#7c3aed", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Notes
                      </button>
                      <button 
                        onClick={() => deleteJob(job.id)}
                        style={{ padding: "6px 10px", background: "#dc2626", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingJob && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}>
            <div style={{ 
              background: cardBg, 
              padding: "30px", 
              borderRadius: "12px", 
              width: "90%", 
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto"
            }}>
              <h2 style={{ margin: "0 0 20px 0" }}>Edit Job</h2>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Company</label>
                <input
                  type="text"
                  value={editForm.company}
                  onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "6px",
                    background: darkMode ? "#374151" : "#ffffff",
                    color: textColor
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Job Position</label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "6px",
                    background: darkMode ? "#374151" : "#ffffff",
                    color: textColor
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "6px",
                    background: darkMode ? "#374151" : "#ffffff",
                    color: textColor
                  }}
                >
                  <option value="Bookmarked">Bookmarked</option>
                  <option value="Applying">Applying</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interviewing</option>
                  <option value="Negotiating">Negotiating</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Deadline</label>
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm({...editForm, deadline: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "6px",
                    background: darkMode ? "#374151" : "#ffffff",
                    color: textColor
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Date Applied</label>
                <input
                  type="date"
                  value={editForm.date_applied}
                  onChange={(e) => setEditForm({...editForm, date_applied: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "6px",
                    background: darkMode ? "#374151" : "#ffffff",
                    color: textColor
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Follow Up Date</label>
                <input
                  type="date"
                  value={editForm.followup}
                  onChange={(e) => setEditForm({...editForm, followup: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "6px",
                    background: darkMode ? "#374151" : "#ffffff",
                    color: textColor
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Career Page URL</label>
                <input
                  type="url"
                  value={editForm.url}
                  onChange={(e) => setEditForm({...editForm, url: e.target.value})}
                  placeholder="https://company.com/careers"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "6px",
                    background: darkMode ? "#374151" : "#ffffff",
                    color: textColor
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  placeholder="Add your notes here..."
                  style={{
                    width: "100%",
                    height: "100px",
                    padding: "10px",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "6px",
                    background: darkMode ? "#374151" : "#ffffff",
                    color: textColor,
                    resize: "vertical"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={updateJob}
                  style={{ 
                    flex: 1, 
                    padding: "12px", 
                    background: "#10b981", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "6px", 
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={cancelEdit}
                  style={{ 
                    flex: 1, 
                    padding: "12px", 
                    background: "#6b7280", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "6px", 
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Modal */}
        {notesJobId && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}>
            <div style={{ 
              background: cardBg, 
              padding: "30px", 
              borderRadius: "12px", 
              width: "90%", 
              maxWidth: "500px"
            }}>
              <h2 style={{ margin: "0 0 15px 0" }}>Job Notes</h2>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "20px" }}>
                Job ID: {notesJobId}
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                style={{
                  width: "100%",
                  height: "200px",
                  padding: "15px",
                  borderRadius: "8px",
                  border: `1px solid ${borderColor}`,
                  background: darkMode ? "#374151" : "#ffffff",
                  color: textColor,
                  fontFamily: "Arial, sans-serif",
                  fontSize: "14px",
                  marginBottom: "20px",
                  resize: "vertical"
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={saveNotes}
                  style={{ 
                    flex: 1, 
                    padding: "12px", 
                    background: "#10b981", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "6px", 
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Save Notes
                </button>
                <button
                  onClick={() => { setNotesJobId(null); setNotes(""); }}
                  style={{ 
                    flex: 1, 
                    padding: "12px", 
                    background: "#6b7280", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "6px", 
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default JobTracker;
