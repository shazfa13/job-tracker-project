import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function AddJob() {

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    const loggedIn = localStorage.getItem("loggedIn");

    if (!loggedIn) {
      navigate("/");
    }

  }, [navigate]);

  const addJob = async () => {

    if (!company || !role || !status) {
      alert("Please fill all fields");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const userRole = localStorage.getItem("userRole");

      if (!userId) {
        alert("User ID not found. Please log in again.");
        navigate("/");
        return;
      }

      await axios.post("http://127.0.0.1:5000/jobs", {
        user_id: userId,
        company,
        role,
        status
      });

      alert("Job Added Successfully");

      setCompany("");
      setRole("");
      setStatus("");

      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Error adding job. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div style={{
        textAlign: "center",
        marginTop: "80px"
      }}>

        <h2>Add New Job</h2>

        <br />

        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <br /><br />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <br /><br />

        <button onClick={addJob}>
          Add Job
        </button>

      </div>
    </>
  );
}

export default AddJob;

