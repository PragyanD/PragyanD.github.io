export default function WallpaperPicker({ open, onClose, wallpapers, currentWallpaper, onSelect, getWallpaperSrc }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[400] flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="rounded-2xl p-5 shadow-2xl border border-white/10"
                style={{ background: "rgba(18,18,30,0.95)", backdropFilter: "blur(40px)", width: 440 }}
                onClick={e => e.stopPropagation()}
            >
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Choose Wallpaper</p>
                <div className="grid grid-cols-5 gap-2">
                    {wallpapers.map(w => (
                        <button
                            key={w.id}
                            onClick={() => onSelect(w)}
                            className="flex flex-col items-center gap-1.5 group"
                            aria-pressed={currentWallpaper === w.id}
                            aria-label={w.label + (currentWallpaper === w.id ? ' (selected)' : '')}
                        >
                            <div
                                className="rounded-lg w-full aspect-video transition-all"
                                style={{
                                    background: `url('${getWallpaperSrc(w)}') center / cover no-repeat`,
                                    outline: currentWallpaper === w.id ? '3px solid #0078d4' : '2px solid transparent',
                                    outlineOffset: '2px',
                                }}
                            />
                            <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">{w.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
