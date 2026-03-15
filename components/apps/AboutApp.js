import Image from "next/image";
import profilePic from "../../public/profilePic.jpg";

const SKILLS = [
    { category: "Languages", items: ["Python", "C", "C++", "JavaScript", "Java", "SQL", "Bash"] },
    { category: "Frameworks", items: ["React.js", "Node.js", "Flask", "PyTorch", "TensorFlow"] },
    { category: "Tools", items: ["Git", "Linux", "Docker", "AWS", "FFmpeg"] },
    { category: "Competencies", items: ["System Design", "Distributed Systems", "API Dev", "CI/CD", "ML"] },
];

// L4 — Changed last color from "#ff453a" (danger red) to "#a855f7" (purple/indigo)
const COLORS = ["#0078d4", "#34c759", "#febc2e", "#a855f7"];
const LIGHT_TEXT_COLORS = ["#005fa3", "#1a7a30", "#8a6000", "#7e22ce"];

export default function AboutApp({ darkTheme = false, onOpenApp }) {
    const t = darkTheme ? {
        containerBg: "#0a0a1e",
        heroBorder: "1px solid rgba(255,255,255,0.08)",
        // H1 — hero theme tokens (dark)
        heroBg: "linear-gradient(135deg, #0a0a1e 0%, #1a1a35 50%, #0d1b3e 100%)",
        heroText: "rgba(255,255,255,0.65)",
        heroMuted: "rgba(255,255,255,0.6)",
        bioText: "rgba(255,255,255,0.75)",
        cardBg: "rgba(20,20,40,0.6)",
        cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
        certHeading: "rgba(255,255,255,0.5)",
        certTitle: "rgba(255,255,255,0.9)",
        certSubtitle: "rgba(255,255,255,0.5)",
        footnote: "rgba(255,255,255,0.4)",
        btnGhost: { bg: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)" },
        btnLinkedIn: { bg: "rgba(0,120,212,0.3)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(0,120,212,0.5)" },
    } : {
        containerBg: "#f7f8fb",
        heroBorder: "1px solid #e0e0e0",
        // H1 — hero theme tokens (light)
        heroBg: "linear-gradient(135deg, #e8f0fb 0%, #dce8f5 50%, #e0eaf8 100%)",
        heroText: "#555",
        heroMuted: "#888",
        bioText: "#444",
        cardBg: "#fff",
        cardShadow: "0 1px 4px rgba(0,0,0,0.06)",
        certHeading: "#888",
        certTitle: "#222",
        certSubtitle: "#888",
        footnote: "#999",
        btnGhost: { bg: "rgba(0,0,0,0.06)", color: "#333", border: "1px solid rgba(0,0,0,0.15)" },
        btnLinkedIn: { bg: "rgba(0,120,212,0.1)", color: "#0078d4", border: "1px solid rgba(0,120,212,0.3)" },
    };

    return (
        // M7 — Re-enable text selection on bio content
        <div className="w-full h-full overflow-y-auto os-scroll" style={{ background: t.containerBg, userSelect: 'text', WebkitUserSelect: 'text' }}>
            {/* Hero */}
            <div
                className="flex items-center gap-6 p-8"
                style={{
                    // H1 — use theme-aware heroBg token
                    background: t.heroBg,
                    borderBottom: t.heroBorder,
                }}
            >
                <div
                    className="rounded-full overflow-hidden flex-shrink-0"
                    style={{
                        // M5 — Increase profile photo size from 90 to 112
                        width: 112,
                        height: 112,
                        border: "3px solid rgba(0,120,212,0.8)",
                        boxShadow: darkTheme
                            ? "0 0 24px rgba(0,120,212,0.5)"
                            : "0 0 12px rgba(0,120,212,0.2)",
                    }}
                >
                    {/* M5 — Matching width/height on Image component */}
                    <Image src={profilePic} alt="Pragyan Das" width={112} height={112} style={{ objectFit: "cover" }} />
                </div>
                <div>
                    {/* H1 — Conditional color instead of hardcoded text-white */}
                    <h1 className="text-2xl font-bold" style={{ color: darkTheme ? '#fff' : '#111' }}>Pragyan Das</h1>
                    {/* M3 — Subtitle size: text-sm → text-base font-medium; H1 — use t.heroText */}
                    <p className="text-base font-medium mt-1" style={{ color: t.heroText }}>Software Engineer</p>
                    {/* M4 — Updated location string; H1/L2 — use t.heroMuted */}
                    <p className="inline-flex items-center gap-1 text-xs mt-2" style={{ color: t.heroMuted }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        Bengaluru, India
                    </p>
                    <div className="flex gap-3 mt-3">
                        {/* M8 — Add aria-label to contact links */}
                        <a href="https://github.com/PragyanD" target="_blank" rel="noopener noreferrer"
                            aria-label="Visit GitHub profile"
                            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-all"
                            style={{ background: t.btnGhost.bg, color: t.btnGhost.color, border: t.btnGhost.border }}>
                            <svg width="13" height="13" viewBox="0 0 98 96" fill="currentColor" aria-hidden="true"><path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/></svg>
                            GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/daspragyan" target="_blank" rel="noopener noreferrer"
                            aria-label="Visit LinkedIn profile"
                            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-all"
                            style={{ background: t.btnLinkedIn.bg, color: t.btnLinkedIn.color, border: t.btnLinkedIn.border }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                            LinkedIn
                        </a>
                        <a href="mailto:pragyan0506@gmail.com"
                            aria-label="Send email"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium"
                            style={{ background: t.btnGhost.bg, color: t.btnGhost.color, border: t.btnGhost.border }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            Email
                        </a>
                        {onOpenApp && (
                            <button
                                aria-label="Open Task Manager"
                                onClick={() => onOpenApp('taskmanager')}
                                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-all"
                                style={{ background: t.btnGhost.bg, color: t.btnGhost.color, border: t.btnGhost.border }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
                                Experiences
                            </button>
                        )}

                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="px-8 py-6">
                {/* Status indicator */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4"
                    style={{ background: 'rgba(52, 199, 89, 0.15)', border: '1px solid rgba(52,199,89,0.3)' }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 font-medium">Open to opportunities · Remote or Hybrid</span>
                </div>

                {/* M2 — Add "About" section heading before bio */}
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: t.certHeading }}>About</h2>

                <p className="text-sm leading-relaxed" style={{ color: t.bioText }}>
                    I&apos;m a software engineer drawn to systems where the margin for error is genuinely small.
                    I graduated from UW-Madison and have shipped production code across broadcast infrastructure,
                    distributed ML platforms, and graph databases. Most recently, my time has been spent in
                    broadcast, working on everything from encryption to low-latency video pipelines, where a
                    dropped frame or a bad decrypt is a real problem, not a hypothetical one. I led the
                    encryption module design for DTV&apos;s BISS implementation, driving architecture decisions
                    and coordinating with QA to cut the verification cycle significantly. Before that, I
                    defined the ML pipeline architecture for Synkriom&apos;s candidate matching system, owning
                    the end-to-end design from data ingestion through model serving. I work best on teams
                    that take the craft seriously, and I&apos;m currently looking for my next chance to build
                    something that matters.
                </p>
            </div>

            {/* Skills grid */}
            {/* M2 — Wrap grid to add "Skills" heading; M9 — category labels changed to <h3> inside map */}
            <div className="px-8 pb-8">
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.certHeading }}>Skills</h2>
                <div className="grid grid-cols-2 gap-4">
                    {SKILLS.map(({ category, items }, i) => (
                        <div
                            key={category}
                            className="p-4 rounded-lg"
                            style={{ background: t.cardBg, border: `1px solid ${COLORS[i]}33`, boxShadow: t.cardShadow, transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease" }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${COLORS[i]}22`; e.currentTarget.style.borderColor = `${COLORS[i]}55`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = t.cardShadow; e.currentTarget.style.borderColor = `${COLORS[i]}33`; }}
                        >
                            {/* M9 — Change <p> category labels to <h3> */}
                            <h3 className="text-xs font-semibold mb-2.5" style={{ color: darkTheme ? COLORS[i] : LIGHT_TEXT_COLORS[i], textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                {category}
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {items.map((item) => (
                                    <span key={item} className="text-xs px-2 py-0.5 rounded-full"
                                        style={{ background: `${COLORS[i]}18`, color: darkTheme ? COLORS[i] : LIGHT_TEXT_COLORS[i], border: `1px solid ${COLORS[i]}33` }}>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Certifications */}
            <div className="px-8 pb-8">
                {/* L1 — Removed redundant mt-4 */}
                <div>
                    {/* M9 — Change <h3> Certifications heading to <h2> for proper hierarchy */}
                    <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: t.certHeading }}>Certifications</h2>
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,153,0,0.1)', border: '1px solid rgba(255,153,0,0.25)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,153,0,0.2)' }}>
                            <svg width="20" height="12" viewBox="0 0 304 182" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AWS logo">
                                <path d="M86.4 66.4c0 3.7.4 6.7 1.1 8.9.8 2.2 1.8 4.6 3.2 7.2.5.8.7 1.6.7 2.3 0 1-.6 2-1.9 3l-6.3 4.2c-.9.6-1.8.9-2.6.9-1 0-2-.5-3-1.4-1.4-1.5-2.6-3.1-3.6-4.7-1-1.7-2-3.6-3.1-5.9-7.8 9.2-17.6 13.8-29.4 13.8-8.4 0-15.1-2.4-20-7.2-4.9-4.8-7.4-11.2-7.4-19.2 0-8.5 3-15.4 9.1-20.6 6.1-5.2 14.2-7.8 24.5-7.8 3.4 0 6.9.3 10.6.8 3.7.5 7.5 1.3 11.5 2.2v-7.3c0-7.6-1.6-12.9-4.7-16-3.2-3.1-8.6-4.6-16.3-4.6-3.5 0-7.1.4-10.8 1.3-3.7.9-7.3 2-10.8 3.4-1.6.7-2.8 1.1-3.5 1.3-.7.2-1.2.3-1.6.3-1.4 0-2.1-1-2.1-3.1v-4.9c0-1.6.2-2.8.7-3.5.5-.7 1.4-1.4 2.8-2.1 3.5-1.8 7.7-3.3 12.6-4.5 4.9-1.3 10.1-1.9 15.6-1.9 11.9 0 20.6 2.7 26.2 8.1 5.5 5.4 8.3 13.6 8.3 24.6v32.4zM45.8 81.6c3.3 0 6.7-.6 10.3-1.8 3.6-1.2 6.8-3.4 9.5-6.4 1.6-1.9 2.8-4 3.4-6.4.6-2.4 1-5.3 1-8.7v-4.2c-2.9-.7-6-1.3-9.2-1.7-3.2-.4-6.3-.6-9.4-.6-6.7 0-11.6 1.3-14.9 4-3.3 2.7-4.9 6.5-4.9 11.5 0 4.7 1.2 8.2 3.7 10.6 2.4 2.5 5.9 3.7 10.5 3.7zm80.3 10.8c-1.8 0-3-.3-3.8-1-.8-.6-1.5-2-2.1-3.9L96.7 10.2c-.6-2-.9-3.3-.9-4 0-1.6.8-2.5 2.4-2.5h9.8c1.9 0 3.2.3 3.9 1 .8.6 1.4 2 2 3.9l16.8 66.2 15.6-66.2c.5-2 1.1-3.3 1.9-3.9.8-.6 2.2-1 4-1h8c1.9 0 3.2.3 4 1 .8.6 1.5 2 1.9 3.9l15.8 67 17.3-67c.6-2 1.3-3.3 2-3.9.8-.6 2.1-1 3.9-1h9.3c1.6 0 2.5.8 2.5 2.5 0 .5-.1 1-.2 1.6-.1.6-.3 1.4-.7 2.5l-24.1 77.3c-.6 2-1.3 3.3-2.1 3.9-.8.6-2.1 1-3.8 1h-8.6c-1.9 0-3.2-.3-4-1-.8-.7-1.5-2-1.9-4L156 23l-15.4 64.4c-.5 2-1.1 3.3-1.9 4-.8.7-2.2 1-4 1h-8.6zm128.5 2.7c-5.2 0-10.4-.6-15.4-1.8-5-1.2-8.9-2.5-11.5-4-1.6-.9-2.7-1.9-3.1-2.8-.4-.9-.6-1.9-.6-2.8v-5.1c0-2.1.8-3.1 2.3-3.1.6 0 1.2.1 1.8.3.6.2 1.5.6 2.5 1 3.4 1.5 7.1 2.7 11 3.5 4 .8 7.9 1.2 11.9 1.2 6.3 0 11.2-1.1 14.6-3.3 3.4-2.2 5.2-5.4 5.2-9.5 0-2.8-.9-5.1-2.7-7-1.8-1.9-5.2-3.6-10.1-5.2L246 52c-7.3-2.3-12.7-5.7-16-10.2-3.3-4.4-5-9.3-5-14.5 0-4.2.9-7.9 2.7-11.1 1.8-3.2 4.2-6 7.2-8.2 3-2.3 6.4-4 10.4-5.2 4-1.2 8.2-1.7 12.6-1.7 2.2 0 4.5.1 6.7.4 2.3.3 4.4.7 6.5 1.1 2 .5 3.9 1 5.7 1.6 1.8.6 3.2 1.2 4.2 1.8 1.4.8 2.4 1.6 3 2.5.6.8.9 1.8.9 3.3v4.7c0 2.1-.8 3.2-2.3 3.2-.8 0-2.1-.4-3.8-1.2-5.7-2.6-12.1-3.9-19.2-3.9-5.7 0-10.2.9-13.3 2.8-3.1 1.9-4.7 4.8-4.7 8.9 0 2.8 1 5.2 3 7.1 2 1.9 5.7 3.8 11 5.5l14.2 4.5c7.2 2.3 12.4 5.5 15.5 9.6 3.1 4.1 4.6 8.8 4.6 14 0 4.3-.9 8.2-2.6 11.6-1.8 3.4-4.2 6.4-7.3 8.8-3.1 2.5-6.8 4.3-11.1 5.6-4.5 1.4-9.2 2.1-14.3 2.1z" fill="#FF9900"/>
                                <path d="M273.5 143.7c-32.9 24.3-80.7 37.2-121.8 37.2-57.6 0-109.5-21.3-148.7-56.7-3.1-2.8-.3-6.6 3.4-4.4 42.4 24.6 94.7 39.5 148.8 39.5 36.5 0 76.6-7.6 113.5-23.2 5.5-2.5 10.2 3.6 4.8 7.6z" fill="#FF9900"/>
                                <path d="M287.2 128.1c-4.2-5.4-27.8-2.6-38.5-1.3-3.2.4-3.7-2.4-.8-4.5 18.8-13.2 49.7-9.4 53.3-5 3.6 4.5-1 35.4-18.6 50.2-2.7 2.3-5.3 1.1-4.1-1.9 4-9.9 12.9-32.2 8.7-37.5z" fill="#FF9900"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-semibold" style={{ color: t.certTitle }}>AWS Certified Cloud Practitioner</p>
                            {/* M11 — Change text-[10px] to text-xs */}
                            <p className="text-xs" style={{ color: t.certSubtitle }}>Amazon Web Services · 2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
