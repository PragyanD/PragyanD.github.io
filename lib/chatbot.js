/**
 * Rule-based portfolio chatbot for the Terminal app.
 * Matches user input against keyword patterns and returns a relevant response.
 */

const QA = [
    {
        patterns: [/skill/i, /tech\s*stack/i, /technolog/i, /language/i, /framework/i, /tool/i, /what.*(?:use|know|work with)/i],
        response: "I work with Python, C/C++, JavaScript, Java, SQL, and Bash. On the frameworks side, I use React, Node.js, Flask, PyTorch, and TensorFlow. My toolbelt includes Git, Linux, Docker, AWS, and FFmpeg.",
    },
    {
        patterns: [/experience/i, /work\s*history/i, /career/i, /job/i, /where.*work/i, /employ/i],
        response: "I've shipped production code across broadcast infrastructure, distributed ML platforms, and graph databases. At DTV Innovations I led the encryption module design for a BISS implementation, and at Synkriom I defined the ML pipeline architecture for a candidate matching system.",
    },
    {
        patterns: [/project/i, /portfolio/i, /built/i, /build/i, /made/i, /create/i],
        response: "Some highlights: Scene Recognition AI (CNN, 93% accuracy), Proton Discord Bot (Node.js + FFmpeg), BISS Encryption for TSDuck, Apache AGE graph database contributions, FlappyAI (neuroevolution), and this portfolio website itself. Type 'cat projects.lnk' for a quick list.",
    },
    {
        patterns: [/edu/i, /school/i, /university/i, /college/i, /degree/i, /study/i, /studied/i, /uw/i, /madison/i],
        response: "I graduated from the University of Wisconsin-Madison. Go Badgers!",
    },
    {
        patterns: [/contact/i, /email/i, /reach/i, /connect/i, /linkedin/i, /github/i, /social/i],
        response: "You can reach me at pragyan0506@gmail.com. Find me on GitHub (PragyanD) or LinkedIn (linkedin.com/in/daspragyan). I'm currently open to opportunities.",
    },
    {
        patterns: [/hobby/i, /hobbies/i, /fun/i, /interest/i, /free\s*time/i, /like.*do/i, /about.*you/i],
        response: "I enjoy building side projects that push my boundaries -- from neuroevolution experiments to this desktop OS portfolio. I'm drawn to systems where the margin for error is genuinely small.",
    },
    {
        patterns: [/locat/i, /where.*(?:live|based|from)/i, /city/i, /country/i],
        response: "I'm based in Bengaluru, India. I'm open to remote or hybrid roles.",
    },
    {
        patterns: [/certif/i, /aws/i, /cloud/i],
        response: "I'm an AWS Certified Cloud Practitioner (2024). I have hands-on experience with AWS services and cloud architecture.",
    },
    {
        patterns: [/hire/i, /avail/i, /open/i, /opportunit/i, /looking/i, /status/i],
        response: "Yes, I'm currently open to opportunities -- both remote and hybrid. Feel free to reach out at pragyan0506@gmail.com or connect on LinkedIn.",
    },
    {
        patterns: [/hello/i, /^hi$/i, /^hey/i, /greet/i, /how.*are/i, /what.*up/i],
        response: "Hey there! I'm Pragyan's portfolio assistant. Ask me about skills, projects, experience, education, or contact info.",
    },
    {
        patterns: [/help/i, /what.*can.*ask/i, /what.*know/i],
        response: "Try asking about: skills, projects, experience, education, certifications, location, contact info, or availability. I'll do my best to answer!",
    },
    {
        patterns: [/name/i, /who/i],
        response: "I'm Pragyan Das -- a software engineer who graduated from UW-Madison. I specialize in systems programming, ML, and full-stack development.",
    },
    {
        patterns: [/ml|machine\s*learn/i, /ai|artificial/i, /deep\s*learn/i, /neural/i, /model/i],
        response: "I've worked on CNN-based scene recognition (93% accuracy on MiniPlaces), an MNIST classifier with PyTorch, FlappyAI using neuroevolution, and an ML pipeline for candidate matching at Synkriom.",
    },
];

const FALLBACK = "I'm not sure about that. Try asking about my skills, projects, experience, or education.";

/**
 * Match user input against the Q&A patterns and return the best response.
 * @param {string} input - The user's question
 * @returns {string} The chatbot's response
 */
export function getResponse(input) {
    if (!input || !input.trim()) {
        return "Ask me anything about Pragyan -- skills, projects, experience, or education.";
    }

    const trimmed = input.trim();

    for (const entry of QA) {
        for (const pattern of entry.patterns) {
            if (pattern.test(trimmed)) {
                return entry.response;
            }
        }
    }

    return FALLBACK;
}
