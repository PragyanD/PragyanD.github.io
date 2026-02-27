import { useState, useRef, useEffect } from 'react';

const FILES = {
    'bio.txt': 'I am Pragyan, a Software Engineer passionate about building cool desk-top simulations.',
    'projects.lnk': 'Pointing to: Scene Recognition AI, Proton Bot, BISS Encryption, Apache AGE.',
    'contact.cfg': 'Email: pragyan@os.com\nGitHub: pragyanD\nStatus: Online',
};

export default function TerminalApp() {
    const [history, setHistory] = useState([
        { type: 'output', content: 'Welcome to PragyanOS Terminal v1.0.0' },
        { type: 'output', content: 'Type "help" to see available commands.' },
    ]);
    const [input, setInput] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (cmd) => {
        const fullCmd = cmd.trim();
        const [base, ...args] = fullCmd.toLowerCase().split(' ');

        let output = '';

        switch (base) {
            case 'help':
                output = 'Available commands: ls, pwd, cat, cd, sudo, help, clear';
                break;
            case 'ls':
                output = Object.keys(FILES).join('  ');
                break;
            case 'pwd':
                output = '/Users/pragyan/desktop';
                break;
            case 'cat':
                const file = args[0];
                if (!file) {
                    output = 'Usage: cat [filename]';
                } else if (FILES[file]) {
                    output = FILES[file];
                } else {
                    output = `cat: ${file}: No such file or directory`;
                }
                break;
            case 'cd':
                output = 'Permission Denied: You are already at peak performance.';
                break;
            case 'sudo':
                if (args.join(' ') === 'make me a sandwich') {
                    output = 'Coming right up! 🥪';
                } else {
                    output = 'This incident will be reported. (Not really, I trust you).';
                }
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'win':
                output = 'Task failed successfully.';
                break;
            case 'hack':
                output = 'Searching for a 12-digit password... 1-2-3-4-5... Oh wait.';
                break;
            case 'make':
                if (args[0] === 'me' && args[1] === 'a' && args[2] === 'sandwich') {
                    output = 'sudo make me a sandwich.';
                } else {
                    output = 'Command not found. Did you try turning it off and on again?';
                }
                break;
            case '':
                return;
            default:
                output = 'Command not found. Did you try turning it off and on again?';
                break;
        }

        setHistory(prev => [
            ...prev,
            { type: 'input', content: `pragyan@os:~$ ${fullCmd}` },
            { type: 'output', content: output }
        ]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full bg-[#0c0c0c] text-[#cccccc] font-mono p-4 overflow-y-auto os-scroll"
            style={{ fontSize: '13px', lineHeight: '1.5' }}
            onClick={() => document.getElementById('terminal-input').focus()}
        >
            {history.map((line, i) => (
                <div key={i} className={line.type === 'input' ? 'text-white font-bold' : ''}>
                    {line.content}
                </div>
            ))}
            <div className="flex gap-2">
                <span className="text-[#3fc05e] font-bold">pragyan@os:~$</span>
                <input
                    id="terminal-input"
                    autoFocus
                    autoComplete="off"
                    spellCheck="false"
                    className="flex-1 bg-transparent border-none outline-none text-[#cccccc]"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
}
