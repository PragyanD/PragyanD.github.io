import { useState, useEffect } from "react";
import Image from "next/image";
import profilePic from "../public/profilePic.jpg";

const LINKS = [
    { label: "GitHub", href: "https://github.com/PragyanD", icon: "⌥" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/daspragyan", icon: "in" },
    { label: "Resume", href: "resume.pdf", icon: "📄", target: "_blank" },
    { label: "Email", href: "mailto:pragyan0506@gmail.com", icon: "✉" },
];

export default function StartMenu({ open, onClose, onOpenApp }) {
    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            {/* Menu Panel */}
            <div
                className="start-menu-open fixed z-50 flex overflow-hidden"
                style={{
                    bottom: 52,
                    left: 0,
                    width: 420,
                    height: 560,
                    borderRadius: "12px 12px 0 12px",
                    background: "rgba(18, 18, 32, 0.95)",
                    backdropFilter: "blur(30px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 -8px 60px rgba(0,0,0,0.7)",
                }}
            >
                {/* Left Column: Profile */}
                <div
                    className="flex flex-col"
                    style={{
                        width: 160,
                        background: "rgba(0,0,0,0.3)",
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    {/* Profile Photo */}
                    <div className="flex flex-col items-center justify-center gap-3 p-5 pt-8">
                        <div
                            className="rounded-full overflow-hidden flex-shrink-0"
                            style={{
                                width: 80,
                                height: 80,
                                border: "3px solid rgba(0,120,212,0.8)",
                                boxShadow: "0 0 20px rgba(0,120,212,0.4)",
                            }}
                        >
                            <Image src={profilePic} alt="Pragyan Das" width={80} height={80} style={{ objectFit: "cover" }} />
                        </div>
                        <div className="text-center">
                            <p className="text-white font-semibold text-sm leading-tight">Pragyan Das</p>
                            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Software Engineer</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-4" style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />

                    {/* Links */}
                    <div className="flex flex-col gap-1 p-2 flex-1">
                        {LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target={link.target || "_self"}
                                rel="noopener noreferrer"
                                onClick={onClose}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all"
                                style={{ color: "rgba(255,255,255,0.7)" }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                            >
                                <span className="text-sm w-5 text-center">{link.icon}</span>
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Power */}
                    <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <button
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs transition-all"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,80,80,0.15)"; e.currentTarget.style.color = "#ff6b6b"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                            onClick={onClose}
                        >
                            <span>⏻</span> Sign out
                        </button>
                    </div>
                </div>

                {/* Right Column: Apps */}
                <div className="flex flex-col flex-1 p-4 overflow-y-auto os-scroll">
                    <p className="text-xs font-semibold mb-3 px-1" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Applications
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { app: "taskmanager", icon: <img src="/icon_task_manager.png" alt="Task Manager" className="w-full h-full object-contain" />, label: "Task\nManager" },
                            { app: "about", icon: <img src="/icon_about.png" alt="About Me" className="w-full h-full object-contain" />, label: "About\nMe" },
                            { app: "projects", icon: <img src="/icon_projects.png" alt="Projects" className="w-full h-full object-contain" />, label: "Projects" },
                            { app: "resume", icon: <img src="/icon_resume.png" alt="Resume" className="w-full h-full object-contain" />, label: "Resume" },
                            { app: "terminal", icon: <div className="w-full h-full flex items-center justify-center bg-black rounded text-[10px] font-bold text-green-500 border border-green-900/50">_&gt;</div>, label: "Terminal" },
                        ].map(({ app, icon, label }) => (
                            <button
                                key={app}
                                onClick={() => { onOpenApp(app); onClose(); }}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all text-center"
                                style={{ color: "rgba(255,255,255,0.75)" }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
                            >
                                <div className="w-8 h-8 flex items-center justify-center mb-1">{icon}</div>
                                <span className="text-xs font-medium leading-tight whitespace-pre-line">{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Skills quick-view */}
                    <div className="mt-4">
                        <p className="text-xs font-semibold mb-2 px-1" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            Skills
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {["Python", "C/C++", "JavaScript", "Java", "React", "Docker", "AWS", "Flask", "PyTorch"].map((s) => (
                                <span
                                    key={s}
                                    className="px-2 py-0.5 rounded text-xs"
                                    style={{ background: "rgba(0,120,212,0.2)", color: "rgba(100,180,255,0.9)", border: "1px solid rgba(0,120,212,0.3)" }}
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
