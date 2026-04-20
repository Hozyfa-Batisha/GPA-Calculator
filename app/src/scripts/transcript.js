/**
 * transcript.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Expected API endpoints:
 *   GET /users/me       → { fullName, username, email }
 *   GET /transcript     → { cgpa, semesters: [{ name, gpa, courses: [...] }] }
 */

// Grade points table (used for display only — GPA comes from the API)
const GRADE_POINTS = {
    'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0,
};

function getGradeClass(grade) {
    const map = {
        'A': 'grade-A', 'A-': 'grade-A-',
        'B+': 'grade-Bp', 'B': 'grade-B', 'B-': 'grade-Bm',
        'C+': 'grade-Cp', 'C': 'grade-C', 'C-': 'grade-Cm',
        'D+': 'grade-Dp', 'D': 'grade-D', 'D-': 'grade-Dm',
        'F': 'grade-F',
    };
    return map[grade] || 'grade-default';
}

function getStanding(cgpa) {
    if (cgpa === null || isNaN(parseFloat(cgpa))) return 'N/A';
    if (cgpa >= 3.7) return 'Excellent';
    if (cgpa >= 3.3) return 'Very Good';
    if (cgpa >= 3.0) return 'Good';
    if (cgpa >= 2.7) return 'Above Average';
    if (cgpa >= 2.0) return 'Average';
    return 'Below Average';
}

// Render helpers ───────────────────────────────────────────────────────────

function formatGPA(gpa) {
    const val = parseFloat(gpa);
    return (!isNaN(val)) ? val.toFixed(2) : '0.00';
}

function renderSemester(sem) {
    const semGPA   = formatGPA(sem.gpa);
    const totalCr  = sem.courses.reduce((s, c) => s + c.credits, 0);

    const courseRows = sem.courses.map(c => {
        const pts = GRADE_POINTS[c.grade] ?? 0;
        return `
        <div class="course-row">
            <span class="course-name">${c.name}</span>
            <span class="course-credits">${c.credits} cr</span>
            <span class="grade-badge ${getGradeClass(c.grade)}">${c.grade}</span>
            <span class="course-points">${pts.toFixed(1)}</span>
        </div>`;
    }).join('');

    return `
    <div class="semester-block">
        <div class="semester-header">
            <span class="semester-name">${sem.name}</span>
            <span class="semester-gpa-badge">
                GPA: <strong>${semGPA}</strong>
                <span class="semester-meta ms-2">${totalCr} credits · ${sem.courses.length} courses</span>
            </span>
        </div>
        ${courseRows || '<p class="text-muted ps-2 py-2" style="font-size:0.85rem">No courses recorded.</p>'}
    </div>`;
}

// ─── Main load ────────────────────────────────────────────────────────────────

async function loadTranscript() {
    if (!requireAuth()) return;

    // Set generated date immediately
    document.getElementById('generated-date').textContent =
        new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    try {
        const [profileRes, transcriptRes] = await Promise.all([
            fetch(`${API_BASE}/users/me`,    { headers: authHeader() }),
            fetch(`${API_BASE}/transcript`,  { headers: authHeader() }),
        ]);

        if (!profileRes.ok || !transcriptRes.ok) {
            if (profileRes.status === 401 || transcriptRes.status === 401) {
                logout();
                return;
            }
            throw new Error('Failed to load transcript data.');
        }

        const profile    = await profileRes.json();
        const transcript = await transcriptRes.json();

        renderTranscript(profile, transcript);

    } catch (err) {
        document.getElementById('semesters-container').innerHTML =
            `<div class="alert alert-danger">${err.message}</div>`;
    }
}

function renderTranscript(profile, transcript) {
    // Student info
    document.getElementById('student-name').textContent     = profile.fullName;
    document.getElementById('student-username').textContent = '@' + profile.username;

    // Navbar elements (pill style on this page)
    const navPill = document.getElementById('navbar-username');
    if (navPill) navPill.textContent = profile.fullName + ' ▾';

    const welcome = document.getElementById('user-welcome');
    if (welcome) welcome.textContent = `Welcome, ${profile.fullName}`;

    // Totals
    let totalCourses = 0, totalCredits = 0;
    transcript.semesters.forEach(s => {
        totalCourses += s.courses.length;
        totalCredits += s.courses.reduce((sum, c) => sum + c.credits, 0);
    });

    document.getElementById('cgpa-display').textContent     = formatGPA(transcript.cgpa);
    document.getElementById('standing-display').textContent = getStanding(transcript.cgpa);
    document.getElementById('total-semesters').textContent  = transcript.semesters.length;
    document.getElementById('total-courses').textContent    = totalCourses;
    document.getElementById('total-credits').textContent    = totalCredits;

    // Semester blocks
    const container = document.getElementById('semesters-container');
    container.innerHTML = transcript.semesters.length
        ? transcript.semesters.map(renderSemester).join('')
        : '<p class="text-muted text-center py-4">No semester data available.</p>';
}

window.onload = loadTranscript;