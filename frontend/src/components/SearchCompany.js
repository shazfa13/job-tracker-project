import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function SearchCompany() {
  const [jobs, setJobs] = useState([]);
  const [searchCompany, setSearchCompany] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
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

  return (
    <>
      <Navbar />
      <div style={{ padding: "40px" }}>
        <h1>Search Company</h1>
        <br />
        <input
          placeholder="Enter Company Name"
          value={searchCompany}
          onChange={(e) => setSearchCompany(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <br /><br />
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.company}</td>
                <td>{job.role}</td>
                <td>{job.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SearchCompany;