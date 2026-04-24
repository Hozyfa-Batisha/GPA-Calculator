<?php
// ============================================================
//  server/routes/tasks.php
//  GET    /api/tasks                    — all tasks for user
//  GET    /api/tasks?course_id=:id      — tasks for a course
//  POST   /api/tasks                    — create task
//  PUT    /api/tasks?id=:id             — update task
//  DELETE /api/tasks?id=:id             — delete task
// ============================================================

require_once __DIR__ . '/../config/helpers.php';

$userId = requireAuth();
$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = (int) ($_GET['id'] ?? 0);

// Auto-mark overdue on every tasks request
refreshOverdueTasks($pdo, $userId);

// ── GET /api/tasks  OR  /api/tasks?course_id=:id ─────────────
if ($method === 'GET') {
    $courseId = (int) ($_GET['course_id'] ?? 0);

    if ($courseId) {
        // Tasks for a specific course (ownership check via join)
        $stmt = $pdo->prepare("
            SELECT t.* FROM tasks t
            JOIN courses c  ON c.id = t.course_id
            JOIN semesters s ON s.id = c.semester_id
            WHERE t.course_id = ? AND s.user_id = ?
            ORDER BY t.due_date ASC
        ");
        $stmt->execute([$courseId, $userId]);
    } else {
        // All tasks for user, with course name
        $stmt = $pdo->prepare("
            SELECT t.*, c.name AS course_name
            FROM tasks t
            JOIN courses c ON c.id = t.course_id
            WHERE t.user_id = ?
            ORDER BY t.due_date ASC
        ");
        $stmt->execute([$userId]);
    }
    respond($stmt->fetchAll());
}

// ── POST /api/tasks ──────────────────────────────────────────
if ($method === 'POST') {
    $data     = getBody();
    $title    = trim($data['title']    ?? '');
    $dueDate  = trim($data['due_date'] ?? '');
    $courseId = (int) ($data['course_id'] ?? 0);

    if (!$title || !$dueDate || !$courseId) {
        respondError('title, due_date, and course_id are required.');
    }

    // Verify course belongs to user
    $check = $pdo->prepare("
        SELECT c.id FROM courses c
        JOIN semesters s ON s.id = c.semester_id
        WHERE c.id = ? AND s.user_id = ?
    ");
    $check->execute([$courseId, $userId]);
    if (!$check->fetch()) respondError('Course not found.', 404);

    $stmt = $pdo->prepare("
        INSERT INTO tasks (title, description, due_date, status, course_id, user_id)
        VALUES (?, ?, ?, 'pending', ?, ?)
    ");
    $stmt->execute([
        $title,
        $data['description'] ?? null,
        $dueDate,
        $courseId,
        $userId,
    ]);
    respond(['message' => 'Task created.', 'id' => (int) $pdo->lastInsertId()], 201);
}

// ── PUT /api/tasks?id=:id ────────────────────────────────────
if ($method === 'PUT' && $id) {
    $check = $pdo->prepare("SELECT id FROM tasks WHERE id = ? AND user_id = ?");
    $check->execute([$id, $userId]);
    if (!$check->fetch()) respondError('Task not found.', 404);

    $data   = getBody();
    $status = $data['status'] ?? null;

    // Validate status value if provided
    $validStatuses = ['pending', 'done', 'overdue'];
    if ($status && !in_array($status, $validStatuses)) {
        respondError("status must be one of: pending, done, overdue.");
    }

    $stmt = $pdo->prepare("
        UPDATE tasks
        SET title       = COALESCE(?, title),
            description = COALESCE(?, description),
            due_date    = COALESCE(?, due_date),
            status      = COALESCE(?, status)
        WHERE id = ?
    ");
    $stmt->execute([
        $data['title']       ?? null,
        $data['description'] ?? null,
        $data['due_date']    ?? null,
        $status,
        $id,
    ]);
    respond(['message' => 'Task updated.']);
}

// ── DELETE /api/tasks?id=:id ─────────────────────────────────
if ($method === 'DELETE' && $id) {
    $check = $pdo->prepare("SELECT id FROM tasks WHERE id = ? AND user_id = ?");
    $check->execute([$id, $userId]);
    if (!$check->fetch()) respondError('Task not found.', 404);

    $pdo->prepare("DELETE FROM tasks WHERE id = ?")->execute([$id]);
    respond(['message' => 'Task deleted.']);
}

respondError('Invalid tasks endpoint.', 404);
