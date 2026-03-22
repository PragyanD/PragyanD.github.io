import { useState, useRef, useEffect, useCallback } from "react";

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
        details: {
            challenge: "Scene recognition requires understanding complex spatial relationships and contextual cues across 100+ scene categories, where naive models plateau around 70% accuracy.",
            approach: "Built a CNN pipeline with aggressive data augmentation (random crops, flips, color jitter), batch normalization for training stability, and cosine annealing learning rate scheduling to escape local minima.",
            impact: "Achieved 93% top-5 accuracy on the MiniPlaces benchmark, significantly outperforming the baseline model through systematic hyperparameter optimization.",
        },
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
        details: {
            challenge: "Discord servers needed a single bot to handle moderation, music streaming, and member verification without relying on multiple third-party bots with conflicting permissions.",
            approach: "Designed an event-driven Node.js architecture with FFmpeg audio pipelines for low-latency YouTube streaming and a role-based verification system for new member onboarding.",
            impact: "Deployed across multiple servers, consolidating 3+ separate bots into one reliable service with real-time audio processing and automated server management.",
        },
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
        details: {
            challenge: "DTV Innovations required BISS encryption support for live broadcast transport streams, a capability not natively available in the open-source TSDuck toolkit.",
            approach: "Implemented BISS-1, BISS-E, and BISS-CA encryption modes in C, integrating with TSDuck's plugin architecture and conforming to DVB/ETSI standards for real-time transport stream scrambling.",
            impact: "Delivered a production-grade encryption patch adopted by DTV Innovations for their commercial broadcast infrastructure, enabling compliant real-time video scrambling.",
        },
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
        details: {
            challenge: "Apache AGE needed expanded Cypher query support and had unresolved SQL injection vectors in its query translation layer between Cypher and PostgreSQL.",
            approach: "Implemented new Cypher parsing functions in C, added graph traversal operators, and audited the query translation pipeline to identify and patch injection vulnerabilities.",
            impact: "Merged contributions to an Apache Foundation project used by thousands of developers, hardening security and extending query language coverage for the graph database extension.",
        },
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
        details: {
            challenge: "Traditional portfolio sites feel static and forgettable. The goal was to create an immersive, memorable experience that showcases both design sensibility and engineering skill.",
            approach: "Built a full desktop OS simulation with draggable/resizable windows, a taskbar, spotlight search, boot sequence, and multiple windowed apps — all in Next.js with Tailwind CSS.",
            impact: "A fully interactive portfolio OS that stands out from conventional sites, featuring real window management, theme switching, and a polished user experience deployed via GitHub Pages.",
        },
    },
    {
        name: "FlappyAI",
        logo: null,
        icon: "\uD83D\uDC26",
        stack: ["JavaScript", "NEAT", "HTML Canvas"],
        description: "NEAT algorithm that evolves a neural network to play Flappy Bird optimally. Goes from zero to perfect play in ~20 generations.",
        highlight: "Neuroevolution",
        color: "#a855f7",
        github: "https://github.com/PragyanD/FlappyAI",
        demo: null,
        links: [],
        details: {
            challenge: "Training a neural network to play Flappy Bird without any labeled data or reward shaping — relying purely on evolutionary strategies to discover optimal play.",
            approach: "Implemented the NEAT (NeuroEvolution of Augmenting Topologies) algorithm in JavaScript, evolving both network weights and topology through speciation and crossover.",
            impact: "Agents evolve from random flailing to perfect, indefinite play in approximately 20 generations, demonstrating the power of evolutionary approaches over traditional RL for simple control tasks.",
        },
    },
    {
        name: "Pordle",
        logo: null,
        icon: "\uD83D\uDFE9",
        stack: ["HTML", "CSS", "JavaScript"],
        description: "A faithful Wordle clone built with vanilla HTML/CSS/JS. Features daily words, color-coded feedback, and on-screen keyboard.",
        highlight: "Web Game",
        color: "#0078d4",
        github: "https://github.com/PragyanD/Pordle",
        demo: "https://pragyand.github.io/Pordle/",
        links: [],
        details: {
            challenge: "Recreating the addictive Wordle gameplay loop with no frameworks — just vanilla web technologies — while keeping the daily word sync and keyboard interaction faithful to the original.",
            approach: "Built with pure HTML/CSS/JS using a deterministic daily word algorithm, CSS grid for the letter board, and event listeners for both physical and on-screen keyboard input.",
            impact: "A lightweight, framework-free web game with daily word rotation and full keyboard support, playable instantly at a static URL with zero load time.",
        },
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
        details: {
            challenge: "Building a robust digit classifier that generalizes well across varied handwriting styles in the MNIST benchmark while keeping the architecture efficient.",
            approach: "Designed a convolutional neural network with dropout regularization and optimized the training loop with learning rate scheduling in PyTorch.",
            impact: "Achieved high classification accuracy on the MNIST test set, serving as a foundational deep learning project demonstrating CNN architecture design and training best practices.",
        },
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
        details: {
            challenge: "Health tracking apps often require separate iOS and Android codebases, leading to inconsistent experiences and doubled development effort.",
            approach: "Built a unified cross-platform app with Flutter, using Dart for shared business logic and Flutter widgets for a consistent, native-feeling UI across both platforms.",
            impact: "A single codebase delivering a polished wellness tracking experience on both iOS and Android, with personalized health insights and metric visualization.",
        },
    },
];

function ProjectCard({ project, t }) {
    const [expanded, setExpanded] = useState(false);
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);

    const measureHeight = useCallback(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, []);

    useEffect(() => {
        measureHeight();
    }, [expanded, measureHeight]);

    return (
        <div
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
                            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.insertAdjacentHTML('afterend', '<span style="font-size:20px">\uD83D\uDCE6</span>'); }}
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

            {/* Expandable Case Study */}
            {project.details && (
                <>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all self-start mb-1"
                        style={{
                            background: expanded ? `${project.color}22` : `${project.color}10`,
                            color: project.color,
                            border: `1px solid ${project.color}${expanded ? '44' : '22'}`,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${project.color}30`;
                            e.currentTarget.style.borderColor = `${project.color}55`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = expanded ? `${project.color}22` : `${project.color}10`;
                            e.currentTarget.style.borderColor = `${project.color}${expanded ? '44' : '22'}`;
                        }}
                    >
                        {expanded ? "Show Less" : "Learn More"} {expanded ? "\u25B4" : "\u25BE"}
                    </button>
                    <div
                        style={{
                            maxHeight: expanded ? contentHeight : 0,
                            opacity: expanded ? 1 : 0,
                            overflow: "hidden",
                            transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
                        }}
                    >
                        <div ref={contentRef} className="pt-3">
                            <div
                                className="rounded-lg p-4 space-y-3"
                                style={{
                                    background: t.detailBg,
                                    border: `1px solid ${project.color}20`,
                                }}
                            >
                                {[
                                    { label: "Challenge", text: project.details.challenge },
                                    { label: "Approach", text: project.details.approach },
                                    { label: "Impact", text: project.details.impact },
                                ].map((section) => (
                                    <div key={section.label}>
                                        <p className="text-xs font-semibold mb-1" style={{ color: project.color }}>
                                            {section.label}
                                        </p>
                                        <p className="text-xs leading-relaxed" style={{ color: t.desc }}>
                                            {section.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Links */}
            {project.links.length > 0 && (
                <div className="flex gap-2">
                    {project.links.map((link) => (
                        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-md font-medium transition-all"
                            style={{ background: `${project.color}18`, color: project.color, border: `1px solid ${project.color}33` }}>
                            {"\u2197"} {link.label}
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
                            GitHub {"\u2192"}
                        </a>
                    )}
                    {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer"
                           className="text-xs px-2 py-1 rounded-lg text-white bg-blue-600/80 hover:bg-blue-600 transition-colors">
                            Live Demo {"\u2192"}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

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
        detailBg: "rgba(255,255,255,0.04)",
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
        viewAllLinkHover: "#93bbfd",
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
        detailBg: "#f5f5f7",
        linkBorder: "#d0d0d0",
        linkBorderHover: "#aaa",
        linkText: "#555",
        sectionTitle: "#888",
        repoBg: "#fafafa",
        repoBorder: "#e8e8e8",
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
                    <ProjectCard key={project.name} project={project} t={t} />
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
                            <p className="text-xs mt-2" style={{ color: t.repoLang }}>{"\u25CF"} {repo.lang}</p>
                        </a>
                    ))}
                </div>
                <a
                    href="https://github.com/PragyanD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-center text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                    View all repositories {"\u2192"}
                </a>
            </div>
        </div>
    );
}
