import { api } from "./api.js";

async function loadTranscript() {
  try {
    const user = await api.user.getProfile();
    document.getElementById("user-name").innerText = user.full_name;
    document.getElementById("user-email").innerText = user.email;
    document.getElementById("issue-date").innerText =
      new Date().toLocaleDateString();

    const semesters = await api.semesters.getAll();
    const container = document.getElementById("semesters-container");
    container.innerHTML = "";

    let totalWeighted = 0,
      totalCredits = 0;

    for (const sem of semesters) {
      const courses = await api.courses.getBySemester(sem.id);
      let semCredits = 0,
        semWeighted = 0;
      let rows = "";

      courses.forEach((c) => {
        const pts = parseFloat(c.grade_points || 0) * parseInt(c.credits);
        semCredits += parseInt(c.credits);
        semWeighted += pts;
        rows += `<tr><td>${c.name}</td><td class="text-center">${c.grade}</td><td class="text-center">${c.credits}</td><td class="text-end">${pts.toFixed(2)}</td></tr>`;
      });

      totalWeighted += semWeighted;
      totalCredits += semCredits;

      container.innerHTML += `
                        <div class="mb-5">
                            <h5 class="fw-bold border-bottom pb-2">${sem.name}</h5>
                            <table class="table table-sm table-borderless">
                                <thead class="text-muted small"><tr><th>Course</th><th class="text-center">Grade</th><th class="text-center">Credits</th><th class="text-end">Points</th></tr></thead>
                                <tbody>${rows}
                                    <tr class="fw-bold"><td colspan="3" class="text-end">Semester Total:</td><td class="text-end">${semWeighted.toFixed(2)}</td></tr>
                                </tbody>
                            </table>
                            <p class="text-end small">Semester GPA: <strong>${semCredits > 0 ? (semWeighted / semCredits).toFixed(2) : "0.00"}</strong></p>
                        </div>`;
    }

    document.getElementById("final-cgpa").innerText =
      totalCredits > 0 ? (totalWeighted / totalCredits).toFixed(2) : "0.00";
    document.getElementById("total-credits").innerText = totalCredits;
  } catch (err) {
    window.location.href = "login.html";
  }
}

window.onload = loadTranscript;
