/**
 * settings.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Expected API endpoints:
 *   GET   /users/me                      → { fullName, username, email }
 *   PATCH /users/me                      → { fullName, email }         → 200
 *   POST  /auth/change-password          → { currentPassword, newPassword } → 200
 */

async function loadSettings() {
    if (!requireAuth()) return;

    try {
        const res = await fetch(`${API_BASE}/users/me`, { headers: authHeader() });

        if (res.status === 401) { logout(); return; }
        if (!res.ok) throw new Error('Failed to load profile.');

        const profile = await res.json();

        document.getElementById('username-field').value = profile.username;
        document.getElementById('fullname-field').value  = profile.fullName;
        document.getElementById('email-field').value     = profile.email;

        const navPill = document.getElementById('navbar-username');
        if (navPill) navPill.textContent = profile.fullName + ' ▾';

    } catch (err) {
        showMessage('profile-message', err.message, 'error');
    }
}

// ─── Save profile ─────────────────────────────────────────────────────────────

async function saveProfile() {
    const fullName = document.getElementById('fullname-field').value.trim();
    const email    = document.getElementById('email-field').value.trim();

    if (!fullName) {
        showMessage('profile-message', 'Full name cannot be empty.', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/users/me`, {
            method: 'PATCH',
            headers: authHeader(),
            body: JSON.stringify({ fullName, email }),
        });

        if (res.status === 401) { logout(); return; }
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to save profile.');
        }

        const navPill = document.getElementById('navbar-username');
        if (navPill) navPill.textContent = fullName + ' ▾';

        showMessage('profile-message', 'Profile saved successfully!', 'success');

    } catch (err) {
        showMessage('profile-message', err.message, 'error');
    }
}

// ─── Change password ──────────────────────────────────────────────────────────

async function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword     = document.getElementById('new-password').value;
    const confirm         = document.getElementById('confirm-password').value;

    if (!currentPassword || !newPassword || !confirm) {
        showMessage('password-message', 'Please fill in all password fields.', 'error');
        return;
    }
    if (newPassword.length < 6) {
        showMessage('password-message', 'New password must be at least 6 characters.', 'error');
        return;
    }
    if (newPassword !== confirm) {
        showMessage('password-message', 'New passwords do not match.', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/change-password`, {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (res.status === 401) {
            showMessage('password-message', 'Current password is incorrect.', 'error');
            return;
        }
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to change password.');
        }

        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value     = '';
        document.getElementById('confirm-password').value = '';

        showMessage('password-message', 'Password changed successfully!', 'success');

    } catch (err) {
        showMessage('password-message', err.message, 'error');
    }
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function showMessage(elementId, text, type) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = `<div class="alert-${type}-custom">${text}</div>`;
    setTimeout(() => { el.innerHTML = ''; }, 4000);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // Ensure profile-message div exists after Save button
    const saveBtn = document.querySelector('.btn-save');
    if (saveBtn && !document.getElementById('profile-message')) {
        const div = document.createElement('div');
        div.id = 'profile-message';
        div.className = 'mt-3';
        saveBtn.parentNode.insertBefore(div, saveBtn.nextSibling);
    }
    loadSettings();
});