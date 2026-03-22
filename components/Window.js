import { useState, useRef, useCallback, useEffect, useMemo, memo } from "react";
import { createPortal } from "react-dom";
import { getJSON, setJSON, STORAGE_KEYS } from "../lib/storage";

function Window({
    id,
    title,
    icon,
    children,
    initialWidth = 800,
    initialHeight = 520,
    initialX,
    initialY,
    onClose,
    onMinimize,
    onFocus,
    zIndex,
    isMinimizing,
    isRestoring,
    isClosing = false,
    focused = true,
    themeColor = '#0078d4',
    maximized = false,
    onMaximize,
}) {
    const [pos, setPos] = useState(() => {
        const saved = getJSON(STORAGE_KEYS.windowState(id));
        if (saved) return saved.pos;
        return {
            x: initialX ?? Math.max(60, Math.floor(Math.random() * 300) + 80),
            y: initialY ?? Math.max(40, Math.floor(Math.random() * 120) + 40),
        };
    });
    const [size, setSize] = useState(() => {
        const saved = getJSON(STORAGE_KEYS.windowState(id));
        if (saved) return saved.size;
        return { w: initialWidth, h: initialHeight };
    });

    const [titleMenu, setTitleMenu] = useState(null); // { x, y } | null
    const [pinned, setPinned] = useState(false);       // Always on Top

    const dragging = useRef(false);
    const [isDragging, setIsDragging] = useState(false);
    const resizing = useRef(false); // store direction string: 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'
    const offset = useRef({ x: 0, y: 0 });
    const prevState = useRef(null);

    const posRef = useRef(pos);
    const sizeRef = useRef(size);

    const [snapped, setSnapped] = useState(false); // 'left' | 'right' | false
    const [snapPreview, setSnapPreview] = useState(null); // 'left' | 'right' | null
    const snappedRef = useRef(false);

    useEffect(() => { posRef.current = pos; }, [pos]);
    useEffect(() => { sizeRef.current = size; }, [size]);
    useEffect(() => { snappedRef.current = snapped; }, [snapped]);

    const prevMaximizedRef = useRef(maximized);
    useEffect(() => {
        const was = prevMaximizedRef.current;
        prevMaximizedRef.current = maximized;
        if (maximized && !was && !prevState.current) {
            prevState.current = { pos: { ...posRef.current }, size: { ...sizeRef.current } };
        } else if (!maximized && was && prevState.current) {
            setPos(prevState.current.pos);
            setSize(prevState.current.size);
            prevState.current = null;
        }
    }, [maximized]); // eslint-disable-line react-hooks/exhaustive-deps

    const onMouseDownTitle = useCallback((e) => {
        if (maximized) return;
        if (e.target.closest(".win-control")) return;
        dragging.current = true;
        setIsDragging(true);
        offset.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y };
        onFocus?.(id);
        e.preventDefault();

        const onDragMove = (ev) => {
            // If dragged away from snapped state, restore original size and calculate new relative pos
            if (snappedRef.current) {
                setSnapped(false);
                // Prevent jumping: set the mouse offset to center of the restored window title bar
                offset.current = { x: sizeRef.current.w / 2, y: 20 };
            }

            const TASKBAR = 48;
            let newX = ev.clientX - offset.current.x;
            let newY = Math.max(0, Math.min(window.innerHeight - TASKBAR - 40, ev.clientY - offset.current.y));

            // Snap preview
            if (ev.clientX <= 20) {
                setSnapPreview('left');
            } else if (ev.clientX >= window.innerWidth - 20) {
                setSnapPreview('right');
            } else {
                setSnapPreview(null);
            }

            // Snap logic
            if (ev.clientX <= 20) {
                setSnapped('left');
                prevState.current = { pos: { x: newX, y: newY }, size: { ...sizeRef.current } };
                setPos({ x: 0, y: 0 });
            } else if (ev.clientX >= window.innerWidth - 20) {
                setSnapped('right');
                prevState.current = { pos: { x: newX, y: newY }, size: { ...sizeRef.current } };
                setPos({ x: window.innerWidth / 2, y: 0 });
            } else {
                setPos({
                    x: Math.max(0, Math.min(window.innerWidth - sizeRef.current.w, newX)),
                    y: newY,
                });
            }
        };

        const onDragUp = () => {
            setJSON(STORAGE_KEYS.windowState(id), { pos: posRef.current, size: sizeRef.current });
            dragging.current = false;
            setIsDragging(false);
            setSnapPreview(null);
            window.removeEventListener("mousemove", onDragMove);
            window.removeEventListener("mouseup", onDragUp);
        };

        window.addEventListener("mousemove", onDragMove);
        window.addEventListener("mouseup", onDragUp);
    }, [maximized, id, onFocus]);

    const onMouseDownResize = useCallback((e, dir) => {
        if (maximized) return;
        resizing.current = dir;
        offset.current = {
            startX: e.clientX,
            startY: e.clientY,
            startW: sizeRef.current.w,
            startH: sizeRef.current.h,
            startXPos: posRef.current.x,
            startYPos: posRef.current.y
        };
        onFocus?.(id);
        e.preventDefault();
        e.stopPropagation();

        const onResizeMove = (ev) => {
            if (snappedRef.current) setSnapped(false);
            const deltaX = ev.clientX - offset.current.startX;
            const deltaY = ev.clientY - offset.current.startY;

            let newW = offset.current.startW;
            let newH = offset.current.startH;
            let newX = offset.current.startXPos;
            let newY = offset.current.startYPos;

            if (dir.includes('e')) {
                newW = Math.max(300, offset.current.startW + deltaX);
            }
            if (dir.includes('s')) {
                newH = Math.max(200, offset.current.startH + deltaY);
            }
            if (dir.includes('w')) {
                newW = Math.max(300, offset.current.startW - deltaX);
                if (newW > 300) {
                    newX = offset.current.startXPos + deltaX;
                }
            }
            if (dir.includes('n')) {
                newH = Math.max(200, offset.current.startH - deltaY);
                if (newH > 200) {
                    newY = offset.current.startYPos + deltaY;
                }
            }

            setSize({ w: newW, h: newH });
            setPos({ x: newX, y: newY });
        };

        const onResizeUp = () => {
            setJSON(STORAGE_KEYS.windowState(id), { pos: posRef.current, size: sizeRef.current });
            resizing.current = false;
            setSnapPreview(null);
            window.removeEventListener("mousemove", onResizeMove);
            window.removeEventListener("mouseup", onResizeUp);
        };

        window.addEventListener("mousemove", onResizeMove);
        window.addEventListener("mouseup", onResizeUp);
    }, [maximized, id, onFocus]);

    const toggleMaximize = useCallback(() => {
        if (!maximized) {
            prevState.current = { pos: { ...posRef.current }, size: { ...sizeRef.current } };
        } else {
            if (prevState.current) {
                setPos(prevState.current.pos);
                setSize(prevState.current.size);
                prevState.current = null;
            }
        }
        onMaximize?.();
        onFocus?.(id);
    }, [maximized, onMaximize, id, onFocus]);

    const boxShadow = useMemo(() => {
        if (maximized || isMinimizing || snapped) return "none";
        const c = themeColor;
        if (isDragging) return `inset 0 1px 0 rgba(255,255,255,0.3), 0 0 32px ${c}4d, 0 35px 100px rgba(0,0,0,0.55)`;
        if (focused)    return `inset 0 1px 0 rgba(255,255,255,0.3), 0 0 24px ${c}40, 0 24px 80px rgba(0,0,0,0.4)`;
        return "inset 0 1px 0 rgba(255,255,255,0.08), 0 6px 20px rgba(0,0,0,0.18)";
    }, [maximized, isMinimizing, snapped, isDragging, focused, themeColor]);

    const effectiveZIndex = pinned ? 9998 : zIndex;

    const style = maximized
        ? { left: 0, top: 0, width: "100%", height: "calc(100vh - 48px)", zIndex: effectiveZIndex }
        : snapped === 'left'
            ? { left: 0, top: 0, width: "50%", height: "calc(100vh - 48px)", zIndex: effectiveZIndex }
            : snapped === 'right'
                ? { left: "50%", top: 0, width: "50%", height: "calc(100vh - 48px)", zIndex: effectiveZIndex }
                : { left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex: effectiveZIndex };

    // Only play the windowOpen animation on a true first-open, NOT on restore-from-minimized.
    // If we always added "window-open", removing "win-restore" at the end of the restore timeout
    // would leave only "window-open", restarting the open animation a second time.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [playOpenAnim] = useState(() => !isRestoring);

    const animClass = isClosing ? "win-close" : isMinimizing ? "win-minimize" : isRestoring ? "win-restore" : "";
    const openClass = playOpenAnim ? "window-open" : "";

    const titleMenuItems = [
        { label: 'Close',                        action: () => { onClose?.(id); setTitleMenu(null); } },
        { label: 'Minimize',                     action: () => { onMinimize?.(id); setTitleMenu(null); } },
        { label: maximized ? 'Restore' : 'Maximize', action: () => { toggleMaximize(); setTitleMenu(null); } },
        null,
        { label: pinned ? '✓ Always on Top' : 'Always on Top', action: () => { setPinned(p => !p); setTitleMenu(null); } },
        { label: 'Reset Size', action: () => {
            setPos({ x: initialX ?? 100, y: initialY ?? 60 });
            setSize({ w: initialWidth, h: initialHeight });
            setTitleMenu(null);
        }},
    ];

    return (
        <div
            className={`${openClass} fixed flex flex-col overflow-hidden select-none${animClass ? ` ${animClass}` : ""}`.trim()}
            style={{
                ...style,
                borderRadius: (maximized || snapped) ? 0 : 12,
                boxShadow,
                border: focused
                    ? `1px solid ${themeColor}72`
                    : "1px solid rgba(255,255,255,0.12)",
                backdropFilter: isMinimizing ? "none" : "blur(40px)",
                background: "rgba(255, 255, 255, 0.1)",
                transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                pointerEvents: (isMinimizing || isClosing) ? "none" : "auto",
            }}
            onMouseDown={() => { if (titleMenu) setTitleMenu(null); onFocus?.(id); }}
        >
            {/* Title Bar */}
            <div
                className="flex items-center gap-2 px-3 flex-shrink-0 cursor-default transition-colors duration-200"
                style={{
                    height: 38,
                    background: focused ? `${themeColor}1e` : "rgba(10, 10, 20, 0.15)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                }}
                onMouseDown={onMouseDownTitle}
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setTitleMenu({ x: e.clientX, y: e.clientY }); }}
            >
                {/* Traffic Lights */}
                <div role="group" aria-label="Window controls" className="flex items-center gap-1.5 win-control" style={{ filter: focused ? "none" : "saturate(0) opacity(0.4)" }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose?.(id); }}
                        className="w-3 h-3 rounded-full flex items-center justify-center group transition-all"
                        style={{ background: "#ff5f57" }}
                        title="Close" aria-label="Close"
                    >
                        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-red-900 leading-none">✕</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMinimize?.(id); }}
                        className="w-3 h-3 rounded-full flex items-center justify-center group transition-all"
                        style={{ background: "#febc2e" }}
                        title="Minimize" aria-label="Minimize"
                    >
                        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-yellow-900 leading-none">−</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
                        className="w-3 h-3 rounded-full flex items-center justify-center group transition-all"
                        style={{ background: "#28c840" }}
                        title={maximized ? "Restore" : "Maximize"} aria-label={maximized ? "Restore" : "Maximize"}
                    >
                        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-green-900 leading-none">⤢</span>
                    </button>
                </div>

                {/* Title */}
                <div className="flex-1 flex items-center justify-center gap-1.5 pointer-events-none text-center">
                    {icon && <div className="w-4 h-4 flex items-center justify-center flex-shrink-0" style={{ opacity: focused ? 1 : 0.4 }}>{icon}</div>}
                    <span className="text-xs font-medium truncate max-w-[200px]" style={{ color: focused ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)" }}>
                        {title}
                    </span>
                </div>

                {/* Spacer */}
                <div className="w-14" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative" style={{ background: "#f3f3f3" }}>
                {children}
            </div>

            {/* Omni-directional Resize Handles */}
            {!maximized && !isMinimizing && (
                <>
                    {/* Edges */}
                    <div onMouseDown={(e) => onMouseDownResize(e, 'n')} className="absolute top-0 left-2 right-2 h-1 cursor-ns-resize z-50" />
                    <div onMouseDown={(e) => onMouseDownResize(e, 's')} className="absolute bottom-0 left-2 right-2 h-2 cursor-ns-resize z-50" />
                    <div onMouseDown={(e) => onMouseDownResize(e, 'e')} className="absolute top-2 bottom-2 right-0 w-2 cursor-ew-resize z-50" />
                    <div onMouseDown={(e) => onMouseDownResize(e, 'w')} className="absolute top-2 bottom-2 left-0 w-2 cursor-ew-resize z-50" />
                    {/* Corners */}
                    <div onMouseDown={(e) => onMouseDownResize(e, 'nw')} className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-50" />
                    <div onMouseDown={(e) => onMouseDownResize(e, 'ne')} className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-50" />
                    <div onMouseDown={(e) => onMouseDownResize(e, 'sw')} className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-50" />
                    <div onMouseDown={(e) => onMouseDownResize(e, 'se')} className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-50 flex items-end justify-end p-1 opacity-40 hover:opacity-70 transition-opacity duration-150">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                            <path d="M1 7L7 1M4 7L7 4M7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                    </div>
                </>
            )}

            {/* Snap preview portal */}
            {snapPreview && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed pointer-events-none"
                    style={{
                        zIndex: 4,
                        left: snapPreview === 'left' ? 0 : '50%',
                        top: 0,
                        width: '50%',
                        height: 'calc(100vh - 48px)',
                        border: '2px dashed rgba(0,120,212,0.6)',
                        background: 'rgba(0,120,212,0.06)',
                        borderRadius: 8,
                        transition: 'left 0.1s ease',
                    }}
                />,
                document.body
            )}

            {/* Title-bar context menu */}
            {titleMenu && typeof document !== 'undefined' && createPortal(
                <div
                    role="menu"
                    className="fixed z-[9999] flex flex-col p-1 rounded-xl shadow-2xl"
                    style={{
                        left: titleMenu.x,
                        top: titleMenu.y,
                        minWidth: 160,
                        background: "rgba(20,20,32,0.92)",
                        backdropFilter: "blur(32px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                    }}
                    onMouseLeave={() => setTitleMenu(null)}
                    onContextMenu={e => e.preventDefault()}
                    onMouseDown={e => e.stopPropagation()}
                >
                    {titleMenuItems.map((item, i) => item === null
                        ? <div key={i} className="h-px my-1 mx-2 bg-white/10" />
                        : <button
                            key={i}
                            role="menuitem"
                            onClick={item.action}
                            className="text-left px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded-lg transition-colors w-full"
                          >
                            {item.label}
                          </button>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}

export default memo(Window);
