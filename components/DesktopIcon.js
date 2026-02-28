import { useState, useRef } from "react";

const ICON_W = 80;
const ICON_H = 104; // 60px icon + label + padding (approximate)
const TASKBAR_H = 48;
const SNAP = 16;
const DRAG_THRESHOLD = 5; // px — below this is a click, not a drag

export default function DesktopIcon({ icon, label, onDoubleClick, style }) {
    const [clicking, setClicking] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const dragging = useRef(false);
    const didDrag = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const offset = useRef({ x: 0, y: 0 });
    const buttonRef = useRef(null);
    const naturalPos = useRef(null);

    const handleMouseDown = (e) => {
        e.stopPropagation();
        dragging.current = true;
        didDrag.current = false;
        startPos.current = { x: e.clientX, y: e.clientY };

        // Capture natural screen position once per drag session
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            naturalPos.current = { x: rect.left - pos.x, y: rect.top - pos.y };
        }
        offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

        const handleMouseMove = (mouseMoveEvent) => {
            if (dragging.current) {
                const dx = mouseMoveEvent.clientX - startPos.current.x;
                const dy = mouseMoveEvent.clientY - startPos.current.y;
                if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
                    didDrag.current = true;
                }
                const rawX = mouseMoveEvent.clientX - offset.current.x;
                const rawY = mouseMoveEvent.clientY - offset.current.y;
                const nat = naturalPos.current || { x: 0, y: 0 };
                setPos({
                    x: Math.max(-nat.x, Math.min(window.innerWidth - nat.x - ICON_W, rawX)),
                    y: Math.max(-nat.y, Math.min(window.innerHeight - nat.y - ICON_H - TASKBAR_H, rawY)),
                });
            }
        };

        const handleMouseUp = () => {
            dragging.current = false;
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);

            if (!didDrag.current) {
                // Treat as a click — open the app
                setClicking(true);
                setTimeout(() => {
                    setClicking(false);
                    onDoubleClick?.();
                }, 200);
            } else {
                // Snap to nearest 16px grid on release
                setPos(p => ({
                    x: Math.round(p.x / SNAP) * SNAP,
                    y: Math.round(p.y / SNAP) * SNAP,
                }));
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <button
            ref={buttonRef}
            onMouseDown={handleMouseDown}
            onDragStart={(e) => e.preventDefault()}
            className="flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all group focus:outline-none"
            style={{
                width: 80,
                transform: `translate(${pos.x}px, ${pos.y}px) ${clicking ? "scale(1.2)" : "scale(1)"}`,
                transition: dragging.current ? "none" : clicking ? "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease" : "transform 0.2s ease",
                filter: clicking ? "brightness(1.2)" : "none",
                cursor: dragging.current ? "grabbing" : "pointer",
                ...style,
            }}
            aria-label={`Open ${label}`}
            title={`Click to open ${label}`}
        >
            {/* Icon */}
            <div
                className="flex items-center justify-center rounded-xl transition-all"
                style={{
                    width: 60,
                    height: 60,
                    fontSize: 36,
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0,120,212,0.3)";
                    e.currentTarget.style.borderColor = "rgba(0,120,212,0.6)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,120,212,0.4)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                }}
            >
                {icon}
            </div>

            {/* Label */}
            <span
                className="text-center text-xs leading-tight font-medium px-1 py-0.5 rounded"
                style={{
                    color: "rgba(255,255,255,0.95)",
                    textShadow: "0 0 4px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.95), 0 4px 16px rgba(0,0,0,0.8)",
                    WebkitTextStroke: "0.3px rgba(0,0,0,0.5)",
                    backdropFilter: "blur(4px)",
                    background: "rgba(0,0,0,0.25)",
                    maxWidth: 76,
                    wordBreak: "break-word",
                    fontSize: 11,
                }}
            >
                {label}
            </span>
        </button>
    );
}
