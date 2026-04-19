<?php
// ============================================================
//  server/routes/schedule.php
//  GET    /api/schedule           — full weekly schedule for user
//  POST   /api/schedule           — add time slot to a course
//  PUT    /api/schedule?id=:id    — update time slot
//  DELETE /api/schedule?id=:id    — remove time slot
// ============================================================

require_once __DIR__ . '/../config/helpers.php';

$userId = requireAuth();
$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = (int) ($_GET['id'] ?? 0);

$dayOrder = ['Mon' => 1, 'Tue' => 2, 'Wed' => 3, 'Thu' => 4, 'Fri' => 5, 'Sat' => 6, 'Sun' => 7];

// ── GET /api/schedule ────────────────────────────────────────
if ($method === 'GET') {
    $stmt = $pdo->prepare("
        SELECT
            sch.id,
            sch.day_of_week,
            sch.start_time,
            sch.end_time,
            sch.location,
            c.id   AS course_id,
            c.name AS course_name,
            s.name AS semester_name
        FROM schedule sch
        JOIN courses   c ON c.id  = sch.course_id
        JOIN semesters s ON s.id  = c.semester_id
        WHERE s.user_id = ?
        ORDER BY FIELD(sch.day_of_week, 'Mon','Tue','Wed','Thu','Fri','Sat','Sun'),
                 sch.start_time
    ");
    $stmt->execute([$userId]);
    respond($stmt->fetchAll());
}

// ── POST /api/schedule ───────────────────────────────────────
if ($method === 'POST') {
    $data      = getBody();
    $courseId  = (int) ($data['course_id']  ?? 0);
    $day       = trim($data['day_of_week']  ?? '');
    $startTime = trim($data['start_time']   ?? '');
    $endTime   = trim($data['end_time']     ?? '');

    if (!$courseId || !$day || !$startTime || !$endTime) {
        respondError('course_id, day_of_week, start_time, and end_time are required.');
    }

    $validDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    if (!in_array($day, $validDays)) {
        respondError('day_of_week must be Mon, Tue, Wed, Thu, Fri, Sat, or Sun.');
    }
    if ($startTime >= $endTime) {
        respondError('start_time must be before end_time.');
    }

    // Verify course ownership
    $check = $pdo->prepare("
        SELECT c.id FROM courses c
        JOIN semesters s ON s.id = c.semester_id
        WHERE c.id = ? AND s.user_id = ?
    ");
    $check->execute([$courseId, $userId]);
    if (!$check->fetch()) respondError('Course not found.', 404);

    // Conflict check: same user, same day, overlapping time
    $conflict = $pdo->prepare("
        SELECT sch.id FROM schedule sch
        JOIN courses c   ON c.id  = sch.course_id
        JOIN semesters s ON s.id  = c.semester_id
        WHERE s.user_id     = ?
          AND sch.day_of_week = ?
          AND sch.start_time  < ?
          AND sch.end_time    > ?
    ");
    $conflict->execute([$userId, $day, $endTime, $startTime]);
    if ($conflict->fetch()) {
        respondError('Time slot conflicts with an existing schedule entry.', 409);
    }

    $stmt = $pdo->prepare("
        INSERT INTO schedule (course_id, day_of_week, start_time, end_time, location)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$courseId, $day, $startTime, $endTime, $data['location'] ?? null]);
    respond(['message' => 'Schedule slot added.', 'id' => (int) $pdo->lastInsertId()], 201);
}

// ── PUT /api/schedule?id=:id ─────────────────────────────────
if ($method === 'PUT' && $id) {
    $check = $pdo->prepare("
        SELECT sch.id FROM schedule sch
        JOIN courses c   ON c.id  = sch.course_id
        JOIN semesters s ON s.id  = c.semester_id
        WHERE sch.id = ? AND s.user_id = ?
    ");
    $check->execute([$id, $userId]);
    if (!$check->fetch()) respondError('Schedule slot not found.', 404);

    $data = getBody();
    $stmt = $pdo->prepare("
        UPDATE schedule
        SET day_of_week = COALESCE(?, day_of_week),
            start_time  = COALESCE(?, start_time),
            end_time    = COALESCE(?, end_time),
            location    = COALESCE(?, location)
        WHERE id = ?
    ");
    $stmt->execute([
        $data['day_of_week'] ?? null,
        $data['start_time']  ?? null,
        $data['end_time']    ?? null,
        $data['location']    ?? null,
        $id,
    ]);
    respond(['message' => 'Schedule slot updated.']);
}

// ── DELETE /api/schedule?id=:id ──────────────────────────────
if ($method === 'DELETE' && $id) {
    $check = $pdo->prepare("
        SELECT sch.id FROM schedule sch
        JOIN courses c   ON c.id  = sch.course_id
        JOIN semesters s ON s.id  = c.semester_id
        WHERE sch.id = ? AND s.user_id = ?
    ");
    $check->execute([$id, $userId]);
    if (!$check->fetch()) respondError('Schedule slot not found.', 404);

    $pdo->prepare("DELETE FROM schedule WHERE id = ?")->execute([$id]);
    respond(['message' => 'Schedule slot removed.']);
}

respondError('Invalid schedule endpoint.', 404);
