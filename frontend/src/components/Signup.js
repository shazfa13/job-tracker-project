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
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://127.0.0.1:5000/signup", {
        username,
        password,
        role
      });

      alert("Account Created Successfully");
      navigate("/login");
    } catch (error) {
      alert("User already exists");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDB = async () => {
    if (window.confirm("Are you sure you want to reset the database? This will delete all data.")) {
      try {
        await axios.post("http://127.0.0.1:5000/reset-db");
        alert("Database reset successfully! You can now create new accounts.");
        window.location.reload();
      } catch (error) {
        alert("Failed to reset database");
      }
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
        width: "480px",
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
              🚀 Create Account
            </h1>
          </div>
          <p style={{
            margin: 0,
            color: secondaryColor,
            fontSize: "16px",
            fontWeight: "500"
          }}>
            Join the Job Tracker platform today
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
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSignup();
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
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSignup();
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

        <div style={{ marginBottom: "35px" }}>
          <label style={{
            display: "block",
            marginBottom: "10px",
            fontWeight: "600",
            color: textColor,
            fontSize: "14px",
            letterSpacing: "0.5px"
          }}>
            Account Type
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
                cursor: "pointer",
                boxSizing: "border-box",
                appearance: "none",
                WebkitAppearance: "none"
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
            >
              <option value="client">👤 Client Account</option>
              <option value="admin">👑 Admin Account</option>
            </select>
            <div style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: secondaryColor,
              fontSize: "12px",
              pointerEvents: "none"
            }}>
              ⚙️
            </div>
            <div style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: secondaryColor,
              fontSize: "12px",
              pointerEvents: "none"
            }}>
              ▼
            </div>
          </div>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
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
              <span>Creating Account...</span>
            </div>
          ) : (
            <span>✨ Create Account</span>
          )}
        </button>

        {/* Reset DB Button */}
        <button
          onClick={handleResetDB}
          style={{
            width: "100%",
            padding: "16px",
            background: "transparent",
            color: "#ef4444",
            border: "2px solid #ef4444",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            marginTop: "20px"
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#ef4444";
            e.target.style.color = "white";
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#ef4444";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          🗑️ Reset Database (Development Only)
        </button>

        {/* Login Link */}
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
            Already have an account?{" "}
            <Link 
              to="/login" 
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
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
