<?php
// ============================================================
//  server/routes/courses.php
//  GET    /api/courses?semester_id=:id  — list courses in semester
//  POST   /api/courses                  — add course
//  PUT    /api/courses?id=:id           — update course / grade / progress
//  DELETE /api/courses?id=:id           — delete course
// ============================================================

require_once __DIR__ . '/../config/helpers.php';

$userId = requireAuth();
$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = (int) ($_GET['id'] ?? 0);

// ── GET /api/courses?semester_id=:id ─────────────────────────
if ($method === 'GET') {
    $semesterId = (int) ($_GET['semester_id'] ?? 0);
    if (!$semesterId) respondError('semester_id is required.');

    // Confirm semester belongs to user
    $check = $pdo->prepare("SELECT id FROM semesters WHERE id = ? AND user_id = ?");
    $check->execute([$semesterId, $userId]);
    if (!$check->fetch()) respondError('Semester not found.', 404);

    $stmt = $pdo->prepare("
        SELECT
            c.*,
            (SELECT COUNT(*) FROM tasks t WHERE t.course_id = c.id) AS task_count
        FROM courses c
        WHERE c.semester_id = ?
        ORDER BY c.id ASC
    ");
    $stmt->execute([$semesterId]);
    respond($stmt->fetchAll());
}

// ── POST /api/courses ────────────────────────────────────────
if ($method === 'POST') {
    $data       = getBody();
    $name       = trim($data['name'] ?? '');
    $credits    = (int) ($data['credits'] ?? 0);
    $semesterId = (int) ($data['semester_id'] ?? 0);

    if (!$name || !$credits || !$semesterId) {
        respondError('name, credits, and semester_id are required.');
    }
    if ($credits < 1 || $credits > 6) {
        respondError('credits must be between 1 and 6.');
    }

    // Verify semester ownership
    $check = $pdo->prepare("SELECT id FROM semesters WHERE id = ? AND user_id = ?");
    $check->execute([$semesterId, $userId]);
    if (!$check->fetch()) respondError('Semester not found.', 404);

    $grade       = $data['grade'] ?? null;
    $gradePoints = $grade ? gradeToPoints($grade) : null;

    $stmt = $pdo->prepare("INSERT INTO courses (name, grade, credits, grade_points, semester_id, progress)
                            VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $grade, $credits, $gradePoints, $semesterId, $data['progress'] ?? 0]);
    respond(['message' => 'Course added.', 'id' => (int) $pdo->lastInsertId()], 201);
}

// ── PUT /api/courses?id=:id ──────────────────────────────────
if ($method === 'PUT' && $id) {
    // Verify ownership via join
    $check = $pdo->prepare("
        SELECT c.id FROM courses c
        JOIN semesters s ON s.id = c.semester_id
        WHERE c.id = ? AND s.user_id = ?
    ");
    $check->execute([$id, $userId]);
    if (!$check->fetch()) respondError('Course not found.', 404);

    $data = getBody();
    
    $name = isset($data['name']) ? trim($data['name']) : null;
    if ($name === '') respondError('Course name cannot be empty.');

    $grade = $data['grade'] ?? null;
    $gradePoints = null;
    if ($grade !== null) {
        $gradePoints = gradeToPoints($grade);
        if ($gradePoints === null) respondError('Invalid grade provided.');
    }

    $credits = isset($data['credits']) ? (int)$data['credits'] : null;
    if ($credits !== null && ($credits < 1 || $credits > 6)) {
        respondError('Credits must be between 1 and 6.');
    }

    $progress = isset($data['progress']) ? (int)$data['progress'] : null;
    if ($progress !== null && ($progress < 0 || $progress > 100)) {
        respondError('Progress must be between 0 and 100.');
    }

    $stmt = $pdo->prepare("
        UPDATE courses
        SET name         = COALESCE(?, name),
            grade        = COALESCE(?, grade),
            grade_points = COALESCE(?, grade_points),
            credits      = COALESCE(?, credits),
            progress     = COALESCE(?, progress)
        WHERE id = ?
    ");
    $stmt->execute([
        $name,
        $grade,
        $gradePoints,
        $credits,
        $progress,
        $id,
    ]);
    respond(['message' => 'Course updated.']);
}

// ── DELETE /api/courses?id=:id ───────────────────────────────
if ($method === 'DELETE' && $id) {
    $check = $pdo->prepare("
        SELECT c.id FROM courses c
        JOIN semesters s ON s.id = c.semester_id
        WHERE c.id = ? AND s.user_id = ?
    ");
    $check->execute([$id, $userId]);
    if (!$check->fetch()) respondError('Course not found.', 404);

    $pdo->prepare("DELETE FROM courses WHERE id = ?")->execute([$id]);
    respond(['message' => 'Course deleted.']);
}

respondError('Invalid courses endpoint.', 404);
