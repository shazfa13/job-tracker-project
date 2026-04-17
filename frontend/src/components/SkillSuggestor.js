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
      const response = await axios.post("/analyze-skills", {
        description: jobDescription
      });

      if (response.data.skills) {
        setSuggestedSkills(response.data.skills);
      }
    } catch (error) {
      const mockSkills = extractSkillsFromText(jobDescription);
      setSuggestedSkills(mockSkills);
    } finally {
      setIsLoading(false);
    }
  };

  const extractSkillsFromText = (text) => {
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

    commonSkills.forEach((skill) => {
      if (
        lowerText.includes(skill.toLowerCase()) ||
        lowerText.includes(skill.toLowerCase().replace(/\./g, "")) ||
        lowerText.includes(skill.toLowerCase().replace(/\s/g, ""))
      ) {
        if (!foundSkills.includes(skill)) {
          foundSkills.push(skill);
        }
      }
    });

    if (lowerText.includes("senior") || lowerText.includes("lead")) {
      foundSkills.push("Leadership", "Mentoring");
    }
    if (lowerText.includes("remote")) {
      foundSkills.push("Remote Collaboration", "Time Management");
    }
    if (lowerText.includes("team")) {
      foundSkills.push("Teamwork", "Collaboration");
    }

    return [...new Set(foundSkills)].slice(0, 12);
  };

  const copySkillsToClipboard = () => {
    const skillsText = suggestedSkills.join(", ");
    navigator.clipboard
      .writeText(skillsText)
      .then(() => {
        alert("Skills copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy skills");
      });
  };

  const clearData = () => {
    setJobDescription("");
    setSuggestedSkills([]);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const textColor = darkMode ? "#f3f4f6" : "#1f2937";
  const borderColor = darkMode ? "#4b5563" : "#e5e7eb";
  const inputBg = darkMode ? "#111827" : "#ffffff";
  const mutedColor = darkMode ? "#9ca3af" : "#6b7280";

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn btn-primary">
        AI Skills
      </button>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-panel" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ margin: 0, color: textColor }}>AI Skill Suggestor</h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-ghost" onClick={toggleDarkMode}>{darkMode ? "Light" : "Dark"}</button>
            <button className="btn btn-danger" onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>

        <div className="stack-16">
          <div>
            <label className="field-label" style={{ color: mutedColor }}>Job Description</label>
            <textarea
              ref={textareaRef}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to extract relevant skills..."
              className="form-control"
              style={{ minHeight: "140px", resize: "vertical", background: inputBg, borderColor, color: textColor }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn btn-primary" onClick={analyzeJobDescription} disabled={isLoading}>
                {isLoading ? "Analyzing..." : "Extract Skills"}
              </button>
              <button
                className="btn btn-danger"
                onClick={clearData}
                disabled={!jobDescription.trim() && suggestedSkills.length === 0}
              >
                Delete Data
              </button>
            </div>
          </div>

          {suggestedSkills.length > 0 && (
            <div className="surface-card" style={{ padding: "16px", background: inputBg, border: `1px solid ${borderColor}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <strong style={{ color: textColor }}>Suggested Skills ({suggestedSkills.length})</strong>
                <button className="btn btn-success" onClick={copySkillsToClipboard}>Copy All</button>
              </div>

              <div className="skill-grid">
                {suggestedSkills.map((skill, index) => (
                  <button
                    key={index}
                    className="skill-chip"
                    onClick={() => {
                      navigator.clipboard.writeText(skill);
                      alert(`Copied: ${skill}`);
                    }}
                    style={{ background: darkMode ? "#1f2937" : "#f8fafc", color: textColor, border: `1px solid ${borderColor}` }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="surface-card" style={{ padding: "12px", background: inputBg, border: `1px solid ${borderColor}` }}>
            <p style={{ margin: 0, fontSize: "12px", color: mutedColor }}>
              Tip: click any skill to copy it individually, or use Copy All for the complete list.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillSuggestor;