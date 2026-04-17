import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./JobPortal.css";
function JobListingPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applicationByJobId, setApplicationByJobId] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [coverPageFile, setCoverPageFile] = useState(null);
  const [referral, setReferral] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const fetchJobs = useCallback(async () => {
    try {
      const res = await axios.get("/job-postings");
      setJobs(res.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAppliedJobs = useCallback(async () => {
    try {
      const res = await axios.get(
        `/job-applications/${userId}`
      );
      const apps = res.data || [];
      setAppliedJobs(apps.map((app) => app.job_id));

      const appMap = apps.reduce((acc, app) => {
        acc[app.job_id] = app._id;
        return acc;
      }, {});
      setApplicationByJobId(appMap);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  }, [userId]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/job-seeker-signup");
      return;
    }
    fetchJobs();
    fetchAppliedJobs();
  }, [navigate, fetchJobs, fetchAppliedJobs]);

  useEffect(() => {
    const results = jobs.filter(
      (job) =>
        job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  const fileToPayload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          data: reader.result
        });
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleApplyJob = async (jobId) => {
    if (!userId) {
      alert("Please login first");
      return;
    }

    if (!resumeFile || !coverPageFile) {
      alert("Please attach both your resume and cover page.");
      return;
    }

    setIsApplying(true);
    try {
      const [resumeAttachment, coverPageAttachment] = await Promise.all([
        fileToPayload(resumeFile),
        fileToPayload(coverPageFile)
      ]);

      await axios.post("/apply-job", {
        user_id: userId,
        job_id: jobId,
        resume_attachment: resumeAttachment,
        cover_page_attachment: coverPageAttachment,
        referral: referral.trim()
      });
      alert("Applied successfully!");
      setAppliedJobs([...appliedJobs, jobId]);
      fetchAppliedJobs();
      setResumeFile(null);
      setCoverPageFile(null);
      setReferral("");
      setSelectedJob(null);
    } catch (error) {
      if (error.response?.status === 409) {
        alert("You have already applied for this job");
      } else {
        alert(error.response?.data?.error || "Error applying for job");
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleWithdrawApplication = async (jobId) => {
    const applicationId = applicationByJobId[jobId];
    if (!applicationId) {
      alert("Application record not found. Please refresh and try again.");
      return;
    }

    const shouldWithdraw = window.confirm(
      "Do you want to withdraw this application?"
    );

    if (!shouldWithdraw) {
      return;
    }

    setIsWithdrawing(true);
    try {
      await axios.delete(`/job-applications/${applicationId}`, {
        params: { user_id: userId }
      });

      setAppliedJobs((prev) => prev.filter((id) => id !== jobId));
      setApplicationByJobId((prev) => {
        const next = { ...prev };
        delete next[jobId];
        return next;
      });
      alert("Application withdrawn successfully.");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to withdraw application");
    } finally {
      setIsWithdrawing(false);
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
  const inputBg = darkMode ? "#111827" : "#ffffff";
  const mutedText = darkMode ? "#9ca3af" : "#6b7280";

  return (
    <div
      className="job-listing-page"
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
            Job Listings 📋
          </h1>
          <p style={{ color: mutedText, fontSize: "14px" }}>
            Browse and apply to exciting opportunities
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/job-applications-dashboard")}
          >
            My Applications
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/resume-upload")}
          >
            My Resume
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: selectedJob ? "1fr 1fr" : "1fr",
          gap: "24px"
        }}
      >
        <div>
          <div
            style={{
              marginBottom: "24px",
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: "12px",
              padding: "16px"
            }}
          >
            <input
              type="text"
              placeholder="Search by job position or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{
                background: inputBg,
                color: textColor,
                borderColor: borderColor
              }}
            />
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", color: mutedText }}>
              Loading jobs...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: mutedText,
                padding: "32px",
                background: cardBg,
                borderRadius: "12px",
                border: `1px solid ${borderColor}`
              }}
            >
              No jobs found matching your search
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredJobs.map((job) => (
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
                      <p style={{ color: mutedText, fontSize: "12px" }}>
                        Posted: {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {appliedJobs.includes(job._id) && (
                      <span
                        style={{
                          background: "#dcfce7",
                          color: "#15803d",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}
                      >
                        ✓ Applied
                      </span>
                    )}
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
                  marginBottom: "12px"
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

              {appliedJobs.includes(selectedJob._id) ? (
                <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                  <button
                    className="btn btn-success"
                    style={{ flex: 1 }}
                    disabled
                  >
                    ✓ Applied
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleWithdrawApplication(selectedJob._id)}
                    disabled={isWithdrawing}
                    style={{ flex: 1, opacity: isWithdrawing ? 0.6 : 1 }}
                  >
                    {isWithdrawing ? "Withdrawing..." : "Withdraw Application"}
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: "20px" }}>
                  <div style={{ marginBottom: "12px" }}>
                    <label className="field-label">Attach Resume *</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label className="field-label">Attach Cover Page *</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setCoverPageFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label className="field-label">Referral (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Referral name, company, or link"
                      value={referral}
                      onChange={(e) => setReferral(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleApplyJob(selectedJob._id)}
                    disabled={isApplying}
                    style={{
                      width: "100%",
                      marginTop: "8px",
                      opacity: isApplying ? 0.6 : 1
                    }}
                  >
                    {isApplying ? "Applying..." : "Apply Now"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobListingPage;
