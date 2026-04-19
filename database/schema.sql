-- ============================================================
--  Study Planner + GPA Tracker — MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS study_planner;
USE study_planner;

-- ─────────────────────────────────────────
--  1. USERS
-- ─────────────────────────────────────────
CREATE TABLE users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) DEFAULT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
--  2. SEMESTERS
-- ─────────────────────────────────────────
CREATE TABLE semesters (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,           -- e.g. "Fall 2024"
    user_id    INT NOT NULL,
    start_date DATE DEFAULT NULL,
    end_date   DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
--  3. COURSES
-- ─────────────────────────────────────────
CREATE TABLE courses (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(150) NOT NULL,          -- e.g. "Data Structures"
    grade        ENUM('A','A-','B+','B','B-','C+','C','C-','D+','D','D-','F') DEFAULT NULL,
    credits      TINYINT NOT NULL CHECK (credits BETWEEN 1 AND 6),
    grade_points DECIMAL(3,1) DEFAULT NULL,      -- auto-calculated from grade
    semester_id  INT NOT NULL,
    progress     TINYINT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),  -- 0–100 %
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
--  4. TASKS
-- ─────────────────────────────────────────
CREATE TABLE tasks (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,           -- e.g. "Submit Assignment 2"
    description TEXT DEFAULT NULL,
    due_date    DATETIME NOT NULL,
    status      ENUM('pending','done','overdue') DEFAULT 'pending',
    course_id   INT NOT NULL,
    user_id     INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE
);

-- ─────────────────────────────────────────
--  5. SCHEDULE
-- ─────────────────────────────────────────
CREATE TABLE schedule (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    course_id   INT NOT NULL,
    day_of_week ENUM('Mon','Tue','Wed','Thu','Fri','Sat','Sun') NOT NULL,
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL,
    location    VARCHAR(100) DEFAULT NULL,       -- room / building (optional)
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
--  Useful indexes
-- ─────────────────────────────────────────
CREATE INDEX idx_semesters_user    ON semesters (user_id);
CREATE INDEX idx_courses_semester  ON courses   (semester_id);
CREATE INDEX idx_tasks_course      ON tasks     (course_id);
CREATE INDEX idx_tasks_user        ON tasks     (user_id);
CREATE INDEX idx_schedule_course   ON schedule  (course_id);
