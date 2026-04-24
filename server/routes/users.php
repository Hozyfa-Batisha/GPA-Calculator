<?php
// ============================================================
//  server/routes/users.php
//  GET  /api/users/me         — get profile
//  PUT  /api/users/me         — update profile
// ============================================================

require_once __DIR__ . '/../config/helpers.php';

$userId = requireAuth();
$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET /api/users/me ────────────────────────────────────────
if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT id, username, name AS full_name, email, created_at FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    if (!$user) respondError('User not found.', 404);
    respond($user);
}

// ── PUT /api/users/me ────────────────────────────────────────
if ($method === 'PUT') {
    $data = getBody();

    $name = isset($data['full_name']) ? trim($data['full_name']) : null;
    if ($name === '') respondError('Name cannot be empty.');

    $username = isset($data['username']) ? trim($data['username']) : null;
    if ($username === '') respondError('Username cannot be empty.');
    if ($email !== null) {
        if ($email === '') respondError('Email cannot be empty.');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respondError('Invalid email format.');
    }

    // Password change (optional)
    $newHash = null;
    if (!empty($data['password'])) {
        if (strlen($data['password']) < 6) respondError('Password must be at least 6 characters.');
        $newHash = password_hash($data['password'], PASSWORD_BCRYPT);
    }

    $stmt = $pdo->prepare("
        UPDATE users
        SET username       = COALESCE(?, username),
            name          = COALESCE(?, name),
            email         = COALESCE(?, email),
            password_hash = COALESCE(?, password_hash)
        WHERE id = ?
    ");
        $stmt->execute([
            $username,
            $name,
            $email,
            $newHash,
            $userId,
        ]);
    respond(['message' => 'Profile updated.']);
}

respondError('Invalid users endpoint.', 404);
