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

  return (
    <>
      <Navbar />
      <div style={{ padding: "40px" }}>

        <h1>Admin Dashboard - Full Analytics</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" }}>
          
          <div>
            <h2>Overall Statistics</h2>
            <p><strong>Total Clients:</strong> {clients.length}</p>
            <p><strong>Total Jobs:</strong> {jobs.length}</p>
            <p><strong>Applied:</strong> {applied}</p>
            <p><strong>Interview:</strong> {interview}</p>
            <p><strong>Offer:</strong> {offer}</p>
            <p><strong>Rejected:</strong> {rejected}</p>
          </div>

          <div style={{ width: "300px" }}>
            <Pie data={chartData} />
          </div>

        </div>

        <br />
        <hr />
        <br />

        <h2>Manage Clients</h2>
        <table border="1" cellPadding="10" style={{ width: "100%", marginBottom: "40px" }}>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Username</th>
              <th>Total Jobs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const clientJobCount = jobs.filter(j => j.user_id === client.id).length;
              return (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.username}</td>
                  <td>{clientJobCount}</td>
                  <td>
                    <button 
                      onClick={() => setSelectedClient(client)}
                      style={{ marginRight: "10px" }}
                    >
                      View Jobs
                    </button>
                    <button 
                      onClick={() => deleteClient(client.id)}
                      style={{ background: "#dc2626", color: "white", border: "none", padding: "8px 12px", cursor: "pointer", borderRadius: "5px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {selectedClient && (
          <>
            <h2>Jobs for {selectedClient.username}</h2>
            <button 
              onClick={() => setSelectedClient(null)}
              style={{ marginBottom: "10px", background: "#6b7280" }}
            >
              Clear Selection
            </button>
            <table border="1" cellPadding="10" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clientJobs.length > 0 ? (
                  clientJobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.company}</td>
                      <td>{job.role}</td>
                      <td>{job.status}</td>
                      <td>
                        <button 
                          onClick={() => deleteJob(job.id)}
                          style={{ background: "#dc2626", color: "white", border: "none", padding: "6px 10px", cursor: "pointer", borderRadius: "4px" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>No jobs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

      </div>
    </>
  );
}

export default AdminDashboard;