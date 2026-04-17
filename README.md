# Job Tracker Project

A full-stack job management platform that supports three user experiences in one codebase:

- Job seekers who track applications, resumes, deadlines, and job portal submissions.
- Recruiters who create job postings, review applicants, and make decisions.
- Admin users who manage platform-wide jobs and client accounts.

The project uses a React frontend and an Express + MongoDB backend.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Architecture](#backend-architecture)
- [How Roles Work](#how-roles-work)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Backend API Reference](#backend-api-reference)
- [Database Collections](#database-collections)
- [Troubleshooting](#troubleshooting)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

## Overview

Job Tracker combines classic personal job tracking with a mini hiring portal.

Main experiences:

- Core app flow for client/admin users: signup/login, dashboard views, add and manage tracked jobs, notes, status progression, resume builder, and skill suggestions.
- Job portal flow for job seekers and recruiters: role-based signup/login, posting jobs, applying with attachments, applicant review, and analytics.

## Key Features

### Core Job Tracking

- Add jobs with company, role, status, notes, links, deadlines, and follow-up dates.
- Filter/search/sort job applications.
- Edit and delete saved jobs.
- Track pipeline stages and visualize deadlines.

### Resume Management

- Create and manage structured resumes (personal info, summary, experience, education, skills, projects).
- Upload downloadable resume files for job portal applications.

### Job Portal

- Recruiters can create and delete job postings.
- Job seekers can browse listings and apply with resume + cover page attachments.
- Job seekers can withdraw applications.
- Recruiters can accept or reject applications.

### Analytics and Admin

- Recruiter analytics summary per posting (applicants, accepted/rejected/pending).
- Admin dashboard for viewing/removing clients and jobs.

### AI-Style Skill Helper

- Skill extraction endpoint and UI helper for parsing job descriptions into relevant skills.

## Tech Stack

### Frontend

- React 19
- React Router
- Axios
- Chart.js + Recharts
- Create React App build tooling

### Backend

- Node.js
- Express
- MongoDB Node Driver
- CORS
- dotenv

### Tooling

- concurrently for running frontend and backend together
- nodemon for backend development

## Project Structure

```text
job-tracker-project/
	package.json                # root scripts to run both apps
	backend/
		package.json
		server.js                 # Express bootstrap
		controllers/              # Request handlers grouped by feature
		middleware/               # Shared Express middleware
		models/                   # MongoDB connection + serializers
		routes/                   # Route definitions wired to controllers
	frontend/
		package.json
		src/
			App.js                  # route map
			components/             # UI modules for all roles
			services/api.js         # axios instance (optional use)
```

## Backend Architecture

The backend uses a modular Express structure while keeping existing API routes unchanged.

Request flow:

1. `server.js` bootstraps Express and global middleware.
2. `models/database.js` initializes MongoDB and creates indexes.
3. `routes/*.js` defines endpoint paths.
4. `controllers/*.js` handles request/response logic.
5. `middleware/errorHandler.js` catches uncaught runtime errors and returns JSON errors.

Controller-to-domain mapping:

- `authController`: signup/login
- `resumeController`: resume builder + resume upload
- `jobController`: job tracker + notes + reset-db + skill analysis
- `adminController`: admin jobs/clients management
- `portalController`: recruiter + job-seeker portal flows

## How Roles Work

This project stores role/user session fields in local storage and returns role data from the backend login response.

Primary roles in use:

- `client`: regular tracker user (core dashboard flow).
- `admin`: platform admin (admin dashboard flow).
- `job_seeker`: portal applicant flow.
- `recruiter`: portal recruiting flow.

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- MongoDB running locally or a reachable MongoDB URI

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd job-tracker-project
npm run install-all
```

### 2. Configure environment

Create a `.env` file in `backend/`:

```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=jobtracker
PORT=5000
```

Optional frontend env (`frontend/.env`):

```env
REACT_APP_API_URL=http://127.0.0.1:5000
```

### 3. Run the app

From project root:

```bash
npm start
```

Default URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Environment Variables

### Backend (`backend/.env`)

- `MONGO_URI`: MongoDB connection string.
- `DB_NAME`: database name (defaults to `jobtracker`).
- `PORT`: Express server port (defaults to `5000`).

### Frontend (`frontend/.env`)

- `REACT_APP_API_URL`: optional API base URL if you use a separate frontend domain.

Current behavior: frontend requests use relative API paths (for example `/jobs`), which works out of the box when frontend and backend are served from the same origin.

## Available Scripts

### Root scripts

- `npm start`: runs backend + frontend together using concurrently.
- `npm run backend`: starts backend only.
- `npm run frontend`: starts frontend only.
- `npm run backend:dev`: starts backend with nodemon.
- `npm run build`: builds frontend production bundle.
- `npm run install-all`: installs root, backend, and frontend dependencies.

### Backend scripts

- `npm start`: run server with Node.
- `npm run dev`: run server with nodemon.

### Frontend scripts

- `npm start`: React development server.
- `npm run build`: production build.
- `npm test`: test runner.

## Deployment

Current deployment target:

- Frontend -> Vercel
- Backend -> Render
- Database -> MongoDB Atlas

### 1) Deploy Backend to Render

This repo includes `render.yaml` configured for backend-only deployment.

Render service settings used:

- Build command: `cd backend && npm install`
- Start command: `cd backend && npm start`

Required Render environment variables:

- `NODE_ENV=production`
- `MONGO_URI=<your-atlas-connection-string>`
- `DB_NAME=jobtracker`
- `PORT=10000` (or Render-provided port)
- `FRONTEND_ORIGIN=<your-vercel-domain>`
- `SERVE_STATIC_FRONTEND=false`

### 2) Deploy Frontend to Vercel

In Vercel project settings:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `build`

Required Vercel environment variable:

- `REACT_APP_API_URL=<your-render-backend-url>`

Notes:

- SPA route fallback is configured in `frontend/vercel.json`.
- Global Axios base URL is configured in `frontend/src/index.js`.

### 3) Use MongoDB Atlas

Create an Atlas cluster, then set Render `MONGO_URI` with your Atlas connection string.

Atlas checklist:

- Create DB user and password.
- Add Render outbound IP access (or temporary `0.0.0.0/0` for testing).
- Ensure connection string includes retry options from Atlas template.

## Backend API Reference

Base URL: `http://127.0.0.1:5000`

### Authentication

- `POST /signup`
	- Creates a new user.
	- Body: `username`, `password`, optional `role`.
- `POST /login`
	- Authenticates user by username/password.
	- Returns `role` and `user_id`.

### Resume Builder Resumes

- `POST /resumes`
- `GET /resumes?user_id=<id>`
- `PUT /resumes/:resumeId`
- `DELETE /resumes/:resumeId?user_id=<id>`

### Job Tracking

- `POST /jobs`
- `GET /jobs?user_id=<id>&role=<client|admin>`
- `PUT /jobs/:jobId`
- `DELETE /jobs/:jobId?user_id=<id>&role=<client|admin>`
- `GET /jobs/:jobId/notes?user_id=<id>&role=<client|admin>`
- `POST /jobs/:jobId/notes`

### Admin

- `GET /admin/jobs?role=admin`
- `DELETE /admin/jobs/:jobId?role=admin`
- `GET /admin/clients?role=admin`
- `DELETE /admin/clients/:clientId?role=admin`
- `POST /reset-db` (development utility)

### Skill Analysis

- `POST /analyze-skills`
	- Body: `description`
	- Returns extracted/suggested skills.

### Job Portal - Recruiter

- `POST /create-job-posting`
- `GET /job-postings`
- `GET /recruiter-jobs/:recruiterId`
- `DELETE /job-postings/:jobId`
- `GET /recruiter-analytics/:recruiterId`
- `GET /job-applicants/:jobId`

### Job Portal - Job Seeker Applications

- `POST /apply-job`
- `GET /job-applications/:userId`
- `DELETE /job-applications/:applicationId?user_id=<id>`
- `PATCH /job-applications/:applicationId/status`

### Job Seeker Resume Uploads

- `POST /upload-resume`
- `GET /resumes/:userId`

## Database Collections

The backend initializes these collections:

- `users`
- `jobs`
- `resumes`
- `job_postings`
- `job_applications`
- `job_seeker_resumes`

Indexes are created for common lookup fields such as `username`, `user_id`, `recruiter_id`, and `job_id`.

## Troubleshooting

### Backend not reachable

- Ensure MongoDB is running.
- Verify backend started on port 5000.
- Check `backend/.env` values.

### `npm run dev` exits with code 1 (backend)

- From `backend/`, run `npm run dev`.
- From project root, run `npm run backend:dev`.
- Ensure `backend/.env` has valid `MONGO_URI`, `DB_NAME`, and `PORT` values.
- If using MongoDB Atlas, verify connection string credentials and network allow-list.
- Check backend logs for `Failed to connect MongoDB` and fix DB connectivity before retrying.

### Login/signup failures

- Duplicate usernames return a 400 error.
- Invalid credentials return 401 on login.

### CORS or network issues

- Confirm frontend calls point to the same backend URL and port.
- If deploying, replace hard-coded `127.0.0.1` URLs in frontend components.

### Application already exists when applying

- `POST /apply-job` returns 409 if the same user already applied to the same job posting.

## Known Limitations

- Passwords are stored in plain text (no hashing yet).
- Auth uses local storage and simple role checks, not token/session-based authorization.
- Many frontend components use hard-coded API URLs instead of one centralized API client.
- API coverage has no formal automated test suite yet.

## Future Improvements

- Add secure authentication with hashed passwords and JWT/session handling.
- Centralize all frontend API calls through one configurable service.
- Add backend validation middleware and rate limiting.
- Add unit/integration tests for critical API and UI flows.
- Improve deployment readiness (environment-specific config, health checks, CI/CD).

LIVE LINK:https://job-tracker-project-rp6r.onrender.com
