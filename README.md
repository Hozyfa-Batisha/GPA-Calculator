# GPA Calculator
*7anafoly elsokara 7alwa eldonya mnawara*

## pages

-   Anas:
    - **Login / Register**: Create an account and log in securely.
    - **Home Dashboard**: See all your semesters at a glance(cards), with each semester's GPA, Courses, Credits and your overall CGPA, total of Course, Credits.
- Hozyfa:
    - **GPA Calculator**: Add courses to any semester — enter the course name, grade (A to F), and credit hours. The GPA for that semester is calculated automatically.
    - **Course Rankings**: See all your courses ranked from best to worst grade across all semesters.
- Yasmen:  
    - **Transcript**: Full academic record across all semesters.
    - **User Settings**: Manage and edit the profile information.
---

## Tech Stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Frontend  | React (with a little of TypeScript)  |
| Styling   | Botstrab CSS                         |
| Backend   | Node.js                              |
| Database  | PostgreSQL                           |
| API       | REST API                             |

---

## Project Structure

```
.
├── app/
│   └── frontend/             # frontend
│       └── src/
│           ├── pages/        # Login, Home, Semester, Rankings, etc..
│           ├── components/   # UI components (shadcn)
│           └── etc/          # The other sources
├─── backend/
│   └── server/               # backend
│       └── src/
├── database/                 # DB scripts, schema
└── README.md
```

---

## Database (in principle)

**users**
- `id` — primary key
- `username` — unique, used for login
- `password_hash` — hashed with bcryptjs
- `name` — display name 

**semesters**
- `id` — primary key
- `name` — e.g. "Fall 2024"
- `user_id` — links to the user who owns it

**courses**
- `id` — primary key
- `name` — e.g. "Data Structures"
- `grade` — one of: A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F
- `credits` — 1 to 6 credit hours
- `grade_points` — calculated from grade (A = 4.0, F = 0.0)
- `semester_id` — links to the semester

---

## GPA Formula

GPA is calculated using the standard weighted average:

```
GPA = (sum of grade_points × credits) / (total credit hours)
```

Grade scale used:

| Grade | Points |
|-------|--------|
| A     | 4.0    |
| A-    | 3.7    |
| B+    | 3.3    |
| B     | 3.0    |
| B-    | 2.7    |
| C+    | 2.3    |
| C     | 2.0    |
| C-    | 1.7    |
| D+    | 1.3    |
| D     | 1.0    |
| D-    | 0.7    |
| F     | 0.0    |

---

## API Endpoints
    (┬┬﹏┬┬)

---
