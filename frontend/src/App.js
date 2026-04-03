import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import AddJob from "./components/AddJob";
import SearchCompany from "./components/SearchCompany";
import JobTracker from "./components/JobTracker";
import ResumeBuilder from "./components/ResumeBuilder";
import JobPortalEntry from "./components/JobPortalEntry";
import JobSeekerSignup from "./components/JobSeekerSignup";
import RecruiterSignup from "./components/RecruiterSignup";
import JobListingPage from "./components/JobListingPage";
import JobApplicationsDashboard from "./components/JobApplicationsDashboard";
import ResumeUpload from "./components/ResumeUpload";
import CreateJobPosting from "./components/CreateJobPosting";
import RecruiterDashboard from "./components/RecruiterDashboard";
import RecruiterAnalyticsDashboard from "./components/RecruiterAnalyticsDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/add-job" element={<AddJob />} />
      <Route path="/search-company" element={<SearchCompany />} />
      <Route path="/job-tracker" element={<JobTracker />} />
      <Route path="/resume-builder" element={<ResumeBuilder />} />
      
      {/* Job Portal Routes */}
      <Route path="/job-portal" element={<JobPortalEntry />} />
      <Route path="/job-seeker-signup" element={<JobSeekerSignup />} />
      <Route path="/recruiter-signup" element={<RecruiterSignup />} />
      <Route path="/job-listings" element={<JobListingPage />} />
      <Route path="/job-applications-dashboard" element={<JobApplicationsDashboard />} />
      <Route path="/resume-upload" element={<ResumeUpload />} />
      <Route path="/create-job-posting" element={<CreateJobPosting />} />
      <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
      <Route path="/recruiter-analytics" element={<RecruiterAnalyticsDashboard />} />
    </Routes>
  );
}

export default App;


