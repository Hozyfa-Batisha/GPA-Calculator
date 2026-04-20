import { api } from './api.js';

async function initDashboard() {
    try {
        const user = await api.user.getProfile();
        document.getElementById('user-welcome').innerText = `Welcome, ${user.full_name}!`;

        const semesters = await api.semesters.getAll();
        let totalWeightedSum = 0;
        let totalCredits = 0;

        const coursePromises = semesters.map(sem => api.courses.getBySemester(sem.id));
        const allCoursesSets = await Promise.all(coursePromises);

        allCoursesSets.forEach(courses => {
            courses.forEach(course => {
                totalWeightedSum += (parseFloat(course.grade_points) * parseInt(course.credits));
                totalCredits += parseInt(course.credits);
            });
        });

        const cgpa = totalCredits > 0 ? (totalWeightedSum / totalCredits) : 0;

        // Update Stats Cards
        document.getElementById('stat-sems').innerText = semesters.length;
        const totalCourses = allCoursesSets.reduce((acc, curr) => acc + curr.length, 0);
        document.getElementById('stat-courses').innerText = totalCourses;
        const avgCredits = semesters.length > 0 ? (totalCredits / semesters.length).toFixed(1) : '0';
        document.getElementById('stat-avg-credits').innerText = avgCredits;

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
        window.location.href = 'login.html';
    }
}

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
        await api.auth.logout();
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
    } catch (err) {
        alert("Logout failed");
    }
});

window.onload = initDashboard;
