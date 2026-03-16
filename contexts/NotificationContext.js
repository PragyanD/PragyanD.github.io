import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const NotificationContext = createContext(null);

const NOTIFICATION_LIMIT = 3;
const AUTO_DISMISS_MS = 4000;

function getShownNotifications() {
    try {
        return JSON.parse(localStorage.getItem('pdos_shown_notifications') || '{}');
    } catch { return {}; }
}

function markShown(id) {
    const shown = getShownNotifications();
    shown[id] = Date.now();
    localStorage.setItem('pdos_shown_notifications', JSON.stringify(shown));
}

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const queueRef = useRef([]);
    const counterRef = useRef(0);

    const dismiss = useCallback((nid) => {
        setNotifications(prev => prev.filter(n => n.nid !== nid));
    }, []);

    const processQueue = useCallback(() => {
        setNotifications(prev => {
            if (prev.length >= NOTIFICATION_LIMIT || queueRef.current.length === 0) return prev;
            const slotsAvailable = NOTIFICATION_LIMIT - prev.length;
            const toAdd = queueRef.current.splice(0, slotsAvailable);
            return [...prev, ...toAdd];
        });
    }, []);

    const notify = useCallback(({ id, message, icon, type = 'info', showOnce = true }) => {
        if (showOnce && id) {
            const shown = getShownNotifications();
            if (shown[id]) return;
            markShown(id);
        }

        counterRef.current += 1;
        const notification = {
            nid: counterRef.current,
            id,
            message,
            icon,
            type,
            createdAt: Date.now(),
        };

        queueRef.current.push(notification);
        processQueue();
    }, [processQueue]);

    // Process queue when a notification is dismissed
    useEffect(() => {
        if (notifications.length < NOTIFICATION_LIMIT && queueRef.current.length > 0) {
            const timer = setTimeout(processQueue, 100);
            return () => clearTimeout(timer);
        }
    }, [notifications.length, processQueue]);

    // Auto-dismiss
    useEffect(() => {
        if (notifications.length === 0) return;
        const timers = notifications.map(n => {
            const elapsed = Date.now() - n.createdAt;
            const remaining = Math.max(AUTO_DISMISS_MS - elapsed, 0);
            return setTimeout(() => dismiss(n.nid), remaining);
        });
        return () => timers.forEach(clearTimeout);
    }, [notifications, dismiss]);

    return (
        <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
}
