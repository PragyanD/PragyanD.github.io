/**
 * Centralized localStorage utility with SSR safety and error handling.
 *
 * All localStorage access in the app should go through these helpers
 * so we have a single place to manage keys, handle JSON parse errors,
 * and guard against SSR (where `window` is undefined).
 */

/** Semantic key map — values are the actual localStorage key strings. */
export const STORAGE_KEYS = {
    OPEN_WINDOWS:          'pdos_open_windows',
    PILL_ORDER:            'pdos_pill_order',
    WALLPAPER:             'pdos_wallpaper',
    DARK_THEME:            'pdos_dark_theme',
    AVIF_SUPPORT:          'pdos_avif_support',
    OPENED_APPS:           'pdos_opened_apps',
    SPOTLIGHT_TIP_SEEN:    'spotlight_tip_seen',
    ACHIEVEMENTS:          'pdos_achievements',
    ACHIEVEMENTS_SEEN:     'pdos_achievements_seen',
    SHOWN_NOTIFICATIONS:   'pdos_shown_notifications',
    TRASH:                 'pdos_trash',
    BEST_2048:             'pdos_2048_best',
    BEST_SNAKE:            'pdos_snake_best',
    BEST_MINESWEEPER:      'pdos_ms_best_time',
    TTT_WINS:              'pdos_ttt_wins',
    // Dynamic key helpers
    windowState: (id) => `window_state_${id}`,
};

function isBrowser() {
    return typeof window !== 'undefined';
}

/**
 * Read a JSON-serialized value from localStorage.
 * @param {string} key - localStorage key
 * @param {*} fallback - returned when the key is missing or the parse fails
 */
export function getJSON(key, fallback = null) {
    if (!isBrowser()) return fallback;
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

/**
 * Write a JSON-serializable value to localStorage.
 * @param {string} key
 * @param {*} value
 */
export function setJSON(key, value) {
    if (!isBrowser()) return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch { /* quota exceeded or private mode — silently ignore */ }
}

/**
 * Read a plain string value from localStorage.
 * @param {string} key
 * @param {string} fallback
 */
export function get(key, fallback = null) {
    if (!isBrowser()) return fallback;
    try {
        const val = localStorage.getItem(key);
        return val !== null ? val : fallback;
    } catch {
        return fallback;
    }
}

/**
 * Write a plain string value to localStorage.
 * @param {string} key
 * @param {string} value
 */
export function set(key, value) {
    if (!isBrowser()) return;
    try {
        localStorage.setItem(key, value);
    } catch { /* silently ignore */ }
}

/**
 * Remove a key from localStorage.
 * @param {string} key
 */
export function remove(key) {
    if (!isBrowser()) return;
    try {
        localStorage.removeItem(key);
    } catch { /* silently ignore */ }
}

/**
 * Remove all keys matching a prefix.
 * @param {string} prefix
 */
export function removeByPrefix(prefix) {
    if (!isBrowser()) return;
    try {
        Object.keys(localStorage)
            .filter(k => k.startsWith(prefix))
            .forEach(k => localStorage.removeItem(k));
    } catch { /* silently ignore */ }
}
