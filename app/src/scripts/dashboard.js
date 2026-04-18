// This file handles the 'Data' and 'Interactions' of the dashboard

const mockData = {
    studentName: "Anas",
    cgpa: 3.65,
    totalCredits: 45,
    semesters: [
        {
            id: Date.now() + 1, // Added unique ID for easier deleting
            name: "Semester 1",
            gpa: 3.4,
            courses: [
                { name: "Intro to CS", grade: "A", credits: 3 },
                { name: "Calculus I", grade: "B+", credits: 4 },
                { name: "English 101", grade: "A-", credits: 3 }
            ]
        },
        {
            id: Date.now() + 2,
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

// Initialize Dashboard
function loadDashboard() {
    // 1. Update User Name in Navbar
    document.getElementById('user-welcome').innerText = `Welcome, ${mockData.studentName}`;
    
    // 2. Update Summary Values
    document.getElementById('cgpa-value').innerText = mockData.cgpa;
    document.getElementById('total-credits').innerText = mockData.totalCredits;

    // 3. Render Semester Cards
    const container = document.getElementById('semester-container');
    container.innerHTML = ''; // Clear container first

    mockData.semesters.forEach((sem, index) => {
        const courseCount = sem.courses.length;
        const totalCredits = sem.courses.reduce((sum, c) => sum + c.credits, 0);

        const cardHtml = `
            <div class="col-md-4">
                <div class="card p-3">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="m-0">${sem.name}</h5>
                        <span class="badge bg-primary">GPA: ${sem.gpa}</span>
                    </div>
                    <div class="text-center mb-3">
                        <small class="text-muted">Courses: ${courseCount} | Credits: ${totalCredits}</small>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-info btn-sm text-white" onclick="showDetails(${index})">View Details</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteSemester(${index})">🗑️</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

// --- INTERACTION FUNCTIONS ---

// Function to show the Modal with course details
function showDetails(index) {
    const sem = mockData.semesters[index];
    document.getElementById('modalTitle').innerText = sem.name;
    
    const list = document.getElementById('course-list');
    list.innerHTML = ''; // Clear old list

    sem.courses.forEach(c => {
        list.innerHTML += `
            <li class="list-group-item d-flex justify-content-between">
                ${c.name} <span class="fw-bold">${c.grade} (${c.credits}cr)</span>
            </li>
        `;
    });

    // Use Bootstrap's Modal JS to show the window
    const myModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    myModal.show();
}

// Function to delete a semester
function deleteSemester(index) {
    if(confirm("Are you sure you want to delete this semester?")) {
        mockData.semesters.splice(index, 1); // Remove 1 item at the given index
        loadDashboard(); // Refresh the UI
    }
}

// Function to add a new (empty) semester
function addSemester() {
    const name = prompt("Enter Semester Name (e.g. Semester 3):");
    if (name) {
        mockData.semesters.push({
            id: Date.now(),
            name: name,
            gpa: 0.0,
            courses: []
        });
        loadDashboard(); // Refresh the UI
    }
}

window.onload = loadDashboard;
