import { getJSON, setJSON } from './storage';

const KEYS = {
    APP_STATS: 'pdos_app_stats',
    SESSION_COUNT: 'pdos_session_count',
    SESSION_START: 'pdos_session_start',
};

/**
 * Increment the open-count for a given app.
 */
export function trackAppOpen(appId) {
    const stats = getJSON(KEYS.APP_STATS, {});
    stats[appId] = (stats[appId] || 0) + 1;
    setJSON(KEYS.APP_STATS, stats);
}

/**
 * Return a map of { appId: openCount } for all tracked apps.
 */
export function getAppStats() {
    return getJSON(KEYS.APP_STATS, {});
}

/**
 * Call once per page load to record a new session.
 * Increments total session count and stores the start timestamp.
 */
export function trackSession() {
    const count = getJSON(KEYS.SESSION_COUNT, 0);
    setJSON(KEYS.SESSION_COUNT, count + 1);
    setJSON(KEYS.SESSION_START, Date.now());
}

/**
 * Return { count, startTime } for display purposes.
 * `startTime` is epoch-ms of the current session start.
 */
export function getSessionStats() {
    return {
        count: getJSON(KEYS.SESSION_COUNT, 0),
        startTime: getJSON(KEYS.SESSION_START, Date.now()),
    };
}
