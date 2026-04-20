<?php
// ============================================================
//  server/routes/semesters.php
//  GET    /api/semesters          — list all for logged-in user
//  POST   /api/semesters          — create new semester
//  PUT    /api/semesters/:id      — update semester
//  DELETE /api/semesters/:id      — delete semester
// ============================================================

require_once __DIR__ . '/../config/helpers.php';

$userId = requireAuth();
$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = (int) ($_GET['id'] ?? 0);

// ── GET /api/semesters ───────────────────────────────────────
if ($method === 'GET' && !$id) {
    try {
        $stmt = $pdo->prepare("
            SELECT
                s.id, s.name, s.start_date, s.end_date,
                COUNT(c.id)                                          AS course_count,
                SUM(c.credits)                                       AS total_credits,
                ROUND(
                    LEAST(4.0, SUM(c.grade_points * c.credits) /
                    NULLIF(SUM(CASE WHEN c.grade_points IS NOT NULL
                                    THEN c.credits END), 0))
                , 2)                                                  AS gpa
            FROM semesters s
            LEFT JOIN courses c ON c.semester_id = s.id
            WHERE s.user_id = ?
            GROUP BY s.id
            ORDER BY s.start_date DESC, s.id DESC
        ");
        $stmt->execute([$userId]);
        respond($stmt->fetchAll());
    } catch (PDOException $e) {
        respondError('Database Error: ' . $e->getMessage(), 500);
    }
}

// ── POST /api/semesters ──────────────────────────────────────
if ($method === 'POST') {
    try {
        $data = getBody();
        $name = trim($data['name'] ?? '');
        if (!$name) respondError('Semester name is required.');

        $stmt = $pdo->prepare("INSERT INTO semesters (name, user_id, start_date, end_date)
                                VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $name,
            $userId,
            $data['start_date'] ?? null,
            $data['end_date']   ?? null,
        ]);
        respond(['message' => 'Semester created.', 'id' => (int) $pdo->lastInsertId()], 201);
    } catch (PDOException $e) {
        respondError('Database Error: ' . $e->getMessage(), 500);
    }
}

// ── PUT /api/semesters?id=:id ────────────────────────────────
if ($method === 'PUT' && $id) {
    try {
        // Verify ownership
        $check = $pdo->prepare("SELECT id FROM semesters WHERE id = ? AND user_id = ?");
        $check->execute([$id, $userId]);
        if (!$check->fetch()) respondError('Semester not found.', 404);

        $data = getBody();
        $name = isset($data['name']) ? trim($data['name']) : null;
        if ($name === '') respondError('Semester name cannot be empty.');

        $stmt = $pdo->prepare("UPDATE semesters
                                SET name = COALESCE(?, name), start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date)
                                WHERE id = ?");
        $stmt->execute([
            $name,
            $data['start_date'] ?? null,
            $data['end_date']   ?? null,
            $id,
        ]);
        respond(['message' => 'Semester updated.']);
    } catch (PDOException $e) {
        respondError('Database Error: ' . $e->getMessage(), 500);
    }
}

// ── DELETE /api/semesters?id=:id ─────────────────────────────
if ($method === 'DELETE' && $id) {
    try {
        $check = $pdo->prepare("SELECT id FROM semesters WHERE id = ? AND user_id = ?");
        $check->execute([$id, $userId]);
        if (!$check->fetch()) respondError('Semester not found.', 404);

        $pdo->prepare("DELETE FROM semesters WHERE id = ?")->execute([$id]);
        respond(['message' => 'Semester deleted.']);
    } catch (PDOException $e) {
        respondError('Database Error: ' . $e->getMessage(), 500);
    }
}

respondError('Invalid semesters endpoint.', 404);
