const PROJECTS = [
    {
        name: "Scene Recognition AI",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
        stack: ["PyTorch", "Python", "Deep Learning"],
        description: "CNN-based scene classifier achieving 93% accuracy on MiniPlaces dataset. Optimized via hyperparameter tuning, data augmentation, batch normalization, and learning rate scheduling.",
        highlight: "Machine Learning",
        color: "#a855f7",
        github: "https://github.com/PragyanD/scene-recognition",
        demo: null,
        links: [],
    },
    {
        name: "Proton — Discord Bot",
        logo: "https://www.pngall.com/wp-content/uploads/15/Atom-PNG-Photos.png",
        stack: ["Node.js", "JavaScript", "FFmpeg", "YTDL"],
        description: "Multipurpose Discord bot for server admin, music playback, and user verification. Streams audio from YouTube via YTDL + FFmpeg for real-time audio processing.",
        highlight: "Distributed Systems",
        color: "#38bdf8",
        github: null,
        demo: null,
        links: [],
    },
    {
        name: "BISS Encryption (TSDuck)",
        logo: "https://avatars.githubusercontent.com/u/29593658?s=200&v=4",
        stack: ["C", "Bouncy Castle", "DVB/ETSI", "TSDuck"],
        description: "Developed a proprietary patch for DTV Innovations which added support for BISS-1/E/CA encryption for real-time video scrambling.",
        highlight: "Multimedia Encryption",
        color: "#34c759",
        github: null,
        demo: null,
        links: [],
    },
    {
        name: "Apache AGE Contributions",
        logo: "https://news.apache.org/wp-content/uploads/2024/04/age_highres.png",
        stack: ["C", "PostgreSQL", "Go", "Python"],
        description: "Contributed to Apache AGE graph database extension for PostgreSQL. Implemented Cypher query parsing, graph traversal, and mitigated SQL injection vulnerabilities.",
        highlight: "Graph Databases",
        color: "#0078d4",
        github: null,
        demo: null,
        links: [],
    },
    {
        name: "Portfolio — This Website",
        logo: "/favicon.png",
        stack: ["Next.js", "React", "Tailwind CSS"],
        description: "Interactive portfolio styled as a desktop OS, complete with a boot sequence, windowed apps, and a dark theme. Built with Next.js and deployed via GitHub Pages.",
        highlight: "Web Development",
        color: "#38bdf8",
        github: "https://github.com/PragyanD/PragyanD.github.io",
        demo: "https://pragyand.github.io",
        links: [],
    },
    {
        name: "FlappyAI",
        logo: null,
        icon: "🐦",
        stack: ["JavaScript", "NEAT", "HTML Canvas"],
        description: "NEAT algorithm that evolves a neural network to play Flappy Bird optimally. Goes from zero to perfect play in ~20 generations.",
        highlight: "Neuroevolution",
        color: "#a855f7",
        github: "https://github.com/PragyanD/FlappyAI",
        demo: null,
        links: [],
    },
    {
        name: "Pordle",
        logo: null,
        icon: "🟩",
        stack: ["HTML", "CSS", "JavaScript"],
        description: "A faithful Wordle clone built with vanilla HTML/CSS/JS. Features daily words, color-coded feedback, and on-screen keyboard.",
        highlight: "Web Game",
        color: "#0078d4",
        github: "https://github.com/PragyanD/Pordle",
        demo: "https://pragyand.github.io/Pordle/",
        links: [],
    },
    {
        name: "MNIST Classifier",
        logo: "https://www.vectorlogo.zone/logos/pytorch/pytorch-icon.svg",
        stack: ["Python", "PyTorch", "CNN"],
        description: "CNN trained on handwritten digit recognition achieving high accuracy on the MNIST benchmark dataset.",
        highlight: "Machine Learning",
        color: "#a855f7",
        github: "https://github.com/PragyanD/MNIST-Classifier",
        demo: null,
        links: [],
    },
    {
        name: "HealthSage",
        logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/flutter/flutter-original.svg",
        stack: ["Flutter", "Dart"],
        description: "Cross-platform wellness tracking app built with Flutter. Tracks health metrics and provides personalized insights.",
        highlight: "Mobile App",
        color: "#38bdf8",
        github: "https://github.com/PragyanD/HealthSage",
        demo: null,
        links: [],
    },
];

export default function ProjectsApp({ darkTheme = false }) {
    const t = darkTheme ? {
        containerBg: "#0a0a1e",
        cardBg: "rgba(20,20,40,0.6)",
        cardBorder: "rgba(255,255,255,0.08)",
        cardShadow: "0 2px 8px rgba(0,0,0,0.3)",
        logoBg: "rgba(255,255,255,0.08)",
        title: "rgba(255,255,255,0.9)",
        desc: "rgba(255,255,255,0.6)",
        pillBg: "rgba(255,255,255,0.08)",
        pillText: "rgba(255,255,255,0.6)",
        pillBorder: "rgba(255,255,255,0.12)",
        linkBorder: "rgba(255,255,255,0.15)",
        linkBorderHover: "rgba(255,255,255,0.35)",
        linkText: "rgba(255,255,255,0.7)",
        sectionTitle: "rgba(255,255,255,0.5)",
        repoBg: "rgba(255,255,255,0.03)",
        repoBorder: "rgba(255,255,255,0.08)",
        repoBorderHover: "rgba(255,255,255,0.18)",
        repoName: "rgba(255,255,255,0.9)",
        repoDesc: "rgba(255,255,255,0.5)",
        repoLang: "rgba(255,255,255,0.35)",
        viewAllLink: "#60a5fa",
        viewAllLinkHover: "#93c5fd",
    } : {
        containerBg: "#f7f8fb",
        cardBg: "#fff",
        cardBorder: "#e8e8e8",
        cardShadow: "0 2px 8px rgba(0,0,0,0.06)",
        logoBg: "white",
        title: "#111",
        desc: "#555",
        pillBg: "#f0f0f0",
        pillText: "#555",
        pillBorder: "#e0e0e0",
        linkBorder: "#ccc",
        linkBorderHover: "#999",
        linkText: "#555",
        sectionTitle: "#888",
        repoBg: "#f5f5f5",
        repoBorder: "#e0e0e0",
        repoBorderHover: "#ccc",
        repoName: "#111",
        repoDesc: "#666",
        repoLang: "#999",
        viewAllLink: "#2563eb",
        viewAllLinkHover: "#1d4ed8",
    };

    return (
        <div className="w-full h-full overflow-y-auto os-scroll p-8" style={{ background: t.containerBg }}>
            <div className="grid grid-cols-2 gap-6">
                {PROJECTS.map((project) => (
                    <div
                        key={project.name}
                        className="flex flex-col p-6 rounded-xl transition-all"
                        style={{
                            background: t.cardBg,
                            border: `1px solid ${t.cardBorder}`,
                            boxShadow: t.cardShadow,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `0 6px 24px ${project.color}22`;
                            e.currentTarget.style.borderColor = `${project.color}44`;
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = t.cardShadow;
                            e.currentTarget.style.borderColor = t.cardBorder;
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                            <div
                                className="flex items-center justify-center flex-shrink-0 rounded-lg text-xl overflow-hidden p-1"
                                style={{
                                    width: 44,
                                    height: 44,
                                    background: t.logoBg,
                                    border: `1px solid ${project.color}33`,
                                }}
                            >
                                {project.logo ? (
                                    <img
                                        src={project.logo}
                                        alt={project.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.insertAdjacentHTML('afterend', '<span style="font-size:20px">📦</span>'); }}
                                    />
                                ) : (
                                    project.icon
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold leading-tight" style={{ color: t.title }}>{project.name}</h3>
                                <span
                                    className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                                    style={{ background: `${project.color}18`, color: project.color, border: `1px solid ${project.color}33` }}
                                >
                                    {project.highlight}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs leading-relaxed flex-1 mb-3" style={{ color: t.desc }}>
                            {project.description}
                        </p>

                        {/* Stack */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {project.stack.map((s) => (
                                <span key={s} className="text-xs px-1.5 py-0.5 rounded font-mono"
                                    style={{ background: t.pillBg, color: t.pillText, border: `1px solid ${t.pillBorder}` }}>
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

                        {/* GitHub / Demo links */}
                        {(project.github || project.demo) && (
                            <div className="flex gap-2 mt-3">
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                                       className="text-xs px-2 py-1 rounded-lg transition-colors"
                                       style={{ border: `1px solid ${t.linkBorder}`, color: t.linkText }}
                                       onMouseEnter={e => e.currentTarget.style.borderColor = t.linkBorderHover}
                                       onMouseLeave={e => e.currentTarget.style.borderColor = t.linkBorder}>
                                        GitHub →
                                    </a>
                                )}
                                {project.demo && (
                                    <a href={project.demo} target="_blank" rel="noopener noreferrer"
                                       className="text-xs px-2 py-1 rounded-lg transition-colors"
                                       style={{ background: 'rgba(37,99,235,0.8)', color: '#fff' }}>
                                        Live Demo →
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* GitHub Repositories */}
            <div className="mt-6 px-0 pb-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: t.sectionTitle }}>On GitHub</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { name: 'PragyanD.github.io', desc: 'This portfolio — desktop OS built with Next.js & React', lang: 'JavaScript' },
                        { name: 'scene-recognition', desc: 'CNN-based scene recognition achieving 93% accuracy', lang: 'Python' },
                    ].map(repo => (
                        <a
                            key={repo.name}
                            href={`https://github.com/PragyanD/${repo.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl transition-colors"
                            style={{ border: `1px solid ${t.repoBorder}`, background: t.repoBg }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = t.repoBorderHover}
                            onMouseLeave={e => e.currentTarget.style.borderColor = t.repoBorder}
                        >
                            <p className="text-xs font-semibold truncate" style={{ color: t.repoName }}>{repo.name}</p>
                            <p className="text-xs mt-1 leading-tight line-clamp-2" style={{ color: t.repoDesc }}>{repo.desc}</p>
                            <p className="text-xs mt-2" style={{ color: t.repoLang }}>● {repo.lang}</p>
                        </a>
                    ))}
                </div>
                <a
                    href="https://github.com/PragyanD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-center text-xs transition-colors"
                    style={{ color: t.viewAllLink }}
                    onMouseEnter={e => e.currentTarget.style.color = t.viewAllLinkHover}
                    onMouseLeave={e => e.currentTarget.style.color = t.viewAllLink}
                >
                    View all repositories →
                </a>
            </div>
        </div>
    );
}
