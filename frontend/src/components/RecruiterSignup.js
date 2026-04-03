import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./JobPortal.css";

function RecruiterSignup() {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!isLoginMode && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isLoginMode && !companyName) {
      setError("Company name is required");
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isLoginMode ? "/login" : "/signup";
      const payload = isLoginMode
        ? { username, password }
        : {
            username,
            password,
            role: "recruiter",
            company_name: companyName
          };

      const res = await axios.post(`http://127.0.0.1:5000${endpoint}`, payload);

      if (isLoginMode) {
        if (res.data.message === "Login successful") {
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("userRole", res.data.role);
          localStorage.setItem("userId", res.data.user_id);
          localStorage.setItem("portalRole", "recruiter");
          navigate("/recruiter-dashboard");
        }
      } else {
        if (res.data.message === "User created") {
          setError("");
          setIsLoginMode(true);
          setPassword("");
          setConfirmPassword("");
          alert("Signup successful! Please login with your credentials.");
        }
      }
    } catch (error) {
      if (!error.response) {
        setError("Cannot reach the server. Please try again.");
      } else if (error.response.status === 400) {
        if (error.response.data?.error?.includes("already exists")) {
          setError("Username already exists. Please login instead.");
        } else {
          setError(error.response.data?.error || "Signup failed");
        }
      } else {
        setError(error.response.data?.error || "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const pageBg = darkMode ? "#111827" : "#f3f4f6";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const textColor = darkMode ? "#f3f4f6" : "#111827";
  const borderColor = darkMode ? "#374151" : "#d1d5db";
  const inputBg = darkMode ? "#111827" : "#ffffff";
  const mutedText = darkMode ? "#9ca3af" : "#6b7280";

  return (
    <div className={`auth-page auth-ui ${darkMode ? "auth-dark" : "auth-light"}`} style={{ background: pageBg }}>
      <div className="auth-actions-bar">
        <button
          className="btn btn-ghost ghost-btn"
          onClick={() => navigate("/job-portal")}
        >
          Back to Portal
        </button>
        <button className="btn btn-ghost ghost-btn" onClick={toggleDarkMode}>
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>

      <div className="auth-shell-center">
        <div className="auth-card" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
          <h1 className="auth-title" style={{ color: textColor }}>
            {isLoginMode ? "Recruiter Sign In" : "Recruiter Signup"}
          </h1>
          <p className="auth-subtitle" style={{ color: mutedText }}>
            {isLoginMode
              ? "Sign in to manage postings, candidates, and analytics."
              : "Create a recruiter account to post jobs and review applicants."}
          </p>

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "12px",
                borderRadius: "8px",
                marginTop: "20px",
                marginBottom: "4px",
                fontSize: "14px"
              }}
            >
              {error}
            </div>
          )}

          <form className="form-stack" onSubmit={handleSignup} style={{ marginTop: "24px" }}>
            <div>
              <label className="field-label" style={{ color: mutedText }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                placeholder="Enter your username"
                style={{ background: inputBg, color: textColor, borderColor: borderColor }}
              />
            </div>

            {!isLoginMode && (
              <div>
                <label className="field-label" style={{ color: mutedText }}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="form-control"
                  placeholder="Enter your company name"
                  style={{ background: inputBg, color: textColor, borderColor: borderColor }}
                />
              </div>
            )}

            <div>
              <label className="field-label" style={{ color: mutedText }}>
                Password
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Enter your password"
                  style={{ background: inputBg, color: textColor, borderColor: borderColor }}
                />
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {!isLoginMode && (
              <div>
                <label className="field-label" style={{ color: mutedText }}>
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control"
                  placeholder="Confirm your password"
                  style={{ background: inputBg, color: textColor, borderColor: borderColor }}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: "100%", marginTop: "8px", opacity: isLoading ? 0.6 : 1 }}
            >
              {isLoading ? "Processing..." : isLoginMode ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p style={{ margin: "24px 0 0", textAlign: "center", color: mutedText }}>
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError("");
                setPassword("");
                setConfirmPassword("");
                setCompanyName("");
              }}
              style={{ background: "none", border: "none", color: "#2f6ce5", cursor: "pointer", fontWeight: 600 }}
            >
              {isLoginMode ? "Sign up here" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecruiterSignup;
