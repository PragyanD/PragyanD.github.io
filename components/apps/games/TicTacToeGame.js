import { useState, useEffect, useCallback } from 'react';

const LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
];

function checkWinner(board) {
    for (const [a,b,c] of LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return board.every(Boolean) ? 'draw' : null;
}

function minimax(board, isMax, depth = 0) {
    const w = checkWinner(board);
    if (w === 'O') return 10 - depth;
    if (w === 'X') return depth - 10;
    if (w === 'draw') return 0;
    const scores = [];
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = isMax ? 'O' : 'X';
            scores.push(minimax(board, !isMax, depth + 1));
            board[i] = null;
        }
    }
    return isMax ? Math.max(...scores) : Math.min(...scores);
}

function bestMove(board) {
    let best = -Infinity, move = -1;
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = 'O';
            const score = minimax(board, false);
            board[i] = null;
            if (score > best) { best = score; move = i; }
        }
    }
    return move;
}

export default function TicTacToeGame({ darkTheme }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [thinking, setThinking] = useState(false);
    const [wins, setWins] = useState(() => {
        try { return parseInt(localStorage.getItem('pdos_ttt_wins') || '0'); } catch { return 0; }
    });
    const winner = checkWinner(board);

    const bg = darkTheme ? '#0a0a1e' : '#f7f8fb';
    const cardBg = darkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    const textColor = darkTheme ? 'rgba(255,255,255,0.85)' : '#222';
    const subColor = darkTheme ? 'rgba(255,255,255,0.35)' : '#888';

    const handleClick = useCallback((i) => {
        if (board[i] || winner || !xIsNext || thinking) return;
        const next = [...board];
        next[i] = 'X';
        setBoard(next);
        setXIsNext(false);
    }, [board, winner, xIsNext, thinking]);

    useEffect(() => {
        if (!xIsNext && !winner) {
            setThinking(true);
            const t = setTimeout(() => {
                const move = bestMove([...board]);
                if (move !== -1) {
                    setBoard(prev => {
                        const next = [...prev];
                        next[move] = 'O';
                        return next;
                    });
                }
                setXIsNext(true);
                setThinking(false);
            }, 300);
            return () => clearTimeout(t);
        }
    }, [xIsNext, board, winner]);

    useEffect(() => {
        if (winner === 'X') {
            setWins(w => {
                const n = w + 1;
                try { localStorage.setItem('pdos_ttt_wins', String(n)); } catch {}
                return n;
            });
        }
    }, [winner]);

    const reset = () => { setBoard(Array(9).fill(null)); setXIsNext(true); setThinking(false); };

    const status = winner === 'draw' ? "It's a draw!"
        : winner ? (winner === 'X' ? 'You win! 🎉' : 'CPU wins 🤖')
        : thinking ? 'CPU thinking…'
        : 'Your turn (X)';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-5 select-none" style={{ background: bg }}>
            <p className="text-sm font-medium" style={{ color: textColor }}>{status}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 88px)', gap: 8 }}>
                {board.map((cell, i) => (
                    <button
                        key={i}
                        onClick={() => handleClick(i)}
                        className="text-3xl font-bold rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        style={{
                            width: 88, height: 88,
                            background: cardBg,
                            border: '1px solid rgba(0,120,212,0.25)',
                            color: cell === 'X' ? '#0078d4' : '#ff453a',
                            cursor: (!cell && !winner && xIsNext && !thinking) ? 'pointer' : 'default',
                        }}
                        aria-label={`Cell ${i + 1}${cell ? ': ' + cell : ''}`}
                    >
                        {cell}
                    </button>
                ))}
            </div>
            <div className="flex flex-col items-center gap-1">
                <button
                    onClick={reset}
                    className="px-5 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                    style={{ background: 'rgba(0,120,212,0.15)', color: '#0078d4', border: '1px solid rgba(0,120,212,0.35)' }}
                >
                    New Game
                </button>
                <div className="flex items-center gap-3">
                    <p className="text-[10px]" style={{ color: subColor }}>CPU plays perfect minimax</p>
                    {wins > 0 && <p className="text-[10px] font-semibold" style={{ color: '#34c759' }}>🏆 {wins} win{wins !== 1 ? 's' : ''}</p>}
                </div>
            </div>
        </div>
    );
}
