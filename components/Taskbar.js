import { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import Image from "next/image";
import favicon from "../public/favicon.png";
import { APPS_CONFIG, renderWindowIcon } from "../lib/apps.config";

const APP_META = Object.fromEntries(
    APPS_CONFIG.map(app => [app.id, { icon: renderWindowIcon(app), label: app.label }])
);

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function Calendar({ onClose }) {
    const today = new Date();
    const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

    useEffect(() => {
        const handler = (e) => { if (!e.target.closest("[data-calendar]")) onClose(); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    const firstDay = new Date(view.year, view.month, 1).getDay();
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const prevMonth = () => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 });
    const nextMonth = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 });

    const isToday = (d) => d && view.year === today.getFullYear() && view.month === today.getMonth() && d === today.getDate();

    return (
        <div
            data-calendar
            className="fixed z-[200] rounded-2xl shadow-2xl"
            style={{
                bottom: 56,
                right: 8,
                width: 220,
                background: "rgba(18,18,30,0.96)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                padding: "14px 12px 12px",
            }}
        >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>‹</button>
                <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{MONTHS[view.month]} {view.year}</span>
                <button onClick={nextMonth} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>›</button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                    <span key={d} className="text-center text-[9px] font-semibold py-0.5" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>{d}</span>
                ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((d, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-center rounded-full aspect-square text-[11px]"
                        style={{
                            color: isToday(d) ? "#fff" : d ? "rgba(255,255,255,0.7)" : "transparent",
                            background: isToday(d) ? "#0078d4" : "transparent",
                            fontWeight: isToday(d) ? 600 : 400,
                        }}
                    >
                        {d || ""}
                    </div>
                ))}
            </div>
        </div>
    );
}

function Clock() {
    const [time, setTime] = useState(new Date());
    const [calOpen, setCalOpen] = useState(false);
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
        <>
            <button
                data-calendar
                onClick={() => setCalOpen(v => !v)}
                className="flex flex-col items-end text-right px-4 h-full justify-center hover:bg-white/5 transition-colors rounded"
                aria-label="Open calendar"
            >
                <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>{timeStr}</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)", fontSize: "10px" }}>{dateStr}</span>
            </button>
            {calOpen && <Calendar onClose={() => setCalOpen(false)} />}
        </>
    );
}

export default function Taskbar({ openWindows, minimizedWindows, onStartClick, startOpen, onRestoreWindow, onVolumeClick }) {
    const [closingPills, setClosingPills] = useState(new Set());
    const prevOpenWindows = useRef(openWindows);

    useEffect(() => {
        const prev = prevOpenWindows.current;
        const removed = prev.filter(id => !openWindows.includes(id));
        if (removed.length > 0) {
            setClosingPills(s => {
                const next = new Set(s);
                removed.forEach(id => next.add(id));
                return next;
            });
            const timer = setTimeout(() => {
                setClosingPills(s => {
                    const next = new Set(s);
                    removed.forEach(id => next.delete(id));
                    return next;
                });
            }, 150);
            prevOpenWindows.current = openWindows;
            return () => clearTimeout(timer);
        }
        prevOpenWindows.current = openWindows;
    }, [openWindows]);

    // --- Pill ordering + drag-to-reorder ---
    const [pillOrder, setPillOrder] = useState(() => {
        try {
            const pillArr = JSON.parse(localStorage.getItem('pdos_pill_order') || '[]');
            const winArr  = JSON.parse(localStorage.getItem('pdos_open_windows') || '[]');
            // Keep saved pill order, then append any open windows not yet in it
            const filtered = pillArr.filter(id => winArr.includes(id));
            const extra    = winArr.filter(id => !filtered.includes(id));
            return [...filtered, ...extra];
        } catch { return []; }
    });
    const [dragId, setDragId] = useState(null);
    const [dragInsertIdx, setDragInsertIdx] = useState(null);
    const pillContainerRef = useRef(null);
    const isDraggingRef = useRef(false);
    const dragStartXRef = useRef(0);
    // FLIP animation bookkeeping
    const prevPositions = useRef({});
    const flipRafRef = useRef(null);

    // All visible pills = open + closing (for exit animation)
    const allVisible = useMemo(
        () => [...new Set([...openWindows, ...Array.from(closingPills)])],
        [openWindows, closingPills]
    );

    // Keep pillOrder in sync: preserve existing order, append new arrivals
    useEffect(() => {
        setPillOrder(prev => {
            const keep = prev.filter(id => allVisible.includes(id));
            const newOnes = allVisible.filter(id => !prev.includes(id));
            return [...keep, ...newOnes];
        });
    }, [allVisible]);

    // During drag: insert dragId at dragInsertIdx in the base order (excluding dragId)
    const displayOrder = useMemo(() => {
        if (!dragId || dragInsertIdx === null) return pillOrder;
        const without = pillOrder.filter(id => id !== dragId);
        const result = [...without];
        result.splice(Math.min(dragInsertIdx, result.length), 0, dragId);
        return result;
    }, [pillOrder, dragId, dragInsertIdx]);

    // FLIP: after each dragInsertIdx change, invert pills back to their previous positions
    // then let a rAF remove the inversion so the browser animates them smoothly.
    useLayoutEffect(() => {
        if (!pillContainerRef.current || !dragId) return;

        const pills = Array.from(pillContainerRef.current.querySelectorAll("[data-pill-id]"));
        let anyMoved = false;

        pills.forEach(el => {
            const id = el.dataset.pillId;
            if (id === dragId) return;
            const prev = prevPositions.current[id];
            if (!prev) return;
            const curr = el.getBoundingClientRect();
            const dx = Math.round(prev.left - curr.left);
            if (Math.abs(dx) > 0) {
                el.style.transition = "none";
                el.style.transform = `translateX(${dx}px)`;
                anyMoved = true;
            }
        });

        if (!anyMoved) return;

        // Cancel any rAF still in flight from a previous drag tick
        if (flipRafRef.current) cancelAnimationFrame(flipRafRef.current);

        // Force a reflow so the inverted position is committed before we add the transition
        pillContainerRef.current.getBoundingClientRect(); // eslint-disable-line

        flipRafRef.current = requestAnimationFrame(() => {
            if (!pillContainerRef.current) return;
            pillContainerRef.current.querySelectorAll("[data-pill-id]").forEach(el => {
                if (el.dataset.pillId === dragId) return;
                if (el.style.transform) {
                    el.style.transition = "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)";
                    el.style.transform = "";
                }
            });
        });
    }, [dragInsertIdx, dragId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Query DOM for insert index, excluding the dragged pill itself
    const computeInsertIdx = (cursorX, excludeId) => {
        if (!pillContainerRef.current) return 0;
        const all = Array.from(pillContainerRef.current.querySelectorAll("[data-pill-id]"));
        const pills = all.filter(el => el.dataset.pillId !== excludeId);
        for (let i = 0; i < pills.length; i++) {
            const rect = pills[i].getBoundingClientRect();
            if (cursorX < rect.left + rect.width / 2) return i;
        }
        return pills.length;
    };

    const handlePillMouseDown = (e, appId) => {
        if (closingPills.has(appId)) return;
        e.preventDefault();
        dragStartXRef.current = e.clientX;
        isDraggingRef.current = false;

        const snapshotPositions = () => {
            if (!pillContainerRef.current) return;
            pillContainerRef.current.querySelectorAll("[data-pill-id]").forEach(el => {
                if (el.dataset.pillId !== appId)
                    prevPositions.current[el.dataset.pillId] = el.getBoundingClientRect();
            });
        };

        const onMouseMove = (me) => {
            if (!isDraggingRef.current) {
                if (Math.abs(me.clientX - dragStartXRef.current) > 6) {
                    isDraggingRef.current = true;
                    snapshotPositions();
                    setDragId(appId);
                    setDragInsertIdx(computeInsertIdx(me.clientX, appId));
                }
                return;
            }
            snapshotPositions();
            setDragInsertIdx(computeInsertIdx(me.clientX, appId));
        };

        const onMouseUp = (me) => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);

            if (!isDraggingRef.current) {
                // Was a click — restore/focus the window
                onRestoreWindow(appId);
            } else {
                // Commit the new order
                const finalIdx = computeInsertIdx(me.clientX, appId);
                setPillOrder(prev => {
                    const without = prev.filter(id => id !== appId);
                    without.splice(Math.min(finalIdx, without.length), 0, appId);
                    try { localStorage.setItem('pdos_pill_order', JSON.stringify(without)); } catch {}
                    return without;
                });
            }

            setDragId(null);
            setDragInsertIdx(null);
            isDraggingRef.current = false;
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    return (
        <div
            className="taskbar fixed bottom-0 left-0 right-0 flex items-center z-50"
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
                aria-label="Start menu"
                aria-expanded={startOpen}
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
                    className="rounded-lg overflow-hidden flex-shrink-0"
                    style={{
                        width: 30,
                        height: 30,
                        border: startOpen ? "2px solid #0078d4" : "2px solid rgba(255,255,255,0.2)",
                        transition: "all 0.2s ease",
                    }}
                >
                    <Image src={favicon} alt="Start" width={30} height={30} style={{ objectFit: "contain" }} />
                </div>
                <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>Start</span>
            </button>

            {/* Running App Pills */}
            <div
                ref={pillContainerRef}
                className="flex items-center px-2 flex-1"
                style={{ userSelect: "none" }}
            >
                {displayOrder.map((appId) => {
                    const meta = APP_META[appId] || { icon: "🗔", label: appId };
                    const isMin = minimizedWindows.includes(appId);
                    const isClosingPill = closingPills.has(appId);
                    const isDragged = dragId === appId;

                    return (
                        // Collapsing wrapper — animates layout space away on close.
                        // overflow:hidden + max-width/marginRight → 0 removes the pill's
                        // layout contribution (transform-only animations cannot do this).
                        // overflow:visible when not closing lets drag elevation overflow.
                        <div
                            key={appId}
                            data-pill-id={appId}
                            style={{
                                display: "flex",
                                flexShrink: 0,
                                overflow: isClosingPill ? "hidden" : "visible",
                                maxWidth: isClosingPill ? 0 : 300,
                                marginRight: isClosingPill ? 0 : 4,
                                opacity: isClosingPill ? 0 : 1,
                                transition: isClosingPill
                                    ? "max-width 0.15s ease-in, margin-right 0.15s ease-in, opacity 0.12s ease-in"
                                    : "none",
                            }}
                        >
                            <button
                                onMouseDown={(e) => handlePillMouseDown(e, appId)}
                                aria-label={`${meta.label} — ${isMin ? "minimized" : "open"}`}
                                className="pill-appear flex items-center gap-1.5 px-3 py-1 rounded text-xs"
                                style={{
                                    background: isMin ? "rgba(255,255,255,0.05)" : "rgba(0,120,212,0.2)",
                                    color: isMin ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)",
                                    border: isMin ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,120,212,0.4)",
                                    height: 32,
                                    flexShrink: 0,
                                    opacity: isDragged ? 0.45 : 1,
                                    transform: isDragged ? "scale(1.07) translateY(-4px)" : "none",
                                    boxShadow: isDragged ? "0 8px 24px rgba(0,0,0,0.5)" : "none",
                                    cursor: isDragged ? "grabbing" : dragId ? "default" : "grab",
                                    transition: isDragged
                                        ? "transform 0.1s ease, opacity 0.1s ease, box-shadow 0.1s ease"
                                        : "background 0.15s ease, color 0.15s ease, transform 0.15s ease, opacity 0.15s ease",
                                    zIndex: isDragged ? 10 : "auto",
                                    position: "relative",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isDragged && !dragId)
                                        e.currentTarget.style.background = "rgba(0,120,212,0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    if (!isDragged)
                                        e.currentTarget.style.background = isMin ? "rgba(255,255,255,0.05)" : "rgba(0,120,212,0.2)";
                                }}
                            >
                                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">{meta.icon}</div>
                                <span>{meta.label}</span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* System Tray */}
            <div className="flex items-center gap-1 pr-1">
                <button onClick={onVolumeClick} aria-label="Volume settings" className="flex items-center gap-2 px-2 py-1 rounded text-xs cursor-default hover:bg-white/10 transition-colors">
                    <img
                        src="/icon_volume.svg"
                        alt="Volume"
                        title="Volume"
                        className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity"
                    />
                </button>
                <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />
                <Clock />
            </div>
        </div>
    );
}
