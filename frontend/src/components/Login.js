import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("client");
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

  const handleLogin = async () => {
    const normalizedUsername = username.trim();
    const normalizedPassword = password;

    if (!normalizedUsername || !normalizedPassword) {
      alert("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        username: normalizedUsername,
        password: normalizedPassword
      });

      if (res.data.message === "Login successful") {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("userId", res.data.user_id);

        if (res.data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      if (!error.response) {
        alert("Cannot reach the server. Please make sure backend and MongoDB are running.");
      } else if (error.response.status === 401) {
        alert("Invalid username or password");
      } else {
        alert(error.response.data?.error || "Login failed. Please try again.");
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
          <h1 className="auth-title" style={{ color: textColor }}>Sign In</h1>
          <p className="auth-subtitle" style={{ color: muted }}>Continue your application tracking workspace.</p>

          <div className="form-stack" style={{ marginTop: "24px" }}>
            <div>
              <label className="field-label" style={{ color: muted }}>Username</label>
              <input
                type="text"
                className="form-control"
                style={{ background: inputBg, borderColor, color: textColor }}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
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
              <div className="form-row">
                <button
                  className={`btn ${selectedRole === "client" ? "btn-primary" : "btn-ghost"}`}
                  style={{ flex: 1 }}
                  onClick={() => setSelectedRole("client")}
                >
                  Client
                </button>
                <button
                  className={`btn ${selectedRole === "admin" ? "btn-danger" : "btn-ghost"}`}
                  style={{ flex: 1 }}
                  onClick={() => setSelectedRole("admin")}
                >
                  Admin
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedRole(selectedRole);
                handleLogin();
              }}
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <p style={{ margin: 0, textAlign: "center", color: muted }}>
              Don&apos;t have an account? <Link to="/signup" className="link-inline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;