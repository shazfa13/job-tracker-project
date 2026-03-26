import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

function Dashboard() {

  const [jobs, setJobs] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
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

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  // Enhanced status categories
  const bookmarked = jobs.filter(j => j.status === "Bookmarked").length;
  const applying = jobs.filter(j => j.status === "Applying").length;
  const applied = jobs.filter(j => j.status === "Applied").length;
  const interviewing = jobs.filter(j => j.status === "Interview").length;
  const negotiating = jobs.filter(j => j.status === "Negotiating").length;
  const accepted = jobs.filter(j => j.status === "Accepted").length;
  const rejected = jobs.filter(j => j.status === "Rejected").length;

  // Chart data with enhanced categories
  const chartData = {
    labels: ["Bookmarked", "Applying", "Applied", "Interviewing", "Negotiating", "Accepted", "Rejected"],
    datasets: [
      {
        data: [bookmarked, applying, applied, interviewing, negotiating, accepted, rejected],
        backgroundColor: [
          "#6b7280",
          "#3b82f6", 
          "#8b5cf6",
          "#f59e0b",
          "#10b981",
          "#059669",
          "#ef4444"
        ]
      }
    ]
  };

  const barChartData = {
    labels: ["Bookmarked", "Applying", "Applied", "Interviewing", "Negotiating", "Accepted", "Rejected"],
    datasets: [
      {
        label: "Job Count",
        data: [bookmarked, applying, applied, interviewing, negotiating, accepted, rejected],
        backgroundColor: [
          "#6b7280",
          "#3b82f6", 
          "#8b5cf6",
          "#f59e0b",
          "#10b981",
          "#059669",
          "#ef4444"
        ]
      }
    ]
  };

  // Weekly progress data
  const weeklyData = [0, 0, 0, 0];
  jobs.forEach((job, index) => {
    if (index < 3) weeklyData[0]++;
    else if (index < 6) weeklyData[1]++;
    else if (index < 9) weeklyData[2]++;
    else weeklyData[3]++;
  });

  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Total Applications",
        data: weeklyData,
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

  const totalApplications = jobs.length;
  const activeApplications = jobs.filter(j => !["Accepted", "Rejected"].includes(j.status)).length;
  const successRate = totalApplications > 0 ? Math.round((accepted / totalApplications) * 100) : 0;

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
            <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>Job Application Analytics</h1>
            <p style={{ color: "#6b7280", margin: 0 }}>Track your job search progress and insights</p>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <button 
              onClick={() => navigate("/job-tracker")}
              style={{
                padding: "12px 20px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              View Job Tracker
            </button>
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
        </div>

        {/* Key Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          <div style={{ background: cardBg, padding: "24px", borderRadius: "12px", border: `1px solid ${borderColor}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>Total Applications</p>
                <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{totalApplications}</p>
              </div>
              <div style={{ fontSize: "32px" }}>📊</div>
            </div>
          </div>
          
          <div style={{ background: cardBg, padding: "24px", borderRadius: "12px", border: `1px solid ${borderColor}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>Active Applications</p>
                <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{activeApplications}</p>
              </div>
              <div style={{ fontSize: "32px" }}>⏳</div>
            </div>
          </div>
          
          <div style={{ background: cardBg, padding: "24px", borderRadius: "12px", border: `1px solid ${borderColor}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>Success Rate</p>
                <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{successRate}%</p>
              </div>
              <div style={{ fontSize: "32px" }}>🎯</div>
            </div>
          </div>
          
          <div style={{ background: cardBg, padding: "24px", borderRadius: "12px", border: `1px solid ${borderColor}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>Interviews</p>
                <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>{interviewing}</p>
              </div>
              <div style={{ fontSize: "32px" }}>💼</div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "30px", marginBottom: "40px" }}>
          <div style={{ background: cardBg, padding: "30px", borderRadius: "12px", border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}>Application Distribution</h3>
            <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
              <Pie data={chartData} options={{ 
                responsive: true, 
                plugins: {
                  legend: {
                    position: 'bottom',
                  }
                }
              }} />
            </div>
          </div>

          <div style={{ background: cardBg, padding: "30px", borderRadius: "12px", border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}>Status Breakdown</h3>
            <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
              <Bar data={barChartData} options={{ 
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }} />
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div style={{ background: cardBg, padding: "30px", borderRadius: "12px", border: `1px solid ${borderColor}`, marginBottom: "40px" }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}>Application Timeline</h3>
          <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
            <Line data={lineChartData} options={{ 
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'top'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }} />
          </div>
        </div>

        {/* Detailed Statistics */}
        <div style={{ background: cardBg, padding: "30px", borderRadius: "12px", border: `1px solid ${borderColor}` }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600" }}>Detailed Statistics</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
            <div style={{ padding: "20px", background: "#6b7280", color: "white", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "14px", marginBottom: "8px" }}>Bookmarked</p>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>{bookmarked}</p>
            </div>
            <div style={{ padding: "20px", background: "#3b82f6", color: "white", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "14px", marginBottom: "8px" }}>Applying</p>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>{applying}</p>
            </div>
            <div style={{ padding: "20px", background: "#8b5cf6", color: "white", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "14px", marginBottom: "8px" }}>Applied</p>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>{applied}</p>
            </div>
            <div style={{ padding: "20px", background: "#f59e0b", color: "white", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "14px", marginBottom: "8px" }}>Interviewing</p>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>{interviewing}</p>
            </div>
            <div style={{ padding: "20px", background: "#10b981", color: "white", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "14px", marginBottom: "8px" }}>Negotiating</p>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>{negotiating}</p>
            </div>
            <div style={{ padding: "20px", background: "#059669", color: "white", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "14px", marginBottom: "8px" }}>Accepted</p>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>{accepted}</p>
            </div>
            <div style={{ padding: "20px", background: "#ef4444", color: "white", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "14px", marginBottom: "8px" }}>Rejected</p>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>{rejected}</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Dashboard;
