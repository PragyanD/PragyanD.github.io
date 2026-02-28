import { useState, useCallback, useRef } from "react";

/**
 * Manages open/minimized/focus state for all desktop windows.
 * @param {Function} onOpen - side effect called at the start of openApp (e.g. close start menu)
 */
export default function useWindowManager(onOpen) {
    const [openWindows, setOpenWindows] = useState([]);
    const [minimizedWindows, setMinimizedWindows] = useState([]);
    const [focusOrder, setFocusOrder] = useState([]);
    const [minimizing, setMinimizing] = useState(null);
    const [restoring, setRestoring] = useState(null);
    const [closing, setClosing] = useState(new Set());
    const closingTimers = useRef({});

    const openApp = useCallback((appId) => {
        onOpen?.();
        if (minimizedWindows.includes(appId)) {
            setRestoring(appId);
            setMinimizedWindows((prev) => prev.filter((id) => id !== appId));
            setFocusOrder((prev) => [...prev.filter((id) => id !== appId), appId]);
            setTimeout(() => setRestoring(null), 450);
            return;
        }
        if (!openWindows.includes(appId)) {
            setOpenWindows((prev) => [...prev, appId]);
            setFocusOrder((prev) => [...prev.filter((id) => id !== appId), appId]);
        } else {
            setFocusOrder((prev) => [...prev.filter((id) => id !== appId), appId]);
        }
    }, [openWindows, minimizedWindows, onOpen]);

    const closeApp = useCallback((appId) => {
        // Play close animation first, then remove from state
        setClosing(prev => new Set([...prev, appId]));
        closingTimers.current[appId] = setTimeout(() => {
            setOpenWindows((prev) => prev.filter((id) => id !== appId));
            setMinimizedWindows((prev) => prev.filter((id) => id !== appId));
            setFocusOrder((prev) => prev.filter((id) => id !== appId));
            setClosing(prev => { const next = new Set(prev); next.delete(appId); return next; });
            delete closingTimers.current[appId];
        }, 190);
    }, []);

    const minimizeApp = useCallback((appId) => {
        setMinimizing(appId);
        setTimeout(() => {
            setMinimizedWindows((prev) => prev.includes(appId) ? prev : [...prev, appId]);
            setFocusOrder((prev) => prev.filter((id) => id !== appId));
            setMinimizing(null);
        }, 450);
    }, []);

    const focusApp = useCallback((appId) => {
        setFocusOrder((prev) => [...prev.filter((id) => id !== appId), appId]);
        if (minimizedWindows.includes(appId)) {
            openApp(appId);
        }
    }, [minimizedWindows, openApp]);

    // Windows to render: open + not minimized, plus windows animating out
    const activeWindows = [
        ...new Set([
            ...openWindows.filter(id => !minimizedWindows.includes(id)),
            ...(minimizing ? [minimizing] : []),
            ...closing,
        ])
    ];

    // All "running" apps for the taskbar (open + minimized)
    const allRunning = [...new Set([...openWindows, ...minimizedWindows])];

    return {
        openWindows,
        minimizedWindows,
        focusOrder,
        minimizing,
        restoring,
        closing,
        activeWindows,
        allRunning,
        openApp,
        closeApp,
        minimizeApp,
        focusApp,
    };
}
