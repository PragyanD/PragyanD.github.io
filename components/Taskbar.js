import { useState, useEffect } from "react";
import Image from "next/image";
import profilePic from "../public/profilePic.jpg";

function Clock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    const fmt = (n) => String(n).padStart(2, "0");
    const h = time.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = (h % 12) || 12;
    const timeStr = `${fmt(h12)}:${fmt(time.getMinutes())} ${ampm}`;
    const dateStr = time.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return (
        <div className="flex flex-col items-end text-right px-4 cursor-default">
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>{timeStr}</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)", fontSize: "10px" }}>{dateStr}</span>
        </div>
    );
}

export default function Taskbar({ openWindows, minimizedWindows, onStartClick, startOpen, onRestoreWindow, onOpenApp }) {
    const APP_META = {
        taskmanager: { icon: <img src="/icon_task_manager.png" alt="Task Manager" className="w-full h-full object-contain" />, label: "Task Manager" },
        about: { icon: <img src="/icon_about.png" alt="About Me" className="w-full h-full object-contain" />, label: "About Me" },
        projects: { icon: <img src="/icon_projects.png" alt="Projects" className="w-full h-full object-contain" />, label: "Projects" },
        resume: { icon: <img src="/icon_resume.png" alt="Resume" className="w-full h-full object-contain" />, label: "Resume" },
    };

    return (
        <div
            className="fixed bottom-0 left-0 right-0 flex items-center z-50"
            style={{
                height: 48,
                background: "rgba(10, 10, 25, 0.4)",
                backdropFilter: "blur(40px)",
                borderTop: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 -4px 30px rgba(0,0,0,0.3)",
            }}
        >
            {/* Start Button */}
            <button
                id="start-button"
                onClick={onStartClick}
                className="flex items-center gap-2 px-3 h-full transition-all flex-shrink-0"
                style={{
                    minWidth: 56,
                    background: startOpen ? "rgba(0,120,212,0.25)" : "transparent",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) => { if (!startOpen) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                onMouseLeave={(e) => { if (!startOpen) e.currentTarget.style.background = "transparent"; }}
            >
                <div
                    className="rounded-full overflow-hidden flex-shrink-0"
                    style={{
                        width: 30,
                        height: 30,
                        border: startOpen ? "2px solid #0078d4" : "2px solid rgba(255,255,255,0.2)",
                        boxShadow: startOpen ? "0 0 10px rgba(0,120,212,0.5)" : "none",
                        transition: "all 0.2s ease",
                    }}
                >
                    <Image src={profilePic} alt="Start" width={30} height={30} style={{ objectFit: "cover" }} />
                </div>
                <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>Start</span>
            </button>

            {/* Running App Pills */}
            <div className="flex items-center gap-1 px-2 flex-1">
                {openWindows.map((appId) => {
                    const meta = APP_META[appId] || { icon: "🗔", label: appId };
                    const isMin = minimizedWindows.includes(appId);
                    return (
                        <button
                            key={appId}
                            onClick={() => onRestoreWindow(appId)}
                            className="pill-appear flex items-center gap-1.5 px-3 py-1 rounded transition-all text-xs"
                            style={{
                                background: isMin ? "rgba(255,255,255,0.05)" : "rgba(0,120,212,0.2)",
                                color: isMin ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)",
                                border: isMin ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,120,212,0.4)",
                                height: 32,
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,120,212,0.3)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = isMin ? "rgba(255,255,255,0.05)" : "rgba(0,120,212,0.2)"; }}
                        >
                            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">{meta.icon}</div>
                            <span>{meta.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* System Tray */}
            <div className="flex items-center gap-1 pr-1">
                <div className="flex items-center gap-2 px-2 py-1 rounded text-xs cursor-default">
                    <img
                        src="/icon_volume.svg"
                        alt="Volume"
                        title="Volume"
                        className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity"
                    />
                </div>
                <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)" }} />
                <Clock />
            </div>
        </div>
    );
}
