import Image from "next/image";
import profilePic from "../../public/profilePic.jpg";

const SKILLS = [
    { category: "Languages", items: ["Python", "C", "C++", "JavaScript", "Java", "SQL", "Bash"] },
    { category: "Frameworks", items: ["React.js", "Node.js", "Flask", "PyTorch", "TensorFlow"] },
    { category: "Tools", items: ["Git", "Linux", "Docker", "AWS", "FFmpeg"] },
    { category: "Competencies", items: ["System Design", "Distributed Systems", "API Dev", "CI/CD", "ML"] },
];

const COLORS = ["#0078d4", "#34c759", "#febc2e", "#ff453a"];

export default function AboutApp({ darkTheme = false }) {
    const t = darkTheme ? {
        containerBg: "#0a0a1e",
        heroBorder: "1px solid rgba(255,255,255,0.08)",
        bioText: "rgba(255,255,255,0.75)",
        cardBg: "rgba(20,20,40,0.6)",
        cardShadow: "0 1px 4px rgba(0,0,0,0.3)",
    } : {
        containerBg: "#f7f8fb",
        heroBorder: "1px solid #e0e0e0",
        bioText: "#444",
        cardBg: "#fff",
        cardShadow: "0 1px 4px rgba(0,0,0,0.06)",
    };

    return (
        <div className="w-full h-full overflow-y-auto os-scroll" style={{ background: t.containerBg }}>
            {/* Hero */}
            <div
                className="flex items-center gap-6 p-8"
                style={{
                    background: "linear-gradient(135deg, #0a0a1e 0%, #1a1a35 50%, #0d1b3e 100%)",
                    borderBottom: t.heroBorder,
                }}
            >
                <div
                    className="rounded-full overflow-hidden flex-shrink-0"
                    style={{
                        width: 90,
                        height: 90,
                        border: "3px solid rgba(0,120,212,0.8)",
                        boxShadow: "0 0 24px rgba(0,120,212,0.5)",
                    }}
                >
                    <Image src={profilePic} alt="Pragyan Das" width={90} height={90} style={{ objectFit: "cover" }} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Pragyan Das</h1>
                    <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>Software Engineer</p>
                    <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                        Madison, WI → Elgin, IL → Bengaluru, India
                    </p>
                    <div className="flex gap-3 mt-3">
                        <a href="https://github.com/PragyanD" target="_blank" rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-md font-medium transition-all"
                            style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}>
                            ⌥ GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/daspragyan" target="_blank" rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-md font-medium transition-all"
                            style={{ background: "rgba(0,120,212,0.3)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(0,120,212,0.5)" }}>
                            in LinkedIn
                        </a>
                        <a href="mailto:pragyan0506@gmail.com"
                            className="text-xs px-3 py-1.5 rounded-md font-medium"
                            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            ✉ Email
                        </a>
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
                {/* Impact metrics */}
                <div className="grid grid-cols-2 gap-2 my-4">
                    {[
                        { value: '93%', label: 'Model accuracy' },
                        { value: '<100ms', label: 'Video pipeline latency' },
                        { value: '40%', label: 'QA cycle reduction' },
                        { value: '15%', label: 'Matching improvement' },
                    ].map(({ value, label }) => (
                        <div key={label} className="p-3 rounded-xl text-center"
                             style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <p className="text-base font-bold text-blue-400">{value}</p>
                            <p className="text-[10px] text-white/50 mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
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
                <p className="text-xs mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Note: Post-graduation (Jan–Mar 2023): Focused on open-source contributions and systems
                    study while preparing for industry roles before joining Synkriom in April 2023.
                </p>
            </div>

            {/* Skills grid */}
            <div className="px-8 pb-8 grid grid-cols-2 gap-4">
                {SKILLS.map(({ category, items }, i) => (
                    <div
                        key={category}
                        className="p-4 rounded-lg"
                        style={{ background: t.cardBg, border: `1px solid ${COLORS[i]}33`, boxShadow: t.cardShadow, transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease" }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${COLORS[i]}22`; e.currentTarget.style.borderColor = `${COLORS[i]}55`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = t.cardShadow; e.currentTarget.style.borderColor = `${COLORS[i]}33`; }}
                    >
                        <p className="text-xs font-semibold mb-2.5" style={{ color: COLORS[i], textTransform: "uppercase", letterSpacing: "0.07em" }}>
                            {category}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {items.map((item) => (
                                <span key={item} className="text-xs px-2 py-0.5 rounded-full"
                                    style={{ background: `${COLORS[i]}18`, color: COLORS[i], border: `1px solid ${COLORS[i]}33` }}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Certifications */}
            <div className="px-8 pb-8">
                <div className="mt-4">
                    <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Certifications</h3>
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,153,0,0.1)', border: '1px solid rgba(255,153,0,0.25)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,153,0,0.2)' }}>
                            <span className="text-sm font-bold" style={{ color: '#FF9900' }}>AWS</span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-white/90">AWS Certified Cloud Practitioner</p>
                            <p className="text-[10px] text-white/50">Amazon Web Services · 2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
