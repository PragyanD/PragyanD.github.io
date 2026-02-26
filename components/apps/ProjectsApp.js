const PROJECTS = [
    {
        name: "Scene Recognition AI",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
        stack: ["PyTorch", "Python", "Deep Learning"],
        description: "CNN-based scene classifier achieving 93% accuracy on MiniPlaces dataset. Optimized via hyperparameter tuning, data augmentation, batch normalization, and learning rate scheduling.",
        highlight: "Machine Learning",
        color: "#6366f1",
        links: [],
    },
    {
        name: "Proton — Discord Bot",
        logo: "https://www.pngall.com/wp-content/uploads/15/Atom-PNG-Photos.png",
        stack: ["Node.js", "JavaScript", "FFmpeg", "YTDL"],
        description: "Multipurpose Discord bot for server admin, music playback, and user verification. Streams audio from YouTube via YTDL + FFmpeg for real-time audio processing.",
        highlight: "Distributed Systems",
        color: "#5865f2",
        links: [{ label: "GitHub", href: "https://github.com/PragyanD" }],
    },
    {
        name: "BISS Encryption (TSDuck)",
        logo: "https://avatars.githubusercontent.com/u/10368383?s=200&v=4",
        stack: ["C", "Bouncy Castle", "DVB/ETSI", "TSDuck"],
        description: "Developed a proprietary patch for DTV Innovations which added support for BISS-1/E/CA encryption for real-time video scrambling.",
        highlight: "Multimedia Encryption",
        color: "#f59e0b",
        links: [],
    },
    {
        name: "Apache AGE Contributions",
        logo: "https://news.apache.org/wp-content/uploads/2024/04/age_highres.png",
        stack: ["C", "PostgreSQL", "Go", "Python"],
        description: "Contributed to Apache AGE graph database extension for PostgreSQL. Implemented Cypher query parsing, graph traversal, and mitigated SQL injection vulnerabilities.",
        highlight: "Graph Databases",
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
                                className="flex items-center justify-center flex-shrink-0 rounded-lg text-xl bg-white overflow-hidden p-1 shadow-sm"
                                style={{
                                    width: 44,
                                    height: 44,
                                    border: `1px solid ${project.color}33`,
                                }}
                            >
                                {project.logo ? (
                                    <img src={project.logo} alt={project.name} className="w-full h-full object-contain" />
                                ) : (
                                    project.icon
                                )}
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
