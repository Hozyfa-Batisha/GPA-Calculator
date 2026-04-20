<?php
// ============================================================
//  server/routes/ai.php
//  POST /api/ai/chat  — Proxy for Gemini API
// ============================================================

require_once __DIR__ . '/../config/helpers.php';

$userId = requireAuth();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = getBody();
    $message = $data['message'] ?? '';
    $apiKey  = $data['apiKey'] ?? '';

    if (!$message || !$apiKey) {
        respondError('Message and API Key are required.');
    }

    // Gemini API Endpoint
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

    $payload = [
        "contents" => [
            [
                "parts" => [
                    ["text" => "You are an Academic Advisor for a university student. Be helpful, encouraging, and professional. The student is using a GPA Calculator app. Answer this: " . $message]
                ]
            ]
        ]
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);

    if ($error) {
        respondError('CURL Error: ' . $error, 500);
    }

    if ($httpCode !== 200) {
        respondError('AI API Error: ' . $response, $httpCode);
    }

    $result = json_decode($response, true);
    $aiText = $result['candidates'][0]['content']['parts'][0]['text'] ?? 'I am sorry, I could not generate a response.';

    // Strip <thought> blocks to ensure a clean response for the professor
    $aiText = preg_replace('/<thought>.*?<\/thought>/is', '', $aiText);
    $aiText = trim($aiText);

    respond(['response' => $aiText]);
}

respondError('Invalid AI endpoint.', 404);
