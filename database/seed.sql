-- ============================================================
--  Enhanced Mock Seed Data — Presentation Ready
-- ============================================================
USE gpa_calculator;

-- Clear existing data to avoid duplicates
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE schedule;
TRUNCATE TABLE tasks;
TRUNCATE TABLE courses;
TRUNCATE TABLE semesters;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Create the Demo User
INSERT INTO users (username, password_hash, name, email) 
VALUES ('anas', '$2y$10$exampleHashForAnas000000000000000000000000000000000000', 'Anas Mohammed', 'anas@example.com');

SET @userId = (SELECT id FROM users WHERE username = 'anas');

-- 2. Create Semesters (Strictly matching schema: id, name, user_id)
INSERT INTO semesters (name, user_id) VALUES 
('Fall 2023', @userId), 
('Spring 2024', @userId), 
('Fall 2024', @userId);

SET @sem1 = (SELECT id FROM semesters WHERE name = 'Fall 2023' AND user_id = @userId);
SET @sem2 = (SELECT id FROM semesters WHERE name = 'Spring 2024' AND user_id = @userId);
SET @sem3 = (SELECT id FROM semesters WHERE name = 'Fall 2024' AND user_id = @userId);

-- 3. Courses for Semester 1 (The "Honors" Semester)
INSERT INTO courses (name, grade, credits, grade_points, semester_id, progress) VALUES
('Introduction to Programming', 'A', 3, 4.0, @sem1, 100),
('Calculus I', 'A-', 3, 3.7, @sem1, 100),
('English Composition', 'B+', 2, 3.3, @sem1, 100),
('Physics I', 'A', 3, 4.0, @sem1, 100);

-- 4. Courses for Semester 2 (The "Struggle" Semester)
INSERT INTO courses (name, grade, credits, grade_points, semester_id, progress) VALUES
('Data Structures', 'B', 3, 3.0, @sem2, 100),
('Discrete Mathematics', 'C+', 3, 2.3, @sem2, 100),
('Digital Logic', 'B-', 3, 2.7, @sem2, 100),
('Linear Algebra', 'C', 3, 2.0, @sem2, 100);

-- 5. Courses for Semester 3 (The "Current" Semester)
INSERT INTO courses (name, grade, credits, grade_points, semester_id, progress) VALUES
('Operating Systems', NULL, 3, NULL, @sem3, 45),
('Database Systems', 'B+', 3, 3.3, @sem3, 60),
('Software Engineering', NULL, 3, NULL, @sem3, 30),
('AI Fundamentals', 'A', 3, 4.0, @sem3, 50);

-- 6. Tasks (Mix of statuses for demonstration)
-- Get a course ID from current semester
SET @course_os = (SELECT id FROM courses WHERE name = 'Operating Systems' AND semester_id = @sem3);
SET @course_db = (SELECT id FROM courses WHERE name = 'Database Systems' AND semester_id = @sem3);
SET @course_se = (SELECT id FROM courses WHERE name = 'Software Engineering' AND semester_id = @sem3);

INSERT INTO tasks (title, description, due_date, status, course_id, user_id) VALUES
('OS Project: Kernel Threading', 'Implement a basic thread scheduler', '2024-11-15 23:59:00', 'done', @course_os, @userId),
('DB Lab: Normalization', 'Convert the library schema to 3NF', '2024-10-20 10:00:00', 'overdue', @course_db, @userId),
('SE Midterm Review', 'Read chapters 4-8', '2024-12-01 15:00:00', 'pending', @course_se, @userId),
('AI Essay', 'Discuss the ethics of LLMs', '2024-11-25 23:59:00', 'pending', (SELECT id FROM courses WHERE name = 'AI Fundamentals' AND semester_id = @sem3), @userId);

-- 7. Weekly Schedule (Detailed for current semester)
INSERT INTO schedule (course_id, day_of_week, start_time, end_time, location) VALUES
(@course_os, 'Mon', '09:00:00', '10:30:00', 'Engineering Hall - Room 101'),
(@course_os, 'Wed', '09:00:00', '10:30:00', 'Engineering Hall - Room 101'),
(@course_db, 'Tue', '11:00:00', '12:30:00', 'CS Lab 2'),
(@course_db, 'Thu', '11:00:00', '12:30:00', 'CS Lab 2'),
(@course_se, 'Mon', '14:00:00', '15:30:00', 'Seminar Room A'),
(@course_se, 'Wed', '14:00:00', '15:30:00', 'Seminar Room A'),
((SELECT id FROM courses WHERE name = 'AI Fundamentals' AND semester_id = @sem3), 'Fri', '10:00:00', '12:00:00', 'Main Auditorium');
