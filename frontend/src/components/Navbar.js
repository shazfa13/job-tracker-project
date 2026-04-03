import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SkillSuggestor from "./SkillSuggestor";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const adminNavItems = [
    { label: "Admin Dashboard", icon: "📊", path: "/admin-dashboard" }
  ];

  const userNavItems = [
    { label: "Dashboard", icon: "📈", path: "/dashboard" },
    { label: "Add Job", icon: "➕", path: "/add-job" },
    { label: "Job Tracker", icon: "🗂", path: "/job-tracker" },
    { label: "Job Portal", icon: "💼", path: "/job-portal" },
    { label: "Search", icon: "🔎", path: "/search-company" },
    { label: "Resume", icon: "📄", path: "/resume-builder" }
  ];

  const navItems = userRole === "admin" ? adminNavItems : userNavItems;
  const pageTitle = userRole === "admin" ? "Admin Workspace" : "Job Application Tracker";

  return (
    <>
      <aside className="app-shell-sidebar">
        <div className="app-shell-brand">
          <span>📋 JobTracker</span>
        </div>

        <nav className="app-shell-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`app-shell-nav-btn ${location.pathname === item.path ? "active" : ""}`}
            >
              <strong>{item.icon}</strong>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <header className="app-shell-topbar">
        <div>
          <strong>{pageTitle}</strong>
        </div>
        <div className="app-shell-actions">
          <SkillSuggestor />
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </header>
    </>
  );
}

export default Navbar;
