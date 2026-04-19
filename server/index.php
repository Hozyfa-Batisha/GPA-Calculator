<?php
// ============================================================
//  server/index.php — Front Controller / Router
//
//  All requests come in as:
//    /api/{resource}[?id=x&...]
//
//  Examples:
//    POST   /api/auth?action=register
//    GET    /api/semesters
//    POST   /api/courses
//    GET    /api/tasks?course_id=3
//    GET    /api/schedule
//    GET    /api/users/me
// ============================================================

// Parse resource from URL path
$path     = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = array_values(array_filter(explode('/', trim($path, '/'))));

// Find the 'api' segment to handle subfolder installations
$apiIndex = array_search('api', $segments);
$resource = ($apiIndex !== false) ? ($segments[$apiIndex + 1] ?? '') : '';
$sub      = ($apiIndex !== false) ? ($segments[$apiIndex + 2] ?? '') : '';

$routeMap = [
    'auth'      => __DIR__ . '/routes/auth.php',
    'semesters' => __DIR__ . '/routes/semesters.php',
    'courses'   => __DIR__ . '/routes/courses.php',
    'tasks'     => __DIR__ . '/routes/tasks.php',
    'schedule'  => __DIR__ . '/routes/schedule.php',
    'users'     => __DIR__ . '/routes/users.php',
];

if (isset($routeMap[$resource])) {
    require $routeMap[$resource];
} else {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => "Unknown endpoint: /api/$resource"]);
}
