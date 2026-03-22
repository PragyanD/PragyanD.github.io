import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import profilePic from "../public/profilePic.jpg";
import { APPS_CONFIG, renderWindowIcon } from "../lib/apps.config";

const LINKS = [
    {
        label: "GitHub", href: "https://github.com/PragyanD",
        iconSvg: <svg width="15" height="15" viewBox="0 0 98 96" fill="currentColor" aria-hidden="true"><path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/></svg>,
    },
    {
        label: "LinkedIn", href: "https://www.linkedin.com/in/daspragyan",
        iconSvg: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>,
    },
    { label: "Resume", href: "/Pragyans_Resume.pdf", iconImg: "/icon_resume.png", target: "_blank" },
    {
        label: "Email", href: "mailto:pragyan0506@gmail.com",
        iconSvg: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    },
];

export default function StartMenu({ open, onClose, onOpenApp, onRestart }) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open || !panelRef.current) return;
        const node = panelRef.current;
        const focusables = node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusables.length) focusables[0].focus();

        const handleKeyDown = (e) => {
            if (e.key !== 'Tab') return;
            const updatedFocusables = node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (!updatedFocusables.length) return;
            const first = updatedFocusables[0];
            const last = updatedFocusables[updatedFocusables.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        };

        node.addEventListener('keydown', handleKeyDown);
        return () => node.removeEventListener('keydown', handleKeyDown);
    }, [open]);

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            {/* Menu Panel */}
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Start Menu"
                className="start-menu-open fixed z-50 flex overflow-hidden"
                style={{
                    bottom: 48,
                    left: 0,
                    width: 420,
                    height: 560,
                    borderRadius: "12px 12px 0 12px",
                    background: "rgba(18, 18, 32, 0.95)",
                    backdropFilter: "blur(40px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 -8px 60px rgba(0,0,0,0.7)",
                }}
            >
                {/* Left Column: Profile */}
                <div
                    className="flex flex-col"
                    style={{
                        width: 140,
                        background: "rgba(0,0,0,0.3)",
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    {/* Profile Photo */}
                    <div className="flex flex-col items-center justify-center gap-3 p-5 pt-8">
                        <div
                            className="rounded-full overflow-hidden flex-shrink-0"
                            style={{
                                width: 70,
                                height: 70,
                                border: "3px solid rgba(0,120,212,0.8)",
                                boxShadow: "0 0 20px rgba(0,120,212,0.4)",
                            }}
                        >
                            <Image src={profilePic} alt="Pragyan Das" width={70} height={70} style={{ objectFit: "cover" }} />
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
                                className="hover-pill flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium"
                                style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                    {link.iconImg
                                        ? <img src={link.iconImg} alt={link.label} className="w-full h-full object-contain" />
                                        : link.iconSvg}
                                </span>
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Restart */}
                    <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <button
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs transition-all"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,120,212,0.15)"; e.currentTarget.style.color = "#60a5fa"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                            onClick={() => { onClose(); onRestart?.(); }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                <path d="M3 3v5h5"/>
                            </svg>
                            Restart
                        </button>
                    </div>
                </div>

                {/* Right Column: Apps */}
                <div className="flex flex-col flex-1 p-4 overflow-y-auto os-scroll">
                    <p className="text-xs font-semibold mb-3 px-1" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Applications
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        {APPS_CONFIG.map((app) => (
                            <button
                                key={app.id}
                                onClick={() => { onOpenApp(app.id); onClose(); }}
                                className="hover-pill flex flex-col items-center gap-1.5 p-3 rounded-lg text-center"
                                style={{ color: "rgba(255,255,255,0.75)" }}
                            >
                                <div className="w-8 h-8 flex items-center justify-center mb-1">{renderWindowIcon(app)}</div>
                                <span className="text-xs font-medium leading-tight whitespace-pre-line">{app.startMenuLabel}</span>
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
