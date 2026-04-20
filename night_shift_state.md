# 🌙 Night Shift State Manifest: GPA Revision

## 📍 Current Status
- **Iteration**: 13
- **Current Phase**: Phase 3: Documentation & Defense Strategy
- **Active Goal**: NONE - PROJECT COMPLETE.

## 🗺️ Roadmap
### Phase 1: Logic & Core Stability (Sprints 1-5)
- [x] Audit GPA calculation logic (prevent > 4.0).
- [x] Implement strict input validation for all forms.
- [x] Fix edge cases (0 courses, empty semesters).
- [x] Verify DB constraints and data integrity.

### Phase 2: UI/UX & "Perfect" Polish (Sprints 6-10)
- [x] Implement @media print CSS (Hide sidebar/navbar in print mode).
- [x] Implement "Night Mode" (Dark Theme).
- [x] Add AI Chat integration (API key field + Chat UI).
- [x] Responsive design audit for all pages.

### Phase 3: Documentation & Defense Strategy (Sprints 11-15)
- [x] Create "Beginner's Guide" (How to run and use).
- [x] Create "Doctor's Defense" guide (Technical justifications + FAQ).
- [x] Create Presentation Day script.
- [x] FINAL SIGN-OFF - Project Perfected.

## ✅ Completed Tasks
- [x] Environment cloned to `/opt/data/home/night_shift/gpa_revision/`.
- [x] State manifest initialized.
- [x] Audit GPA calculation logic:
    - Backend: Verified `LEAST(4.0, ...)` in `server/routes/semesters.php` and `gradeToPoints` mapping in `server/config/helpers.php`.
    - Frontend: Fixed `transcript.html` and `simulator.html` to use `grade_points` instead of `grade` and capped displayed GPAs at 4.0 using `Math.min(4.0, ...)` .
- [x] Implement strict input validation for all forms:
    - Frontend: Added `min`/`max` constraints to credits (1-6) and grades (0-4.0) in `course_manage.html` and `calculator.html`.
    - Backend `courses.php`: Implemented strict validation for `name`, `grade`, `credits` (1-6), and `progress` (0-100).
    - Backend `semesters.php`: Added `name` validation and partial update support.
    - Backend `users.php`: Added `name`, email format, and password length checks.
    - Backend `auth.php`: Added `username`, `password`, and email validation.
- [x] Fix edge cases (0 courses, empty semesters):
    - Backend: Verified `NULLIF` in `semesters.php` to prevent division by zero.
    - Frontend: Added `formatGPA` helper in `transcript.js` and updated `getStanding` to handle null/NaN GPAs.
- [x] Verify DB constraints and data integrity:
    - Audited `database/schema.sql`: Verified `NOT NULL` constraints and `FOREIGN KEY ... ON DELETE CASCADE` on all tables.
    - Verified no orphaned data: `ON DELETE CASCADE` ensures courses/tasks/schedules are removed when semesters/users are deleted.
    - Audited API ownership: Verified all routes in `server/routes/` (semesters, courses, tasks, users) strictly filter by `user_id` or join with `semesters` to prevent cross-user data leakage.
- [x] Implement @media print CSS:
    - Added `@media print` block to `app/src/style/style.css` to hide `.sidebar` and `.btn`, remove margins from `.main-content`, and optimize colors for printing.
- [x] Implement "Night Mode" (Dark Theme):
    - Added theme toggle switch to `settings.html`.
    - Included `theme.js` in all HTML pages for persistence and application.
    - Migrated `transcript.css` and `settings.css` to use theme variables for consistent contrast.
- [x] Implement AI Chat Integration:
    - Added OpenAI API key field to `settings.html` with `localStorage` persistence.
    - Created `chat.css` for a professional, theme-aware floating chat interface.
    - Created `chat.js` to handle AI interactions using a system prompt for academic advising.
    - Integrated chat component into `footer.php` for global availability across all pages.
- [x] Responsive Design Audit:
    - Implemented `mobile-toggle` button and integrated `ui.js` across all main navigation pages (`dashboard.html`, `semesters.html`, `courses.html`, `calculator.html`, `simulator.html`, `transcript.html`, `settings.html`, `semester_view.html`).
    - Wrapped all data tables in `.table-responsive` containers to prevent layout breaking on small screens.
    - Verified a consistent mobile experience across the application.
- [x] Create "Beginner's Guide":
    - Created `BEGINNERS_GUIDE.md` in root directory including installation, setup, and user manual.
- [x] Create "Doctor's Defense" guide:
    - Created `DEFENSE_STRATEGY.md` providing technical justifications for architecture, logic capping, security, and a comprehensive FAQ for the professor.
- [x] Create Presentation Day script:
    - Created `PRESENTATION_SCRIPT.md` detailing a high-impact demo flow, emphasizing logic integrity, UI polish, and modern AI integration.
- [x] FINAL SIGN-OFF:
    - Conducted a comprehensive audit of all "Perfect" standards.
    - Verified GPA capping in `semesters.php` and `helpers.php`.
    - Verified `@media print` optimization in `style.css`.
    - Verified theme and AI key functionality in `settings.html`.
    - Verified AI chat logic in `chat.js`.
    - Confirmed all documentation is present and professional.

## 📝 Notes for Next Iteration
- PROJECT COMPLETE.
- Final sign-off achieved.
- All requirements met to the "Perfect" standard.
