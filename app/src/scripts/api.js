// ============================================================
//  app/src/scripts/api.js — Vanilla JS API client
//  Base URL points to your PHP server
// ============================================================

const API_BASE = window.location.origin + '/gpa-calculator/server';

async function request(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        credentials: 'include',       // sends session cookie
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}/api/${endpoint}`, options);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    return data;
}

// ── Auth ──────────────────────────────────────────────────────
export const api = {

    auth: {
        register: (username, password, name, email) =>
            request('auth?action=register', 'POST', { username, password, name, email }),

        login: (username, password) =>
            request('auth?action=login', 'POST', { username, password }),

        logout: () =>
            request('auth?action=logout', 'POST'),
    },

    // ── Semesters ─────────────────────────────────────────────
    semesters: {
        getAll: () =>
            request('semesters'),

        create: (name, startDate, endDate) =>
            request('semesters', 'POST', { name, start_date: startDate, end_date: endDate }),

        update: (id, data) =>
            request(`semesters?id=${id}`, 'PUT', data),

        delete: (id) =>
            request(`semesters?id=${id}`, 'DELETE'),
    },

    // ── Courses ───────────────────────────────────────────────
    courses: {
        getBySemester: (semesterId) =>
            request(`courses?semester_id=${semesterId}`),

        create: (name, credits, semesterId, grade = null, progress = 0) =>
            request('courses', 'POST', { name, credits, semester_id: semesterId, grade, progress }),

        update: (id, data) =>
            request(`courses?id=${id}`, 'PUT', data),

        delete: (id) =>
            request(`courses?id=${id}`, 'DELETE'),
    },

    // ── Tasks ─────────────────────────────────────────────────
    tasks: {
        getAll: () =>
            request('tasks'),

        getByCourse: (courseId) =>
            request(`tasks?course_id=${courseId}`),

        create: (title, dueDate, courseId, description = '') =>
            request('tasks', 'POST', { title, due_date: dueDate, course_id: courseId, description }),

        update: (id, data) =>
            request(`tasks?id=${id}`, 'PUT', data),

        markDone: (id) =>
            request(`tasks?id=${id}`, 'PUT', { status: 'done' }),

        delete: (id) =>
            request(`tasks?id=${id}`, 'DELETE'),
    },

    // ── Schedule ──────────────────────────────────────────────
    schedule: {
        getAll: () =>
            request('schedule'),

        add: (courseId, dayOfWeek, startTime, endTime, location = '') =>
            request('schedule', 'POST', {
                course_id: courseId,
                day_of_week: dayOfWeek,
                start_time: startTime,
                end_time: endTime,
                location,
            }),

        update: (id, data) =>
            request(`schedule?id=${id}`, 'PUT', data),

        delete: (id) =>
            request(`schedule?id=${id}`, 'DELETE'),
    },

    // ── User settings ─────────────────────────────────────────
    user: {
        getProfile: () =>
            request('users/me'),

        updateProfile: (data) =>
            request('users/me', 'PUT', data),
    },
};
