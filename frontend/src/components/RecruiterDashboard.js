import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./JobPortal.css";

function RecruiterDashboard() {
  const [jobPostings, setJobPostings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicationCountByJobId, setApplicationCountByJobId] = useState({});
  const [decisionLoadingId, setDecisionLoadingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const fetchJobPostings = useCallback(async () => {
    try {
      const res = await axios.get(
        `/recruiter-jobs/${userId}`
      );
      setJobPostings(res.data || []);
    } catch (error) {
      console.error("Error fetching job postings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchApplicants = useCallback(async (jobId) => {
    try {
      const res = await axios.get(
        `/job-applicants/${jobId}`
      );
      setApplicants(res.data || []);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  }, []);

  const fetchRecruiterAnalytics = useCallback(async () => {
    try {
      const res = await axios.get(`/recruiter-analytics/${userId}`);
      const jobs = res.data?.jobs || [];
      const counts = jobs.reduce((acc, item) => {
        acc[item.job_id] = item.totalApplicants || 0;
        return acc;
      }, {});
      setApplicationCountByJobId(counts);
    } catch (error) {
      console.error("Error fetching recruiter analytics:", error);
    }
  }, [userId]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/recruiter-signup");
      return;
    }
    fetchJobPostings();
    fetchRecruiterAnalytics();
  }, [fetchJobPostings, fetchRecruiterAnalytics, navigate]);

  useEffect(() => {
    if (selectedJob) {
      fetchApplicants(selectedJob._id);
    }
  }, [fetchApplicants, selectedJob]);

  const handleApplicantDecision = async (applicationId, status) => {
    setDecisionLoadingId(applicationId);
    try {
      await axios.patch(`/job-applications/${applicationId}/status`, {
        recruiter_id: userId,
        status
      });

      if (selectedJob?._id) {
        await fetchApplicants(selectedJob._id);
      }
      await fetchRecruiterAnalytics();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update application status");
    } finally {
      setDecisionLoadingId(null);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await axios.delete(`/job-postings/${jobId}`);
        alert("Job posting deleted successfully");
        fetchJobPostings();
        setSelectedJob(null);
      } catch (error) {
        alert("Error deleting job posting");
      }
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const pageBg = darkMode ? "#111827" : "#f3f4f6";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const textColor = darkMode ? "#f3f4f6" : "#111827";
  const borderColor = darkMode ? "#374151" : "#d1d5db";
  const mutedText = darkMode ? "#9ca3af" : "#6b7280";

  const downloadAttachment = (attachment) => {
    if (!attachment?.data) return;
    const link = document.createElement("a");
    link.href = attachment.data;
    link.download = attachment.name || "attachment";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="recruiter-dashboard"
      style={{
        background: pageBg,
        minHeight: "100vh",
        padding: "32px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <h1 style={{ color: textColor, fontSize: "28px", marginBottom: "8px" }}>
            Recruiter Dashboard 🏢
          </h1>
          <p style={{ color: mutedText, fontSize: "14px" }}>
            Manage job postings and view applicants
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/create-job-posting")}
          >
            Post New Job
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/recruiter-analytics")}
          >
            Analytics Dashboard
          </button>
          <button className="btn btn-ghost ghost-btn" onClick={toggleDarkMode}>
            {darkMode ? "Light" : "Dark"}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              localStorage.removeItem("loggedIn");
              localStorage.removeItem("userId");
              localStorage.removeItem("portalRole");
              navigate("/job-portal");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", color: mutedText }}>
          Loading dashboard...
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: selectedJob ? "1fr 1fr" : "1fr",
            gap: "32px"
          }}
        >
          <div>
            <h2 style={{ color: textColor, marginBottom: "16px", fontSize: "20px" }}>
              Your Job Postings ({jobPostings.length})
            </h2>

            {jobPostings.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 32px",
                  background: cardBg,
                  borderRadius: "12px",
                  border: `1px solid ${borderColor}`
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                <h3 style={{ color: textColor, marginBottom: "8px" }}>
                  No Job Postings Yet
                </h3>
                <p style={{ color: mutedText, marginBottom: "24px" }}>
                  Start recruiting by creating your first job posting
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/create-job-posting")}
                >
                  Create Job Posting
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {jobPostings.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                    style={{
                      background: cardBg,
                      border: `1px solid ${
                        selectedJob?._id === job._id ? "#2f6ce5" : borderColor
                      }`,
                      borderRadius: "12px",
                      padding: "16px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow:
                        selectedJob?._id === job._id
                          ? "0 4px 12px rgba(47, 108, 229, 0.2)"
                          : "none"
                    }}
                    onMouseEnter={(e) => {
                      if (selectedJob?._id !== job._id) {
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(0, 0, 0, 0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedJob?._id !== job._id) {
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        gap: "12px"
                      }}
                    >
                      <div>
                        <h3 style={{ color: textColor, marginBottom: "4px" }}>
                          {job.position}
                        </h3>
                        <p style={{ color: mutedText, fontSize: "14px", marginBottom: "4px" }}>
                          {job.company}
                        </p>
                      </div>
                      <span
                        style={{
                          background: "#dbeafe",
                          color: "#0c4a6e",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {applicationCountByJobId[job._id] || 0} Applications
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedJob && (
            <div
              style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: "12px",
                padding: "24px",
                height: "fit-content",
                position: "sticky",
                top: "20px"
              }}
            >
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "8px"
                  }}
                >
                  <h2 style={{ color: textColor, marginBottom: "0", fontSize: "24px" }}>
                    {selectedJob.position}
                  </h2>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedJob(null)}
                    style={{ minHeight: "36px", padding: "8px 12px" }}
                  >
                    Close
                  </button>
                </div>
                <p style={{ color: mutedText, marginBottom: "16px", fontSize: "16px" }}>
                  {selectedJob.company}
                </p>

                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ color: textColor, marginBottom: "8px", fontSize: "16px" }}>
                    Description
                  </h4>
                  <p style={{ color: mutedText, fontSize: "14px", lineHeight: "1.6" }}>
                    {selectedJob.description}
                  </p>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ color: textColor, marginBottom: "8px", fontSize: "16px" }}>
                    Requirements
                  </h4>
                  <ul
                    style={{
                      color: mutedText,
                      fontSize: "14px",
                      paddingLeft: "20px",
                      lineHeight: "1.8"
                    }}
                  >
                    {selectedJob.requirements &&
                      selectedJob.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                  </ul>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteJob(selectedJob._id)}
                    style={{ flex: 1 }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: `1px solid ${borderColor}` }}>
                <h3 style={{ color: textColor, marginBottom: "16px", fontSize: "18px" }}>
                  Applicants ({applicants.length})
                </h3>

                {applicants.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "24px",
                      color: mutedText,
                      background: pageBg,
                      borderRadius: "8px"
                    }}
                  >
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>📭</div>
                    <p>No applicants yet</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {applicants.map((applicant) => (
                      <div
                        key={applicant._id}
                        style={{
                          background: pageBg,
                          border: `1px solid ${borderColor}`,
                          borderRadius: "8px",
                          padding: "12px"
                        }}
                      >
                        <h4 style={{ color: textColor, marginBottom: "4px" }}>
                          {applicant.user_name}
                        </h4>
                        <p style={{ color: mutedText, fontSize: "12px" }}>
                          Applied:{" "}
                          {new Date(applicant.applied_at).toLocaleDateString()}
                        </p>

                        <div style={{ marginTop: "8px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              background:
                                applicant.status === "accepted"
                                  ? "#dcfce7"
                                  : applicant.status === "rejected"
                                    ? "#fee2e2"
                                    : "#fef3c7",
                              color:
                                applicant.status === "accepted"
                                  ? "#166534"
                                  : applicant.status === "rejected"
                                    ? "#991b1b"
                                    : "#b45309",
                              padding: "4px 10px",
                              borderRadius: "999px",
                              fontSize: "12px",
                              fontWeight: "600"
                            }}
                          >
                            {(applicant.status || "pending").toUpperCase()}
                          </span>
                        </div>

                        <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button
                            className="btn btn-secondary"
                            style={{ minHeight: "32px", padding: "6px 10px" }}
                            onClick={() => downloadAttachment(applicant.resume_attachment)}
                            disabled={!applicant.resume_attachment?.data}
                          >
                            Resume
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ minHeight: "32px", padding: "6px 10px" }}
                            onClick={() => downloadAttachment(applicant.cover_page_attachment)}
                            disabled={!applicant.cover_page_attachment?.data}
                          >
                            Cover Page
                          </button>
                        </div>

                        {applicant.referral ? (
                          <p style={{ color: mutedText, fontSize: "12px", marginTop: "8px" }}>
                            Referral: {applicant.referral}
                          </p>
                        ) : (
                          <p style={{ color: mutedText, fontSize: "12px", marginTop: "8px" }}>
                            Referral: None
                          </p>
                        )}

                        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                          <button
                            className="btn btn-success"
                            style={{ minHeight: "32px", padding: "6px 10px", flex: 1 }}
                            onClick={() => handleApplicantDecision(applicant._id, "accepted")}
                            disabled={decisionLoadingId === applicant._id || applicant.status === "accepted"}
                          >
                            {decisionLoadingId === applicant._id ? "Saving..." : "Accept"}
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ minHeight: "32px", padding: "6px 10px", flex: 1 }}
                            onClick={() => handleApplicantDecision(applicant._id, "rejected")}
                            disabled={decisionLoadingId === applicant._id || applicant.status === "rejected"}
                          >
                            {decisionLoadingId === applicant._id ? "Saving..." : "Reject"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
