import { useState, useRef, useCallback, useEffect } from "react";

export default function Window({
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
}) {
    const [maximized, setMaximized] = useState(false);
    const [pos, setPos] = useState({
        x: initialX ?? Math.max(60, Math.floor(Math.random() * 300) + 80),
        y: initialY ?? Math.max(40, Math.floor(Math.random() * 120) + 40),
    });
    const [size, setSize] = useState({ w: initialWidth, h: initialHeight });

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

                // Snap logic
                if (e.clientX <= 5) {
                    setSnapped('left');
                    prevState.current = { pos: { x: newX, y: newY }, size: { ...size } };
                    setPos({ x: 0, y: 0 });
                } else if (e.clientX >= window.innerWidth - 5) {
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
            dragging.current = false;
            setIsDragging(false);
            resizing.current = false;
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

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const style = maximized
        ? { left: 0, top: 0, width: "100%", height: "calc(100vh - 48px)", zIndex }
        : snapped === 'left'
            ? { left: 0, top: 0, width: "50%", height: "calc(100vh - 48px)", zIndex }
            : snapped === 'right'
                ? { left: "50%", top: 0, width: "50%", height: "calc(100vh - 48px)", zIndex }
                : { left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex };

    return (
        <div
            className="window-open fixed flex flex-col overflow-hidden select-none"
            style={{
                ...style,
                opacity: (mounted && !isMinimizing) ? 1 : 0,
                transform: isMinimizing
                    ? "translateY(80vh) scale(0)"
                    : isRestoring || !mounted
                        ? "scale(0.95)"
                        : "scale(1)",
                transformOrigin: "bottom center",
                transition: dragging.current || resizing.current
                    ? "none"
                    : "all 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, box-shadow 0.2s ease",
                borderRadius: (maximized || snapped) ? 0 : 12,
                boxShadow: maximized || isMinimizing || snapped
                    ? "none"
                    : isDragging
                        ? "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 0 0 1px rgba(255,255,255,0.1), 0 35px 100px rgba(0,0,0,0.55)"
                        : "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 0 0 1px rgba(255,255,255,0.1), 0 24px 80px rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: isMinimizing ? "none" : "blur(40px)",
                background: "rgba(255, 255, 255, 0.1)",
                pointerEvents: isMinimizing ? "none" : "auto",
            }}
            onMouseDown={() => onFocus?.(id)}
        >
            {/* Title Bar */}
            <div
                className="flex items-center gap-2 px-3 flex-shrink-0 cursor-default"
                style={{
                    height: 38,
                    background: "rgba(30, 30, 46, 0.5)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
                onMouseDown={onMouseDownTitle}
            >
                {/* Traffic Lights */}
                <div className="flex items-center gap-1.5 win-control">
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose?.(id); }}
                        className="w-3 h-3 rounded-full flex items-center justify-center group transition-all"
                        style={{ background: "#ff5f57" }}
                        title="Close"
                    >
                        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-red-900 leading-none">✕</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMinimize?.(id); }}
                        className="w-3 h-3 rounded-full flex items-center justify-center group transition-all"
                        style={{ background: "#febc2e" }}
                        title="Minimize"
                    >
                        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-yellow-900 leading-none">−</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
                        className="w-3 h-3 rounded-full flex items-center justify-center group transition-all"
                        style={{ background: "#28c840" }}
                        title="Maximize"
                    >
                        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-green-900 leading-none">⤢</span>
                    </button>
                </div>

                {/* Title */}
                <div className="flex-1 flex items-center justify-center gap-1.5 pointer-events-none text-center">
                    {icon && <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">{icon}</div>}
                    <span className="text-xs font-medium truncate max-w-[200px]" style={{ color: "rgba(255,255,255,0.75)" }}>
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
                    <div onMouseDown={(e) => onMouseDownResize(e, 'se')} className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end p-0.5 group">
                        <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-gray-400 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                </>
            )}
        </div>
    );
}
