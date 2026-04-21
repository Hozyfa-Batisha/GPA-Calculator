# GPA Calculator & Academic Planner

*7anafoly elsokara 7alwa eldonya mnawara*

A professional, full-stack academic tracking tool designed to help students manage semesters, track course performance, and simulate future academic goals.

## 📚 Documentation
For a complete guide, technical justifications, and the presentation script, please refer to the **[Project Documentation](./PROJECT_DOCUMENTATION.md)**.

---

## 🛠️ Tech Stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Frontend  | Vanilla JS, HTML5, CSS3               |
| Styling   | Custom Variable-based Theme           |
| Backend   | PHP (REST API)                        |
| Database  | MySQL                                |

---

## 📂 Project Structure

```
.
├── app/                      # Frontend
│      └── src/
│           ├── pages/        # Login, Dashboard, etc.
│           ├── scripts/      # Vanilla JS Logic
│           └── style/        # Theme & Page CSS
├── server/                   # Backend
│      └── routes/            # API Endpoints
├── database/                 # SQL Schema & Seeds
└── PROJECT_DOCUMENTATION.md  # Full Guide & Defense Strategy
```

---

## 🧮 GPA Formula

GPA is calculated using the standard weighted average:

```
GPA = (sum of grade_points × credits) / (total credit hours)
```

**Grade Scale:**
- A: 4.0, A-: 3.7, B+: 3.3, B: 3.0, B-: 2.7, C+: 2.3, C: 2.0, C-: 1.7, D+: 1.3, D: 1.0, D-: 0.7, F: 0.0

---

## 🔌 API Endpoints
All endpoints are prefixed with `/api/` and require session authentication.
- `/api/auth` - Registration, Login, Logout
- `/api/semesters` - Semester management
- `/api/courses` - Course and Grade tracking
- `/api/tasks` - Academic task management
- `/api/schedule` - Weekly class scheduling
- `/api/users/me` - Profile management
- `/api/ai/chat` - Academic AI Advisor proxy
