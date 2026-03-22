import { useState } from "react";
import { getJSON, setJSON, STORAGE_KEYS } from "../../lib/storage";

const ALL_FILES = [
    { name: "works_on_my_machine.tar.gz",        size: "2.7 GB",        date: "Always" },
    { name: "final_final_FINAL_v3_USE_THIS.js",  size: "14 KB",         date: "2 hrs ago" },
    { name: "estimated_deadline.xlsx",           size: "—",             date: "corrupted" },
    { name: "todo_definitely_final.md",            size: "3 lines",       date: "6 months ago" },
    { name: "production_debug.log",              size: "847 MB",        date: "yesterday" },
    { name: "unused_imports/",                   size: "—",             date: "everywhere" },
    { name: "flash_player_install.exe",          size: "3.1 MB",        date: "quarantined" },
    { name: "pr_2847_wip_DO_NOT_MERGE.patch",    size: "3,847 lines",   date: "open 847 days" },
    { name: "migration_v2_backup_OLD/",           size: "—",             date: "never finished" },
    { name: "node_modules/",                     size: "847,293 items", date: "do not open" },
];

function FileIcon({ name }) {
    if (name.endsWith("/")) return <span style={{ fontSize: 13 }}>📁</span>;
    if (name.endsWith(".js") || name.endsWith(".ts") || name.endsWith(".patch") || name.endsWith(".diff")) return <span style={{ fontSize: 13 }}>📄</span>;
    if (name.endsWith(".exe")) return <span style={{ fontSize: 13 }}>⚙️</span>;
    if (name.endsWith(".pdf") || name.endsWith(".pptx") || name.endsWith(".xlsx")) return <span style={{ fontSize: 13 }}>📋</span>;
    if (name.endsWith(".txt") || name.endsWith(".md")) return <span style={{ fontSize: 13 }}>📝</span>;
    if (name.endsWith(".tar.gz") || name.endsWith(".zip")) return <span style={{ fontSize: 13 }}>🗜️</span>;
    if (name.endsWith(".stacktrace") || name.endsWith(".tmp")) return <span style={{ fontSize: 13 }}>⚠️</span>;
    return <span style={{ fontSize: 13 }}>🗒️</span>;
}

function loadTrashState() {
    const saved = getJSON(STORAGE_KEYS.TRASH, null);
    return saved !== null ? saved : ALL_FILES;
}

export default function TrashApp({ darkTheme = false }) {
    const [files, setFiles] = useState(loadTrashState);
    const [confirming, setConfirming] = useState(false);

    const t = darkTheme ? {
        containerBg: "#0a0a1e",
        headerBg: "rgba(255,255,255,0.04)",
        headerBorder: "rgba(255,255,255,0.08)",
        headerText: "rgba(255,255,255,0.8)",
        confirmBg: "rgba(255,67,58,0.08)",
        confirmBorder: "rgba(255,67,58,0.2)",
        confirmText: "rgba(255,255,255,0.7)",
        colHeaderBg: "rgba(255,255,255,0.03)",
        colHeaderBorder: "rgba(255,255,255,0.06)",
        colHeaderText: "rgba(255,255,255,0.35)",
        rowEven: "transparent",
        rowOdd: "rgba(255,255,255,0.015)",
        rowBorder: "rgba(255,255,255,0.04)",
        rowHover: "rgba(255,255,255,0.06)",
        fileName: "rgba(255,255,255,0.75)",
        fileMeta: "rgba(255,255,255,0.35)",
        emptyText: "rgba(255,255,255,0.25)",
        emptySubText: "rgba(255,255,255,0.12)",
        footerText: "rgba(255,255,255,0.18)",
        statusBarBg: "rgba(0,0,0,0.3)",
        statusBarBorder: "rgba(255,255,255,0.06)",
        statusBarText: "rgba(255,255,255,0.35)",
    } : {
        containerBg: "#f7f8fb",
        headerBg: "rgba(0,0,0,0.03)",
        headerBorder: "#e0e0e0",
        headerText: "#333",
        confirmBg: "rgba(255,67,58,0.05)",
        confirmBorder: "rgba(255,67,58,0.15)",
        confirmText: "#555",
        colHeaderBg: "#efefef",
        colHeaderBorder: "#ddd",
        colHeaderText: "#888",
        rowEven: "#fff",
        rowOdd: "#fafafa",
        rowBorder: "#eee",
        rowHover: "rgba(0,120,212,0.05)",
        fileName: "#333",
        fileMeta: "#888",
        emptyText: "#aaa",
        emptySubText: "#ccc",
        footerText: "#aaa",
        statusBarBg: "#e8e8e8",
        statusBarBorder: "#d0d0d0",
        statusBarText: "#666",
    };

    const handleEmptyClick = () => {
        if (files.length === 0) return;
        if (!confirming) {
            setConfirming(true);
        } else {
            setFiles([]);
            setConfirming(false);
            setJSON(STORAGE_KEYS.TRASH, []);
        }
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: t.containerBg, fontFamily: "'JetBrains Mono', monospace" }}>
            {/* Header bar */}
            <div
                className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
                style={{ background: t.headerBg, borderBottom: `1px solid ${t.headerBorder}` }}
            >
                <div className="flex items-center gap-2">
                    <span style={{ fontSize: 14 }}>🗑️</span>
                    <span className="text-xs font-semibold" style={{ color: t.headerText }}>Trash</span>
                    {files.length > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,67,58,0.15)", color: "#ff453a", border: "1px solid rgba(255,67,58,0.3)" }}>
                            {files.length} items
                        </span>
                    )}
                </div>
                {files.length > 0 && (
                    <button
                        className="text-[11px] px-3 py-1 rounded font-medium transition-all"
                        style={{ background: confirming ? "rgba(255,67,58,0.28)" : "rgba(255,67,58,0.12)", color: "#ff453a", border: "1px solid rgba(255,67,58,0.25)" }}
                        onClick={handleEmptyClick}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,67,58,0.22)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = confirming ? "rgba(255,67,58,0.28)" : "rgba(255,67,58,0.12)"; }}
                    >
                        {confirming ? "Delete Forever?" : "Empty Trash"}
                    </button>
                )}
            </div>

            {/* Confirmation bar */}
            {confirming && (
                <div
                    className="flex items-center justify-between px-4 py-2 flex-shrink-0 text-[11px]"
                    style={{ background: t.confirmBg, borderBottom: `1px solid ${t.confirmBorder}` }}
                >
                    <span style={{ color: t.confirmText }}>
                        Permanently delete {files.length} items? This cannot be undone.
                    </span>
                    <button
                        className="text-[11px] px-2 py-0.5 rounded"
                        style={{ color: t.confirmText, background: "transparent" }}
                        onClick={() => setConfirming(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Column headers */}
            {files.length > 0 && (
                <div
                    className="grid text-xs font-semibold px-4 py-1.5 flex-shrink-0"
                    style={{
                        gridTemplateColumns: "1fr 100px 160px",
                        background: t.colHeaderBg,
                        borderBottom: `1px solid ${t.colHeaderBorder}`,
                        color: t.colHeaderText,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                    }}
                >
                    <span>Name</span>
                    <span className="text-right">Size</span>
                    <span className="text-right">Date</span>
                </div>
            )}

            {/* Flat file list */}
            <div className="flex-1 overflow-y-auto os-scroll flex flex-col">
                {files.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3">
                        <span style={{ fontSize: 48, opacity: 0.3 }}>🗑️</span>
                        <p className="text-sm font-medium" style={{ color: t.emptyText }}>Trash is empty</p>
                        <p className="text-xs" style={{ color: t.emptySubText }}>
                            Nothing here.
                        </p>
                    </div>
                ) : (
                    <>
                        {files.map((file, i) => (
                            <div
                                key={i}
                                className="grid items-center px-4 py-2"
                                style={{
                                    gridTemplateColumns: "1fr 100px 160px",
                                    background: i % 2 === 0 ? t.rowEven : t.rowOdd,
                                    borderBottom: `1px solid ${t.rowBorder}`,
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = t.rowHover; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? t.rowEven : t.rowOdd; }}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <FileIcon name={file.name} />
                                    <span className="text-xs truncate" style={{ color: t.fileName }}>
                                        {file.name}
                                    </span>
                                </div>
                                <span className="text-[11px] text-right" style={{ color: t.fileMeta }}>
                                    {file.size}
                                </span>
                                <span className="text-[11px] text-right" style={{ color: t.fileMeta }}>
                                    {file.date}
                                </span>
                            </div>
                        ))}

                        <div className="px-4 py-4 text-center">
                            <p className="text-xs" style={{ color: t.footerText }}>
                                Items in Trash will be deleted... eventually.
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Status bar */}
            <div
                className="flex items-center justify-between px-4 py-1.5 flex-shrink-0 text-xs"
                style={{ background: t.statusBarBg, borderTop: `1px solid ${t.statusBarBorder}`, color: t.statusBarText }}
            >
                <span>{files.length} items</span>
                <span>{files.length} deleted items</span>
            </div>
        </div>
    );
}
