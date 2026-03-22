import { useAchievements } from '../../contexts/AchievementContext';
import { useState, useEffect } from 'react';
import { getJSON, setJSON, STORAGE_KEYS } from '../../lib/storage';

export default function AchievementsApp({ darkTheme = false }) {
    const { achievements, unlocked, progress, total } = useAchievements();
    const [justSeen, setJustSeen] = useState(() => {
        return getJSON(STORAGE_KEYS.ACHIEVEMENTS_SEEN, {});
    });

    // Track which achievements are "new" (unlocked but not yet seen in trophy case)
    const newlyUnlocked = achievements.filter(a => unlocked[a.id] && !justSeen[a.id]);

    useEffect(() => {
        if (newlyUnlocked.length > 0) {
            const timer = setTimeout(() => {
                const next = { ...justSeen };
                newlyUnlocked.forEach(a => { next[a.id] = true; });
                setJustSeen(next);
                setJSON(STORAGE_KEYS.ACHIEVEMENTS_SEEN, next);
            }, 2000); // Show glow for 2s before marking as seen
            return () => clearTimeout(timer);
        }
    }, [newlyUnlocked.length]);

    const bg = darkTheme ? '#0a0a1e' : '#f7f8fb';
    const cardBg = darkTheme ? 'rgba(255,255,255,0.04)' : '#fff';
    const cardBorder = darkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const titleColor = darkTheme ? '#fff' : '#111';
    const subColor = darkTheme ? 'rgba(255,255,255,0.45)' : '#888';
    const barBg = darkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

    const pct = total > 0 ? (progress / total) * 100 : 0;

    return (
        <div className="w-full h-full overflow-y-auto os-scroll" style={{ background: bg }}>
            {/* Header */}
            <div className="px-8 pt-8 pb-2">
                <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: titleColor }}>
                    <img src="/icon_achievements.svg" alt="Achievements" className="w-7 h-7" draggable={false} />
                    Achievements
                </h1>
                <p className="text-xs mt-1" style={{ color: subColor }}>
                    {progress}/{total} unlocked
                </p>

                {/* Progress bar */}
                <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: barBg }}>
                    <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                            width: `${pct}%`,
                            background: pct === 100
                                ? 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)'
                                : 'linear-gradient(90deg, #0078d4, #38bdf8)',
                            boxShadow: pct === 100
                                ? '0 0 12px rgba(245, 158, 11, 0.5)'
                                : '0 0 8px rgba(0, 120, 212, 0.3)',
                        }}
                    />
                </div>
            </div>

            {/* Achievement grid */}
            <div className="px-8 py-6 grid grid-cols-2 gap-3">
                {achievements.map(a => {
                    const isNew = newlyUnlocked.some(n => n.id === a.id);
                    const done = !!unlocked[a.id];

                    return (
                        <div
                            key={a.id}
                            className="relative p-4 rounded-xl transition-all"
                            style={{
                                background: done ? cardBg : darkTheme ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                                border: `1px solid ${done ? (isNew ? 'rgba(255, 200, 50, 0.4)' : cardBorder) : cardBorder}`,
                                opacity: done ? 1 : 0.5,
                                boxShadow: isNew
                                    ? '0 0 20px rgba(255, 180, 0, 0.15), inset 0 1px 0 rgba(255, 200, 50, 0.1)'
                                    : 'none',
                                animation: isNew ? 'achievementGlow 2s ease-in-out' : 'none',
                            }}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-2xl flex-shrink-0" style={{ filter: done ? 'none' : 'grayscale(1)' }}>
                                    {done ? a.icon : '🔒'}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate" style={{ color: done ? titleColor : subColor }}>
                                        {done ? a.name : '???'}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: subColor }}>
                                        {done ? a.description : a.hint}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
