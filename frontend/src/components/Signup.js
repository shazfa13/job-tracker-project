import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const handleSignup = async () => {
    const normalizedUsername = username.trim();
    const normalizedPassword = password;

    if (!normalizedUsername || !normalizedPassword) {
      alert("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/signup", {
        username: normalizedUsername,
        password: normalizedPassword,
        role
      });

      alert("Account Created Successfully");
      navigate("/login");
    } catch (error) {
      if (!error.response) {
        alert("Cannot reach the server. Please make sure backend and MongoDB are running.");
      } else if (error.response.status === 400) {
        alert(error.response.data?.error || "User already exists");
      } else {
        alert(error.response.data?.error || "Signup failed. Please try again.");
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
  const muted = darkMode ? "#9ca3af" : "#6b7280";

  return (
    <div className={`auth-page auth-ui ${darkMode ? "auth-dark" : "auth-light"}`} style={{ background: pageBg }}>
      <div className="auth-actions-bar">
        <button className="btn btn-ghost ghost-btn" onClick={() => navigate("/")}>Back to Home</button>
        <button className="btn btn-ghost ghost-btn" onClick={toggleDarkMode}>{darkMode ? "Light" : "Dark"}</button>
      </div>

      <div className="auth-shell-center">
        <div className="auth-card" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
          <h1 className="auth-title" style={{ color: textColor }}>Create Account</h1>
          <p className="auth-subtitle" style={{ color: muted }}>Set up your workspace and start tracking applications.</p>

          <div className="form-stack" style={{ marginTop: "24px" }}>
            <div>
              <label className="field-label" style={{ color: muted }}>Username</label>
              <input
                type="text"
                className="form-control"
                style={{ background: inputBg, borderColor, color: textColor }}
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSignup();
                  }
                }}
              />
            </div>

            <div>
              <label className="field-label" style={{ color: muted }}>Password</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  style={{ background: inputBg, borderColor, color: textColor }}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSignup();
                    }
                  }}
                />
                <button className="btn btn-ghost" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="field-label" style={{ color: muted }}>Account Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-control"
                style={{ background: inputBg, borderColor, color: textColor }}
              >
                <option value="client">Client Account</option>
                <option value="admin">Admin Account</option>
              </select>
            </div>

            <button
              onClick={handleSignup}
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            <p style={{ margin: 0, textAlign: "center", color: muted }}>
              Already have an account? <Link to="/login" className="link-inline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;