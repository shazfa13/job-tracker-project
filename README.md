# 🚀 Job Application Tracker System

A full-stack web application to manage and track job applications with **Admin & Client roles**, analytics dashboard, and modern UI.

---

## 📌 Overview

The **Job Application Tracker System** helps users efficiently track job applications, monitor progress, and analyze outcomes.

It supports:
- 👤 Client users → manage their own job applications  
- 🛠 Admin users → manage all data in the system  

---

## ✨ Features

### 🔐 Authentication & Roles
- Admin & Client login system
- Role-based access control
- Secure session handling

### 📊 Dashboard
- Job statistics (Pie Chart & analytics)
- Application status tracking:
  - Applied
  - Interview
  - Offer
  - Rejected

### 💼 Job Management
- Add job applications
- Edit job details
- Delete jobs
- View job list

### 🔍 Search & Filter
- Search by company
- Filter by status

### 🎨 UI Features
- Modern responsive design
- 🌙 Light / Dark Mode
- Clean dashboard layout

---

## 🏗 Architecture

This project follows a **3-Tier Architecture**:
# 🚀 Job Application Tracker System

  
### 🔹 Frontend
- React.js
- HTML, CSS, JavaScript
- Axios for API calls

### 🔹 Backend
- Node.js
- Express.js
- REST API architecture

### 🔹 Database
- MongoDB (NoSQL)

---

## 📂 Project Structure

### 🔹 Frontend
- React.js
- HTML, CSS, JavaScript
- Axios for API calls

### 🔹 Backend
- Node.js
- Express.js
- REST API architecture

### 🔹 Database
- MongoDB (NoSQL)

---

## 📂 Project Structure
job-tracker/
│
├── backend/
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ └── server.js
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Login.js
│ │ │ ├── Signup.js
│ │ │ ├── Dashboard.js
│ │ │ ├── AdminDashboard.js
│ │ │ ├── AddJob.js
│ │ │ ├── JobList.js
│ │ │ ├── SearchCompany.js
│ │ │ └── Navbar.js
│ │ └── App.js
│
└── README.me

🔄 Workflow
User → Login/Signup
↓
Role-Based Access
↓
Dashboard
↓
Add / View / Edit Jobs
↓
Data stored in MongoDB

 📊 Database Schema

### Users Collection

_id
username
password
role (admin/client)


### Jobs Collection

_id
company
role
status
owner
createdAt


## 🔐 Security Features

- Role-based authorization
- Protected admin routes
- Input validation
- Session management

## 🧑‍💻 Tech Stack

### Frontend
- React.js
- HTML, CSS, JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB

---

## 🎯 Conclusion

This project provides a **complete job tracking solution** with:
- Role-based access
- Interactive dashboard
- Clean UI
- Scalable architecture
