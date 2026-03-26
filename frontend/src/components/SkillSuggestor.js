import React, { useState, useRef } from "react";
import axios from "axios";

function SkillSuggestor() {
  const [jobDescription, setJobDescription] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const textareaRef = useRef(null);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const analyzeJobDescription = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description first");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate AI API call (in production, this would call your actual AI service)
      const response = await axios.post("http://127.0.0.1:5000/analyze-skills", {
        description: jobDescription
      });

      if (response.data.skills) {
        setSuggestedSkills(response.data.skills);
      }
    } catch (error) {
      // Fallback to mock AI response for demo
      const mockSkills = extractSkillsFromText(jobDescription);
      setSuggestedSkills(mockSkills);
    } finally {
      setIsLoading(false);
    }
  };

  const extractSkillsFromText = (text) => {
    // Simple keyword-based skill extraction as fallback
    const commonSkills = [
      "JavaScript", "Python", "Java", "React", "Node.js", "Angular", "Vue.js",
      "HTML", "CSS", "TypeScript", "MongoDB", "SQL", "PostgreSQL",
      "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Git",
      "Agile", "Scrum", "Project Management", "Communication", "Leadership",
      "Machine Learning", "Data Science", "Analytics", "Marketing", "Sales",
      "Customer Service", "Problem Solving", "Critical Thinking", "Teamwork",
      "REST APIs", "GraphQL", "Microservices", "DevOps", "CI/CD",
      "Testing", "Unit Testing", "Integration Testing", "UI/UX Design",
      "Figma", "Adobe Creative Suite", "Content Writing", "SEO", "SEM"
    ];

    const foundSkills = [];
    const lowerText = text.toLowerCase();
    
    commonSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase()) || 
          lowerText.includes(skill.toLowerCase().replace(/\./g, "")) ||
          lowerText.includes(skill.toLowerCase().replace(/\s/g, ""))) {
        if (!foundSkills.includes(skill)) {
          foundSkills.push(skill);
        }
      }
    });

    // Add some contextual skills based on keywords
    if (lowerText.includes("senior") || lowerText.includes("lead")) {
      foundSkills.push("Leadership", "Mentoring");
    }
    if (lowerText.includes("remote")) {
      foundSkills.push("Remote Collaboration", "Time Management");
    }
    if (lowerText.includes("team")) {
      foundSkills.push("Teamwork", "Collaboration");
    }

    return [...new Set(foundSkills)].slice(0, 12); // Remove duplicates and limit to 12
  };

  const copySkillsToClipboard = () => {
    const skillsText = suggestedSkills.join(", ");
    navigator.clipboard.writeText(skillsText).then(() => {
      alert("Skills copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy skills");
    });
  };

  const bgColor = darkMode ? "#1f2937" : "#ffffff";
  const textColor = darkMode ? "#f3f4f6" : "#1f2937";
  const cardBg = darkMode ? "#374151" : "#ffffff";
  const borderColor = darkMode ? "#4b5563" : "#e5e7eb";
  const primaryColor = "#3b82f6";

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "10px 16px",
          background: primaryColor,
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        🤖 AI Skills
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: cardBg,
        padding: "30px",
        borderRadius: "16px",
        width: "90%",
        maxWidth: "700px",
        maxHeight: "80vh",
        overflowY: "auto"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: "24px", 
            fontWeight: "bold",
            color: textColor 
          }}>
            🤖 AI Skill Suggestor
          </h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={toggleDarkMode}
              style={{
                padding: "8px 12px",
                background: darkMode ? "#fbbf24" : "#1f2937",
                color: darkMode ? "black" : "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: "8px 12px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: textColor
          }}>
            Job Description:
          </label>
          <textarea
            ref={textareaRef}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to extract relevant skills..."
            style={{
              width: "100%",
              height: "150px",
              padding: "15px",
              border: `1px solid ${borderColor}`,
              borderRadius: "8px",
              background: darkMode ? "#1f2937" : "#ffffff",
              color: textColor,
              fontSize: "14px",
              resize: "vertical",
              fontFamily: "Arial, sans-serif"
            }}
          />
        </div>

        {/* Analyze Button */}
        <div style={{ marginBottom: "25px", textAlign: "center" }}>
          <button
            onClick={analyzeJobDescription}
            disabled={isLoading}
            style={{
              padding: "12px 24px",
              background: isLoading ? "#9ca3af" : primaryColor,
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "600",
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? "🔄 Analyzing..." : "🔍 Extract Skills"}
          </button>
        </div>

        {/* Results Section */}
        {suggestedSkills.length > 0 && (
          <div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px"
            }}>
              <h3 style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "600",
                color: textColor
              }}>
                Suggested Skills ({suggestedSkills.length}):
              </h3>
              <button
                onClick={copySkillsToClipboard}
                style={{
                  padding: "8px 16px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                📋 Copy All
              </button>
            </div>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "10px",
              maxHeight: "300px",
              overflowY: "auto",
              padding: "15px",
              background: darkMode ? "#1f2937" : "#f8fafc",
              borderRadius: "8px",
              border: `1px solid ${borderColor}`
            }}>
              {suggestedSkills.map((skill, index) => (
                <div
                  key={index}
                  style={{
                    padding: "8px 12px",
                    background: darkMode ? "#374151" : "#ffffff",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: textColor,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(skill);
                    alert(`Copied: ${skill}`);
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = primaryColor;
                    e.target.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = darkMode ? "#374151" : "#ffffff";
                    e.target.style.color = textColor;
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div style={{
          marginTop: "20px",
          padding: "15px",
          background: darkMode ? "#1f2937" : "#f8fafc",
          borderRadius: "8px",
          border: `1px solid ${borderColor}`
        }}>
          <p style={{
            margin: 0,
            fontSize: "12px",
            color: darkMode ? "#94a3b8" : "#64748b"
          }}>
            💡 <strong>Tip:</strong> Click on any skill to copy it individually, or use "Copy All" to get the complete list for your resume.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SkillSuggestor;
