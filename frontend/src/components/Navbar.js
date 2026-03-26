import React from "react";
import { useNavigate } from "react-router-dom";
import SkillSuggestor from "./SkillSuggestor";
import ResumeBuilder from "./ResumeBuilder";

function Navbar() {

  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div style={{
      background: "#1e293b",
      color: "white",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2 style={{ margin: 0, fontSize: "20px" }}>
        JobTracker {userRole === "admin" && "- Admin"}
      </h2>
      
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "15px"
      }}>
        {userRole === "admin" ? (
          <button
            onClick={() => navigate("/admin-dashboard")}
            style={{
              padding: "8px 16px",
              background: "#374151",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#4b5563";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#374151";
            }}
          >
            Admin Dashboard
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "8px 16px",
                background: "#374151",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#4b5563";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#374151";
              }}
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/add-job")}
              style={{
                padding: "8px 16px",
                background: "#374151",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#4b5563";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#374151";
              }}
            >
              Add Job
            </button>

            <button
              onClick={() => navigate("/search-company")}
              style={{
                padding: "8px 16px",
                background: "#374151",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#4b5563";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#374151";
              }}
            >
              Search Company
            </button>

            <button
              onClick={() => navigate("/resume-builder")}
              style={{
                padding: "8px 16px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#059669";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#10b981";
              }}
            >
              📄 Resume Builder
            </button>
          </>
        )}

        <SkillSuggestor />

        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#dc2626";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#ef4444";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
