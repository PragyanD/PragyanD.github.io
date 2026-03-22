import { useState, useEffect, useMemo } from 'react';
import { getAppStats, getSessionStats } from '../../lib/analytics';
import { APPS_CONFIG } from '../../lib/apps.config';
import { useAchievements } from '../../contexts/AchievementContext';

function formatDuration(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

function getSystemInfo() {
    if (typeof window === 'undefined') return {};
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg/')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';

    let os = 'Unknown';
    if (ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return {
        browser,
        os,
        resolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        cores: navigator.hardwareConcurrency || '?',
        colorDepth: `${window.screen.colorDepth}-bit`,
    };
}

function SectionHeader({ children }) {
    return (
        <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#10b981' }}>
            {children}
        </h3>
    );
}

function StatRow({ label, value, mono = true }) {
    return (
        <div className="flex justify-between items-center py-0.5">
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
            <span className={`text-[11px] ${mono ? 'font-mono' : ''}`} style={{ color: 'rgba(255,255,255,0.85)' }}>{value}</span>
        </div>
    );
}

function BarChart({ items, maxValue }) {
    if (!items.length) {
        return <p className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>No app usage data yet.</p>;
    }
    return (
        <div className="flex flex-col gap-1.5">
            {items.map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-2">
                    {icon && <img src={icon} alt="" className="w-4 h-4 object-contain flex-shrink-0" />}
                    <span className="text-[10px] w-20 truncate flex-shrink-0" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                    <div className="flex-1 h-3 rounded-sm overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div
                            className="h-full rounded-sm transition-all duration-500"
                            style={{
                                width: `${Math.max(4, (value / maxValue) * 100)}%`,
                                background: 'linear-gradient(90deg, #10b981, #34d399)',
                            }}
                        />
                    </div>
                    <span className="text-[10px] font-mono w-6 text-right flex-shrink-0" style={{ color: 'rgba(255,255,255,0.7)' }}>{value}</span>
                </div>
            ))}
        </div>
    );
}

export default function SystemMonitorApp() {
    const [elapsed, setElapsed] = useState(0);
    const [appStats, setAppStats] = useState({});
    const [sessionStats, setSessionStats] = useState({ count: 0, startTime: Date.now() });
    const { progress, total } = useAchievements();

    const systemInfo = useMemo(() => getSystemInfo(), []);

    // Refresh stats every second
    useEffect(() => {
        const session = getSessionStats();
        setSessionStats(session);
        setAppStats(getAppStats());

        const interval = setInterval(() => {
            setElapsed(Date.now() - session.startTime);
            setAppStats(getAppStats());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Build sorted app usage list
    const appUsageItems = useMemo(() => {
        const items = APPS_CONFIG.map(app => ({
            label: app.label,
            value: appStats[app.id] || 0,
            icon: app.iconSrc,
        })).filter(item => item.value > 0);
        items.sort((a, b) => b.value - a.value);
        return items;
    }, [appStats]);

    const maxOpens = Math.max(1, ...appUsageItems.map(i => i.value));
    const achievementPct = total > 0 ? Math.round((progress / total) * 100) : 0;

    return (
        <div
            className="h-full overflow-auto font-mono text-white"
            style={{ background: '#0a0a14' }}
        >
            {/* Header */}
            <div className="px-4 pt-3 pb-2 border-b" style={{ borderColor: 'rgba(16,185,129,0.15)' }}>
                <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: '#10b981' }} />
                    <span className="text-xs font-bold tracking-wide" style={{ color: '#10b981' }}>SYSTEM MONITOR</span>
                    <span className="text-[10px] ml-auto" style={{ color: 'rgba(255,255,255,0.25)' }}>PDOS v1.0</span>
                </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-x-5 gap-y-4">
                {/* Session Stats */}
                <div>
                    <SectionHeader>Session</SectionHeader>
                    <StatRow label="Total Sessions" value={sessionStats.count} />
                    <StatRow label="Uptime" value={formatDuration(elapsed)} />
                </div>

                {/* Achievement Progress */}
                <div>
                    <SectionHeader>Achievements</SectionHeader>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.7)' }}>{progress}/{total}</span>
                        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>({achievementPct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${achievementPct}%`,
                                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                            }}
                        />
                    </div>
                </div>

                {/* App Usage */}
                <div className="col-span-2">
                    <SectionHeader>App Usage (opens)</SectionHeader>
                    <BarChart items={appUsageItems} maxValue={maxOpens} />
                </div>

                {/* System Info */}
                <div className="col-span-2">
                    <SectionHeader>System Info</SectionHeader>
                    <div className="grid grid-cols-2 gap-x-4">
                        <StatRow label="Browser" value={systemInfo.browser} />
                        <StatRow label="OS" value={systemInfo.os} />
                        <StatRow label="Screen" value={systemInfo.resolution} />
                        <StatRow label="Viewport" value={systemInfo.viewport} />
                        <StatRow label="Language" value={systemInfo.language} />
                        <StatRow label="CPU Cores" value={systemInfo.cores} />
                        <StatRow label="Color Depth" value={systemInfo.colorDepth} />
                    </div>
                </div>
            </div>

            {/* Footer scanline effect */}
            <div className="px-4 py-2 border-t" style={{ borderColor: 'rgba(16,185,129,0.1)' }}>
                <p className="text-[9px] text-center" style={{ color: 'rgba(16,185,129,0.3)' }}>
                    All data stored locally in your browser. Nothing is sent to any server.
                </p>
            </div>
        </div>
    );
}
