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
    const resizing = useRef(false);
    const offset = useRef({ x: 0, y: 0 });
    const prevState = useRef(null);

    const onMouseDownTitle = useCallback((e) => {
        if (maximized) return;
        if (e.target.closest(".win-control")) return;
        dragging.current = true;
        offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        onFocus?.(id);
        e.preventDefault();
    }, [maximized, pos, id, onFocus]);

    const onMouseDownResize = useCallback((e) => {
        if (maximized) return;
        resizing.current = true;
        offset.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
        onFocus?.(id);
        e.preventDefault();
        e.stopPropagation();
    }, [maximized, size, id, onFocus]);

    useEffect(() => {
        const onMouseMove = (e) => {
            if (dragging.current) {
                const TASKBAR = 48;
                setPos({
                    x: Math.max(0, Math.min(window.innerWidth - size.w, e.clientX - offset.current.x)),
                    y: Math.max(0, Math.min(window.innerHeight - TASKBAR - 40, e.clientY - offset.current.y)),
                });
            } else if (resizing.current) {
                const deltaX = e.clientX - offset.current.x;
                const deltaY = e.clientY - offset.current.y;
                setSize({
                    w: Math.max(300, offset.current.w + deltaX),
                    h: Math.max(200, offset.current.h + deltaY),
                });
            }
        };

        const onMouseUp = () => {
            dragging.current = false;
            resizing.current = false;
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [size]);

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
        : { left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex };

    return (
        <div
            className="window-open fixed flex flex-col overflow-hidden select-none"
            style={{
                ...style,
                opacity: (mounted && !isMinimizing) ? 1 : 0,
                transform: isMinimizing
                    ? "translateY(100px) scale(0.1)"
                    : isRestoring || !mounted
                        ? "scale(0.95)"
                        : "scale(1)",
                transition: dragging.current || resizing.current
                    ? "none"
                    : "all 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
                borderRadius: maximized ? 0 : 12,
                boxShadow: maximized || isMinimizing
                    ? "none"
                    : "0 24px 80px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: isMinimizing ? "none" : "blur(20px)",
                background: "rgba(255, 255, 255, 0.05)",
                pointerEvents: isMinimizing ? "none" : "auto",
            }}
            onMouseDown={() => onFocus?.(id)}
        >
            {/* Title Bar */}
            <div
                className="flex items-center gap-2 px-3 flex-shrink-0 cursor-default"
                style={{
                    height: 38,
                    background: "linear-gradient(180deg, #1e1e2e 0%, #161622 100%)",
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
                    {icon && <span className="text-sm">{icon}</span>}
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

                {/* Resize handle */}
                {!maximized && (
                    <div
                        onMouseDown={onMouseDownResize}
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end p-0.5 group"
                    >
                        <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-gray-400 opacity-30 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
            </div>
        </div>
    );
}
