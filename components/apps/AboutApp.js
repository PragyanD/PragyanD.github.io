import Image from "next/image";
import profilePic from "../../public/profilePic.jpg";

const SKILLS = [
    { category: "Languages", items: ["Python", "C", "C++", "JavaScript", "Java", "SQL", "Bash"] },
    { category: "Frameworks", items: ["React.js", "Node.js", "Flask", "PyTorch", "TensorFlow"] },
    { category: "Tools", items: ["Git", "Linux", "Docker", "AWS", "FFmpeg"] },
    { category: "Competencies", items: ["System Design", "Distributed Systems", "API Dev", "CI/CD", "ML"] },
];

const COLORS = ["#0078d4", "#34c759", "#febc2e", "#ff453a"];

export default function AboutApp() {
    return (
        <div className="w-full h-full overflow-y-auto os-scroll" style={{ background: "#f7f8fb" }}>
            {/* Hero */}
            <div
                className="flex items-center gap-6 p-8"
                style={{
                    background: "linear-gradient(135deg, #0a0a1e 0%, #1a1a35 50%, #0d1b3e 100%)",
                    borderBottom: "1px solid #e0e0e0",
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
                <p className="text-sm leading-relaxed" style={{ color: "#444" }}>
                    I&apos;m a software engineer who loves building systems that matter — from low-latency video pipelines to
                    distributed ML platforms. I graduated from UW-Madison and have shipped production code
                    across broadcast infrastructure, machine learning, and graph databases.
                </p>
            </div>

            {/* Skills grid */}
            <div className="px-8 pb-8 grid grid-cols-2 gap-4">
                {SKILLS.map(({ category, items }, i) => (
                    <div key={category} className="p-4 rounded-lg" style={{ background: "#fff", border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
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
        </div>
    );
}
