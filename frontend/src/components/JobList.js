import React from "react";
import API from "../services/api";

function JobList({ jobs, refreshJobs }) {

  const deleteJob = async (id) => {
    await API.delete(`/jobs/${id}`);
    refreshJobs();
  };

  return (

<div className="jobs-list">

{jobs.map((job) => (

<div key={job.id} className="job-card">

<h3>{job.company}</h3>

<p>{job.role}</p>

<p>
Status: <span className={`status-pill ${job.status === "Rejected" ? "status-danger" : job.status === "Accepted" ? "status-success" : "status-pending"}`}>{job.status}</span>
</p>

<button className="btn btn-danger" onClick={() => deleteJob(job.id)}>
Delete
</button>

</div>

))}

</div>

);
}

export default JobList;