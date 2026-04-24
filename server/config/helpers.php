<?php
// ============================================================
//  server/config/helpers.php — Shared utilities
// ============================================================

require_once __DIR__ . '/db.php';

// ── JSON helpers ─────────────────────────────────────────────
function respond(mixed $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function respondError(string $message, int $code = 400): void {
    respond(['error' => $message], $code);
}

// ── Auth guard ───────────────────────────────────────────────
function requireAuth(): int {
    session_start();
    if (empty($_SESSION['user_id'])) {
        respondError('Unauthorized. Please log in.', 401);
    }
    return (int) $_SESSION['user_id'];
}

// ── Parse JSON body ──────────────────────────────────────────
function getBody(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

// ── Grade → grade points map ─────────────────────────────────
function gradeToPoints(string $grade): ?float {
    if (is_numeric($grade)) {
        $val = (float)$grade;
        return ($val >= 0 && $val <= 4.0) ? $val : null;
    }
    $map = [
        'A'  => 4.0, 'A-' => 3.7,
        'B+' => 3.3, 'B'  => 3.0, 'B-' => 2.7,
        'C+' => 2.3, 'C'  => 2.0, 'C-' => 1.7,
        'D+' => 1.3, 'D'  => 1.0, 'D-' => 0.7,
        'F'  => 0.0,
    ];
    return $map[$grade] ?? null;
}

// ── Auto-update overdue tasks ────────────────────────────────
function refreshOverdueTasks(PDO $pdo, int $userId): void {
    $pdo->prepare("
        UPDATE tasks
        SET    status = 'overdue'
        WHERE  user_id = ?
          AND  status  = 'pending'
          AND  due_date < NOW()
    ")->execute([$userId]);
}

// ── CORS headers (adjust origin in production) ───────────────
header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? 'http://localhost'));
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
