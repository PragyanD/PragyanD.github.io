export default function VolumeControl({ open, volume, onVolumeChange, isPlaying, onTogglePlay }) {
    if (!open) return null;

    return (
        <div
            className="fixed bottom-14 right-4 w-64 p-4 rounded-xl bg-[#1a1a1a]/80 backdrop-blur-3xl border border-white/10 shadow-2xl z-[300]"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Master Volume</span>
                <button
                    onClick={onTogglePlay}
                    className="text-xs px-2 py-0.5 rounded border border-white/10 text-white/60 hover:bg-white/5"
                >
                    {isPlaying ? 'PAUSE' : 'PLAY'}
                </button>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm opacity-40">🔈</span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="flex-1 accent-blue-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm opacity-40">🔊</span>
                <span className="text-xs text-white/50 w-7 text-right tabular-nums">{Math.round(volume * 100)}%</span>
            </div>
            <div className="mt-3 text-xs text-blue-400 font-mono text-center">
                SomaFM Fluid · Chillhop — 128kbps
            </div>
        </div>
    );
}
