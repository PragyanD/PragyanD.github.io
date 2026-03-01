import { useState, useCallback, useEffect, useRef } from "react";
import Window from "./Window";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import DesktopIcon from "./DesktopIcon";
import Spotlight from "./Spotlight";
import ErrorBoundary from "./ErrorBoundary";
import { APPS_CONFIG, renderWindowIcon, renderDesktopIcon } from "../lib/apps.config";
import useWindowManager from "../hooks/useWindowManager";
import useAudio from "../hooks/useAudio";
import Toast from "./Toast";
import SystemWidget from "./SystemWidget";

const APPS = Object.fromEntries(
    APPS_CONFIG.map(app => [app.id, {
        title: app.title,
        icon: renderWindowIcon(app),
        component: app.component,
        width: app.width,
        height: app.height,
        initialX: app.initialX,
        initialY: app.initialY,
    }])
);

const DESKTOP_ICONS = APPS_CONFIG.map(app => ({
    id: app.id,
    icon: renderDesktopIcon(app),
    label: app.label,
}));

const WALLPAPERS = [
    { id: 'default', label: 'Default', value: "url('/wallpaper.jpg')" },
    { id: 'midnight', label: 'Midnight', value: "linear-gradient(135deg, #0a0a1e 0%, #1a1a4e 50%, #0a0a2e 100%)" },
    { id: 'aurora', label: 'Aurora', value: "linear-gradient(135deg, #0d1b2a 0%, #1b4332 40%, #081c15 100%)" },
    { id: 'dusk', label: 'Dusk', value: "linear-gradient(135deg, #1a0533 0%, #4a1942 50%, #1a0a2e 100%)" },
    { id: 'slate', label: 'Slate', value: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" },
];

export default function Desktop({ onRestart }) {
    const [startOpen, setStartOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const [spotlightOpen, setSpotlightOpen] = useState(false);
    const [showSpotlightTip, setShowSpotlightTip] = useState(false);
    const [wallpaper, setWallpaper] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pdos_wallpaper') || 'default';
        }
        return 'default';
    });
    const [wallpaperPickerOpen, setWallpaperPickerOpen] = useState(false);
    const [displaySettingsOpen, setDisplaySettingsOpen] = useState(false);
    const [darkTheme, setDarkTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pdos_dark_theme') === 'true';
        }
        return false;
    });
    const [wallpaperPos, setWallpaperPos] = useState({ x: 50, y: 50 });
    const rafRef = useRef(null);
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const { volume, setVolume, isPlaying, setIsPlaying, soundOpen, setSoundOpen } = useAudio();

    const {
        minimizedWindows, focusOrder, minimizing, restoring, closing,
        activeWindows, allRunning,
        openApp, closeApp, minimizeApp, focusApp,
    } = useWindowManager(useCallback(() => setStartOpen(false), []));

    // Expose focusOrder to keyboard handler via ref so the handler closure stays stable
    const focusOrderRef = useRef(null);
    focusOrderRef.current = focusOrder;

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
            const topWindow = focusOrderRef.current?.at(-1);
            if (topWindow) {
                if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
                    e.preventDefault();
                    closeApp(topWindow);
                }
                if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
                    e.preventDefault();
                    minimizeApp(topWindow);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleContextMenu = useCallback((e) => {
        if (e.target.closest(".window-open") || e.target.closest("#start-button") || e.target.closest(".taskbar")) return;
        e.preventDefault();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
        setStartOpen(false);
    }, []);

    const closeContextMenu = useCallback(() => {
        if (contextMenu.visible) setContextMenu({ visible: false, x: 0, y: 0 });
    }, [contextMenu.visible]);

    const activeWallpaper = WALLPAPERS.find(w => w.id === wallpaper) || WALLPAPERS[0];
    const isImageWallpaper = activeWallpaper.value.startsWith('url(');

    const handleMouseMove = useCallback((e) => {
        if (!isImageWallpaper) return;
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
            setWallpaperPos({
                x: 50 + (e.clientX / window.innerWidth  - 0.5) * -3,
                y: 50 + (e.clientY / window.innerHeight - 0.5) * -3,
            });
            rafRef.current = null;
        });
    }, [isImageWallpaper]);

    return (
        <div
            className="fixed inset-0 overflow-hidden"
            style={{
                background: isImageWallpaper
                    ? `${activeWallpaper.value} ${wallpaperPos.x.toFixed(2)}% ${wallpaperPos.y.toFixed(2)}% / cover no-repeat`
                    : activeWallpaper.value,
            }}
            onMouseMove={handleMouseMove}
            onContextMenu={handleContextMenu}
            onClick={() => { closeContextMenu(); setWallpaperPickerOpen(false); }}
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
                    <div className="h-px my-1.5 mx-2" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)" }} />
                    <button onClick={() => openApp("about")} className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors">
                        About PDOS
                    </button>
                    <button onClick={() => window.open('https://github.com/PragyanD', '_blank')} className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors">
                        View GitHub
                    </button>
                    <div className="h-px my-1.5 mx-2" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)" }} />
                    <button
                        onClick={(e) => { e.stopPropagation(); setWallpaperPickerOpen(true); setContextMenu({ visible: false, x: 0, y: 0 }); }}
                        className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        Change Wallpaper
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setDisplaySettingsOpen(true); setContextMenu({ visible: false, x: 0, y: 0 }); }}
                        className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
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
                        isClosing={closing.has(appId)}
                        focused={focusOrder.at(-1) === appId}
                    >
                        <ErrorBoundary key={appId}>
                            <AppComponent darkTheme={darkTheme} />
                        </ErrorBoundary>
                    </Window>
                );
            })}

            {/* Start Menu */}
            <StartMenu
                open={startOpen}
                onClose={() => setStartOpen(false)}
                onOpenApp={openApp}
                onRestart={onRestart}
            />

            {/* System Status Widget */}
            <SystemWidget />

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
                        <span className="text-[10px] text-white/50 w-7 text-right tabular-nums">{Math.round(volume * 100)}%</span>
                    </div>
                    <div className="mt-3 text-[10px] text-blue-400 font-mono text-center">
                        SomaFM Fluid · Chillhop — 128kbps
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
                    className="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl z-[300]"
                    style={{ animation: 'bounce 3s infinite' }}
                >
                    <p className="text-white text-sm font-medium">Press <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-xs mx-1">⌘ + K</kbd> to search everything.</p>
                    <button onClick={() => setShowSpotlightTip(false)} className="text-white/50 hover:text-white text-sm leading-none ml-1 transition-colors" aria-label="Dismiss tip">✕</button>
                </div>
            )}

            {/* Wallpaper Picker */}
            {wallpaperPickerOpen && (
                <div
                    className="fixed inset-0 z-[400] flex items-center justify-center"
                    onClick={() => setWallpaperPickerOpen(false)}
                >
                    <div
                        className="rounded-2xl p-5 shadow-2xl border border-white/10"
                        style={{ background: "rgba(18,18,30,0.95)", backdropFilter: "blur(40px)", width: 320 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Choose Wallpaper</p>
                        <div className="grid grid-cols-5 gap-2">
                            {WALLPAPERS.map(w => (
                                <button
                                    key={w.id}
                                    onClick={() => {
                                        setWallpaper(w.id);
                                        localStorage.setItem('pdos_wallpaper', w.id);
                                        setWallpaperPickerOpen(false);
                                        addToast(`Wallpaper changed to ${w.label}`, 'success');
                                    }}
                                    className="flex flex-col items-center gap-1.5 group"
                                >
                                    <div
                                        className="rounded-lg w-full aspect-video transition-all"
                                        style={{
                                            background: w.value.startsWith('url(')
                                                ? `${w.value} center / cover no-repeat`
                                                : w.value,
                                            outline: wallpaper === w.id ? '2px solid #0078d4' : '2px solid transparent',
                                            outlineOffset: 2,
                                        }}
                                    />
                                    <span className="text-[9px] text-white/50 group-hover:text-white/80 transition-colors">{w.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Display Settings Modal */}
            {displaySettingsOpen && (
                <div
                    className="fixed inset-0 z-[400] flex items-center justify-center"
                    onClick={() => setDisplaySettingsOpen(false)}
                >
                    <div
                        className="rounded-2xl p-6 shadow-2xl border border-white/10"
                        style={{ background: "rgba(18,18,30,0.95)", backdropFilter: "blur(40px)", width: 300 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>Display Settings</p>

                        {/* Dark Theme Toggle */}
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>Dark App Theme</p>
                                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Dark backgrounds for About, Projects &amp; Task Manager</p>
                            </div>
                            <button
                                onClick={() => {
                                    const next = !darkTheme;
                                    setDarkTheme(next);
                                    localStorage.setItem('pdos_dark_theme', String(next));
                                    addToast(`Dark theme ${next ? 'enabled' : 'disabled'}`, 'success');
                                }}
                                className="relative flex-shrink-0 rounded-full transition-all duration-200"
                                style={{
                                    width: 44,
                                    height: 24,
                                    background: darkTheme ? "#0078d4" : "rgba(255,255,255,0.15)",
                                    border: darkTheme ? "1px solid #0078d4" : "1px solid rgba(255,255,255,0.2)",
                                }}
                                aria-label="Toggle dark theme"
                            >
                                <span
                                    className="absolute top-0.5 rounded-full bg-white transition-all duration-200"
                                    style={{
                                        width: 19,
                                        height: 19,
                                        left: darkTheme ? 22 : 2,
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                                    }}
                                />
                            </button>
                        </div>

                        <div className="h-px my-4" style={{ background: "rgba(255,255,255,0.08)" }} />

                        <button
                            onClick={() => setDisplaySettingsOpen(false)}
                            className="w-full py-1.5 rounded-lg text-xs transition-colors hover:bg-white/5"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <Toast toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
}
