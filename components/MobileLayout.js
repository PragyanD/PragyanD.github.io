const SKILLS = [
    { category: "Languages", items: ["Python", "C", "C++", "JavaScript", "Java", "SQL", "Bash"], color: "#0078d4" },
    { category: "Frameworks", items: ["React.js", "Node.js", "Flask", "PyTorch", "TensorFlow"], color: "#34c759" },
    { category: "Tools", items: ["Git", "Linux", "Docker", "AWS", "FFmpeg"], color: "#febc2e" },
    { category: "Competencies", items: ["System Design", "Distributed Systems", "API Dev", "CI/CD", "ML"], color: "#a855f7" },
];

const EXPERIENCES = [
    {
        company: "DTV Innovations",
        title: "Software Engineer",
        location: "Elgin, IL",
        duration: "Apr 2024 – Jun 2025",
        highlights: [
            "Low-latency video encoding pipeline (VAAPI, FFmpeg, Intel Quick Sync) — sub-100ms broadcast streaming",
            "BISS encryption support (BISS-1/E/CA) via Bouncy Castle & TSDuck — patches merged upstream",
            "Real-time DASH playback monitor in JavaScript — 40% reduction in QA cycle time",
            "Java-C JNI interoperability layer + modular menu framework (60% less code duplication)",
        ],
        stack: ["C", "Java", "JavaScript", "FFmpeg", "JNI"],
        color: "#34c759",
    },
    {
        company: "Synkriom",
        title: "Software Engineer",
        location: "Piscataway, NJ",
        duration: "Apr 2023 – Apr 2024",
        highlights: [
            "Dockerized microservices with Flask/Python — RESTful APIs with rate limiting & monitoring",
            "OpenAI Whisper + LangChain pipeline converting interview recordings to structured assessments",
            "GPT-based recruiting platform with semantic embeddings — 15% improvement in matching accuracy",
        ],
        stack: ["Python", "Flask", "Docker", "LangChain", "OpenAI"],
        color: "#0078d4",
    },
    {
        company: "SKAI Worldwide",
        title: "Software Engineer Intern",
        location: "San Francisco, CA",
        duration: "Sep 2022 – Dec 2022",
        highlights: [
            "Contributed to Apache AGE — open-source PostgreSQL graph extension (C implementation)",
            "Implemented Cypher query parsing and graph traversal algorithms for scalable operations",
            "Mitigated SQL/Cypher injection vulnerabilities in Go and Python drivers",
        ],
        stack: ["C", "PostgreSQL", "Go", "Python"],
        color: "#febc2e",
    },
];

const PROJECTS = [
    {
        name: "Scene Recognition AI",
        stack: ["PyTorch", "Python", "Deep Learning"],
        description: "CNN-based scene classifier achieving 93% accuracy on MiniPlaces dataset. Optimized via hyperparameter tuning, data augmentation, and batch normalization.",
        highlight: "Machine Learning",
        color: "#a855f7",
        github: "https://github.com/PragyanD/scene-recognition",
    },
    {
        name: "BISS Encryption (TSDuck)",
        stack: ["C", "Bouncy Castle", "DVB/ETSI", "TSDuck"],
        description: "Proprietary patch for DTV Innovations adding BISS-1/E/CA encryption support for real-time video scrambling.",
        highlight: "Multimedia Encryption",
        color: "#34c759",
        github: null,
    },
    {
        name: "Apache AGE Contributions",
        stack: ["C", "PostgreSQL", "Go", "Python"],
        description: "Contributed to Apache AGE graph database extension. Implemented Cypher query parsing, graph traversal, and mitigated SQL injection vulnerabilities.",
        highlight: "Graph Databases",
        color: "#0078d4",
        github: null,
    },
    {
        name: "Proton — Discord Bot",
        stack: ["Node.js", "JavaScript", "FFmpeg", "YTDL"],
        description: "Multipurpose Discord bot for server admin, music playback, and user verification with real-time audio processing.",
        highlight: "Distributed Systems",
        color: "#38bdf8",
        github: null,
    },
    {
        name: "Portfolio — This Website",
        stack: ["Next.js", "React", "Tailwind CSS"],
        description: "Interactive portfolio styled as a desktop OS, complete with a boot sequence, windowed apps, and a dark theme.",
        highlight: "Web Development",
        color: "#38bdf8",
        github: "https://github.com/PragyanD/PragyanD.github.io",
        demo: "https://pragyand.github.io",
    },
    {
        name: "FlappyAI",
        stack: ["JavaScript", "NEAT", "HTML Canvas"],
        description: "NEAT algorithm that evolves a neural network to play Flappy Bird optimally. Goes from zero to perfect play in ~20 generations.",
        highlight: "Neuroevolution",
        color: "#a855f7",
        github: "https://github.com/PragyanD/FlappyAI",
    },
];

export default function MobileLayout() {
    return (
        <div className="min-h-screen bg-[#0a0a1e] text-white">
            {/* Header */}
            <header
                className="px-6 pt-12 pb-8"
                style={{
                    background: "linear-gradient(135deg, #0a0a1e 0%, #1a1a35 50%, #0d1b3e 100%)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-5 w-fit"
                    style={{ background: "rgba(52,199,89,0.15)", border: "1px solid rgba(52,199,89,0.3)" }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 font-medium">Open to opportunities</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Pragyan Das</h1>
                <p className="text-base text-white/60 mt-1 font-medium">Software Engineer</p>
                <p className="text-xs text-white/40 mt-2 flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    Bengaluru, India
                </p>

                {/* Quick links */}
                <div className="flex flex-wrap gap-2 mt-5">
                    <a href="/Pragyans_Resume.pdf" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium bg-blue-600 text-white">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                        Resume
                    </a>
                    <a href="https://github.com/PragyanD" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium"
                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                        <svg width="13" height="13" viewBox="0 0 98 96" fill="currentColor"><path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/></svg>
                        GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/daspragyan" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium"
                        style={{ background: "rgba(0,120,212,0.3)", border: "1px solid rgba(0,120,212,0.5)" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                        LinkedIn
                    </a>
                    <a href="mailto:pragyan0506@gmail.com"
                        className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium"
                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        Email
                    </a>
                </div>
            </header>

            {/* About */}
            <section className="px-6 py-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">About</h2>
                <p className="text-sm leading-relaxed text-white/70">
                    Software engineer drawn to systems where the margin for error is genuinely small.
                    UW-Madison graduate with production experience across broadcast infrastructure,
                    distributed ML platforms, and graph databases. Led the encryption module design
                    for DTV&apos;s BISS implementation and defined the ML pipeline architecture for
                    Synkriom&apos;s candidate matching system. Currently looking for the next chance
                    to build something that matters.
                </p>
            </section>

            {/* Experience */}
            <section className="px-6 py-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Experience</h2>
                <div className="space-y-5">
                    {EXPERIENCES.map((exp) => (
                        <div
                            key={exp.company}
                            className="rounded-xl p-5"
                            style={{
                                background: "rgba(20,20,40,0.6)",
                                border: `1px solid ${exp.color}33`,
                            }}
                        >
                            <div className="flex items-start justify-between mb-1">
                                <div>
                                    <h3 className="text-sm font-bold text-white/90">{exp.company}</h3>
                                    <p className="text-xs text-white/50 mt-0.5">{exp.title}</p>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-3"
                                    style={{ background: `${exp.color}18`, color: exp.color, border: `1px solid ${exp.color}33` }}>
                                    {exp.duration}
                                </span>
                            </div>
                            <p className="text-xs text-white/40 mb-3">{exp.location}</p>

                            <ul className="space-y-2 mb-3">
                                {exp.highlights.map((h, i) => (
                                    <li key={i} className="flex gap-2 text-xs text-white/65 leading-relaxed">
                                        <span style={{ color: exp.color, flexShrink: 0 }}>&#9656;</span>
                                        <span>{h}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap gap-1.5">
                                {exp.stack.map((s) => (
                                    <span key={s} className="text-xs px-2 py-0.5 rounded font-mono"
                                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Education */}
                    <div
                        className="rounded-xl p-5"
                        style={{
                            background: "rgba(20,20,40,0.6)",
                            border: "1px solid rgba(197,5,12,0.3)",
                        }}
                    >
                        <div className="flex items-start justify-between mb-1">
                            <div>
                                <h3 className="text-sm font-bold text-white/90">UW-Madison</h3>
                                <p className="text-xs text-white/50 mt-0.5">B.S. Computer Science</p>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-3"
                                style={{ background: "rgba(197,5,12,0.15)", color: "#c5050c", border: "1px solid rgba(197,5,12,0.3)" }}>
                                Aug 2019 – Dec 2022
                            </span>
                        </div>
                        <p className="text-xs text-white/40">Madison, WI</p>
                    </div>
                </div>
            </section>

            {/* Skills */}
            <section className="px-6 py-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Skills</h2>
                <div className="grid grid-cols-2 gap-3">
                    {SKILLS.map(({ category, items, color }) => (
                        <div
                            key={category}
                            className="p-4 rounded-xl"
                            style={{
                                background: "rgba(20,20,40,0.6)",
                                border: `1px solid ${color}33`,
                            }}
                        >
                            <h3 className="text-xs font-semibold mb-2.5 uppercase tracking-wider" style={{ color }}>
                                {category}
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {items.map((item) => (
                                    <span key={item} className="text-xs px-2 py-0.5 rounded-full"
                                        style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Certification */}
                <div className="mt-4 flex items-center gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(255,153,0,0.1)", border: "1px solid rgba(255,153,0,0.25)" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,153,0,0.2)" }}>
                        <svg width="20" height="12" viewBox="0 0 304 182" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M86.4 66.4c0 3.7.4 6.7 1.1 8.9.8 2.2 1.8 4.6 3.2 7.2.5.8.7 1.6.7 2.3 0 1-.6 2-1.9 3l-6.3 4.2c-.9.6-1.8.9-2.6.9-1 0-2-.5-3-1.4-1.4-1.5-2.6-3.1-3.6-4.7-1-1.7-2-3.6-3.1-5.9-7.8 9.2-17.6 13.8-29.4 13.8-8.4 0-15.1-2.4-20-7.2-4.9-4.8-7.4-11.2-7.4-19.2 0-8.5 3-15.4 9.1-20.6 6.1-5.2 14.2-7.8 24.5-7.8 3.4 0 6.9.3 10.6.8 3.7.5 7.5 1.3 11.5 2.2v-7.3c0-7.6-1.6-12.9-4.7-16-3.2-3.1-8.6-4.6-16.3-4.6-3.5 0-7.1.4-10.8 1.3-3.7.9-7.3 2-10.8 3.4-1.6.7-2.8 1.1-3.5 1.3-.7.2-1.2.3-1.6.3-1.4 0-2.1-1-2.1-3.1v-4.9c0-1.6.2-2.8.7-3.5.5-.7 1.4-1.4 2.8-2.1 3.5-1.8 7.7-3.3 12.6-4.5 4.9-1.3 10.1-1.9 15.6-1.9 11.9 0 20.6 2.7 26.2 8.1 5.5 5.4 8.3 13.6 8.3 24.6v32.4zM45.8 81.6c3.3 0 6.7-.6 10.3-1.8 3.6-1.2 6.8-3.4 9.5-6.4 1.6-1.9 2.8-4 3.4-6.4.6-2.4 1-5.3 1-8.7v-4.2c-2.9-.7-6-1.3-9.2-1.7-3.2-.4-6.3-.6-9.4-.6-6.7 0-11.6 1.3-14.9 4-3.3 2.7-4.9 6.5-4.9 11.5 0 4.7 1.2 8.2 3.7 10.6 2.4 2.5 5.9 3.7 10.5 3.7zm80.3 10.8c-1.8 0-3-.3-3.8-1-.8-.6-1.5-2-2.1-3.9L96.7 10.2c-.6-2-.9-3.3-.9-4 0-1.6.8-2.5 2.4-2.5h9.8c1.9 0 3.2.3 3.9 1 .8.6 1.4 2 2 3.9l16.8 66.2 15.6-66.2c.5-2 1.1-3.3 1.9-3.9.8-.6 2.2-1 4-1h8c1.9 0 3.2.3 4 1 .8.6 1.5 2 1.9 3.9l15.8 67 17.3-67c.6-2 1.3-3.3 2-3.9.8-.6 2.1-1 3.9-1h9.3c1.6 0 2.5.8 2.5 2.5 0 .5-.1 1-.2 1.6-.1.6-.3 1.4-.7 2.5l-24.1 77.3c-.6 2-1.3 3.3-2.1 3.9-.8.6-2.1 1-3.8 1h-8.6c-1.9 0-3.2-.3-4-1-.8-.7-1.5-2-1.9-4L156 23l-15.4 64.4c-.5 2-1.1 3.3-1.9 4-.8.7-2.2 1-4 1h-8.6zm128.5 2.7c-5.2 0-10.4-.6-15.4-1.8-5-1.2-8.9-2.5-11.5-4-1.6-.9-2.7-1.9-3.1-2.8-.4-.9-.6-1.9-.6-2.8v-5.1c0-2.1.8-3.1 2.3-3.1.6 0 1.2.1 1.8.3.6.2 1.5.6 2.5 1 3.4 1.5 7.1 2.7 11 3.5 4 .8 7.9 1.2 11.9 1.2 6.3 0 11.2-1.1 14.6-3.3 3.4-2.2 5.2-5.4 5.2-9.5 0-2.8-.9-5.1-2.7-7-1.8-1.9-5.2-3.6-10.1-5.2L246 52c-7.3-2.3-12.7-5.7-16-10.2-3.3-4.4-5-9.3-5-14.5 0-4.2.9-7.9 2.7-11.1 1.8-3.2 4.2-6 7.2-8.2 3-2.3 6.4-4 10.4-5.2 4-1.2 8.2-1.7 12.6-1.7 2.2 0 4.5.1 6.7.4 2.3.3 4.4.7 6.5 1.1 2 .5 3.9 1 5.7 1.6 1.8.6 3.2 1.2 4.2 1.8 1.4.8 2.4 1.6 3 2.5.6.8.9 1.8.9 3.3v4.7c0 2.1-.8 3.2-2.3 3.2-.8 0-2.1-.4-3.8-1.2-5.7-2.6-12.1-3.9-19.2-3.9-5.7 0-10.2.9-13.3 2.8-3.1 1.9-4.7 4.8-4.7 8.9 0 2.8 1 5.2 3 7.1 2 1.9 5.7 3.8 11 5.5l14.2 4.5c7.2 2.3 12.4 5.5 15.5 9.6 3.1 4.1 4.6 8.8 4.6 14 0 4.3-.9 8.2-2.6 11.6-1.8 3.4-4.2 6.4-7.3 8.8-3.1 2.5-6.8 4.3-11.1 5.6-4.5 1.4-9.2 2.1-14.3 2.1z" fill="#FF9900"/>
                            <path d="M273.5 143.7c-32.9 24.3-80.7 37.2-121.8 37.2-57.6 0-109.5-21.3-148.7-56.7-3.1-2.8-.3-6.6 3.4-4.4 42.4 24.6 94.7 39.5 148.8 39.5 36.5 0 76.6-7.6 113.5-23.2 5.5-2.5 10.2 3.6 4.8 7.6z" fill="#FF9900"/>
                            <path d="M287.2 128.1c-4.2-5.4-27.8-2.6-38.5-1.3-3.2.4-3.7-2.4-.8-4.5 18.8-13.2 49.7-9.4 53.3-5 3.6 4.5-1 35.4-18.6 50.2-2.7 2.3-5.3 1.1-4.1-1.9 4-9.9 12.9-32.2 8.7-37.5z" fill="#FF9900"/>
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-white/90">AWS Certified Cloud Practitioner</p>
                        <p className="text-xs text-white/50">Amazon Web Services &middot; 2024</p>
                    </div>
                </div>
            </section>

            {/* Projects */}
            <section className="px-6 py-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Projects</h2>
                <div className="space-y-4">
                    {PROJECTS.map((project) => (
                        <div
                            key={project.name}
                            className="rounded-xl p-5"
                            style={{
                                background: "rgba(20,20,40,0.6)",
                                border: `1px solid ${project.color}33`,
                            }}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-sm font-bold text-white/90">{project.name}</h3>
                                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-3"
                                    style={{ background: `${project.color}18`, color: project.color, border: `1px solid ${project.color}33` }}>
                                    {project.highlight}
                                </span>
                            </div>

                            <p className="text-xs text-white/60 leading-relaxed mb-3">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {project.stack.map((s) => (
                                    <span key={s} className="text-xs px-2 py-0.5 rounded font-mono"
                                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                        {s}
                                    </span>
                                ))}
                            </div>

                            {(project.github || project.demo) && (
                                <div className="flex gap-2">
                                    {project.github && (
                                        <a href={project.github} target="_blank" rel="noopener noreferrer"
                                            className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                                            style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>
                                            GitHub &#8594;
                                        </a>
                                    )}
                                    {project.demo && (
                                        <a href={project.demo} target="_blank" rel="noopener noreferrer"
                                            className="text-xs px-3 py-1.5 rounded-lg bg-blue-600/80 text-white">
                                            Live Demo &#8594;
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section className="px-6 py-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Contact</h2>
                <div className="space-y-3">
                    <a href="/Pragyans_Resume.pdf" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-xl text-sm font-medium bg-blue-600 text-white">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                        Download Resume
                    </a>
                    <a href="https://github.com/PragyanD" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-xl text-sm font-medium text-white/80"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <svg width="16" height="16" viewBox="0 0 98 96" fill="currentColor"><path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/></svg>
                        github.com/PragyanD
                    </a>
                    <a href="https://www.linkedin.com/in/daspragyan" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-xl text-sm font-medium text-white/80"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                        linkedin.com/in/daspragyan
                    </a>
                    <a href="mailto:pragyan0506@gmail.com"
                        className="flex items-center gap-3 p-4 rounded-xl text-sm font-medium text-white/80"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        pragyan0506@gmail.com
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-8 text-center">
                <p className="text-xs text-white/30">
                    View the full desktop experience on a larger screen
                </p>
                <p className="text-xs text-white/20 mt-1">
                    PDOS &middot; Built with Next.js & React
                </p>
            </footer>
        </div>
    );
}
