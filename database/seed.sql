-- ============================================================
--  Seed Data — for development/testing
-- ============================================================
USE study_planner;

-- Demo user (password: "password123" hashed with bcrypt)
INSERT INTO users (username, password_hash, name, email) VALUES
('anas',   '$2y$10$exampleHashForAnas000000000000000000000000000000000000', 'Anas',   'anas@example.com'),
('hozyfa', '$2y$10$exampleHashForHozyfa00000000000000000000000000000000000', 'Hozyfa', 'hozyfa@example.com');

-- Semesters for user 1
INSERT INTO semesters (name, user_id, start_date, end_date) VALUES
('Fall 2024',   1, '2024-09-01', '2024-12-31'),
('Spring 2025', 1, '2025-02-01', '2025-06-30');

-- Courses for semester 1
INSERT INTO courses (name, grade, credits, grade_points, semester_id, progress) VALUES
('Data Structures',     'A',  3, 4.0, 1, 100),
('Calculus II',         'B+', 3, 3.3, 1, 100),
('English Composition', 'A-', 2, 3.7, 1, 100);

-- Courses for semester 2
INSERT INTO courses (name, grade, credits, grade_points, semester_id, progress) VALUES
('Algorithms',          'B',  3, 3.0, 2, 60),
('Operating Systems',   NULL, 3, NULL, 2, 30);

-- Tasks for user 1
INSERT INTO tasks (title, description, due_date, status, course_id, user_id) VALUES
('Assignment 2',    'Implement a binary search tree', '2025-03-15 23:59:00', 'done',    4, 1),
('Midterm Exam',    NULL,                             '2025-03-20 10:00:00', 'overdue', 4, 1),
('Lab Report 3',    'Write up the process scheduling lab', '2025-04-25 23:59:00', 'pending', 5, 1);

-- Schedule for user 1 courses
INSERT INTO schedule (course_id, day_of_week, start_time, end_time, location) VALUES
(4, 'Mon', '09:00:00', '10:30:00', 'Building A - Room 101'),
(4, 'Wed', '09:00:00', '10:30:00', 'Building A - Room 101'),
(5, 'Tue', '11:00:00', '12:30:00', 'Building B - Lab 3'),
(5, 'Thu', '11:00:00', '12:30:00', 'Building B - Lab 3');
