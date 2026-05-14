# civic_report_issue_mern

# 🚨 Civic Issue Reporting System

A full-stack MERN application that enables citizens to report civic problems such as potholes, water leakage, garbage accumulation, streetlight failures, and road damage. Authorities can assign issues to departments, departments can update progress, and citizens receive real-time notifications and status updates.

---

## 🌐 Live Demo

- **Frontend (Vercel):** https://civic-report-issue-mern-gw1k-eq9aq9h7c.vercel.app
- **Backend API (Render):** https://civic-report-issue-mern.onrender.com
- **GitHub Repository:** https://github.com/chandrashekar-chandu/civic_report_issue_mern

---

## 📌 Project Overview

The Civic Issue Reporting System digitizes the process of reporting and resolving public infrastructure problems.

### 👥 User Roles

#### 🧑 Citizen
- Register and login securely
- Report civic issues with images and location details
- Track issue status
- Receive notifications
- View comments and updates

#### 🏛️ Authority
- View all reported issues
- Assign issues to departments
- Monitor analytics and reports
- Update issue status if needed

#### 🏢 Department
- View assigned issues
- Update issue status (`Pending`, `Assigned`, `In Progress`, `Resolved`, `Rejected`)
- Add comments and progress updates

---

## ✨ Features

- 🔐 JWT Authentication and Authorization
- 🧩 Role-Based Access Control (RBAC)
- 📝 Issue Reporting with Image Upload (Multer)
- 📍 Location Information Support
- 🏢 Department Assignment Workflow
- 🔄 Status Tracking System
- 🔔 Notification System
- 💬 Comment System
- 📊 Analytics Dashboard
- 🕒 Activity Logging
- ☁️ Deployment on Vercel and Render

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT (JSON Web Token)
- Multer

### Database
- MongoDB Atlas
- Mongoose

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 🏗️ System Architecture

```text
Citizen → Reports Issue → MongoDB Atlas
                      ↓
Authority → Assigns Department
                      ↓
Department → Updates Status & Comments
                      ↓
Citizen ← Receives Notifications
