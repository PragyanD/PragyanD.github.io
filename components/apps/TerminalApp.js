import { useState, useRef, useEffect } from 'react';
import { getResponse } from '../../lib/chatbot';

const COMMANDS = [
    'ask', 'cat', 'cd', 'chat', 'clear', 'curl', 'date', 'echo', 'git', 'hack', 'help',
    'history', 'ls', 'make', 'neofetch', 'npm', 'python', 'python3',
    'pwd', 'rm', 'sudo', 'uname', 'whoami', 'win',
];

const FILES = {
    'bio.txt': 'Software engineer. UW-Madison grad. Based in Bengaluru.',
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

export default function TerminalApp({ onAchievement }) {
    const [history, setHistory] = useState([
        { type: 'output', content: 'Welcome to PDOS Terminal v1.0.0' },
        { type: 'output', content: 'Type "help" to see available commands.' },
    ]);
    const [input, setInput] = useState('');
    const [caret, setCaret] = useState(0);
    const [cmdHistory, setCmdHistory] = useState([]);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const cmdHistoryRef = useRef([]);
    const historyIdxRef = useRef(-1);
    const tabRef = useRef({ candidates: [], idx: -1, prefix: '' });
    const cmdCountRef = useRef(0);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (cmd) => {
        const fullCmd = cmd.trim();
        if (!fullCmd) return;
        const [base, ...args] = fullCmd.toLowerCase().split(' ');

        setCmdHistory(prev => { const next = [fullCmd, ...prev]; cmdHistoryRef.current = next; return next; });
        historyIdxRef.current = -1;

        // Achievement tracking
        cmdCountRef.current += 1;
        if (cmdCountRef.current >= 5 && onAchievement) onAchievement('terminal_user');
        if (base === 'sudo' && onAchievement) onAchievement('hacker');

        let output = '';

        switch (base) {
            case 'help':
                output = 'Available commands:\n  ls · pwd · cat · cd · echo · date · uname\n  whoami · neofetch · history · clear\n  git · npm · rm · curl · python\n  sudo · win · hack · make\n  ask <question> · chat <question>  — portfolio chatbot';
                break;
            case 'ask':
            case 'chat': {
                const question = args.join(' ');
                output = getResponse(question);
                break;
            }
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
                output = 'cd: restricted';
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
                    output = '🥪';
                } else {
                    output = 'Nice try.';
                }
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'win':
                output = 'Task failed successfully.';
                break;
            case 'hack':
                output = 'Connection refused.';
                break;
            case 'make':
                if (args[0] === 'me' && args[1] === 'a' && args[2] === 'sandwich') {
                    output = 'sudo make me a sandwich.';
                } else {
                    output = 'make: *** No rule to make target. Stop.';
                }
                break;
            case 'git': {
                const sub = args[0];
                if (sub === 'blame') {
                    output = [
                        'commit a1b2c3d4 (HEAD -> main, origin/main)',
                        'Author: Unknown Developer <not-me@dev.null>',
                        'Date:   3 years, 2 months ago',
                        '',
                        '    src/everything.js: do not touch this.',
                        '',
                        'Blame: frontend → backend → PM → intern',
                    ].join('\n');
                } else if (sub === 'status') {
                    output = 'On branch main\nYour branch is ahead of schedule by 3 sprints.\n\nnothing to commit, working tree clean';
                } else if (sub === 'commit') {
                    output = 'nothing to commit, working tree clean';
                } else if (sub === 'push') {
                    output = 'error: failed to push some refs\nreason: stakeholders have rejected your changes.';
                } else {
                    output = `git: '${sub || ''}' is not a git command. See 'git --help'.\n\nDid you mean: git gud`;
                }
                break;
            }
            case 'npm': {
                const sub = args[0];
                if (sub === 'install' || sub === 'i') {
                    output = 'npm warn: found 847,293 packages\nnpm warn: 23,847 have vulnerabilities\n\nadded 847,293 packages in 11m\n\n✓ Done. node_modules is now 2.3 GB.';
                } else if (sub === 'audit') {
                    output = 'found 0 vulnerabilities';
                } else if (sub === 'run' && args[1] === 'dev') {
                    output = '▲ Next.js 14.0.0\n- Local: http://localhost:3000\n\nReady in 2.4s ✓';
                } else {
                    output = `npm ERR! Unknown command: "${sub || ''}"`;
                }
                break;
            }
            case 'rm':
                if ((args.includes('-rf') || args.includes('-r')) &&
                    (args.includes('/') || args.includes('*') || args.includes('.'))) {
                    output = 'rm: it is dangerous to operate recursively on \'/\'\nrm: use --no-preserve-root to override this failsafe';
                } else {
                    output = `rm: cannot remove '${args[0] || '?'}': Permission denied`;
                }
                break;
            case 'curl':
                output = 'curl: (7) Failed to connect: connection refused';
                break;
            case 'python':
            case 'python3':
                output = 'Python 3.12.0 (PDOS build, Mar  1 2026)\n>>>\nKeyboardInterrupt';
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

    const syncCaret = () => {
        requestAnimationFrame(() => {
            if (inputRef.current) setCaret(inputRef.current.selectionStart ?? 0);
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const words = input.split(' ');
            const completing = words[words.length - 1];
            const linePrefix = words.slice(0, -1).join(' ');
            const isFirstWord = words.length === 1;

            // Build candidate list (only recompute if not already cycling)
            const tab = tabRef.current;
            if (tab.candidates.length === 0 || tab.prefix !== completing) {
                const pool = isFirstWord ? COMMANDS : Object.keys(FILES);
                const matches = pool.filter(c => c.startsWith(completing));
                if (matches.length === 0) return;
                tab.candidates = matches;
                tab.idx = -1;
                tab.prefix = completing;
            }

            tab.idx = (tab.idx + 1) % tab.candidates.length;
            const completed = tab.candidates[tab.idx];
            const newInput = linePrefix ? `${linePrefix} ${completed}` : completed;
            setInput(newInput);
            setCaret(newInput.length);
            return;
        }

        // Any non-Tab key resets tab cycling
        tabRef.current = { candidates: [], idx: -1, prefix: '' };

        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
            setCaret(0);
            historyIdxRef.current = -1;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const hist = cmdHistoryRef.current;
            const next = Math.min(historyIdxRef.current + 1, hist.length - 1);
            historyIdxRef.current = next;
            if (hist[next] !== undefined) { setInput(hist[next]); setCaret(hist[next].length); }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = Math.max(historyIdxRef.current - 1, -1);
            historyIdxRef.current = next;
            const val = next === -1 ? '' : (cmdHistoryRef.current[next] ?? '');
            setInput(val);
            setCaret(val.length);
        } else {
            syncCaret();
        }
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full bg-[#0c0c0c] text-[#cccccc] font-mono p-4 overflow-y-auto overflow-x-auto os-scroll"
            style={{ fontSize: '13px', lineHeight: '1.5' }}
            onClick={() => inputRef.current?.focus()}
        >
            {history.map((line, i) => (
                <pre key={i} className={`m-0 font-mono whitespace-pre-wrap break-words${line.type === 'input' ? ' text-white font-bold' : ''}`}>
                    {line.content}
                </pre>
            ))}
            <div className="flex gap-2 items-center">
                <span className="text-[#3fc05e] font-bold flex-shrink-0">pragyan@os:~$</span>
                <div className="relative flex-1">
                    {/* Invisible real input — handles all keyboard/selection events */}
                    <input
                        ref={inputRef}
                        autoFocus
                        autoComplete="off"
                        spellCheck="false"
                        className="absolute inset-0 opacity-0 w-full cursor-default"
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setCaret(e.target.selectionStart ?? 0); }}
                        onKeyDown={handleKeyDown}
                        onKeyUp={syncCaret}
                        onSelect={syncCaret}
                        onClick={syncCaret}
                    />
                    {/* Visual text with cursor at caret position */}
                    <span className="whitespace-pre text-[#cccccc]">{input.slice(0, caret)}</span>
                    <span
                        className="inline-block w-[7px] h-[14px] bg-green-400 align-middle"
                        style={{ animation: 'blink 1s step-end infinite' }}
                        aria-hidden="true"
                    />
                    <span className="whitespace-pre text-[#cccccc]">{input.slice(caret)}</span>
                </div>
            </div>
        </div>
    );
}
