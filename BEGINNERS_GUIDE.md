# 🎓 GPA Calculator: Beginner's Guide

Welcome to the **GPA Calculator**, a comprehensive academic tracking tool designed to help students manage their semesters, track course performance, and simulate future academic goals with precision.

---

## 🌟 Project Overview
The GPA Calculator is a full-stack application that allows users to maintain a digital academic transcript. Unlike simple calculators, this system persists your data, allows for multi-semester management, and provides AI-powered academic advising to help you optimize your GPA.

### Key Features
- **Persistent Tracking**: Save your progress across multiple semesters.
- **Smart Calculations**: Automatic GPA and CGPA calculation with strict 4.0 capping.
- **Goal Simulation**: Predict how future grades will impact your overall standing.
- **AI Academic Advisor**: Integrated AI chat to help with course planning and GPA strategies.
- **Professional Export**: Optimized print mode for generating clean academic reports.
- **Customizable UI**: Full support for Night Mode for late-night study sessions.

---

## 🚀 Getting Started

### 🛠️ Prerequisites
To run this project locally, you will need:
- **Web Server**: Apache or Nginx (via XAMPP, WAMP, or MAMP).
- **PHP**: Version 7.4 or higher.
- **Database**: MySQL or MariaDB.
- **Browser**: Any modern web browser (Chrome, Firefox, Edge).

### 📦 Installation & Setup
1. **Clone the Repository**:
   Place the project folder in your web server's root directory (e.g., `htdocs` for XAMPP).

2. **Database Configuration**:
   - Open your database management tool (e.g., phpMyAdmin).
   - Create a new database named `gpa_calculator`.
   - Import the schema: Execute the SQL commands found in `/database/schema.sql`.
   - (Optional) Import seed data: Execute `/database/seed.sql` to populate the system with sample data.

3. **Connect the Backend**:
   - Navigate to `/server/config/db.php`.
   - Update the database credentials (`host`, `dbname`, `username`, `password`) to match your local environment.

4. **Launch**:
   - Start your Apache and MySQL services.
   - Open your browser and navigate to `http://localhost/gpa_revision/app/src/pages/login.html`.

---

## 📖 User Manual

### 1. Account Setup
- **Register**: Create a new account via the Register page.
- **Login**: Access your personalized dashboard using your credentials.

### 2. Managing Semesters
- **Create a Semester**: Go to the **Semesters** page and add a new semester (e.g., "Fall 2024").
- **View Details**: Click on a semester card from the dashboard to view all courses within that term.

### 3. Tracking Courses
- **Add Course**: Within a semester, add courses by providing the **Course Name**, **Credit Hours** (1-6), and the **Grade** received.
- **Edit/Delete**: You can modify course details or remove them if a grade changes.
- **Automatic GPA**: The system instantly calculates the semester GPA based on the weighted average of your credits and grade points.

### 4. Using the Simulator
- Navigate to the **Simulator** page.
- Input "What-if" grades for upcoming courses to see how they will affect your CGPA. This is perfect for determining the minimum grade needed to maintain a specific scholarship or honor level.

### 5. AI Chat Assistant
- Open the chat bubble in the bottom right corner.
- **API Key**: Go to **Settings** $\rightarrow$ **AI Settings** and enter your OpenAI API key.
- **Interact**: Ask the AI for advice on how to raise your GPA or for tips on managing a heavy course load.

### 6. Printing Your Transcript
- Navigate to the **Transcript** page.
- Press `Ctrl + P` (Windows) or `Cmd + P` (Mac).
- The system automatically hides the sidebar and navigation menus, providing a professional, clean print-out of your academic record.

---

## 🌓 Customization
- **Night Mode**: Toggle the theme switch in the **Settings** page to switch between Light and Dark modes. Your preference is saved automatically for future visits.

---

## 🛠️ Troubleshooting
- **GPA showing as NaN?** Ensure all courses in the semester have valid grades and credits assigned.
- **Database Connection Error?** Double-check the credentials in `server/config/db.php`.
- **Chat not responding?** Verify that your API key is correct and that you have an active internet connection.
