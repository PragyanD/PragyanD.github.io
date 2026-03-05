export default function FlappyApp({ darkTheme = false }) {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between px-3 py-1 bg-gray-800 text-gray-300 text-xs">
                <span>FlappyAI — NEAT Neural Network</span>
                <a
                    href="https://pragyand.github.io/FlappyAi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                >
                    Open in new tab ↗
                </a>
            </div>
            <iframe
                src="https://pragyand.github.io/FlappyAi/"
                className="flex-1 w-full border-0"
                title="FlappyAI - NEAT Algorithm"
                sandbox="allow-scripts allow-same-origin"
            />
        </div>
    );
}
