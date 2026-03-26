import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const bgColor = darkMode ? "#0f172a" : "#f8fafc";
  const textColor = darkMode ? "#f1f5f9" : "#0f172a";
  const cardBg = darkMode ? "#1e293b" : "#ffffff";
  const borderColor = darkMode ? "#334155" : "#e2e8f0";
  const primaryColor = "#3b82f6";

  return (
    <div style={{
      minHeight: "100vh",
      background: bgColor,
      color: textColor,
      transition: "all 0.3s ease",
      display: "flex",
      flexDirection: "column"
    }}>
      
      {/* Header */}
      <div style={{
        padding: "20px 40px",
        borderBottom: `1px solid ${borderColor}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>
          📋 JobTracker Pro
        </h1>
        <button 
          onClick={toggleDarkMode}
          style={{
            padding: "10px 15px",
            background: darkMode ? "#fbbf24" : "#1f2937",
            color: darkMode ? "black" : "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px"
      }}>
        <div style={{
          maxWidth: "800px",
          width: "100%",
          textAlign: "center"
        }}>
          
          {/* Hero Section */}
          <div style={{
            marginBottom: "60px"
          }}>
            <h2 style={{
              fontSize: "48px",
              fontWeight: "bold",
              margin: "0 0 20px 0",
              background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Track Your Job Search Journey
            </h2>
            <p style={{
              fontSize: "20px",
              margin: "0 0 30px 0",
              color: darkMode ? "#94a3b8" : "#64748b",
              lineHeight: "1.6"
            }}>
              Stay organized, track progress, and land your dream job with our comprehensive job application management system.
            </p>
          </div>

          {/* Features Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            marginBottom: "50px"
          }}>
            <div style={{
              background: cardBg,
              padding: "30px",
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>📊</div>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "20px", fontWeight: "600" }}>
                Analytics Dashboard
              </h3>
              <p style={{ margin: 0, color: darkMode ? "#94a3b8" : "#64748b" }}>
                Visualize your job search progress with detailed charts and insights
              </p>
            </div>

            <div style={{
              background: cardBg,
              padding: "30px",
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>🎯</div>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "20px", fontWeight: "600" }}>
                Stage Tracking
              </h3>
              <p style={{ margin: 0, color: darkMode ? "#94a3b8" : "#64748b" }}>
                Track applications from bookmarked to hired with our visual pipeline
              </p>
            </div>

            <div style={{
              background: cardBg,
              padding: "30px",
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>📝</div>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "20px", fontWeight: "600" }}>
                Smart Notes
              </h3>
              <p style={{ margin: 0, color: darkMode ? "#94a3b8" : "#64748b" }}>
                Keep detailed notes and set follow-up reminders for each application
              </p>
            </div>

            <div style={{
              background: cardBg,
              padding: "30px",
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>🔗</div>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "20px", fontWeight: "600" }}>
                Career Links
              </h3>
              <p style={{ margin: 0, color: darkMode ? "#94a3b8" : "#64748b" }}>
                Save direct links to company career pages for easy access
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div style={{
            background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6)`,
            padding: "40px",
            borderRadius: "16px",
            marginBottom: "40px"
          }}>
            <h3 style={{ 
              margin: "0 0 15px 0", 
              fontSize: "24px", 
              fontWeight: "bold",
              color: "white" 
            }}>
              Ready to Take Control of Your Job Search?
            </h3>
            <p style={{ 
              margin: "0 0 30px 0", 
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: "1.6"
            }}>
              Join thousands of job seekers who've streamlined their application process and landed their dream jobs faster.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "16px 32px",
                fontSize: "18px",
                fontWeight: "600",
                background: primaryColor,
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px rgba(59, 130, 246, 0.1)"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 12px rgba(59, 130, 246, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 6px rgba(59, 130, 246, 0.1)";
              }}
            >
              🚀 Sign In
            </button>
            
            <button
              onClick={() => navigate("/signup")}
              style={{
                padding: "16px 32px",
                fontSize: "18px",
                fontWeight: "600",
                background: "transparent",
                color: primaryColor,
                border: `2px solid ${primaryColor}`,
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.background = primaryColor;
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = primaryColor;
              }}
            >
              ✨ Create Account
            </button>
          </div>

          {/* Footer Info */}
          <div style={{
            marginTop: "60px",
            padding: "20px",
            borderTop: `1px solid ${borderColor}`,
            color: darkMode ? "#64748b" : "#94a3b8",
            fontSize: "14px"
          }}>
            <p style={{ margin: "0 0 10px 0" }}>
              🎯 <strong>JobTracker Pro</strong> - Your Professional Job Search Companion
            </p>
            <p style={{ margin: 0 }}>
              Organize • Track • Succeed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
