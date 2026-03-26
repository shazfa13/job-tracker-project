import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import AddJob from "./components/AddJob";
import SearchCompany from "./components/SearchCompany";
import JobTracker from "./components/JobTracker";
import ResumeBuilder from "./components/ResumeBuilder";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/add-job" element={<AddJob />} />
      <Route path="/search-company" element={<SearchCompany />} />
      <Route path="/job-tracker" element={<JobTracker />} />
      <Route path="/resume-builder" element={<ResumeBuilder />} />
    </Routes>
  );
}

export default App;


