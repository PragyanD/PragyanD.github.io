import { useState, useCallback, useEffect, useRef } from "react";
import Window from "./Window";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import DesktopIcon from "./DesktopIcon";
import TaskManagerApp from "./apps/TaskManagerApp";
import ResumeApp from "./apps/ResumeApp";
import AboutApp from "./apps/AboutApp";
import ProjectsApp from "./apps/ProjectsApp";
import TerminalApp from "./apps/TerminalApp";
import Spotlight from "./Spotlight";

const APPS = {
    taskmanager: {
        title: "Task Manager",
        icon: <img src="/icon_task_manager.png" alt="Task Manager" className="w-full h-full object-contain" />,
        component: TaskManagerApp,
        width: 820,
        height: 560,
        initialX: 140,
        initialY: 60,
    },
    resume: {
        title: "resume.pdf — Viewer",
        icon: <img src="/icon_resume.png" alt="Resume" className="w-full h-full object-contain" />,
        component: ResumeApp,
        width: 720,
        height: 580,
        initialX: 220,
        initialY: 80,
    },
    about: {
        title: "About Me",
        icon: <img src="/icon_about.png" alt="About Me" className="w-full h-full object-contain" />,
        component: AboutApp,
        width: 680,
        height: 520,
        initialX: 180,
        initialY: 70,
    },
    projects: {
        title: "Projects",
        icon: <img src="/icon_projects.png" alt="Projects" className="w-full h-full object-contain" />,
        component: ProjectsApp,
        width: 820,
        height: 560,
        initialX: 160,
        initialY: 65,
    },
    terminal: {
        title: "Terminal",
        icon: <div className="w-full h-full flex items-center justify-center bg-black rounded text-[10px] font-bold text-green-500 border border-green-900/50">_&gt;</div>,
        component: TerminalApp,
        width: 640,
        height: 480,
        initialX: 300,
        initialY: 150,
    },
};

const DESKTOP_ICONS = [
    { id: "about", icon: <img src="/icon_about.png" alt="About Me" className="w-full h-full object-contain drop-shadow-md" />, label: "About Me" },
    { id: "taskmanager", icon: <img src="/icon_task_manager.png" alt="Task Manager" className="w-full h-full object-contain drop-shadow-md" />, label: "Task Manager" },
    { id: "projects", icon: <img src="/icon_projects.png" alt="Projects" className="w-full h-full object-contain drop-shadow-md" />, label: "Projects" },
    { id: "resume", icon: <img src="/icon_resume.png" alt="Resume" className="w-full h-full object-contain drop-shadow-md" />, label: "resume.pdf" },
    { id: "terminal", icon: <div className="w-full h-full flex items-center justify-center bg-black rounded-xl text-2xl font-bold text-green-500 border border-green-900/50 shadow-inner group-hover:border-green-400/50 transition-colors">_&gt;</div>, label: "Terminal" },
];

export default function Desktop() {
    const [openWindows, setOpenWindows] = useState([]);
    const [minimizedWindows, setMinimizedWindows] = useState([]);
    const [focusOrder, setFocusOrder] = useState([]);
    const [startOpen, setStartOpen] = useState(false);
    const [minimizing, setMinimizing] = useState(null);
    const [restoring, setRestoring] = useState(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const [spotlightOpen, setSpotlightOpen] = useState(false);
    const [showSpotlightTip, setShowSpotlightTip] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [soundOpen, setSoundOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = volume;
    }, []);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        const hasSeenTip = localStorage.getItem('spotlight_tip_seen');
        if (!hasSeenTip) {
            setTimeout(() => {
                setShowSpotlightTip(true);
                setTimeout(() => {
                    setShowSpotlightTip(false);
                    localStorage.setItem('spotlight_tip_seen', 'true');
                }, 8000);
            }, 3000);
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSpotlightOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setSpotlightOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleContextMenu = useCallback((e) => {
        // Only trigger desktop context menu if clicking directly on the desktop or icons
        if (e.target.closest(".window-open") || e.target.closest("#start-button") || e.target.closest(".taskbar")) return;
        e.preventDefault();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
        setStartOpen(false);
    }, []);

    const closeContextMenu = useCallback(() => {
        if (contextMenu.visible) setContextMenu({ visible: false, x: 0, y: 0 });
    }, [contextMenu.visible]);

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
            onContextMenu={handleContextMenu}
            onClick={closeContextMenu}
        >
            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    className="fixed z-[100] flex flex-col p-1.5 rounded-xl shadow-2xl transition-all font-mono"
                    style={{
                        left: contextMenu.x,
                        top: contextMenu.y,
                        width: 180,
                        background: "rgba(30, 30, 40, 0.6)",
                        backdropFilter: "blur(40px)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <button onClick={() => window.location.reload()} className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors">
                        Refresh Desktop
                    </button>
                    <div className="h-px bg-white/10 my-1 mx-2" />
                    <button onClick={() => openApp("about")} className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors">
                        About PragyanOS
                    </button>
                    <button onClick={() => window.open('https://github.com/PragyanD', '_blank')} className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors">
                        View GitHub
                    </button>
                    <div className="h-px bg-white/10 my-1 mx-2" />
                    <button disabled className="text-left px-3 py-1.5 text-xs text-white/40 cursor-not-allowed">
                        Change Wallpaper
                    </button>
                    <button disabled className="text-left px-3 py-1.5 text-xs text-white/40 cursor-not-allowed">
                        Display Settings
                    </button>
                </div>
            )}

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
                onVolumeClick={() => setSoundOpen(prev => !prev)}
            />

            {/* Volume Control Popup */}
            {soundOpen && (
                <div
                    className="fixed bottom-14 right-4 w-64 p-4 rounded-xl bg-[#1a1a1a]/80 backdrop-blur-3xl border border-white/10 shadow-2xl z-[300]"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Master Volume</span>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="text-[10px] px-2 py-0.5 rounded border border-white/10 text-white/60 hover:bg-white/5"
                        >
                            {isPlaying ? 'PAUSE' : 'PLAY'}
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm opacity-40">🔈</span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="flex-1 accent-blue-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm opacity-40">🔊</span>
                    </div>
                    <div className="mt-3 text-[10px] text-blue-400 font-mono text-center">
                        Lo-Fi Study Beats — 128kbps
                    </div>
                </div>
            )}

            {/* Spotlight Overlay */}
            <Spotlight
                isOpen={spotlightOpen}
                onClose={() => setSpotlightOpen(false)}
                onOpenApp={openApp}
            />

            {/* Spotlight Tip */}
            {showSpotlightTip && (
                <div
                    className="fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl z-[300] animate-bounce-slow"
                    style={{ animation: 'bounce 3s infinite' }}
                >
                    <p className="text-white text-sm font-medium">Press <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-xs mx-1">⌘ + K</kbd> to search everything.</p>
                </div>
            )}
        </div>
    );
}
