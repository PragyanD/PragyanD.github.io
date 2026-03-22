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
import { get, set, getJSON, setJSON, STORAGE_KEYS } from "../lib/storage";
import Toast from "./Toast";
import SystemWidget from "./SystemWidget";
import VolumeControl from "./VolumeControl";
import WallpaperPicker from "./WallpaperPicker";
import DisplaySettings from "./DisplaySettings";
import { NotificationProvider, useNotifications } from "../contexts/NotificationContext";
import { AchievementProvider, useAchievements } from "../contexts/AchievementContext";
import NotificationCenter from "./NotificationCenter";
import { PopupMenu, MenuItem, MenuDivider } from "./ui/PopupMenu";

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
    { id: 'default', label: 'Bliss', avif: '/wallpaper_bliss.avif', fallback: '/wallpaper_bliss.jpg' },
    { id: 'hierapolis', label: 'Hierapolis', avif: '/wallpaper_hierapolis.avif', fallback: '/wallpaper_hierapolis.jpg' },
    { id: 'mysore', label: 'Mysore', avif: '/wallpaper_mysore.avif', fallback: '/wallpaper_mysore.jpg' },
    { id: 'pamukkale', label: 'Pamukkale', avif: '/wallpaper_pamukkale.avif', fallback: '/wallpaper_pamukkale.jpg' },
    { id: 'salkantay', label: 'Salkantay', avif: '/wallpaper_salkantay.avif', fallback: '/wallpaper_salkantay.jpg' },
];

function getCachedAvifSupport() {
    const cached = get(STORAGE_KEYS.AVIF_SUPPORT);
    if (cached !== null) return cached === 'true';
    return null;
}

function detectAvifSupport() {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve(img.height === 1);
        img.onerror = () => resolve(false);
        img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLanAyaAAAAAAAAAAAAAAAAAAAAAAAABhpc3BlAAAAAAAAAAIAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKBzgABpAQ0AIAAAAhAAkiGhAFfA';
    });
}

export default function Desktop({ onRestart }) {
    return (
        <NotificationProvider>
            <AchievementProvider>
                <DesktopInner onRestart={onRestart} />
            </AchievementProvider>
        </NotificationProvider>
    );
}

function DesktopInner({ onRestart }) {
    const [startOpen, setStartOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const [spotlightOpen, setSpotlightOpen] = useState(false);
    const [showSpotlightTip, setShowSpotlightTip] = useState(false);
    const [wallpaper, setWallpaper] = useState(() => {
        return get(STORAGE_KEYS.WALLPAPER, 'default');
    });
    const [wallpaperPickerOpen, setWallpaperPickerOpen] = useState(false);
    const [displaySettingsOpen, setDisplaySettingsOpen] = useState(false);
    const [darkTheme, setDarkTheme] = useState(() => {
        return get(STORAGE_KEYS.DARK_THEME) === 'true';
    });
    const [supportsAvif, setSupportsAvif] = useState(getCachedAvifSupport);
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

    useEffect(() => {
        if (supportsAvif === null) {
            detectAvifSupport().then((supported) => {
                setSupportsAvif(supported);
                set(STORAGE_KEYS.AVIF_SUPPORT, String(supported));
            });
        }
    }, []);

    const getWallpaperSrc = useCallback((wp) => {
        return supportsAvif === true ? wp.avif : wp.fallback;
    }, [supportsAvif]);

    const { volume, setVolume, isPlaying, setIsPlaying, soundOpen, setSoundOpen } = useAudio();

    const { notify } = useNotifications();
    const { unlock, isUnlocked } = useAchievements();

    const {
        minimizedWindows, focusOrder, minimizing, restoring, closing,
        activeWindows, allRunning,
        openApp: rawOpenApp, closeApp, minimizeApp, focusApp,
        maximizedWindows, toggleMaximize, sendToBack,
    } = useWindowManager(useCallback(() => setStartOpen(false), []));

    // Track opened apps for explorer achievement
    const openedAppsRef = useRef(() => {
        return new Set(getJSON(STORAGE_KEYS.OPENED_APPS, []));
    });
    // Initialize on mount
    useEffect(() => {
        if (typeof openedAppsRef.current === 'function') {
            openedAppsRef.current = openedAppsRef.current();
        }
    }, []);

    const APP_NOTIFICATIONS = {
        terminal: { id: 'notif_terminal', message: "Type 'help' to see available commands.", icon: '⌨️' },
        games_hub: { id: 'notif_games', message: 'Take a break.', icon: '🎮' },
        trash: { id: 'notif_trash', message: "You weren't supposed to find this.", icon: '🗑️' },
        resume: { id: 'notif_resume', message: 'Updated and ready to download.', icon: '📄' },
        projects: { id: 'notif_projects', message: "A selection of things I've built.", icon: '📁' },
        about: { id: 'notif_about', message: "The short version.", icon: '👤' },
        taskmanager: { id: 'notif_taskmanager', message: 'Experiences and skills at a glance.', icon: '📊' },
        notepad: { id: 'notif_notepad', message: 'A few things worth knowing.', icon: '🥚' },
        achievements: { id: 'notif_achievements', message: 'How many have you found?', icon: '🏆' },
    };

    // Wrap openApp to trigger notifications and achievements
    const openApp = useCallback((appId) => {
        rawOpenApp(appId);

        // App-specific notification
        const notifConfig = APP_NOTIFICATIONS[appId];
        if (notifConfig) {
            notify({ ...notifConfig, type: 'info', showOnce: true });
        }

        // Track for explorer achievement
        if (typeof openedAppsRef.current !== 'function') {
            openedAppsRef.current.add(appId);
            setJSON(STORAGE_KEYS.OPENED_APPS, [...openedAppsRef.current]);
            const allAppIds = APPS_CONFIG.map(a => a.id);
            if (allAppIds.every(id => openedAppsRef.current.has(id))) {
                unlock('explorer');
            }
        }

        // Specific achievements
        if (appId === 'trash') unlock('archaeologist');
    }, [rawOpenApp, notify, unlock]);

    // Multitasker achievement: 4+ windows open
    useEffect(() => {
        const openCount = allRunning.filter(id => !minimizedWindows.includes(id)).length;
        if (openCount >= 4) unlock('multitasker');
    }, [allRunning, minimizedWindows, unlock]);

    // Time-based notification
    useEffect(() => {
        const timer = setTimeout(() => {
            notify({ id: 'notif_5min', message: "Try the Terminal — it has a few surprises.", icon: '⌨️', type: 'hint', showOnce: true });
        }, 5 * 60 * 1000);
        return () => clearTimeout(timer);
    }, [notify]);

    // First boot achievement
    useEffect(() => {
        unlock('first_boot');
    }, [unlock]);

    // Right-click hint after 30s if context menu hasn't been opened
    const hasContextMenudRef = useRef(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasContextMenudRef.current) {
                notify({ id: 'notif_rightclick', message: 'Try right-clicking the desktop.', icon: '💡', type: 'hint', showOnce: true });
            }
        }, 30000);
        return () => clearTimeout(timer);
    }, [notify]);

    // Expose focusOrder to keyboard handler via ref so the handler closure stays stable
    const focusOrderRef = useRef(null);
    focusOrderRef.current = focusOrder;

    useEffect(() => {
        const hasSeenTip = get(STORAGE_KEYS.SPOTLIGHT_TIP_SEEN);
        if (!hasSeenTip) {
            let innerTimer;
            const outerTimer = setTimeout(() => {
                setShowSpotlightTip(true);
                innerTimer = setTimeout(() => {
                    setShowSpotlightTip(false);
                    set(STORAGE_KEYS.SPOTLIGHT_TIP_SEEN, 'true');
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
        hasContextMenudRef.current = true;
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
    const wallpaperSrc = getWallpaperSrc(activeWallpaper);
    const wallpaperCssValue = `url('${wallpaperSrc}')`;

    const handleMouseMove = useCallback((e) => {
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
            const x = (50 + (e.clientX / window.innerWidth - 0.5) * -3).toFixed(2);
            const y = (50 + (e.clientY / window.innerHeight - 0.5) * -3).toFixed(2);
            if (desktopRef.current) {
                desktopRef.current.style.background =
                    `${wallpaperCssValue} ${x}% ${y}% / cover no-repeat`;
            }
            rafRef.current = null;
        });
    }, [wallpaperCssValue]);

    useEffect(() => {
        const img = new window.Image();
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
        img.onerror = () => {
            document.documentElement.style.setProperty('--taskbar-tint-r', 10);
            document.documentElement.style.setProperty('--taskbar-tint-g', 10);
            document.documentElement.style.setProperty('--taskbar-tint-b', 20);
        };
        img.src = wallpaperSrc;
        return () => { img.onload = null; img.onerror = null; };
    }, [wallpaperSrc]);

    return (
        <div
            ref={desktopRef}
            className="fixed inset-0 overflow-hidden"
            style={{
                background: `${wallpaperCssValue} 50% 50% / cover no-repeat`,
            }}
            onMouseMove={handleMouseMove}
            onContextMenu={handleContextMenu}
            onClick={() => { closeContextMenu(); setWallpaperPickerOpen(false); }}
        >
            {/* Context Menu */}
            <PopupMenu
                visible={contextMenu.visible}
                x={contextMenu.x}
                y={contextMenu.y}
                onClose={closeContextMenu}
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
                <MenuItem onClick={() => window.location.reload()}>
                    Refresh Desktop
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => openApp("about")}>
                    About PDOS
                </MenuItem>
                <MenuItem onClick={() => window.open('https://github.com/PragyanD', '_blank')}>
                    View GitHub
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={(e) => { e.stopPropagation(); setWallpaperPickerOpen(true); setContextMenu({ visible: false, x: 0, y: 0 }); }}>
                    Change Wallpaper
                </MenuItem>
                <MenuItem onClick={(e) => { e.stopPropagation(); setDisplaySettingsOpen(true); setContextMenu({ visible: false, x: 0, y: 0 }); }}>
                    Display Settings
                </MenuItem>
            </PopupMenu>

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
            <VolumeControl
                open={soundOpen}
                volume={volume}
                onVolumeChange={setVolume}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
            />

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
            <WallpaperPicker
                open={wallpaperPickerOpen}
                onClose={() => setWallpaperPickerOpen(false)}
                wallpapers={WALLPAPERS}
                currentWallpaper={wallpaper}
                onSelect={(w) => {
                    setWallpaper(w.id);
                    set(STORAGE_KEYS.WALLPAPER, w.id);
                    setWallpaperPickerOpen(false);
                    addToast(`Wallpaper changed to ${w.label}`, 'success');
                    unlock('wallpaper');
                }}
                getWallpaperSrc={getWallpaperSrc}
            />

            {/* Display Settings Modal */}
            <DisplaySettings
                open={displaySettingsOpen}
                onClose={() => setDisplaySettingsOpen(false)}
                darkTheme={darkTheme}
                onToggleDarkTheme={() => {
                    const next = !darkTheme;
                    setDarkTheme(next);
                    set(STORAGE_KEYS.DARK_THEME, String(next));
                    addToast(`Dark theme ${next ? 'enabled' : 'disabled'}`, 'success');
                    unlock('night_owl');
                }}
            />

            {/* Toast Notifications (legacy) */}
            <Toast toasts={toasts} onDismiss={dismissToast} />

            {/* Achievement/System Notifications */}
            <NotificationCenter />

            {/* Hidden canvas for wallpaper color sampling */}
            <canvas ref={samplerCanvasRef} style={{ display: 'none' }} aria-hidden="true" />
        </div>
    );
}
