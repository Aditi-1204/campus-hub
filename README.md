# 🎓 Campus Hub

> A full-stack MERN web platform to streamline and centralize campus activities — including placements, clubs, events, communication, and administration.

---

## 🚀 Overview

Campus Hub is designed to solve the problem of **scattered campus systems** (WhatsApp groups, emails, manual tracking) by providing a **single unified platform** for:

* Students
* Faculty
* Placement Officers
* Club Coordinators
* Admins

---

## ✨ Key Features

### 🔐 Authentication & Role-Based Access

* Secure login system using JWT
* Role-based dashboards:

  * Student
  * Faculty
  * Placement Officer
  * Admin

---

### 💼 Placement Management System

* Browse verified job & internship listings
* Apply / Withdraw applications
* Save jobs for later
* Track application status:

  * Applied
  * Shortlisted
  * Selected
  * Rejected

#### 👨‍💼 Placement Officer Features

* Post genuine job/internship opportunities
* Manage job listings
* View applicants

---

### 📊 Placement Dashboard (Enhanced)

* Jobs applied / shortlisted / selected stats
* Application tracking UI
* Placement readiness indicators
* Upcoming drives & deadlines
* Resume management (UI-level)

---

### 🎭 Club & Event Management

* Create and manage clubs
* Organize events
* Student registration system
* Member management

---

### 💬 Messaging System

* Student ↔ Faculty communication
* Inbox & message threads

---

### 🛠️ Admin Panel

* Manage users (students, faculty, coordinators)
* System-level control
* Monitor activities

---

## 🧠 Tech Stack

### 💻 Frontend

* React.js (Vite)
* Tailwind CSS

### ⚙️ Backend

* Node.js
* Express.js

### 🗄️ Database

* MongoDB

### 🔐 Authentication

* JWT (JSON Web Tokens)

---

## 📂 Project Structure

```bash
Campus-Hub/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── placements/
│   │   │   ├── forum/
│   │   │   ├── profile/
│   │   │   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd Campus-Hub
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Running the Project

* Frontend → http://localhost:5173
* Backend → http://localhost:5000

---

## 🔥 Highlights

* Full-stack MERN architecture
* Role-based system
* Real-world placement workflow
* Clean and modern UI
* Scalable project structure

---

## ⚠️ Limitations

* Resume upload not fully integrated with backend
* Messaging system is basic
* No real-time updates (yet)

---

## 🚀 Future Enhancements

* Resume upload with cloud storage
* Real-time notifications (WebSockets)
* AI-based job recommendations
* Advanced analytics dashboard

## 📌 Project Scope

This project follows the SRS and extends it with:

* Advanced placement dashboard
* Application tracking UI
* Enhanced user experience

---

## ⭐ Final Note

Campus Hub is not just an academic project —
it is a **real-world scalable platform** designed to improve campus management systems.

---

## 📷 (Optional)

*Add screenshots of your UI here for better presentation*

---

## 📜 License

MIT License
