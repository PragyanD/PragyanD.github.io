/**
 * Simple localStorage wrapper with JSON serialization.
 */

export function getJSON(key, fallback = null) {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

export function setJSON(key, value) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // localStorage full or unavailable — silently ignore
    }
}
