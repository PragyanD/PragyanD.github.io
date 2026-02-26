import { useState, useCallback } from "react";
import Window from "./Window";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import DesktopIcon from "./DesktopIcon";
import TaskManagerApp from "./apps/TaskManagerApp";
import ResumeApp from "./apps/ResumeApp";
import AboutApp from "./apps/AboutApp";
import ProjectsApp from "./apps/ProjectsApp";

const APPS = {
    taskmanager: {
        title: "Task Manager",
        icon: "📊",
        component: TaskManagerApp,
        width: 820,
        height: 560,
        initialX: 140,
        initialY: 60,
    },
    resume: {
        title: "resume.pdf — Viewer",
        icon: "📄",
        component: ResumeApp,
        width: 720,
        height: 580,
        initialX: 220,
        initialY: 80,
    },
    about: {
        title: "About Me",
        icon: "👤",
        component: AboutApp,
        width: 680,
        height: 520,
        initialX: 180,
        initialY: 70,
    },
    projects: {
        title: "Projects",
        icon: "💼",
        component: ProjectsApp,
        width: 820,
        height: 560,
        initialX: 160,
        initialY: 65,
    },
};

const DESKTOP_ICONS = [
    { id: "about", icon: "👤", label: "About Me" },
    { id: "taskmanager", icon: "📊", label: "Task Manager" },
    { id: "projects", icon: "💼", label: "Projects" },
    { id: "resume", icon: "📄", label: "resume.pdf" },
];

export default function Desktop() {
    const [openWindows, setOpenWindows] = useState([]);
    const [minimizedWindows, setMinimizedWindows] = useState([]);
    const [focusOrder, setFocusOrder] = useState([]);
    const [startOpen, setStartOpen] = useState(false);
    const [minimizing, setMinimizing] = useState(null);
    const [restoring, setRestoring] = useState(null);

    const openApp = useCallback((appId) => {
        setStartOpen(false);
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
    }, [openWindows, minimizedWindows]);

    const closeApp = useCallback((appId) => {
        setOpenWindows((prev) => prev.filter((id) => id !== appId));
        setMinimizedWindows((prev) => prev.filter((id) => id !== appId));
        setFocusOrder((prev) => prev.filter((id) => id !== appId));
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
        // Un-minimize if minimized (with animation)
        if (minimizedWindows.includes(appId)) {
            openApp(appId);
        }
    }, [minimizedWindows, openApp]);

    // Windows that should be rendered (open but not minimized, OR currently minimizing)
    const activeWindows = [...new Set([...openWindows.filter(id => !minimizedWindows.includes(id)), (minimizing || [])].flat())].filter(Boolean);

    // All "running" (open + minimized) for taskbar
    const allRunning = [...new Set([...openWindows, ...minimizedWindows])];

    return (
        <div
            className="fixed inset-0 overflow-hidden"
            style={{
                backgroundImage: "url('/new_wallpaper.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Subtle dark overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "rgba(0,0,0,0.15)" }}
            />

            {/* Desktop Icons — left column */}
            <div
                className="absolute top-6 left-6 flex flex-col gap-2"
                style={{ zIndex: 10 }}
            >
                {DESKTOP_ICONS.map(({ id, icon, label }) => (
                    <DesktopIcon
                        key={id}
                        icon={icon}
                        label={label}
                        onDoubleClick={() => openApp(id)}
                    />
                ))}
            </div>

            {/* Windows */}
            {activeWindows.map((appId) => {
                const app = APPS[appId];
                if (!app) return null;
                const AppComponent = app.component;
                const zIndex = 20 + focusOrder.indexOf(appId);
                return (
                    <Window
                        key={appId}
                        id={appId}
                        title={app.title}
                        icon={app.icon}
                        initialWidth={app.width}
                        initialHeight={app.height}
                        initialX={app.initialX}
                        initialY={app.initialY}
                        onClose={closeApp}
                        onMinimize={minimizeApp}
                        onFocus={focusApp}
                        zIndex={zIndex}
                        isMinimizing={minimizing === appId}
                        isRestoring={restoring === appId}
                    >
                        <AppComponent />
                    </Window>
                );
            })}

            {/* Start Menu */}
            <StartMenu
                open={startOpen}
                onClose={() => setStartOpen(false)}
                onOpenApp={openApp}
            />

            {/* Taskbar */}
            <Taskbar
                openWindows={allRunning}
                minimizedWindows={minimizedWindows}
                onStartClick={() => setStartOpen((prev) => !prev)}
                startOpen={startOpen}
                onRestoreWindow={openApp}
                onOpenApp={openApp}
            />
        </div>
    );
}
