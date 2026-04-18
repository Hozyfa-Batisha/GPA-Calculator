// This file handles the 'Data' part of the dashboard
const mockData = {
    studentName: "Anas",
    cgpa: 3.65,
    totalCredits: 45,
    semesters: [
        {
            name: "Semester 1",
            gpa: 3.4,
            courses: [
                { name: "Intro to CS", grade: "A", credits: 3 },
                { name: "Calculus I", grade: "B+", credits: 4 },
                { name: "English 101", grade: "A-", credits: 3 }
            ]
        },
        {
            name: "Semester 2",
            gpa: 3.8,
            courses: [
                { name: "Data Structures", grade: "A", credits: 3 },
                { name: "Physics I", grade: "B", credits: 4 },
                { name: "Discrete Math", grade: "A", credits: 3 }
            ]
        }
    ]
};

function loadDashboard() {
    document.getElementById('cgpa-value').innerText = mockData.cgpa;
    document.getElementById('total-credits').innerText = mockData.totalCredits;
    const container = document.getElementById('semester-container');
    mockData.semesters.forEach(sem => {
        const cardHtml = `
            <div class="col-md-4">
                <div class="card p-3">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="m-0">${sem.name}</h5>
                        <span class="badge bg-primary">GPA: ${sem.gpa}</span>
                    </div>
                    <ul class="list-group list-group-flush">
                        ${sem.courses.map(c => `
                            <li class="list-group-item d-flex justify-content-between">
                                ${c.name} <span class="fw-bold">${c.grade} (${c.credits}cr)</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}
window.onload = loadDashboard;
