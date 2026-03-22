import React from "react";
import API from "../services/api";

function JobList({ jobs, refreshJobs }) {

  const deleteJob = async (id) => {
    await API.delete(`/jobs/${id}`);
    refreshJobs();
  };

  return (

<div>

{jobs.map((job) => (

<div key={job.id} className="job-card">

<h3>{job.company}</h3>

<p>{job.role}</p>

<p className="status">Status: {job.status}</p>

<button onClick={() => deleteJob(job.id)}>
Delete
</button>

</div>

))}

</div>

);
}

export default JobList;