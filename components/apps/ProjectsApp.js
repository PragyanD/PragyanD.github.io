const PROJECTS = [
    {
        name: "Scene Recognition AI",
        icon: "🧠",
        stack: ["PyTorch", "Python", "Deep Learning"],
        description: "CNN-based scene classifier achieving 93% accuracy on MiniPlaces dataset. Optimized via hyperparameter tuning, data augmentation, batch normalization, and learning rate scheduling.",
        highlight: "93% accuracy",
        color: "#6366f1",
        links: [],
    },
    {
        name: "Proton — Discord Bot",
        icon: "🤖",
        stack: ["Node.js", "JavaScript", "FFmpeg", "YTDL"],
        description: "Multipurpose Discord bot for server admin, music playback, and user verification. Streams audio from YouTube via YTDL + FFmpeg for real-time audio processing.",
        highlight: "Distributed System",
        color: "#5865f2",
        links: [{ label: "GitHub", href: "https://github.com/PragyanD" }],
    },
    {
        name: "BISS Encryption (Apache TSDuck)",
        icon: "🔐",
        stack: ["C", "Bouncy Castle", "DVB/ETSI", "TSDuck"],
        description: "Architected BISS-1/E/CA encryption support for real-time video scrambling. Upstream patches accepted and merged into the TSDuck open-source repository.",
        highlight: "Open Source Merged",
        color: "#f59e0b",
        links: [],
    },
    {
        name: "Apache AGE Contributions",
        icon: "🕸️",
        stack: ["C", "PostgreSQL", "Go", "Python"],
        description: "Contributed to Apache AGE graph database extension for PostgreSQL. Implemented Cypher query parsing, graph traversal, and mitigated SQL injection vulnerabilities.",
        highlight: "Open Source",
        color: "#10b981",
        links: [],
    },
];

export default function ProjectsApp() {
    return (
        <div className="w-full h-full overflow-y-auto os-scroll p-6" style={{ background: "#f7f8fb" }}>
            <div className="grid grid-cols-2 gap-4">
                {PROJECTS.map((project) => (
                    <div
                        key={project.name}
                        className="flex flex-col p-5 rounded-xl transition-all"
                        style={{
                            background: "#fff",
                            border: "1px solid #e8e8e8",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `0 6px 24px ${project.color}22`;
                            e.currentTarget.style.borderColor = `${project.color}44`;
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                            e.currentTarget.style.borderColor = "#e8e8e8";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                            <div
                                className="flex items-center justify-center flex-shrink-0 rounded-lg text-xl"
                                style={{
                                    width: 44,
                                    height: 44,
                                    background: `${project.color}18`,
                                    border: `1px solid ${project.color}33`,
                                }}
                            >
                                {project.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold leading-tight" style={{ color: "#111" }}>{project.name}</h3>
                                <span
                                    className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                                    style={{ background: `${project.color}18`, color: project.color, border: `1px solid ${project.color}33` }}
                                >
                                    {project.highlight}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs leading-relaxed flex-1 mb-3" style={{ color: "#555" }}>
                            {project.description}
                        </p>

                        {/* Stack */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {project.stack.map((s) => (
                                <span key={s} className="text-xs px-1.5 py-0.5 rounded font-mono"
                                    style={{ background: "#f0f0f0", color: "#555", border: "1px solid #e0e0e0" }}>
                                    {s}
                                </span>
                            ))}
                        </div>

                        {/* Links */}
                        {project.links.length > 0 && (
                            <div className="flex gap-2">
                                {project.links.map((link) => (
                                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                                        className="text-xs px-3 py-1.5 rounded-md font-medium transition-all"
                                        style={{ background: `${project.color}18`, color: project.color, border: `1px solid ${project.color}33` }}>
                                        ↗ {link.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
