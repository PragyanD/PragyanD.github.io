import { useState, useEffect, useCallback, useRef } from 'react';
import { get, set, STORAGE_KEYS } from '../../../lib/storage';
import { useAchievements } from '../../../contexts/AchievementContext';

function slideRow(row) {
    const cells = row.filter(Boolean);
    const merged = [];
    let scoreGain = 0;
    let skip = false;
    for (let i = 0; i < cells.length; i++) {
        if (skip) { skip = false; continue; }
        if (i + 1 < cells.length && cells[i] === cells[i + 1]) {
            const val = cells[i] * 2;
            merged.push(val);
            scoreGain += val;
            skip = true;
        } else {
            merged.push(cells[i]);
        }
    }
    while (merged.length < 4) merged.push(0);
    return { row: merged, score: scoreGain };
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
    let totalScore = 0;
    for (let r = 0; r < 4; r++) {
        let row = b.slice(r * 4, r * 4 + 4);
        if (dir === 'right' || dir === 'down') row = row.reverse();
        const { row: merged, score } = slideRow(row);
        totalScore += score;
        if (dir === 'right' || dir === 'down') merged.reverse();
        rows.push(merged);
    }
    b = rows.flat();
    if (dir === 'up' || dir === 'down') b = transpose(b);
    return { board: b, score: totalScore };
}

function addTile(board) {
    const empty = board.map((v, i) => v === 0 ? i : -1).filter(i => i >= 0);
    if (!empty.length) return board;
    const idx  = empty[Math.floor(Math.random() * empty.length)];
    const next = [...board];
    next[idx]  = Math.random() < 0.9 ? 2 : 4;
    return next;
}

function isStuck(board) {
    if (board.includes(0)) return false;
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[r * 4 + c] === board[r * 4 + c + 1]) return false;
        }
    }
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r * 4 + c] === board[(r + 1) * 4 + c]) return false;
        }
    }
    return true;
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
    const { unlock } = useAchievements();
    const [board, setBoard] = useState(initBoard);
    const [score, setScore] = useState(0);
    const [best,  setBest]  = useState(() => {
        return parseInt(get(STORAGE_KEYS.BEST_2048, '0'));
    });
    const [won, setWon] = useState(false);
    const [lost, setLost] = useState(false);
    const boardRef = useRef(null);

    const bg = darkTheme ? '#0a0a1e' : '#f7f8fb';

    useEffect(() => { boardRef.current = board; }, [board]);

    useEffect(() => {
        if (score <= 0) return;
        setBest(b => {
            if (score > b) {
                set(STORAGE_KEYS.BEST_2048, String(score));
                return score;
            }
            return b;
        });
    }, [score]);

    const handleMove = useCallback((dir) => {
        const prev = boardRef.current;
        if (!prev) return;
        const { board: next, score: gained } = applyMove(prev, dir);
        if (next.join() === prev.join()) return;
        if (next.includes(2048)) { setWon(true); unlock('gamer'); }
        const withTile = addTile(next);
        if (isStuck(withTile)) setLost(true);
        setBoard(withTile);
        if (gained > 0) setScore(s => s + gained);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
            if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleMove]);

    const reset = () => { const b = initBoard(); boardRef.current = b; setBoard(b); setScore(0); setWon(false); setLost(false); };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 select-none" style={{ background: bg }}>
            <div className="flex items-center gap-3">
                <div className="px-4 py-1.5 rounded-lg text-center" style={{ background: 'rgba(0,120,212,0.12)', border: '1px solid rgba(0,120,212,0.25)' }}>
                    <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: darkTheme ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.45)' }}>Score</p>
                    <p className="text-base font-bold" style={{ color: '#0078d4' }}>{score}</p>
                </div>
                <div className="px-4 py-1.5 rounded-lg text-center" style={{ background: 'rgba(254,188,46,0.1)', border: '1px solid rgba(254,188,46,0.25)' }}>
                    <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: darkTheme ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.45)' }}>Best</p>
                    <p className="text-base font-bold" style={{ color: '#febc2e' }}>{best}</p>
                </div>
                <button
                    onClick={reset}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                    style={{
                        background: darkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                        color:      darkTheme ? 'rgba(255,255,255,0.7)'  : '#444',
                        border: `1px solid ${darkTheme ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                    }}
                >
                    New
                </button>
            </div>

            {won  && <p className="text-xs font-bold" style={{ color: '#febc2e' }}>🎉 You reached 2048!</p>}
            {lost && <p className="text-xs font-bold" style={{ color: '#ff453a' }}>😵 No moves left — game over!</p>}

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
            <p className="text-xs" style={{ color: darkTheme ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)' }}>Arrow keys to play</p>
        </div>
    );
}
