import { useState } from "react";

export default function ResumeApp() {
    const [pdfFailed, setPdfFailed] = useState(false);

    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/Pragyans_Resume.pdf");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Pragyans_Resume.pdf");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            // Fallback to direct link
            window.open("/Pragyans_Resume.pdf", "_blank");
        }
    };

    return (
        <div className="w-full h-full flex flex-col" style={{ background: "#525659" }}>
            {/* Toolbar */}
            <div
                className="flex items-center gap-3 px-4 py-2 flex-shrink-0 text-xs"
                style={{
                    background: "#3d4043",
                    borderBottom: "1px solid rgba(0,0,0,0.3)",
                    color: "rgba(255,255,255,0.7)",
                }}
            >
                <span>📄</span>
                <span>Pragyan&apos;s Resume</span>
                <div className="flex-1" />
                <button
                    onClick={handleDownload}
                    className="px-3 py-1 rounded text-xs font-medium transition-all"
                    style={{ background: "rgba(0,120,212,0.8)", color: "#fff" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,120,212,1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,120,212,0.8)"; }}
                >
                    ⬇ Download
                </button>
            </div>
            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
                {pdfFailed ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-white/60">
                        <p className="text-sm">Could not load PDF preview.</p>
                        <a
                            href="/Pragyans_Resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            Open PDF directly
                        </a>
                    </div>
                ) : (
                    <iframe
                        src="/Pragyans_Resume.pdf"
                        className="w-full h-full"
                        style={{ border: "none", display: "block" }}
                        title="Pragyan Das Resume"
                        onError={() => setPdfFailed(true)}
                    />
                )}
            </div>
        </div>
    );
}
