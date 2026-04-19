import { api } from './api.js';

async function initDashboard() {
    try {
        // 1. Check authentication
        const user = await api.user.getProfile();
        document.getElementById('user-welcome').innerText = `Welcome, ${user.full_name}!`;

        // 2. Fetch all semesters
        const semesters = await api.semesters.getAll();
        
        let totalWeightedSum = 0;
        let totalCredits = 0;

        // 3. For each semester, fetch its courses to calculate CGPA
        // We use Promise.all to fetch all courses in parallel for better performance
        const coursePromises = semesters.map(sem => api.courses.getBySemester(sem.id));
        const allCoursesSets = await Promise.all(coursePromises);

        allCoursesSets.forEach(courses => {
            courses.forEach(course => {
                totalWeightedSum += (parseFloat(course.grade) * parseInt(course.credits));
                totalCredits += parseInt(course.credits);
            });
        });

        const cgpa = totalCredits > 0 ? (totalWeightedSum / totalCredits) : 0;

        // 4. Update the UI
        document.getElementById('cgpa-value').innerText = cgpa.toFixed(2);
        document.getElementById('total-credits').innerText = totalCredits;

        const standingEl = document.getElementById('standing-value');
        if (cgpa >= 3.5) {
            standingEl.innerText = "Excellent";
            standingEl.className = "display-6 fw-bold text-success";
        } else if (cgpa >= 3.0) {
            standingEl.innerText = "Good";
            standingEl.className = "display-6 fw-bold text-primary";
        } else if (cgpa >= 2.0) {
            standingEl.innerText = "Satisfactory";
            standingEl.className = "display-6 fw-bold text-warning";
        } else {
            standingEl.innerText = "Needs Improvement";
            standingEl.className = "display-6 fw-bold text-danger";
        }

    } catch (err) {
        console.error("Dashboard Error:", err);
        // If not logged in, redirect to login page
        window.location.href = 'login.html';
    }
}

// Handle Logout
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
        await api.auth.logout();
        window.location.href = 'login.html';
    } catch (err) {
        alert("Logout failed");
    }
});

window.onload = initDashboard;
