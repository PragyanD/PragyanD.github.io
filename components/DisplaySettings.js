export default function DisplaySettings({ open, onClose, darkTheme, onToggleDarkTheme }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[400] flex items-center justify-center"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Display Settings"
                className="rounded-2xl p-6 shadow-2xl border border-white/10"
                style={{ background: "rgba(18,18,30,0.95)", backdropFilter: "blur(40px)", width: 300 }}
                onClick={e => e.stopPropagation()}
                ref={(node) => {
                    if (!node) return;
                    const focusables = node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (focusables.length) focusables[0].focus();
                    node.onkeydown = (e) => {
                        if (e.key !== 'Tab') return;
                        const first = focusables[0];
                        const last = focusables[focusables.length - 1];
                        if (e.shiftKey) {
                            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
                        } else {
                            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
                        }
                    };
                }}
            >
                <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>Display Settings</p>

                {/* Dark Theme Toggle */}
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>Dark App Theme</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Dark backgrounds for About, Projects &amp; Task Manager</p>
                    </div>
                    <button
                        onClick={onToggleDarkTheme}
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
                    onClick={onClose}
                    className="w-full py-1.5 rounded-lg text-xs transition-colors hover:bg-white/5"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                >
                    Done
                </button>
            </div>
        </div>
    );
}
