<?php
/**
 * HEADER: header.php (Fusion Version)
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Success Hub</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../style/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>

    <div class="sidebar">
        <div class="sidebar-header">🎓 Success Hub</div>
        <ul class="sidebar-menu">
            <li><a href="dashboard.html" class="active">📊 Dashboard</a></li>
            <li><a href="semesters.html">📅 Semesters</a></li>
            <li><a href="courses.html">📚 Courses</a></li>
            <li><a href="calculator.html">🧮 GPA Calculator</a></li>
            <li><a href="simulator.html">🎯 Goal Simulator</a></li>
            <li><a href="transcript.html">📜 Transcript</a></li>
            <li><a href="settings.html">👤 Profile Settings</a></li>
            <li class="mt-auto"><a href="#" onclick="handleLogout()" style="color: #f87171;">🚪 Logout</a></li>
        </ul>
    </div>

    <button id="mobile-toggle" class="mobile-toggle" aria-label="Toggle Menu">
        ☰
    </button>

    <div class="main-content">
