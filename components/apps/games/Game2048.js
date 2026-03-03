import { useState, useEffect, useCallback } from 'react';

function slideRow(row) {
    const cells = row.filter(Boolean);
    const merged = [];
    let skip = false;
    for (let i = 0; i < cells.length; i++) {
        if (skip) { skip = false; continue; }
        if (i + 1 < cells.length && cells[i] === cells[i + 1]) {
            merged.push(cells[i] * 2);
            skip = true;
        } else {
            merged.push(cells[i]);
        }
    }
    while (merged.length < 4) merged.push(0);
    return merged;
}

function transpose(board) {
    const r = Array(16).fill(0);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) r[i * 4 + j] = board[j * 4 + i];
    return r;
}

function applyMove(board, dir) {
    let b = [...board];
    if (dir === 'up' || dir === 'down') b = transpose(b);
    const rows = [];
    for (let r = 0; r < 4; r++) {
        let row = b.slice(r * 4, r * 4 + 4);
        if (dir === 'right' || dir === 'down') row = row.reverse();
        row = slideRow(row);
        if (dir === 'right' || dir === 'down') row = row.reverse();
        rows.push(row);
    }
    b = rows.flat();
    if (dir === 'up' || dir === 'down') b = transpose(b);
    return b;
}

function addTile(board) {
    const empty = board.map((v, i) => v === 0 ? i : -1).filter(i => i >= 0);
    if (!empty.length) return board;
    const idx  = empty[Math.floor(Math.random() * empty.length)];
    const next = [...board];
    next[idx]  = Math.random() < 0.9 ? 2 : 4;
    return next;
}

function initBoard() {
    let b = Array(16).fill(0);
    b = addTile(b);
    b = addTile(b);
    return b;
}

const TILE_COLORS = {
    0:    ['transparent', 'transparent'],
    2:    ['#eee4da', '#776e65'],
    4:    ['#ede0c8', '#776e65'],
    8:    ['#f2b179', '#fff'],
    16:   ['#f59563', '#fff'],
    32:   ['#f67c5f', '#fff'],
    64:   ['#f65e3b', '#fff'],
    128:  ['#edcf72', '#fff'],
    256:  ['#edcc61', '#fff'],
    512:  ['#edc850', '#fff'],
    1024: ['#edc53f', '#fff'],
    2048: ['#edc22e', '#fff'],
};

export default function Game2048({ darkTheme }) {
    const [board, setBoard] = useState(initBoard);
    const [score, setScore] = useState(0);
    const [best,  setBest]  = useState(() => {
        try { return parseInt(localStorage.getItem('pdos_2048_best') || '0'); } catch { return 0; }
    });
    const [won, setWon] = useState(false);

    const bg = darkTheme ? '#0a0a1e' : '#f7f8fb';

    const handleMove = useCallback((dir) => {
        setBoard(prev => {
            const next = applyMove(prev, dir);
            if (next.join() === prev.join()) return prev;
            const delta = next.reduce((a, v) => a + v, 0) - prev.reduce((a, v) => a + v, 0);
            setScore(s => {
                const newS = s + delta;
                setBest(b => {
                    const nb = Math.max(b, newS);
                    try { localStorage.setItem('pdos_2048_best', String(nb)); } catch {}
                    return nb;
                });
                return newS;
            });
            if (next.includes(2048)) setWon(true);
            return addTile(next);
        });
    }, []);

    useEffect(() => {
        const handler = (e) => {
            const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
            if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleMove]);

    const reset = () => { setBoard(initBoard()); setScore(0); setWon(false); };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 select-none" style={{ background: bg }}>
            <div className="flex items-center gap-3">
                <div className="px-4 py-1.5 rounded-lg text-center" style={{ background: 'rgba(0,120,212,0.12)', border: '1px solid rgba(0,120,212,0.25)' }}>
                    <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Score</p>
                    <p className="text-base font-bold" style={{ color: '#0078d4' }}>{score}</p>
                </div>
                <div className="px-4 py-1.5 rounded-lg text-center" style={{ background: 'rgba(254,188,46,0.1)', border: '1px solid rgba(254,188,46,0.25)' }}>
                    <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Best</p>
                    <p className="text-base font-bold" style={{ color: '#febc2e' }}>{best}</p>
                </div>
                <button
                    onClick={reset}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                    New
                </button>
            </div>

            {won && <p className="text-xs font-bold" style={{ color: '#febc2e' }}>🎉 You reached 2048!</p>}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 84px)',
                gridTemplateRows:    'repeat(4, 84px)',
                gap: 8, padding: 10,
                borderRadius: 14,
                background: 'rgba(0,0,0,0.25)',
            }}>
                {board.map((v, i) => {
                    const key = Math.min(v, 2048);
                    const [tileBg, fg] = TILE_COLORS[key] || ['#3c3a32', '#fff'];
                    return (
                        <div key={i} style={{
                            width: 84, height: 84,
                            background: v ? tileBg : (darkTheme ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.07)'),
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: v >= 1024 ? 18 : v >= 128 ? 22 : 26,
                            fontWeight: 'bold',
                            color: v ? fg : 'transparent',
                            transition: 'background 0.08s',
                        }}>
                            {v || ''}
                        </div>
                    );
                })}
            </div>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>Arrow keys to play</p>
        </div>
    );
}
