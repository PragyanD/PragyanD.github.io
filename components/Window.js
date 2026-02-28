import { useState, useRef, useCallback, useEffect, memo } from "react";
import { createPortal } from "react-dom";

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
}) {
    const [maximized, setMaximized] = useState(false);
    const [pos, setPos] = useState(() => {
        try {
            const saved = sessionStorage.getItem(`window_state_${id}`);
            if (saved) { const s = JSON.parse(saved); return s.pos; }
        } catch (_) { /* ignore */ }
        return {
            x: initialX ?? Math.max(60, Math.floor(Math.random() * 300) + 80),
            y: initialY ?? Math.max(40, Math.floor(Math.random() * 120) + 40),
        };
    });
    const [size, setSize] = useState(() => {
        try {
            const saved = sessionStorage.getItem(`window_state_${id}`);
            if (saved) { const s = JSON.parse(saved); return s.size; }
        } catch (_) { /* ignore */ }
        return { w: initialWidth, h: initialHeight };
    });

    const dragging = useRef(false);
    const [isDragging, setIsDragging] = useState(false);
    const resizing = useRef(false); // store direction string: 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'
    const offset = useRef({ x: 0, y: 0 });
    const prevState = useRef(null);

    const onMouseDownTitle = useCallback((e) => {
        if (maximized) return;
        if (e.target.closest(".win-control")) return;
        dragging.current = true;
        setIsDragging(true);
        offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        onFocus?.(id);
        e.preventDefault();
    }, [maximized, pos, id, onFocus]);

    const onMouseDownResize = useCallback((e, dir) => {
        if (maximized) return;
        resizing.current = dir;
        offset.current = {
            startX: e.clientX,
            startY: e.clientY,
            startW: size.w,
            startH: size.h,
            startXPos: pos.x,
            startYPos: pos.y
        };
        onFocus?.(id);
        e.preventDefault();
        e.stopPropagation();
    }, [maximized, size, pos, id, onFocus]);

    const [snapped, setSnapped] = useState(false); // 'left' | 'right' | false
    const [snapPreview, setSnapPreview] = useState(null); // 'left' | 'right' | null

    useEffect(() => {
        const onMouseMove = (e) => {
            if (dragging.current) {
                // If dragged away from snapped state, restore original size and calculate new relative pos
                if (snapped) {
                    setSnapped(false);
                    // Prevent jumping: set the mouse offset to center of the restored window title bar
                    offset.current = { x: size.w / 2, y: 20 };
                }

                const TASKBAR = 48;
                let newX = e.clientX - offset.current.x;
                let newY = Math.max(0, Math.min(window.innerHeight - TASKBAR - 40, e.clientY - offset.current.y));

                // Snap preview
                if (e.clientX <= 20) {
                    setSnapPreview('left');
                } else if (e.clientX >= window.innerWidth - 20) {
                    setSnapPreview('right');
                } else {
                    setSnapPreview(null);
                }

                // Snap logic
                if (e.clientX <= 20) {
                    setSnapped('left');
                    prevState.current = { pos: { x: newX, y: newY }, size: { ...size } };
                    setPos({ x: 0, y: 0 });
                } else if (e.clientX >= window.innerWidth - 20) {
                    setSnapped('right');
                    prevState.current = { pos: { x: newX, y: newY }, size: { ...size } };
                    setPos({ x: window.innerWidth / 2, y: 0 });
                } else {
                    setPos({
                        x: Math.max(0, Math.min(window.innerWidth - size.w, newX)),
                        y: newY,
                    });
                }
            } else if (resizing.current) {
                if (snapped) setSnapped(false);
                const dir = resizing.current;
                const deltaX = e.clientX - offset.current.startX;
                const deltaY = e.clientY - offset.current.startY;

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
            }
        };

        const onMouseUp = () => {
            if (dragging.current || resizing.current) {
                setPos(p => {
                    setSize(s => {
                        try { sessionStorage.setItem(`window_state_${id}`, JSON.stringify({ pos: p, size: s })); } catch (_) { /* ignore */ }
                        return s;
                    });
                    return p;
                });
            }
            dragging.current = false;
            setIsDragging(false);
            resizing.current = false;
            setSnapPreview(null);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [size, snapped]);

    const toggleMaximize = () => {
        if (!maximized) {
            prevState.current = { pos: { ...pos }, size: { ...size } };
            setMaximized(true);
        } else {
            if (prevState.current) {
                setPos(prevState.current.pos);
                setSize(prevState.current.size);
            }
            setMaximized(false);
        }
        onFocus?.(id);
    };

    const style = maximized
        ? { left: 0, top: 0, width: "100%", height: "calc(100vh - 48px)", zIndex }
        : snapped === 'left'
            ? { left: 0, top: 0, width: "50%", height: "calc(100vh - 48px)", zIndex }
            : snapped === 'right'
                ? { left: "50%", top: 0, width: "50%", height: "calc(100vh - 48px)", zIndex }
                : { left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex };

    // Only play the windowOpen animation on a true first-open, NOT on restore-from-minimized.
    // If we always added "window-open", removing "win-restore" at the end of the restore timeout
    // would leave only "window-open", restarting the open animation a second time.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [playOpenAnim] = useState(() => !isRestoring);

    const animClass = isClosing ? "win-close" : isMinimizing ? "win-minimize" : isRestoring ? "win-restore" : "";
    const openClass = playOpenAnim ? "window-open" : "";

    return (
        <div
            className={`${openClass} fixed flex flex-col overflow-hidden select-none${animClass ? ` ${animClass}` : ""}`.trim()}
            style={{
                ...style,
                borderRadius: (maximized || snapped) ? 0 : 12,
                boxShadow: maximized || isMinimizing || snapped
                    ? "none"
                    : isDragging
                        ? "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 32px rgba(0,120,212,0.3), 0 35px 100px rgba(0,0,0,0.55)"
                        : focused
                            ? "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 24px rgba(0,120,212,0.25), 0 24px 80px rgba(0,0,0,0.4)"
                            : "inset 0 1px 0 rgba(255,255,255,0.08), 0 6px 20px rgba(0,0,0,0.18)",
                border: focused
                    ? "1px solid rgba(0,120,212,0.45)"
                    : "1px solid rgba(255,255,255,0.12)",
                backdropFilter: isMinimizing ? "none" : "blur(40px)",
                background: "rgba(255, 255, 255, 0.1)",
                transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                pointerEvents: (isMinimizing || isClosing) ? "none" : "auto",
            }}
            onMouseDown={() => onFocus?.(id)}
        >
            {/* Title Bar */}
            <div
                className="flex items-center gap-2 px-3 flex-shrink-0 cursor-default transition-colors duration-200"
                style={{
                    height: 38,
                    background: focused ? "rgba(30, 30, 46, 0.25)" : "rgba(20, 20, 30, 0.15)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                }}
                onMouseDown={onMouseDownTitle}
            >
                {/* Traffic Lights */}
                <div className="flex items-center gap-1.5 win-control" style={{ filter: focused ? "none" : "saturate(0) opacity(0.4)" }}>
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
            <div className="flex-1 overflow-hidden relative" style={{ background: "#f3f3f3", fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
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
                    <div onMouseDown={(e) => onMouseDownResize(e, 'se')} className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end p-0.5 group">
                        <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-gray-400 opacity-[0.25] group-hover:opacity-75 transition-opacity duration-150 pointer-events-none" />
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
        </div>
    );
}

export default memo(Window);
