import { useState, useEffect } from 'react';

const BOOT_LOG = [
    { text: 'BIOS Version 2.0.26 - Pragyan Labs', delay: 200 },
    { text: 'CPU: Pragyan Core™ i9 @ 5.2GHz', delay: 400 },
    { text: 'Memory Test: 65536MB OK', delay: 600 },
    { text: 'Detecting Primary Master... OK', delay: 300 },
    { text: 'Detecting Secondary Master... OK', delay: 200 },
    { text: 'Verifying DMI Pool Data...', delay: 800 },
    { text: 'Booting PDOS kernel...', delay: 400 },
    { text: 'Loading UI modules...', delay: 300 },
    { text: 'Mounting /Users/pragyan/desktop...', delay: 500 },
    { text: 'Starting XServer...', delay: 400 },
    { text: 'Welcome to PDOS!', delay: 200 },
];

export default function BootSequence({ onComplete }) {
    const [lines, setLines] = useState([]);
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState('bios');

    useEffect(() => {
        let currentIdx = 0;
        const addLine = () => {
            if (currentIdx < BOOT_LOG.length) {
                const entry = BOOT_LOG[currentIdx];
                currentIdx++;
                setLines(prev => [...prev, entry.text]);
                setTimeout(addLine, entry.delay);
            } else {
                setTimeout(() => setPhase('loading'), 500);
            }
        };
        addLine();
    }, []);

    useEffect(() => {
        if (phase === 'loading') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            const audio = new Audio('/startup.mp3');
                            audio.play().catch(() => { });
                            onComplete();
                        }, 500);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [phase, onComplete]);

    return (
        <div className="fixed inset-0 z-[1000] bg-black text-[#aaaaaa] font-mono p-10 flex flex-col items-start justify-start select-none cursor-none">
            {/* CRT scanlines */}
            <div className="absolute inset-0 pointer-events-none z-10" style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
                mixBlendMode: "overlay",
            }} />
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none z-10" style={{
                background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
            }} />

            {phase === 'bios' && (
                <div className="w-full">
                    {lines.map((line, i) => (
                        <div key={i} className="mb-1 leading-tight text-sm uppercase">
                            {line}{i === lines.length - 1 && <span className="animate-pulse">_</span>}
                        </div>
                    ))}
                </div>
            )}

            {phase === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                    <div className="text-white text-4xl font-bold tracking-[0.2em] mb-12 flex items-center gap-4">
                        <span className="text-blue-500 italic">Pragyan</span>
                        <span className="font-light">OS</span>
                    </div>

                    <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 transition-all duration-100 ease-linear rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="mt-6 text-[10px] text-white/30 uppercase tracking-widest font-light">
                        Kernel v2.0.26-release
                    </div>
                </div>
            )}
        </div>
    );
}
