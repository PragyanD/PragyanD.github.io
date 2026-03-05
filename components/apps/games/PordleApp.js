export default function PordleApp({ darkTheme = false }) {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between px-3 py-1 bg-gray-800 text-gray-300 text-xs">
                <span>Pordle — Wordle Clone</span>
                <a
                    href="https://pragyand.github.io/Pordle/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                >
                    Open in new tab ↗
                </a>
            </div>
            <iframe
                src="https://pragyand.github.io/Pordle/"
                className="flex-1 w-full border-0"
                title="Pordle - Wordle Clone"
                sandbox="allow-scripts allow-same-origin allow-forms"
            />
        </div>
    );
}
