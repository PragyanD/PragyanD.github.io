import { useState, useEffect } from "react";

const EXPERIENCES = [
    {
        name: "DTV Innovations",
        title: "Software Engineer",
        location: "Elgin, IL",
        duration: "Apr 2024 – Jun 2025",
        cpu: 87,
        memory: 72,
        status: "Completed",
        description: [
            "Low-latency video encoding pipeline (VAAPI, FFmpeg, Intel Quick Sync) — sub-100ms broadcast streaming",
            "BISS encryption support (BISS-1/E/CA) via Bouncy Castle & TSDuck — patches merged upstream",
            "Real-time DASH playback monitor in JavaScript — 40% reduction in QA cycle time",
            "Java-C JNI interoperability layer + modular menu framework (60% less code duplication)",
        ],
        color: "#34c759",
        stack: ["C", "Java", "JavaScript", "FFmpeg", "JNI"],
        logo: "https://www.dtvinnovations.com/images/logo.png",
    },
    {
        name: "Synkriom",
        title: "Software Engineer",
        location: "Piscataway, NJ",
        duration: "Apr 2023 – Apr 2024",
        cpu: 74,
        memory: 61,
        status: "Completed",
        description: [
            "Dockerized microservices with Flask/Python — RESTful APIs with rate limiting & monitoring",
            "OpenAI Whisper + LangChain pipeline converting interview recordings to structured assessments",
            "GPT-based recruiting platform with semantic embeddings — 15% improvement in matching accuracy",
        ],
        color: "#0078d4",
        stack: ["Python", "Flask", "Docker", "LangChain", "OpenAI"],
        logo: "https://synkriom.com/wp-content/uploads/2023/10/synk_logo.png",
    },
    {
        name: "SKAI Worldwide",
        title: "Software Engineer Intern",
        location: "San Francisco, CA",
        duration: "Sep 2022 – Dec 2022",
        cpu: 53,
        memory: 44,
        status: "Completed",
        description: [
            "Contributed to Apache AGE — open-source PostgreSQL graph extension (C implementation)",
            "Implemented Cypher query parsing and graph traversal algorithms for scalable operations",
            "Mitigated SQL/Cypher injection vulnerabilities in Go and Python drivers",
        ],
        color: "#febc2e",
        stack: ["C", "PostgreSQL", "Go", "Python"],
        logo: "https://skaiworldwide.com/thumb_meta.jpeg",
    },
];

const EDUCATION = {
    name: "UW-Madison",
    title: "B.S. Computer Science",
    location: "Madison, WI",
    duration: "Aug 2019 – Dec 2022",
    cpu: 50,
    memory: 100,
    status: "Completed",
    color: "#c5050c",
    logo: "https://brand.wisc.edu/content/uploads/2023/09/crest-only-logo-print-color.png",
    courses: [
        "CS 354: Machine Organization and Programming",
        "CS 506: Software Engineering",
        "CS 537: Introduction to Operating Systems",
        "CS 540: Introduction to Artificial Intelligence",
        "CS 577: Introduction to Algorithms",
        "CS 642: Introduction to Information Security",
        "PHILOS 551: Philosophy of the Mind"
    ].sort()
};

const SKILLS_PERF = [
    { name: "Python", value: 87 },
    { name: "Java", value: 92 },
    { name: "C / C++", value: 83 },
    { name: "JavaScript", value: 80 },
    { name: "Docker / AWS", value: 60 },
    { name: "ML / PyTorch", value: 55 },
    { name: "SQL", value: 50 },
    { name: "System Design", value: 50 },
];

function CpuBar({ label, value, darkTheme }) {
    const [displayed, setDisplayed] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setWidth(0);
        const timeout = setTimeout(() => setWidth(value), 50);
        let startTimestamp = null;
        const duration = 1000;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setDisplayed(Math.floor(progress * value));
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
        return () => {
            clearTimeout(timeout);
            setDisplayed(0);
        };
    }, [value]);

    const barColor =
        value >= 85 ? "#0078d4" : value >= 65 ? "#34c759" : value >= 50 ? "#febc2e" : "#ff9500";

    return (
        <div className="flex items-center gap-2 text-xs" style={{ fontFamily: "monospace" }}>
            <span style={{ width: 110, color: darkTheme ? "rgba(255,255,255,0.5)" : "#555", flexShrink: 0 }}>{label}</span>
            <div className="flex-1 rounded-sm overflow-hidden" style={{ height: 12, background: darkTheme ? "rgba(255,255,255,0.1)" : "#e5e5e5" }}>
                <div
                    style={{
                        width: `${width}%`,
                        height: "100%",
                        background: barColor,
                        transition: "width 1s cubic-bezier(0.1, 0.7, 1.0, 0.1)",
                    }}
                />
            </div>
            <span style={{ width: 36, color: darkTheme ? "rgba(255,255,255,0.8)" : "#333", textAlign: "right" }}>{displayed}%</span>
        </div>
    );
}

function HardwareValue({ baseValue, color, darkTheme }) {
    const [val, setVal] = useState(baseValue);

    useEffect(() => {
        const interval = setInterval(() => {
            const jitter = Math.floor(Math.random() * 11) - 5;
            setVal(Math.max(0, Math.min(100, baseValue + jitter)));
        }, 1500 + Math.random() * 2000);

        return () => clearInterval(interval);
    }, [baseValue]);

    const isHigh = val > 75;

    return (
        <div className="flex flex-col items-center gap-0.5" title={`Base: ${baseValue}%`}>
            <span className="text-xs font-mono" style={{ color: isHigh ? "#ff453a" : darkTheme ? "rgba(255,255,255,0.8)" : "#333" }}>{val}%</span>
            <div className="w-12 rounded-sm overflow-hidden" style={{ height: 4, background: darkTheme ? "rgba(255,255,255,0.1)" : "#e0e0e0" }}>
                <div style={{ width: `${val}%`, height: "100%", background: isHigh ? "#ff453a" : color, transition: "all 0.3s ease" }} />
            </div>
        </div>
    );
}

export default function TaskManagerApp({ darkTheme = false }) {
    const [tab, setTab] = useState("processes");
    const [selected, setSelected] = useState(null);
    const [eduExpanded, setEduExpanded] = useState(false);

    const tabs = ["Processes", "Performance", "Details"];

    const t = darkTheme ? {
        containerBg: "#0a0a1e",
        tabBarBg: "rgba(15,15,30,0.8)",
        tabBarBorder: "rgba(255,255,255,0.08)",
        tabInactive: "rgba(255,255,255,0.5)",
        headerBg: "rgba(255,255,255,0.05)",
        headerBorder: "rgba(255,255,255,0.08)",
        headerText: "rgba(255,255,255,0.6)",
        rowEven: "rgba(255,255,255,0.02)",
        rowOdd: "rgba(255,255,255,0.04)",
        rowSelected: "rgba(0,120,212,0.15)",
        rowBorder: "rgba(255,255,255,0.05)",
        logoBg: "rgba(255,255,255,0.08)",
        logoBorder: "rgba(255,255,255,0.1)",
        name: "rgba(255,255,255,0.9)",
        subtitle: "rgba(255,255,255,0.4)",
        expandBg: "rgba(0,120,212,0.12)",
        expandBorder: "rgba(255,255,255,0.06)",
        expandText: "rgba(255,255,255,0.7)",
        expandTitle: "rgba(255,255,255,0.8)",
        statusBarBg: "rgba(0,0,0,0.3)",
        statusBarBorder: "rgba(255,255,255,0.06)",
        statusBarText: "rgba(255,255,255,0.45)",
        perfHeader: "rgba(255,255,255,0.5)",
        calloutBg: "rgba(0,120,212,0.15)",
        calloutBorder: "rgba(0,120,212,0.3)",
        calloutText: "rgba(100,170,255,0.9)",
        detailCardBg: "rgba(20,20,40,0.6)",
        detailCardBorder: "rgba(255,255,255,0.08)",
        detailLabel: "rgba(255,255,255,0.4)",
        detailValue: "rgba(255,255,255,0.85)",
        durationBg: "rgba(255,255,255,0.08)",
        durationBorder: "rgba(255,255,255,0.12)",
        durationText: "rgba(255,255,255,0.5)",
    } : {
        containerBg: "#f3f3f3",
        tabBarBg: "#fafafa",
        tabBarBorder: "#d0d0d0",
        tabInactive: "#555",
        headerBg: "#efefef",
        headerBorder: "#ddd",
        headerText: "#444",
        rowEven: "#fff",
        rowOdd: "#fafafa",
        rowSelected: "rgba(0,120,212,0.1)",
        rowBorder: "#eee",
        logoBg: "white",
        logoBorder: "#e5e7eb",
        name: "#111",
        subtitle: "#777",
        expandBg: "rgba(0,120,212,0.04)",
        expandBorder: "#e0e0e0",
        expandText: "#444",
        expandTitle: "#333",
        statusBarBg: "#e8e8e8",
        statusBarBorder: "#d0d0d0",
        statusBarText: "#555",
        perfHeader: "#555",
        calloutBg: "#e8f4fd",
        calloutBorder: "#bee3f8",
        calloutText: "#2b6cb0",
        detailCardBg: "#fff",
        detailCardBorder: "#e0e0e0",
        detailLabel: "#888",
        detailValue: "#222",
        durationBg: "#f3f4f6",
        durationBorder: "#e5e7eb",
        durationText: "#4b5563",
    };

    return (
        <div
            className="flex flex-col w-full h-full overflow-hidden font-mono"
            style={{ background: t.containerBg }}
        >
            {/* Tab bar */}
            <div
                className="flex gap-0 flex-shrink-0"
                style={{ borderBottom: `1px solid ${t.tabBarBorder}`, background: t.tabBarBg }}
            >
                {tabs.map((tabLabel) => {
                    const key = tabLabel.toLowerCase();
                    return (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className="px-5 py-2 text-xs font-medium transition-all"
                            style={{
                                borderBottom: tab === key ? "2px solid #0078d4" : "2px solid transparent",
                                color: tab === key ? "#0078d4" : t.tabInactive,
                                background: "transparent",
                            }}
                        >
                            {tabLabel}
                        </button>
                    );
                })}
            </div>

            {/* ── PROCESSES TAB ── */}
            {tab === "processes" && (
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div
                        className="grid text-xs font-semibold px-3 py-2 flex-shrink-0"
                        style={{
                            gridTemplateColumns: "1fr 90px 90px 110px 140px",
                            background: t.headerBg,
                            borderBottom: `1px solid ${t.headerBorder}`,
                            color: t.headerText,
                        }}
                    >
                        <span>Name</span>
                        <span className="text-center">CPU</span>
                        <span className="text-center">Memory</span>
                        <span className="text-center">Status</span>
                        <span>Duration</span>
                    </div>

                    <div className="flex-1 overflow-y-auto os-scroll">
                        {EXPERIENCES.map((exp, i) => (
                            <div key={i}>
                                <div
                                    className="grid items-center px-3 py-3 cursor-pointer transition-all"
                                    style={{
                                        gridTemplateColumns: "1fr 90px 90px 110px 140px",
                                        background: selected === i ? t.rowSelected : i % 2 === 0 ? t.rowEven : t.rowOdd,
                                        borderBottom: `1px solid ${t.rowBorder}`,
                                    }}
                                    onClick={() => setSelected(selected === i ? null : i)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 flex items-center justify-center rounded shrink-0 p-1" style={{ background: t.logoBg, border: `1px solid ${t.logoBorder}` }}>
                                            <img src={exp.logo} alt="" className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold" style={{ color: t.name }}>{exp.name}</p>
                                            <p className="text-[10px]" style={{ color: t.subtitle }}>{exp.title}</p>
                                        </div>
                                    </div>
                                    <HardwareValue baseValue={exp.cpu} color={exp.color} darkTheme={darkTheme} />
                                    <HardwareValue baseValue={exp.memory} color={exp.color} darkTheme={darkTheme} />
                                    <div className="flex justify-center">
                                        <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                                            style={{ background: "rgba(52,199,89,0.12)", color: "#28a745", border: "1px solid rgba(52,199,89,0.3)" }}>
                                            ✓ {exp.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-xs px-2 py-0.5 rounded-sm" style={{ background: t.durationBg, color: t.durationText, border: `1px solid ${t.durationBorder}` }}>
                                            {exp.duration}
                                        </span>
                                    </div>
                                </div>
                                {selected === i && (
                                    <div className="px-8 py-4 border-l-2" style={{ background: t.expandBg, borderLeftColor: exp.color, borderBottom: `1px solid ${t.expandBorder}` }}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <p className="text-xs font-semibold" style={{ color: t.expandTitle }}>📍 {exp.location}</p>
                                            <div className="flex gap-1.5 flex-wrap ml-2">
                                                {exp.stack.map((s) => (
                                                    <span key={s} className="text-xs px-1.5 py-0.5 rounded"
                                                        style={{ background: "rgba(0,120,212,0.1)", color: "#0078d4", border: "1px solid rgba(0,120,212,0.2)" }}>
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <ul className="space-y-1.5">
                                            {exp.description.map((d, j) => (
                                                <li key={j} className="flex gap-2 text-xs" style={{ color: t.expandText }}>
                                                    <span style={{ color: exp.color, flexShrink: 0 }}>▸</span>
                                                    <span>{d}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}

                        <div key="edu">
                            <div
                                className="grid items-center px-3 py-3 cursor-pointer transition-all"
                                style={{
                                    gridTemplateColumns: "1fr 90px 90px 110px 140px",
                                    background: eduExpanded ? t.rowSelected : t.rowEven,
                                    borderBottom: `1px solid ${t.rowBorder}`,
                                }}
                                onClick={() => setEduExpanded(!eduExpanded)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 flex items-center justify-center rounded shrink-0 p-1" style={{ background: t.logoBg, border: `1px solid ${t.logoBorder}` }}>
                                        <img src={EDUCATION.logo} alt="" className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold" style={{ color: t.name }}>{EDUCATION.name}</p>
                                        <p className="text-[10px]" style={{ color: t.subtitle }}>{EDUCATION.title}</p>
                                    </div>
                                </div>
                                <HardwareValue baseValue={EDUCATION.cpu} color={EDUCATION.color} darkTheme={darkTheme} />
                                <HardwareValue baseValue={EDUCATION.memory} color={EDUCATION.color} darkTheme={darkTheme} />
                                <div className="flex justify-center">
                                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                                        style={{ background: "rgba(52,199,89,0.12)", color: "#28a745", border: "1px solid rgba(52,199,89,0.3)" }}>
                                        ✓ {EDUCATION.status}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-xs px-2 py-0.5 rounded-sm" style={{ background: t.durationBg, color: t.durationText, border: `1px solid ${t.durationBorder}` }}>
                                        {EDUCATION.duration}
                                    </span>
                                </div>
                            </div>
                            {eduExpanded && (
                                <div className="px-8 py-4 border-l-2" style={{ background: t.expandBg, borderLeftColor: EDUCATION.color, borderBottom: `1px solid ${t.expandBorder}` }}>
                                    <p className="text-xs font-semibold mb-2" style={{ color: t.expandTitle }}>🎓 Key Courses:</p>
                                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                                        {EDUCATION.courses.map((course, j) => (
                                            <li key={j} className="flex gap-2 text-xs" style={{ color: t.expandText }}>
                                                <span style={{ color: EDUCATION.color, flexShrink: 0 }}>•</span>
                                                <span>{course}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status bar */}
                    <div
                        className="flex items-center justify-between px-4 py-1.5 flex-shrink-0 text-xs"
                        style={{ background: t.statusBarBg, borderTop: `1px solid ${t.statusBarBorder}`, color: t.statusBarText }}
                    >
                        <span>4 processes ({EXPERIENCES.length} roles + 1 education)</span>
                        <span>Click a row to expand details</span>
                    </div>
                </div>
            )}

            {/* ── PERFORMANCE TAB ── */}
            {tab === "performance" && (
                <div className="flex-1 overflow-y-auto os-scroll p-5 space-y-3">
                    <p className="text-xs font-semibold mb-1" style={{ color: t.perfHeader, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                        Skill Utilization
                    </p>
                    {SKILLS_PERF.map((s) => (
                        <CpuBar key={s.name} label={s.name} value={s.value} darkTheme={darkTheme} />
                    ))}
                    <div className="mt-6 p-3 rounded" style={{ background: t.calloutBg, border: `1px solid ${t.calloutBorder}` }}>
                        <p className="text-xs" style={{ color: t.calloutText }}>
                            <strong>Core Competencies:</strong> Data Structures & Algorithms · System Design · Distributed Systems · API Development · CI/CD · Machine Learning
                        </p>
                    </div>
                </div>
            )}

            {/* ── DETAILS TAB ── */}
            {tab === "details" && (
                <div className="flex-1 overflow-y-auto os-scroll p-4">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Full Name", value: "Pragyan Das" },
                            { label: "GitHub", value: "github.com/PragyanD" },
                            { label: "LinkedIn", value: "linkedin.com/in/daspragyan" },
                            { label: "Education", value: "UW-Madison, B.S. Computer Science" },
                            { label: "Graduation", value: "December 2022" },
                            { label: "Languages", value: "Python, C, C++, JavaScript, Java, SQL, Bash" },
                            { label: "Tools", value: "Git, Linux, Docker, AWS, FFmpeg" },
                            { label: "Frameworks", value: "React.js, Node.js, Flask, PyTorch, TensorFlow" },
                            { label: "Certifications", value: "AWS Certified Cloud Practitioner" },
                        ].map(({ label, value }) => (
                            <div key={label} className="p-3 rounded" style={{ background: t.detailCardBg, border: `1px solid ${t.detailCardBorder}` }}>
                                <p className="text-xs font-semibold mb-0.5" style={{ color: t.detailLabel }}>{label}</p>
                                <p className="text-xs" style={{ color: t.detailValue }}>{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
