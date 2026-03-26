import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function ResumeBuilder() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: ""
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  const [newSkill, setNewSkill] = useState("");

  const [activeSection, setActiveSection] = useState("personal");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/");
      return;
    }
  }, [navigate]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const bgColor = darkMode ? "#1f2937" : "#f8fafc";
  const textColor = darkMode ? "#f3f4f6" : "#1f2937";
  const cardBg = darkMode ? "#374151" : "#ffffff";
  const borderColor = darkMode ? "#4b5563" : "#e2e8f0";
  const primaryColor = "#3b82f6";

  const handlePersonalInfoChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: ""
      }]
    }));
  };

  const updateExperience = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const deleteExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        gpa: ""
      }]
    }));
  };

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const deleteEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const deleteSkill = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now(),
        name: "",
        description: "",
        technologies: "",
        link: ""
      }]
    }));
  };

  const updateProject = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const deleteProject = (id) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const generateResume = () => {
    const resumeHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${resumeData.personalInfo.fullName || 'Resume'}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0; color: #3b82f6; }
        .contact-info { display: flex; justify-content: center; gap: 20px; margin-top: 10px; flex-wrap: wrap; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #3b82f6; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        .item { margin-bottom: 15px; }
        .item h3 { margin: 0 0 5px 0; color: #1f2937; }
        .item p { margin: 0; color: #6b7280; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #3b82f6; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${resumeData.personalInfo.fullName || 'Your Name'}</h1>
        <div class="contact-info">
            ${resumeData.personalInfo.email ? `<span>📧 ${resumeData.personalInfo.email}</span>` : ''}
            ${resumeData.personalInfo.phone ? `<span>📱 ${resumeData.personalInfo.phone}</span>` : ''}
            ${resumeData.personalInfo.location ? `<span>📍 ${resumeData.personalInfo.location}</span>` : ''}
            ${resumeData.personalInfo.linkedin ? `<span>💼 ${resumeData.personalInfo.linkedin}</span>` : ''}
            ${resumeData.personalInfo.github ? `<span>💻 ${resumeData.personalInfo.github}</span>` : ''}
        </div>
    </div>

    ${resumeData.summary ? `
    <div class="section">
        <h2>Professional Summary</h2>
        <p>${resumeData.summary}</p>
    </div>
    ` : ''}

    ${resumeData.experience.length > 0 ? `
    <div class="section">
        <h2>Work Experience</h2>
        ${resumeData.experience.map(exp => `
        <div class="item">
            <h3>${exp.position} - ${exp.company}</h3>
            <p>${exp.startDate} - ${exp.endDate || 'Present'}</p>
            <p>${exp.description}</p>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${resumeData.education.length > 0 ? `
    <div class="section">
        <h2>Education</h2>
        ${resumeData.education.map(edu => `
        <div class="item">
            <h3>${edu.degree} - ${edu.institution}</h3>
            <p>${edu.startDate} - ${edu.endDate || 'Present'} ${edu.gpa ? `| GPA: ${edu.gpa}` : ''}</p>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${resumeData.skills.length > 0 ? `
    <div class="section">
        <h2>Skills</h2>
        <div class="skills">
            ${resumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${resumeData.projects.length > 0 ? `
    <div class="section">
        <h2>Projects</h2>
        ${resumeData.projects.map(proj => `
        <div class="item">
            <h3>${proj.name}</h3>
            <p>${proj.description}</p>
            <p><strong>Technologies:</strong> ${proj.technologies}</p>
            ${proj.link ? `<p><strong>Link:</strong> <a href="${proj.link}">${proj.link}</a></p>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>`;

    const blob = new Blob([resumeHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName || 'resume'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sections = [
    { id: "personal", name: "Personal Info", icon: "👤" },
    { id: "summary", name: "Summary", icon: "📝" },
    { id: "experience", name: "Experience", icon: "💼" },
    { id: "education", name: "Education", icon: "🎓" },
    { id: "skills", name: "Skills", icon: "🛠️" },
    { id: "projects", name: "Projects", icon: "🚀" }
  ];

  return (
    <>
      <Navbar />
      <div style={{
        background: bgColor,
        color: textColor,
        minHeight: "100vh",
        padding: "40px 20px",
        transition: "all 0.3s ease"
      }}>
        
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px"
          }}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: "bold",
                color: textColor
              }}>
                📄 Resume Builder
              </h1>
              <p style={{
                margin: "8px 0 0 0",
                color: darkMode ? "#94a3b8" : "#64748b",
                fontSize: "16px"
              }}>
                Create your professional resume
              </p>
            </div>
            
            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={generateResume}
                style={{
                  padding: "10px 20px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                📥 Download Resume
              </button>
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
          </div>

          {/* Section Navigation */}
          <div style={{
            display: "flex",
            gap: "15px",
            marginBottom: "30px",
            flexWrap: "wrap"
          }}>
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  padding: "12px 20px",
                  background: activeSection === section.id ? primaryColor : cardBg,
                  color: activeSection === section.id ? "white" : textColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease"
                }}
              >
                {section.icon} {section.name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div style={{
            background: cardBg,
            padding: "30px",
            borderRadius: "16px",
            border: `1px solid ${borderColor}`,
            boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
          }}>

            {/* Personal Information */}
            {activeSection === "personal" && (
              <div>
                <h2 style={{ margin: "0 0 20px 0", color: textColor }}>Personal Information</h2>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "20px"
                }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                        background: darkMode ? "#1f2937" : "#ffffff",
                        color: textColor
                      }}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Email</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                        background: darkMode ? "#1f2937" : "#ffffff",
                        color: textColor
                      }}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Phone</label>
                    <input
                      type="tel"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                        background: darkMode ? "#1f2937" : "#ffffff",
                        color: textColor
                      }}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Location</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                        background: darkMode ? "#1f2937" : "#ffffff",
                        color: textColor
                      }}
                      placeholder="New York, NY"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>LinkedIn</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                        background: darkMode ? "#1f2937" : "#ffffff",
                        color: textColor
                      }}
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>GitHub</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.github}
                      onChange={(e) => handlePersonalInfoChange("github", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                        background: darkMode ? "#1f2937" : "#ffffff",
                        color: textColor
                      }}
                      placeholder="github.com/johndoe"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            {activeSection === "summary" && (
              <div>
                <h2 style={{ margin: "0 0 20px 0", color: textColor }}>Professional Summary</h2>
                <textarea
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                  style={{
                    width: "100%",
                    minHeight: "150px",
                    padding: "12px",
                    border: `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    background: darkMode ? "#1f2937" : "#ffffff",
                    color: textColor,
                    fontSize: "16px",
                    resize: "vertical"
                  }}
                  placeholder="Write a brief professional summary about yourself..."
                />
              </div>
            )}

            {/* Experience */}
            {activeSection === "experience" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ margin: 0, color: textColor }}>Work Experience</h2>
                  <button
                    onClick={addExperience}
                    style={{
                      padding: "10px 20px",
                      background: primaryColor,
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    + Add Experience
                  </button>
                </div>
                {resumeData.experience.map((exp) => (
                  <div key={exp.id} style={{
                    background: darkMode ? "#1f2937" : "#f8fafc",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    border: `1px solid ${borderColor}`
                  }}>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      marginBottom: "15px"
                    }}>
                      <input
                        type="text"
                        placeholder="Position"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                        style={{
                          padding: "10px",
                          border: `1px solid ${borderColor}`,
                          borderRadius: "6px",
                          background: darkMode ? "#374151" : "#ffffff",
                          color: textColor
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        style={{
                          padding: "10px",
                          border: `1px solid ${borderColor}`,
                          borderRadius: "6px",
                          background: darkMode ? "#374151" : "#ffffff",
                          color: textColor
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Start Date (e.g., Jan 2020)"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                        style={{
                          padding: "10px",
                          border: `1px solid ${borderColor}`,
                          borderRadius: "6px",
                          background: darkMode ? "#374151" : "#ffffff",
                          color: textColor
                        }}
                      />
                      <input
                        type="text"
                        placeholder="End Date (e.g., Present)"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        style={{
                          padding: "10px",
                          border: `1px solid ${borderColor}`,
                          borderRadius: "6px",
                          background: darkMode ? "#374151" : "#ffffff",
                          color: textColor
                        }}
                      />
                    </div>
                    <textarea
                      placeholder="Job description and achievements..."
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      style={{
                        width: "100%",
                        minHeight: "80px",
                        padding: "10px",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "6px",
                        background: darkMode ? "#374151" : "#ffffff",
                        color: textColor,
                        resize: "vertical"
                      }}
                    />
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      style={{
                        marginTop: "10px",
                        padding: "8px 16px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {activeSection === "education" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ margin: 0, color: textColor }}>Education</h2>
                  <button
                    onClick={addEducation}
                    style={{
                      padding: "10px 20px",
                      background: primaryColor,
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    + Add Education
                  </button>
                </div>
                {resumeData.education.map((edu) => (
                  <div key={edu.id} style={{
                    background: darkMode ? "#1f2937" : "#f8fafc",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    border: `1px solid ${borderColor}`
                  }}>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      marginBottom: "15px"
                    }}>
                      <input
                        type="text"
                        placeholder="Degree (e.g., Bachelor of Science)"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        style={{
                          padding: "10px",
                          border: `1px solid ${borderColor}`,
                          borderRadius: "6px",
                          background: darkMode ? "#374151" : "#ffffff",
                          color: textColor
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                        style={{
                          padding: "10px",
                          border: `1px solid ${borderColor}`,
                          borderRadius: "6px",
                          background: darkMode ? "#374151" : "#ffffff",
                          color: textColor
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                        style={{
                          padding: "10px",
                          border: `1px solid ${borderColor}`,
                          borderRadius: "6px",
                          background: darkMode ? "#374151" : "#ffffff",
                          color: textColor
                        }}
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                        style={{
                          padding: "10px",
                          border: `1px solid ${borderColor}`,
                          borderRadius: "6px",
                          background: darkMode ? "#374151" : "#ffffff",
                          color: textColor
                        }}
                      />
                      <input
                        type="text"
                        placeholder="GPA (optional)"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                        style={{
                          padding: "10px",
                          border: `1px solid ${borderColor}`,
                          borderRadius: "6px",
                          background: darkMode ? "#374151" : "#ffffff",
                          color: textColor
                        }}
                      />
                    </div>
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      style={{
                        padding: "8px 16px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {activeSection === "skills" && (
              <div>
                <h2 style={{ margin: "0 0 20px 0", color: textColor }}>Skills</h2>
                <div style={{
                  display: "flex",
                  gap: "15px",
                  marginBottom: "20px",
                  alignItems: "flex-end"
                }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                      Add New Skill
                    </label>
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkill();
                        }
                      }}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                        background: darkMode ? "#1f2937" : "#ffffff",
                        color: textColor,
                        fontSize: "16px"
                      }}
                      placeholder="Enter a skill (e.g., JavaScript, React, Python)"
                    />
                  </div>
                  <button
                    onClick={addSkill}
                    style={{
                      padding: "12px 24px",
                      background: primaryColor,
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#2563eb";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = primaryColor;
                    }}
                  >
                    + Add Skill
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      background: primaryColor,
                      color: "white",
                      borderRadius: "20px",
                      fontSize: "14px"
                    }}>
                      {skill}
                      <button
                        onClick={() => deleteSkill(index)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "16px",
                          padding: "0",
                          lineHeight: "1"
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {activeSection === "projects" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ margin: 0, color: textColor }}>Projects</h2>
                  <button
                    onClick={addProject}
                    style={{
                      padding: "10px 20px",
                      background: primaryColor,
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    + Add Project
                  </button>
                </div>
                {resumeData.projects.map((proj) => (
                  <div key={proj.id} style={{
                    background: darkMode ? "#1f2937" : "#f8fafc",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    border: `1px solid ${borderColor}`
                  }}>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      marginBottom: "15px"
                    }}>
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                        style={{
                          padding: "10px",
                          border: `1px solid ${borderColor}`,
                          borderRadius: "6px",
                          background: darkMode ? "#374151" : "#ffffff",
                          color: textColor
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Project Link (optional)"
                        value={proj.link}
                        onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                        style={{
                          padding: "10px",
                          border: `1px solid ${borderColor}`,
                          borderRadius: "6px",
                          background: darkMode ? "#374151" : "#ffffff",
                          color: textColor
                        }}
                      />
                    </div>
                    <textarea
                      placeholder="Project description..."
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                      style={{
                        width: "100%",
                        minHeight: "80px",
                        padding: "10px",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "6px",
                        background: darkMode ? "#374151" : "#ffffff",
                        color: textColor,
                        resize: "vertical",
                        marginBottom: "15px"
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Technologies used (e.g., React, Node.js, MongoDB)"
                      value={proj.technologies}
                      onChange={(e) => updateProject(proj.id, "technologies", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "6px",
                        background: darkMode ? "#374151" : "#ffffff",
                        color: textColor,
                        marginBottom: "15px"
                      }}
                    />
                    <button
                      onClick={() => deleteProject(proj.id)}
                      style={{
                        padding: "8px 16px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default ResumeBuilder;
