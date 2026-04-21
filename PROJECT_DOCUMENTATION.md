# 📚 GPA Calculator & Academic Planner: Complete Documentation

This document serves as the definitive guide, technical manual, and defense strategy for the GPA Calculator project. It consolidates all project guides into a single, professional reference.

---

## 🌟 1. Project Overview
The GPA Calculator is a full-stack academic tracking tool designed to help students manage their semesters, track course performance, and simulate future academic goals.

### Key Features
- **Persistent Tracking**: Save academic progress across multiple semesters.
- **Smart Calculations**: Automatic GPA and CGPA calculation with a strict 4.0 capping system.
- **Goal Simulation**: Predict how future grades impact overall standing.
- **AI Academic Advisor**: Integrated AI chat to help with course planning and GPA strategies.
- **Professional Export**: Optimized print mode for generating clean academic reports.
- **Customizable UI**: Full support for Light and Dark modes for accessibility.

---

## 🚀 2. Installation & User Manual

### 🛠️ Prerequisites
- **Web Server**: Apache or Nginx (via XAMPP, WAMP, or MAMP).
- **PHP**: Version 7.4 or higher.
- **Database**: MySQL or MariaDB.
- **Browser**: Any modern web browser.

### 📦 Setup Instructions
1. **Clone the Repository**: Place the project folder in your web server's root directory (e.g., `htdocs`).
2. **Database Configuration**:
   - Create a database named `gpa_calculator`.
   - Import `/database/schema.sql`.
   - (Optional) Import `/database/seed.sql` for sample data.
3. **Backend Connection**: Update `/server/config/db.php` with your local database credentials.
4. **Launch**: Navigate to `http://localhost/[folder_name]/app/src/pages/login.html`.

### 📖 User Guide
- **Account**: Register an account and login to access your personal dashboard.
- **Semesters**: Create semesters (e.g., "Fall 2024") to group your courses.
- **Courses**: Add courses with their names, credits (1-6), and grades. The system handles the weighted average automatically.
- **Simulator**: Use the Simulator page to input "What-if" grades to see the potential impact on your CGPA.
- **AI Chat**: Enter your OpenAI API key in **Settings** $\rightarrow$ **AI Settings** to activate the AI Academic Advisor.
- **Printing**: Visit the **Transcript** page and press `Ctrl + P` for a professional A4-formatted report.

---

## 🏛️ 3. Technical Architecture & Justification

### 🛠️ Tech Stack
- **Backend**: PHP (API-driven).
- **Database**: MySQL (Relational).
- **Frontend**: Vanilla JavaScript, HTML5, CSS3.

### ⚖️ Architectural Decisions
- **Relational Integrity**: MySQL was chosen to manage the hierarchical relationship (`User` $\rightarrow$ `Semester` $\rightarrow$ `Course`). `ON DELETE CASCADE` ensures database hygiene by removing associated records automatically.
- **Zero-Abstraction Frontend**: By avoiding frameworks like React, the project demonstrates a fundamental mastery of the DOM, asynchronous `fetch` requests, and CSS Grid/Flexbox.
- **RESTful API**: The separation of `/app` and `/server` ensures the logic is decoupled, allowing for future scalability (e.g., a mobile app using the same API).

### 🛡️ Security & Integrity
- **IDOR Prevention**: Every API route strictly filters queries by the session's `user_id`, ensuring users can only access their own data.
- **The 4.0 Ceiling**: To maintain institutional realism, GPA is capped at 4.0 using `LEAST(4.0, ...)` in SQL and `Math.min(4.0, gpa)` in JavaScript.
- **Client-Side AI Keys**: The OpenAI API key is stored in `localStorage`, ensuring the server never sees or stores sensitive user keys.
- **Input Validation**: Credits are capped between 1 and 6 to prevent "data bombing" and artificial GPA inflation.

---

## 🎤 4. Presentation & Demo Guide

### 🕒 Demo Flow (5-7 Minutes)
1. **UI & Accessibility (1 Min)**: Show the Dashboard. Toggle **Dark Mode** to demonstrate the theme-variable system and resize the window to show **Responsive Design**.
2. **Logic & Integrity (2 Mins)**: Demonstrate the **Input Validation** (trying to enter invalid credits) and explain the **4.0 Cap**.
3. **Professional Utility (1 Min)**: Show the **Transcript** page and use the **Print Preview** (`Ctrl+P`) to show the clean, professional output.
4. **AI Integration (1 Min)**: Show the **AI Advisor** in action. Demonstrate setting the API key in Settings and asking for GPA improvement strategies.
5. **Conclusion (1 Min)**: Summarize the commitment to quality: secure routes, polished UI, and professional documentation.

---

## ❓ 5. Technical FAQ (Defense Strategy)

**Q: Why not use a modern JS framework (React/Vue)?**
**A**: To ensure maximum portability and zero build-time overhead. It proves a deep understanding of the core web technologies without relying on third-party abstractions.

**Q: How is the GPA calculated?**
**A**: Using a weighted average formula: $\frac{\sum (\text{Grade Points} \times \text{Credits})}{\sum \text{Credits}}$. This is the institutional standard.

**Q: How do you handle concurrent users?**
**A**: Via session-based authentication. Every request is filtered by a unique `user_id` from the session, ensuring total data isolation.

**Q: What happens if a user deletes a semester?**
**A**: The `ON DELETE CASCADE` constraint in the database automatically deletes all associated courses and schedules, preventing orphaned records.
