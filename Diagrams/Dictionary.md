### 1. USERS Table

_Stores student account information and credentials._

| Column Name     | Data Type    | Key / Constraints  | Description                     |
| :-------------- | :----------- | :----------------- | :------------------------------ |
| `id`            | INT          | PK, Auto-Increment | Unique identifier for the user. |
| `username`      | VARCHAR(50)  | UNIQUE, NOT NULL   | Student's login username.       |
| `password_hash` | VARCHAR(255) | NOT NULL           | Securely hashed user password.  |
| `name`          | VARCHAR(100) | NOT NULL           | Student's full name.            |
| `email`         | VARCHAR(150) | DEFAULT NULL       | Student's contact email.        |
| `created_at`    | TIMESTAMP    | DEFAULT CURRENT    | When the account was created.   |

<br>

### 2. SEMESTERS Table

_Groups courses by academic term._

| Column Name  | Data Type    | Key / Constraints  | Description                            |
| :----------- | :----------- | :----------------- | :------------------------------------- |
| `id`         | INT          | PK, Auto-Increment | Unique identifier for the semester.    |
| `name`       | VARCHAR(100) | NOT NULL           | Name of term (e.g., "Fall 2024").      |
| `user_id`    | INT          | FK (USERS)         | Links the semester to a specific user. |
| `created_at` | TIMESTAMP    | DEFAULT CURRENT    | When the record was added.             |

<br>

### 3. COURSES Table

_Stores class data, credit weight, and tracks GPA._

| Column Name    | Data Type    | Key / Constraints  | Description                                  |
| :------------- | :----------- | :----------------- | :------------------------------------------- |
| `id`           | INT          | PK, Auto-Increment | Unique identifier for the course.            |
| `name`         | VARCHAR(150) | NOT NULL           | Name of the class (e.g., "Data Structures"). |
| `grade`        | ENUM         | 'A' to 'F'         | Letter grade received for the course.        |
| `credits`      | TINYINT      | CHECK (1 to 6)     | Credit weight of the course.                 |
| `grade_points` | DECIMAL(3,1) | DEFAULT NULL       | Numeric value derived from the letter grade. |
| `semester_id`  | INT          | FK (SEMESTERS)     | Links the course to a specific semester.     |
| `progress`     | TINYINT      | CHECK (0 to 100)   | Percentage of course completion.             |
| `created_at`   | TIMESTAMP    | DEFAULT CURRENT    | When the course was added.                   |

<br>

### 4. TASKS Table

_Manages assignments, deadlines, and study goals._

| Column Name   | Data Type    | Key / Constraints      | Description                              |
| :------------ | :----------- | :--------------------- | :--------------------------------------- |
| `id`          | INT          | PK, Auto-Increment     | Unique identifier for the task.          |
| `title`       | VARCHAR(200) | NOT NULL               | Name of the assignment or task.          |
| `description` | TEXT         | DEFAULT NULL           | Optional details about the task.         |
| `due_date`    | DATETIME     | NOT NULL               | The exact date and time the task is due. |
| `status`      | ENUM         | pending, done, overdue | Current tracking status of the task.     |
| `course_id`   | INT          | FK (COURSES)           | Links the task to the related course.    |
| `user_id`     | INT          | FK (USERS)             | Links the task to the specific user.     |
| `created_at`  | TIMESTAMP    | DEFAULT CURRENT        | When the task was created.               |

<br>

### 5. SCHEDULE Table

_Stores the weekly class timetable._

| Column Name   | Data Type    | Key / Constraints  | Description                                |
| :------------ | :----------- | :----------------- | :----------------------------------------- |
| `id`          | INT          | PK, Auto-Increment | Unique identifier for the schedule block.  |
| `course_id`   | INT          | FK (COURSES)       | Links the time block to a specific course. |
| `day_of_week` | ENUM         | 'Mon' to 'Sun'     | The day the class takes place.             |
| `start_time`  | TIME         | NOT NULL           | Class start time.                          |
| `end_time`    | TIME         | NOT NULL           | Class end time.                            |
| `location`    | VARCHAR(100) | DEFAULT NULL       | Room or building name for the class.       |
