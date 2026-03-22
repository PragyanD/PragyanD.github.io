/**
 * Shared glassmorphic popup menu components used by Desktop, Window, and Taskbar context menus.
 */
import { forwardRef } from "react";

export const PopupMenu = forwardRef(function PopupMenu({ visible, x, y, onClose, children, width = 180, style: extraStyle, ...rest }, ref) {
    if (!visible) return null;
    return (
        <div
            ref={ref}
            role="menu"
            className="fixed z-[9999] flex flex-col p-1.5 rounded-xl shadow-2xl font-mono"
            style={{
                left: x,
                top: y,
                width,
                background: "rgba(30, 30, 40, 0.6)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                ...extraStyle,
            }}
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={(e) => e.stopPropagation()}
            {...rest}
        >
            {children}
        </div>
    );
});

export function MenuItem({ onClick, children, danger = false, ...rest }) {
    return (
        <button
            role="menuitem"
            onClick={onClick}
            className="text-left px-3 py-1.5 text-xs hover:bg-white/10 rounded-lg transition-colors w-full"
            style={danger ? { color: '#ff453a' } : { color: 'rgba(255,255,255,0.8)' }}
            {...rest}
        >
            {children}
        </button>
    );
}

export function MenuDivider() {
    return (
        <div
            className="h-px my-1.5 mx-2"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)" }}
        />
    );
}
