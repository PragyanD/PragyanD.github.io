export default function DesktopContextMenu({ visible, x, y, onRefresh, onAbout, onChangeWallpaper, onDisplaySettings, onClose }) {
    if (!visible) return null;

    return (
        <div
            role="menu"
            className="fixed z-[100] flex flex-col p-1.5 rounded-xl shadow-2xl transition-all font-mono"
            style={{
                left: x,
                top: y,
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
                    onClose();
                }
            }}
        >
            <button role="menuitem" onClick={onRefresh} className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors">
                Refresh Desktop
            </button>
            <div className="h-px my-1.5 mx-2" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)" }} />
            <button role="menuitem" onClick={onAbout} className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors">
                About PDOS
            </button>
            <button role="menuitem" onClick={() => window.open('https://github.com/PragyanD', '_blank')} className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors">
                View GitHub
            </button>
            <div className="h-px my-1.5 mx-2" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)" }} />
            <button
                role="menuitem"
                onClick={(e) => { e.stopPropagation(); onChangeWallpaper(); }}
                className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors"
            >
                Change Wallpaper
            </button>
            <button
                role="menuitem"
                onClick={(e) => { e.stopPropagation(); onDisplaySettings(); }}
                className="text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 rounded-lg transition-colors"
            >
                Display Settings
            </button>
        </div>
    );
}
