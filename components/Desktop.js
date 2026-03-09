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
        themeColor: app.themeColor,
    }])
);

const LEFT_ICONS = APPS_CONFIG.filter(app => !app.rightColumn && !app.noDesktopIcon).map(app => ({
    id: app.id,
    icon: renderDesktopIcon(app),
    label: app.label,
}));

const RIGHT_ICONS = APPS_CONFIG.filter(app => app.rightColumn).map(app => ({
    id: app.id,
    icon: renderDesktopIcon(app),
    label: app.label,
}));

const WALLPAPERS = [
    { id: 'default', label: 'Bliss', value: "url('/wallpaper_bliss.avif')" },
    { id: 'hierapolis', label: 'Hierapolis', value: "url('/wallpaper_hierapolis.avif')" },
    { id: 'mysore', label: 'Mysore', value: "url('/wallpaper_mysore.jpg')" },
    { id: 'pamukkale', label: 'Pamukkale', value: "url('/wallpaper_pamukkale.avif')" },
    { id: 'salkantay', label: 'Salkantay', value: "url('/wallpaper_salkantay.png')" },
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
    const rafRef = useRef(null);
    const desktopRef = useRef(null);
    const samplerCanvasRef = useRef(null);
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
        maximizedWindows, toggleMaximize, sendToBack,
    } = useWindowManager(useCallback(() => setStartOpen(false), []));

    // Expose focusOrder to keyboard handler via ref so the handler closure stays stable
    const focusOrderRef = useRef(null);
    focusOrderRef.current = focusOrder;

    useEffect(() => {
        const hasSeenTip = localStorage.getItem('spotlight_tip_seen');
        if (!hasSeenTip) {
            let innerTimer;
            const outerTimer = setTimeout(() => {
                setShowSpotlightTip(true);
                innerTimer = setTimeout(() => {
                    setShowSpotlightTip(false);
                    localStorage.setItem('spotlight_tip_seen', 'true');
                }, 8000);
            }, 3000);
            return () => {
                clearTimeout(outerTimer);
                clearTimeout(innerTimer);
            };
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
        const MENU_WIDTH = 180;
        const MENU_HEIGHT = 200; // approximate
        const x = Math.min(e.clientX, window.innerWidth - MENU_WIDTH - 8);
        const y = Math.min(e.clientY, window.innerHeight - MENU_HEIGHT - 8);
        setContextMenu({ visible: true, x, y });
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
            const x = (50 + (e.clientX / window.innerWidth - 0.5) * -3).toFixed(2);
            const y = (50 + (e.clientY / window.innerHeight - 0.5) * -3).toFixed(2);
            if (desktopRef.current) {
                desktopRef.current.style.background =
                    `${activeWallpaper.value} ${x}% ${y}% / cover no-repeat`;
            }
            rafRef.current = null;
        });
    }, [isImageWallpaper, activeWallpaper.value]);

    useEffect(() => {
        if (!isImageWallpaper) {
            document.documentElement.style.removeProperty('--taskbar-tint-r');
            document.documentElement.style.removeProperty('--taskbar-tint-g');
            document.documentElement.style.removeProperty('--taskbar-tint-b');
            return;
        }
        const urlMatch = activeWallpaper.value.match(/url\(['"]?([^'")\s]+)['"]?\)/);
        if (!urlMatch) return;
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = samplerCanvasRef.current;
            if (!canvas) return;
            const W = 80;
            const srcY = Math.floor(img.naturalHeight * 0.8);
            const srcH = img.naturalHeight - srcY;
            const H = Math.max(1, Math.round(W * srcH / img.naturalWidth));
            canvas.width = W;
            canvas.height = H;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, srcY, img.naturalWidth, srcH, 0, 0, W, H);
            const d = ctx.getImageData(0, 0, W, H).data;
            let r = 0, g = 0, b = 0;
            const n = W * H;
            for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i+1]; b += d[i+2]; }
            const mix = 0.3;
            const tr = Math.round((r/n) * mix + 10 * (1 - mix));
            const tg = Math.round((g/n) * mix + 10 * (1 - mix));
            const tb = Math.round((b/n) * mix + 20 * (1 - mix));
            document.documentElement.style.setProperty('--taskbar-tint-r', tr);
            document.documentElement.style.setProperty('--taskbar-tint-g', tg);
            document.documentElement.style.setProperty('--taskbar-tint-b', tb);
        };
        img.src = urlMatch[1];
        return () => { img.onload = null; };
    }, [activeWallpaper.value, isImageWallpaper]);

    return (
        <div
            ref={desktopRef}
            className="fixed inset-0 overflow-hidden"
            style={{
                background: isImageWallpaper
                    ? `${activeWallpaper.value} 50% 50% / cover no-repeat`
                    : activeWallpaper.value,
            }}
            onMouseMove={handleMouseMove}
            onContextMenu={handleContextMenu}
            onClick={() => { closeContextMenu(); setWallpaperPickerOpen(false); }}
        >
            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    role="menu"
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
                    onKeyDown={(e) => {
                        const items = e.currentTarget.querySelectorAll('[role="menuitem"]');
                        const idx = Array.from(items).indexOf(document.activeElement);
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            items[(idx + 1) % items.length]?.focus();
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            items[(idx - 1 + items.length) % items.length]?.focus();
                        } else if (e.key === 'Escape') {
                            setContextMenu(prev => ({ ...prev, visible: false }));
                        }
                    }}
                >
                    <button role="menuitem" onClick={() => window.location.reload()} className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors">
                        Refresh Desktop
                    </button>
                    <div className="h-px my-1.5 mx-2" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)" }} />
                    <button role="menuitem" onClick={() => openApp("about")} className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors">
                        About PDOS
                    </button>
                    <button role="menuitem" onClick={() => window.open('https://github.com/PragyanD', '_blank')} className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors">
                        View GitHub
                    </button>
                    <div className="h-px my-1.5 mx-2" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)" }} />
                    <button
                        role="menuitem"
                        onClick={(e) => { e.stopPropagation(); setWallpaperPickerOpen(true); setContextMenu({ visible: false, x: 0, y: 0 }); }}
                        className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        Change Wallpaper
                    </button>
                    <button
                        role="menuitem"
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

            {/* Desktop Icons — left column (work apps) */}
            <div
                className="absolute top-6 left-6 flex flex-col gap-2"
                style={{ zIndex: 10 }}
            >
                {LEFT_ICONS.map(({ id, icon, label }) => (
                    <DesktopIcon
                        key={id}
                        icon={icon}
                        label={label}
                        onDoubleClick={() => openApp(id)}
                    />
                ))}
            </div>

            {/* Desktop Icons — right column (utilities) */}
            <div
                className="absolute top-6 right-6 flex flex-col gap-2"
                style={{ zIndex: 10 }}
            >
                {RIGHT_ICONS.map(({ id, icon, label }) => (
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
                        themeColor={app.themeColor}
                        maximized={maximizedWindows.has(appId)}
                        onMaximize={() => toggleMaximize(appId)}
                    >
                        <ErrorBoundary key={appId}>
                            <AppComponent darkTheme={darkTheme} onOpenApp={openApp} />
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
                maximizedWindows={maximizedWindows}
                onStartClick={() => setStartOpen((prev) => !prev)}
                startOpen={startOpen}
                onRestoreWindow={openApp}
                onOpenApp={openApp}
                onVolumeClick={() => setSoundOpen(prev => !prev)}
                onCloseApp={closeApp}
                onMinimizeApp={minimizeApp}
                onMaximizeApp={toggleMaximize}
                onBringToFront={focusApp}
                onSendToBack={sendToBack}
            />

            {/* Volume Control Popup */}
            {soundOpen && (
                <div
                    className="fixed bottom-14 right-4 w-64 p-4 rounded-xl bg-[#1a1a1a]/80 backdrop-blur-3xl border border-white/10 shadow-2xl z-[300]"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Master Volume</span>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="text-xs px-2 py-0.5 rounded border border-white/10 text-white/60 hover:bg-white/5"
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
                        <span className="text-xs text-white/50 w-7 text-right tabular-nums">{Math.round(volume * 100)}%</span>
                    </div>
                    <div className="mt-3 text-xs text-blue-400 font-mono text-center">
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
                        style={{ background: "rgba(18,18,30,0.95)", backdropFilter: "blur(40px)", width: 440 }}
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
                                    aria-pressed={wallpaper === w.id}
                                    aria-label={w.label + (wallpaper === w.id ? ' (selected)' : '')}
                                >
                                    <div
                                        className="rounded-lg w-full aspect-video transition-all"
                                        style={{
                                            background: w.value.startsWith('url(')
                                                ? `${w.value} center / cover no-repeat`
                                                : w.value,
                                            outline: wallpaper === w.id ? '3px solid #0078d4' : '2px solid transparent',
                                            outlineOffset: '2px',
                                        }}
                                    />
                                    <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">{w.label}</span>
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

            {/* Hidden canvas for wallpaper color sampling */}
            <canvas ref={samplerCanvasRef} style={{ display: 'none' }} aria-hidden="true" />
        </div>
    );
}
