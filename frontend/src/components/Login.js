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
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        username,
        password
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
      alert("Invalid Login");
    } finally {
      setIsLoading(false);
    }
  };

  const bgColor = darkMode ? "#0f172a" : "#f8fafc";
  const cardBg = darkMode ? "#1e293b" : "#ffffff";
  const textColor = darkMode ? "#f3f4f6" : "#1f2937";
  const borderColor = darkMode ? "#374151" : "#e2e8f0";
  const primaryColor = "#3b82f6";
  const inputBg = darkMode ? "#374151" : "#ffffff";
  const secondaryColor = darkMode ? "#6b7280" : "#64748b";

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${darkMode ? "#1e293b 0%, #0f172a 100%" : "#f8fafc 0%, #e2e8f0 100%"})`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Background Pattern */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: darkMode 
          ? "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)"
          : "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
        backgroundSize: "cover",
        opacity: darkMode ? 0.4 : 0.3,
        animation: "float 20s infinite linear"
      }} />

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "12px 20px",
          background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`,
          color: textColor,
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.3s ease",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
        onMouseOver={(e) => {
          e.target.style.background = darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
          e.target.style.transform = "translateY(-2px)";
        }}
        onMouseOut={(e) => {
          e.target.style.background = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
          e.target.style.transform = "translateY(0)";
        }}
      >
        ← Back to Home
      </button>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "12px 16px",
          background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`,
          color: darkMode ? "#fbbf24" : "#1f2937",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.3s ease",
          zIndex: 1000
        }}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <div style={{
        background: cardBg,
        padding: "50px",
        borderRadius: "20px",
        width: "450px",
        boxShadow: darkMode 
          ? "0 25px 50px rgba(0,0,0,0.3)" 
          : "0 25px 50px rgba(0,0,0,0.1)",
        border: `1px solid ${borderColor}`,
        position: "relative",
        zIndex: 10,
        boxSizing: "border-box"
      }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            display: "inline-block",
            padding: "10px 20px",
            background: `linear-gradient(135deg, ${primaryColor}, #2563eb)`,
            borderRadius: "50px",
            marginBottom: "20px"
          }}>
            <h1 style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "bold",
              color: "white",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)"
            }}>
              👋 Welcome Back
            </h1>
          </div>
          <p style={{
            margin: 0,
            color: secondaryColor,
            fontSize: "16px",
            fontWeight: "500"
          }}>
            Sign in to continue your job search journey
          </p>
        </div>

        {/* Form */}
        <div style={{ marginBottom: "35px" }}>
          <label style={{
            display: "block",
            marginBottom: "10px",
            fontWeight: "600",
            color: textColor,
            fontSize: "14px",
            letterSpacing: "0.5px"
          }}>
            Username
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
              style={{
                width: "100%",
                padding: "16px 20px 16px 50px",
                border: `2px solid ${borderColor}`,
                borderRadius: "12px",
                background: inputBg,
                color: textColor,
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = primaryColor;
                e.target.style.boxShadow = darkMode 
                  ? "0 0 0 3px rgba(59, 130, 246, 0.3)" 
                  : "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = borderColor;
                e.target.style.boxShadow = "none";
              }}
            />
            <div style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: secondaryColor,
              fontSize: "12px"
            }}>
              👤
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "35px" }}>
          <label style={{
            display: "block",
            marginBottom: "10px",
            fontWeight: "600",
            color: textColor,
            fontSize: "14px",
            letterSpacing: "0.5px"
          }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
              style={{
                width: "100%",
                padding: "16px 20px 16px 50px",
                border: `2px solid ${borderColor}`,
                borderRadius: "12px",
                background: inputBg,
                color: textColor,
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = primaryColor;
                e.target.style.boxShadow = darkMode 
                  ? "0 0 0 3px rgba(59, 130, 246, 0.3)" 
                  : "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = borderColor;
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: secondaryColor,
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              {showPassword ? "👁️" : "👁"}
            </button>
          </div>
        </div>

        {/* Role Selection */}
        <div style={{ marginBottom: "35px" }}>
          <label style={{
            display: "block",
            marginBottom: "12px",
            fontWeight: "600",
            color: textColor,
            fontSize: "14px",
            letterSpacing: "0.5px"
          }}>
            Account Type
          </label>
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => setSelectedRole("client")}
              style={{
                flex: 1,
                padding: "16px 20px",
                border: `2px solid ${selectedRole === "client" ? primaryColor : borderColor}`,
                background: selectedRole === "client" ? primaryColor : "transparent",
                color: selectedRole === "client" ? "white" : textColor,
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: selectedRole === "client" 
                  ? "0 4px 15px rgba(59, 130, 246, 0.3)" 
                  : "none"
              }}
              onMouseOver={(e) => {
                if (selectedRole !== "client") {
                  e.target.style.background = "rgba(59, 130, 246, 0.1)";
                }
              }}
              onMouseOut={(e) => {
                if (selectedRole !== "client") {
                  e.target.style.background = "transparent";
                }
              }}
            >
              👤 Client
            </button>
            <button
              onClick={() => setSelectedRole("admin")}
              style={{
                flex: 1,
                padding: "16px 20px",
                border: `2px solid ${selectedRole === "admin" ? "#ef4444" : borderColor}`,
                background: selectedRole === "admin" ? "#ef4444" : "transparent",
                color: selectedRole === "admin" ? "white" : textColor,
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: selectedRole === "admin" 
                  ? "0 4px 15px rgba(239, 68, 68, 0.3)" 
                  : "none"
              }}
              onMouseOver={(e) => {
                if (selectedRole !== "admin") {
                  e.target.style.background = "rgba(239, 68, 68, 0.1)";
                }
              }}
              onMouseOut={(e) => {
                if (selectedRole !== "admin") {
                  e.target.style.background = "transparent";
                }
              }}
            >
              👑 Admin
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={() => {
            setSelectedRole(selectedRole);
            handleLogin();
          }}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "18px",
            background: `linear-gradient(135deg, ${primaryColor}, #2563eb)`,
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "700",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)";
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)";
            }
          }}
        >
          {isLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "20px",
                height: "20px",
                border: "2px solid white",
                borderRadius: "50%",
                borderTop: "2px solid white",
                borderRight: "2px solid white",
                animation: "spin 1s linear infinite"
              }} />
              <span>Signing In...</span>
            </div>
          ) : (
            <span>🚀 Sign In</span>
          )}
        </button>

        {/* Signup Link */}
        <div style={{
          textAlign: "center",
          marginTop: "30px",
          paddingTop: "25px",
          borderTop: `1px solid ${borderColor}`
        }}>
          <p style={{
            margin: 0,
            color: secondaryColor,
            fontSize: "14px"
          }}>
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              style={{
                color: primaryColor,
                textDecoration: "none",
                fontWeight: "600",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.textDecoration = "underline";
              }}
              onMouseOut={(e) => {
                e.target.style.textDecoration = "none";
              }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

