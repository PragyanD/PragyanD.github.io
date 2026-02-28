import { useState, useEffect, useRef } from "react";

function useSmoothedValue(target, speed = 0.06) {
    const [value, setValue] = useState(target);
    const current = useRef(target);
    useEffect(() => {
        const frame = requestAnimationFrame(function step() {
            current.current += (target - current.current) * speed;
            setValue(Math.round(current.current));
            if (Math.abs(target - current.current) > 0.5) {
                requestAnimationFrame(step);
            }
        });
        return () => cancelAnimationFrame(frame);
    }, [target, speed]);
    return value;
}

export default function SystemWidget() {
    const [expanded, setExpanded] = useState(false);
    const [cpuTarget, setCpuTarget] = useState(32);
    const [uptime, setUptime] = useState(0);
    const cpu = useSmoothedValue(cpuTarget);

    // Slowly drift CPU value for a live feel
    useEffect(() => {
        const t = setInterval(() => {
            setCpuTarget(prev => Math.max(8, Math.min(92, prev + (Math.random() - 0.5) * 18)));
        }, 2200);
        return () => clearInterval(t);
    }, []);

    // Uptime counter
    useEffect(() => {
        const t = setInterval(() => setUptime(s => s + 1), 1000);
        return () => clearInterval(t);
    }, []);

    const fmtUptime = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        if (h > 0) return `${h}h ${String(m).padStart(2,'0')}m`;
        return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    };

    const cpuColor = cpu > 70 ? "#ff453a" : cpu > 45 ? "#febc2e" : "#34c759";

    return (
        <div
            className="fixed z-30"
            style={{ bottom: 60, right: 12 }}
        >
            <div
                className="rounded-xl border border-white/10 shadow-xl overflow-hidden"
                style={{
                    background: "rgba(10,10,22,0.82)",
                    backdropFilter: "blur(32px)",
                    width: expanded ? 168 : "auto",
                    transition: "width 0.2s ease",
                }}
            >
                {/* Header / toggle */}
                <button
                    onClick={() => setExpanded(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 w-full hover:bg-white/5 transition-colors"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                >
                    <span className="text-[11px]">⚙</span>
                    <span className="text-[10px] font-mono font-semibold tracking-widest uppercase">SYS</span>
                    {!expanded && (
                        <span className="text-[10px] font-mono ml-1" style={{ color: cpuColor }}>
                            {cpu}%
                        </span>
                    )}
                    <span className="ml-auto text-[9px] opacity-40">{expanded ? '▼' : '▲'}</span>
                </button>

                {/* Expanded panel */}
                {expanded && (
                    <div className="px-3 pb-3 space-y-2">
                        {/* CPU */}
                        <div>
                            <div className="flex justify-between text-[9px] font-mono mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                                <span>CPU</span>
                                <span style={{ color: cpuColor }}>{cpu}%</span>
                            </div>
                            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{ width: `${cpu}%`, background: cpuColor }}
                                />
                            </div>
                        </div>
                        {/* RAM */}
                        <div>
                            <div className="flex justify-between text-[9px] font-mono mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                                <span>RAM</span>
                                <span style={{ color: "#0078d4" }}>65%</span>
                            </div>
                            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                                <div className="h-full rounded-full" style={{ width: "65%", background: "#0078d4" }} />
                            </div>
                        </div>
                        {/* Uptime */}
                        <div className="flex justify-between text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                            <span>UPTIME</span>
                            <span style={{ color: "rgba(255,255,255,0.6)" }}>{fmtUptime(uptime)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
