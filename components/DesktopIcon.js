import { useState, useRef } from "react";

export default function DesktopIcon({ icon, label, onDoubleClick, style }) {
    const [clicking, setClicking] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        setClicking(true);
        setTimeout(() => setClicking(false), 150);
        onDoubleClick?.();
    };

    const handleMouseDown = (e) => {
        e.stopPropagation();
        dragging.current = true;
        offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

        const handleMouseMove = (mouseMoveEvent) => {
            if (dragging.current) {
                setPos({
                    x: mouseMoveEvent.clientX - offset.current.x,
                    y: mouseMoveEvent.clientY - offset.current.y,
                });
            }
        };

        const handleMouseUp = () => {
            dragging.current = false;
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <button
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            className="flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all group focus:outline-none"
            style={{
                width: 80,
                transform: `translate(${pos.x}px, ${pos.y}px) ${clicking ? "scale(0.88)" : "scale(1)"}`,
                transition: dragging.current ? "none" : "transform 0.12s ease",
                cursor: dragging.current ? "grabbing" : "pointer",
                ...style,
            }}
            title={`Double-click to open ${label}`}
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
                    color: "rgba(255,255,255,0.9)",
                    textShadow: "0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)",
                    backdropFilter: "blur(4px)",
                    background: "rgba(0,0,0,0.1)",
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
