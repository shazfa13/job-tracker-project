import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

function Dashboard() {

  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [notesJobId, setNotesJobId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

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

    setEditingId(job.id);
    setCompany(job.company);
    setRole(job.role);
    setStatus(job.status);
  };

  const updateJob = async () => {

    await axios.put(`http://127.0.0.1:5000/jobs/${editingId}`, {
      user_id: userId,
      user_role: userRole,
      company,
      job_role: role,
      status
    });

    setEditingId(null);
    setCompany("");
    setRole("");
    setStatus("");

    fetchJobs();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCompany("");
    setRole("");
    setStatus("");
  };

  const openNotes = async (job) => {
    setNotesJobId(job.id);
    try {
      const res = await axios.get(`http://127.0.0.1:5000/jobs/${job.id}/notes?user_id=${userId}&role=${userRole}`);
      setNotes(res.data.notes);
    } catch (error) {
      setNotes("");
    }
  };

  const saveNotes = async () => {
    try {
      await axios.post(`http://127.0.0.1:5000/jobs/${notesJobId}/notes`, {
        user_id: userId,
        role: userRole,
        notes
      });
      alert("Notes saved successfully");
      setNotesJobId(null);
      setNotes("");
    } catch (error) {
      alert("Error saving notes");
    }
  };



  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

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

  const barChartData = {
    labels: ["Applied", "Interview", "Offer", "Rejected"],
    datasets: [
      {
        label: "Job Count",
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

  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Total Applications",
        data: [jobs.filter((j, i) => i < 3).length, jobs.filter((j, i) => i < 6).length, jobs.filter((j, i) => i < 9).length, jobs.length],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4
      }
    ]
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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1>My Job Dashboard</h1>
          <button 
            onClick={toggleDarkMode}
            style={{
              padding: "10px 15px",
              background: darkMode ? "#fbbf24" : "#1f2937",
              color: darkMode ? "black" : "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" }}>
          <div style={{ background: cardBg, padding: "20px", borderRadius: "10px", border: `1px solid ${borderColor}` }}>
            <h3>Distribution (Pie Chart)</h3>
            <div style={{ width: "100%", maxWidth: "400px" }}>
              <Pie data={chartData} options={{ responsive: true }} />
            </div>
          </div>

          <div style={{ background: cardBg, padding: "20px", borderRadius: "10px", border: `1px solid ${borderColor}` }}>
            <h3>Count by Status (Bar Chart)</h3>
            <div style={{ width: "100%", maxWidth: "400px" }}>
              <Bar data={barChartData} options={{ responsive: true }} />
            </div>
          </div>
        </div>

        <div style={{ background: cardBg, padding: "20px", borderRadius: "10px", border: `1px solid ${borderColor}`, marginBottom: "40px" }}>
          <h3>Application Progress (Line Chart)</h3>
          <div style={{ width: "100%", maxWidth: "800px" }}>
            <Line data={lineChartData} options={{ responsive: true }} />
          </div>
        </div>

        <div style={{ background: cardBg, padding: "20px", borderRadius: "10px", border: `1px solid ${borderColor}`, marginBottom: "40px" }}>
          <h2>Statistics</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px" }}>
            <div style={{ padding: "15px", background: "#3b82f6", color: "white", borderRadius: "5px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "14px" }}>Applied</p>
              <p style={{ margin: "10px 0", fontSize: "24px", fontWeight: "bold" }}>{applied}</p>
            </div>
            <div style={{ padding: "15px", background: "#f59e0b", color: "white", borderRadius: "5px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "14px" }}>Interview</p>
              <p style={{ margin: "10px 0", fontSize: "24px", fontWeight: "bold" }}>{interview}</p>
            </div>
            <div style={{ padding: "15px", background: "#10b981", color: "white", borderRadius: "5px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "14px" }}>Offer</p>
              <p style={{ margin: "10px 0", fontSize: "24px", fontWeight: "bold" }}>{offer}</p>
            </div>
            <div style={{ padding: "15px", background: "#ef4444", color: "white", borderRadius: "5px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "14px" }}>Rejected</p>
              <p style={{ margin: "10px 0", fontSize: "24px", fontWeight: "bold" }}>{rejected}</p>
            </div>
          </div>
        </div>

        {editingId && (
          <div style={{ background: cardBg, padding: "20px", borderRadius: "10px", border: `1px solid ${borderColor}`, marginBottom: "40px" }}>
            <h2>Edit Job</h2>
            <input
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: `1px solid ${borderColor}`, background: bgColor, color: textColor }}
            />
            <input
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: `1px solid ${borderColor}`, background: bgColor, color: textColor }}
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: `1px solid ${borderColor}`, background: bgColor, color: textColor }}
            >
              <option value="">Status</option>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
            <button 
              onClick={updateJob}
              style={{ padding: "10px 15px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}
            >
              Update
            </button>
            <button 
              onClick={cancelEdit}
              style={{ padding: "10px 15px", background: "#6b7280", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        )}

        <h2>My Jobs</h2>
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", borderColor: borderColor, background: cardBg }}>

          <thead>
            <tr style={{ background: darkMode ? "#4b5563" : "#e5e7eb" }}>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {jobs.map((job) => (

              <tr key={job.id} style={{ borderBottom: `1px solid ${borderColor}` }}>

                <td>{job.company}</td>
                <td>{job.role}</td>
                <td>{job.status}</td>

                <td style={{ display: "flex", gap: "5px" }}>

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

                </td>

              </tr>

            ))}

          </tbody>

        </table>

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
            <div style={{ background: cardBg, padding: "30px", borderRadius: "10px", width: "90%", maxWidth: "500px" }}>
              <h2>Job Notes</h2>
              <p style={{ fontSize: "12px", color: "#999" }}>Job ID: {notesJobId}</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                style={{
                  width: "100%",
                  height: "200px",
                  padding: "10px",
                  borderRadius: "5px",
                  border: `1px solid ${borderColor}`,
                  background: bgColor,
                  color: textColor,
                  fontFamily: "Arial, sans-serif",
                  marginBottom: "15px"
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={saveNotes}
                  style={{ flex: 1, padding: "10px", background: "#10b981", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                >
                  Save Notes
                </button>
                <button
                  onClick={() => { setNotesJobId(null); setNotes(""); }}
                  style={{ flex: 1, padding: "10px", background: "#6b7280", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
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

export default Dashboard;
