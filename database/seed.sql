-- ============================================================
--  Seed Data — for development/testing
-- ============================================================
USE gpa_calculator;

-- 1. Create a demo user
INSERT INTO users (username, password_hash, name, email) 
VALUES ('anas', '$2y$10$exampleHashForAnas000000000000000000000000000000000000', 'Anas', 'anas@example.com')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Set a variable for the demo user ID
SET @demo_user_id = (SELECT id FROM users WHERE username = 'anas');

-- 3. Create semesters for the demo user
INSERT INTO semesters (name, user_id, start_date, end_date) VALUES
('Fall 2024', @demo_user_id, '2024-09-01', '2024-12-31'),
('Spring 2025', @demo_user_id, '2025-02-01', '2025-06-30');

-- 4. Get the IDs of the created semesters
SET @sem1 = (SELECT id FROM semesters WHERE name = 'Fall 2024' AND user_id = @demo_user_id LIMIT 1);
SET @sem2 = (SELECT id FROM semesters WHERE name = 'Spring 2025' AND user_id = @demo_user_id LIMIT 1);

-- 5. Courses for semester 1
INSERT INTO courses (name, grade, credits, grade_points, semester_id, progress) VALUES
('Data Structures',     'A',  3, 4.0, @sem1, 100),
('Calculus II',         'B+', 3, 3.3, @sem1, 100),
('English Composition', 'A-', 2, 3.7, @sem1, 100);

-- 6. Courses for semester 2
INSERT INTO courses (name, grade, credits, grade_points, semester_id, progress) VALUES
('Algorithms',          'B',  3, 3.0, @sem2, 60),
('Operating Systems',   NULL, 3, NULL, @sem2, 30);

-- 7. Tasks for demo user
-- Use a subquery to get a course ID from the demo user's courses
SET @course_id = (SELECT id FROM courses WHERE user_id = @demo_user_id LIMIT 1);

INSERT INTO tasks (title, description, due_date, status, course_id, user_id) VALUES
('Assignment 2',    'Implement a binary search tree', '2025-03-15 23:59:00', 'done',    @course_id, @demo_user_id),
('Midterm Exam',    NULL,                             '2025-03-20 10:00:00', 'overdue', @course_id, @demo_user_id),
('Lab Report 3',    'Write up the process scheduling lab', '2025-04-25 23:59:00', 'pending', @course_id, @demo_user_id);

-- 8. Schedule for demo user courses
INSERT INTO schedule (course_id, day_of_week, start_time, end_time, location)
SELECT id, 'Mon', '09:00:00', '10:30:00', 'Building A - Room 101'
FROM courses WHERE semester_id = @sem1 LIMIT 1;

INSERT INTO schedule (course_id, day_of_week, start_time, end_time, location)
SELECT id, 'Tue', '11:00:00', '12:30:00', 'Building B - Lab 3'
FROM courses WHERE semester_id = @sem2 LIMIT 1;
