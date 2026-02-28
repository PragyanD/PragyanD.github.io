import { useState, useRef, useEffect } from 'react';

const FILES = {
    'bio.txt': 'I am Pragyan, a Software Engineer passionate about building cool desktop simulations.',
    'projects.lnk': 'Pointing to: Scene Recognition AI, Proton Bot, BISS Encryption, Apache AGE.',
    'contact.cfg': 'LinkedIn: linkedin.com/in/daspragyan/\nGitHub: pragyanD\nStatus: Online',
};

const NEOFETCH = `
  ██████╗ ██████╗  ██████╗ ███████╗    OS: PDOS 2.0.26-release
  ██╔══██╗██╔══██╗██╔═══██╗██╔════╝    Host: Pragyan Labs
  ██████╔╝██║  ██║██║   ██║███████╗    Kernel: v2.0.26
  ██╔═══╝ ██║  ██║██║   ██║╚════██║    Shell: pdsh 1.0
  ██║     ██████╔╝╚██████╔╝███████║    Resolution: ${typeof window !== 'undefined' ? window.innerWidth : 1920}x${typeof window !== 'undefined' ? window.innerHeight : 1080}
  ╚═╝     ╚═════╝  ╚═════╝ ╚══════╝    CPU: Pragyan Core™ i9 @ 5.2GHz
                                        Memory: 65536MB
                                        Languages: Python Java C/C++ JS
`.trim();

export default function TerminalApp() {
    const [history, setHistory] = useState([
        { type: 'output', content: 'Welcome to PDOS Terminal v1.0.0' },
        { type: 'output', content: 'Type "help" to see available commands.' },
    ]);
    const [input, setInput] = useState('');
    const [cmdHistory, setCmdHistory] = useState([]);
    const [historyIdx, setHistoryIdx] = useState(-1);
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (cmd) => {
        const fullCmd = cmd.trim();
        if (!fullCmd) return;
        const [base, ...args] = fullCmd.toLowerCase().split(' ');

        setCmdHistory(prev => [fullCmd, ...prev]);
        setHistoryIdx(-1);

        let output = '';

        switch (base) {
            case 'help':
                output = 'Available commands:\n  ls · pwd · cat · cd · echo · date · uname\n  whoami · neofetch · history · clear\n  sudo · win · hack · make';
                break;
            case 'ls':
                output = Object.keys(FILES).join('  ');
                break;
            case 'pwd':
                output = '/Users/pragyan/desktop';
                break;
            case 'cat': {
                const file = args[0];
                if (!file) {
                    output = 'Usage: cat [filename]';
                } else if (FILES[file]) {
                    output = FILES[file];
                } else {
                    output = `cat: ${file}: No such file or directory`;
                }
                break;
            }
            case 'cd':
                output = 'Permission Denied: You are already at peak performance.';
                break;
            case 'echo':
                output = args.join(' ') || '';
                break;
            case 'date':
                output = new Date().toString();
                break;
            case 'uname':
                output = 'PDOS 2.0.26-release x86_64 GNU/Linux';
                break;
            case 'whoami':
                output = 'pragyan';
                break;
            case 'neofetch':
                output = NEOFETCH;
                break;
            case 'history':
                output = cmdHistory.length
                    ? [...cmdHistory].reverse().map((c, i) => `  ${i + 1}  ${c}`).join('\n')
                    : 'No history yet.';
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
                output = `pdsh: command not found: ${base}`;
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
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setCmdHistory(prev => {
                const next = Math.min(historyIdx + 1, prev.length - 1);
                setHistoryIdx(next);
                if (prev[next] !== undefined) setInput(prev[next]);
                return prev;
            });
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = Math.max(historyIdx - 1, -1);
            setHistoryIdx(next);
            setInput(next === -1 ? '' : cmdHistory[next] ?? '');
        }
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full bg-[#0c0c0c] text-[#cccccc] font-mono p-4 overflow-y-auto overflow-x-auto os-scroll"
            style={{ fontSize: '13px', lineHeight: '1.5' }}
            onClick={() => document.getElementById('terminal-input').focus()}
        >
            {history.map((line, i) => (
                <pre key={i} className={`m-0 font-mono whitespace-pre${line.type === 'input' ? ' text-white font-bold' : ''}`}>
                    {line.content}
                </pre>
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
