import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./JobPortal.css";

function ResumeUpload() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/job-seeker-signup");
      return;
    }
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/resumes/${userId}`);
      setUploadedResumes(res.data || []);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.startsWith("text/")) {
        setResumeFile(file);
      } else {
        alert("Please upload a PDF or text file");
      }
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read resume file"));
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!resumeFile) {
      alert("Please select a file");
      return;
    }

    if (!resumeName.trim()) {
      alert("Please give your resume a name");
      return;
    }

    setIsUploading(true);
    try {
      const resumeFileContent = await fileToBase64(resumeFile);

      await axios.post("http://127.0.0.1:5000/upload-resume", {
        user_id: userId,
        resume_name: resumeName,
        resume_file: resumeFileContent
      });
      alert("Resume uploaded successfully!");
      setResumeFile(null);
      setResumeName("");
      fetchResumes();
    } catch (error) {
      alert("Error uploading resume: " + (error.response?.data?.error || error.message));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (resume) => {
    if (!resume?.file_content) {
      alert("This resume cannot be downloaded right now.");
      return;
    }

    const link = document.createElement("a");
    link.href = resume.file_content;
    link.download = resume.name || "resume";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      className="resume-upload"
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
            My Resume 📄
          </h1>
          <p style={{ color: mutedText, fontSize: "14px" }}>
            Upload and manage your resumes for job applications
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/job-listings")}
          >
            Browse Jobs
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/job-applications-dashboard")}
          >
            My Applications
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
          gridTemplateColumns: "1fr 1fr",
          gap: "32px"
        }}
      >
        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "12px",
            padding: "24px"
          }}
        >
          <h2 style={{ color: textColor, marginBottom: "16px", fontSize: "20px" }}>
            Upload Resume
          </h2>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: mutedText, fontSize: "14px", fontWeight: "600" }}>
              Resume Name
            </label>
            <input
              type="text"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              className="form-control"
              placeholder="e.g., My Resume 2024"
              style={{
                background: inputBg,
                color: textColor,
                borderColor: borderColor,
                marginTop: "6px"
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: mutedText, fontSize: "14px", fontWeight: "600" }}>
              Select File (PDF or Text)
            </label>
            <div
              style={{
                marginTop: "6px",
                border: `2px dashed ${borderColor}`,
                borderRadius: "8px",
                padding: "24px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: inputBg
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "#2f6ce5";
                e.currentTarget.style.background = darkMode
                  ? "rgba(47, 108, 229, 0.1)"
                  : "rgba(47, 108, 229, 0.05)";
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = borderColor;
                e.currentTarget.style.background = inputBg;
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = borderColor;
                e.currentTarget.style.background = inputBg;
                const file = e.dataTransfer.files[0];
                if (
                  file.type === "application/pdf" ||
                  file.type.startsWith("text/")
                ) {
                  setResumeFile(file);
                }
              }}
            >
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-input"
              />
              <label
                htmlFor="file-input"
                style={{
                  cursor: "pointer",
                  display: "block"
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>📁</div>
                <p style={{ color: mutedText, fontSize: "14px", marginBottom: "4px" }}>
                  Drag and drop your resume here or click to browse
                </p>
                {resumeFile && (
                  <p style={{ color: "#2f6ce5", fontSize: "14px", fontWeight: "600" }}>
                    {resumeFile.name}
                  </p>
                )}
              </label>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={isUploading || !resumeFile}
            style={{
              width: "100%",
              opacity: isUploading || !resumeFile ? 0.6 : 1
            }}
          >
            {isUploading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "12px",
            padding: "24px"
          }}
        >
          <h2 style={{ color: textColor, marginBottom: "16px", fontSize: "20px" }}>
            Your Resumes ({uploadedResumes.length})
          </h2>

          {isLoading ? (
            <div style={{ color: mutedText }}>Loading resumes...</div>
          ) : uploadedResumes.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px",
                color: mutedText,
                background: pageBg,
                borderRadius: "8px"
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>📭</div>
              <p>No resumes uploaded yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {uploadedResumes.map((resume) => (
                <div
                  key={resume.id}
                  style={{
                    background: pageBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    padding: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <h4 style={{ color: textColor, marginBottom: "4px" }}>
                      {resume.name}
                    </h4>
                    <p style={{ color: mutedText, fontSize: "12px" }}>
                      Uploaded:{" "}
                      {new Date(resume.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleDownload(resume)}
                    disabled={!resume.file_content}
                    style={{ minWidth: "80px" }}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeUpload;
