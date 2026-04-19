<?php
// ============================================================
//  server/routes/auth.php
//  POST /api/auth/register
//  POST /api/auth/login
//  POST /api/auth/logout
// ============================================================

require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// ── POST /api/auth/register ──────────────────────────────────
if ($method === 'POST' && $action === 'register') {
    $data     = getBody();
    $username = trim($data['username'] ?? '');
    $password = trim($data['password'] ?? '');
    $name     = trim($data['name']     ?? '');
    $email    = trim($data['email']    ?? '') ?: null;

    if (!$username || !$password || !$name) {
        respondError('username, password, and name are required.');
    }

    $pdo  = getDB();
    $hash = password_hash($password, PASSWORD_BCRYPT);

    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, name, email)
                                VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $hash, $name, $email]);
        respond(['message' => 'Account created successfully.'], 201);
    } catch (PDOException $e) {
        // Duplicate username
        respondError('Username already taken.', 409);
    }
}

// ── POST /api/auth/login ─────────────────────────────────────
if ($method === 'POST' && $action === 'login') {
    session_start();
    $data     = getBody();
    $username = trim($data['username'] ?? '');
    $password = trim($data['password'] ?? '');

    if (!$username || !$password) {
        respondError('username and password are required.');
    }

    $pdo  = getDB();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        respond([
            'message' => 'Login successful.',
            'user'    => [
                'id'       => $user['id'],
                'username' => $user['username'],
                'name'     => $user['name'],
                'email'    => $user['email'],
            ]
        ]);
    } else {
        respondError('Invalid username or password.', 401);
    }
}

// ── POST /api/auth/logout ────────────────────────────────────
if ($method === 'POST' && $action === 'logout') {
    session_start();
    session_destroy();
    respond(['message' => 'Logged out successfully.']);
}

respondError('Invalid auth endpoint.', 404);
