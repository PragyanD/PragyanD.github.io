import { useState, useCallback, useEffect, useRef } from 'react';
import { useAchievements } from '../../../contexts/AchievementContext';

const ROWS = 9, COLS = 9, MINES = 10;

function neighbors(idx) {
    const r = Math.floor(idx / COLS), c = idx % COLS;
    const result = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) result.push(nr * COLS + nc);
        }
    }
    return result;
}

function createBoard(firstIdx) {
    const safe = new Set([firstIdx, ...neighbors(firstIdx)]);
    const cells = Array.from({ length: ROWS * COLS }, () => ({
        mine: false, revealed: false, flagged: false, neighborCount: 0,
    }));
    let placed = 0;
    while (placed < MINES) {
        const idx = Math.floor(Math.random() * ROWS * COLS);
        if (!safe.has(idx) && !cells[idx].mine) { cells[idx].mine = true; placed++; }
    }
    cells.forEach((cell, idx) => {
        if (!cell.mine) cell.neighborCount = neighbors(idx).filter(n => cells[n].mine).length;
    });
    return cells;
}

function floodReveal(cells, idx) {
    const next = cells.map(c => ({ ...c }));
    const queue = [idx];
    const visited = new Set();
    while (queue.length) {
        const i = queue.shift();
        if (visited.has(i) || next[i].revealed || next[i].flagged) continue;
        visited.add(i);
        next[i].revealed = true;
        if (next[i].neighborCount === 0 && !next[i].mine) {
            queue.push(...neighbors(i));
        }
    }
    return next;
}

const NUM_COLORS = ['', '#0078d4', '#34c759', '#ff453a', '#a855f7', '#febc2e', '#20d9d2', '#ff6b35', '#888'];

export default function MinesweeperGame({ darkTheme }) {
    const { unlock } = useAchievements();
    const [cells, setCells] = useState(null);
    const [phase, setPhase] = useState('idle');
    const [flags, setFlags] = useState(0);
    const [time, setTime] = useState(0);
    const [bestTime, setBestTime] = useState(() => {
        try { return parseInt(localStorage.getItem('pdos_ms_best_time') || '0'); } catch { return 0; }
    });
    const timeRef = useRef(0);

    const bg = darkTheme ? '#0a0a1e' : '#f7f8fb';
    const cellBg = darkTheme ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
    const revealedBg = darkTheme ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)';
    const textColor = darkTheme ? 'rgba(255,255,255,0.85)' : '#222';

    useEffect(() => {
        if (phase !== 'playing') return;
        const id = setInterval(() => setTime(t => {
            const n = t + 1;
            timeRef.current = n;
            return n;
        }), 1000);
        return () => clearInterval(id);
    }, [phase]);

    const handleClick = useCallback((idx) => {
        if (phase === 'won' || phase === 'lost') return;
        if (cells && (cells[idx].flagged || cells[idx].revealed)) return;

        let board = cells;
        if (!board) {
            board = createBoard(idx);
            setPhase('playing');
        }
        if (board[idx].mine) {
            const next = board.map(c => c.mine ? { ...c, revealed: true } : c);
            setCells(next);
            setPhase('lost');
            return;
        }
        const next = floodReveal(board, idx);
        const won = next.every(c => c.mine || c.revealed);
        setCells(next);
        if (won) {
            setPhase('won');
            unlock('gamer');
            const t = timeRef.current;
            setBestTime(prev => {
                const save = (prev === 0 || t < prev) ? t : prev;
                try { localStorage.setItem('pdos_ms_best_time', String(save)); } catch {}
                return save;
            });
        }
    }, [cells, phase]);

    const handleFlag = useCallback((e, idx) => {
        e.preventDefault();
        if (!cells || cells[idx].revealed || phase === 'won' || phase === 'lost') return;
        const wasFlagged = cells[idx].flagged;
        setCells(prev => prev.map((c, i) => i === idx ? { ...c, flagged: !c.flagged } : c));
        setFlags(f => wasFlagged ? f - 1 : f + 1);
    }, [cells, phase]);

    const reset = () => { setCells(null); setPhase('idle'); setFlags(0); setTime(0); };
    const fmt = n => String(Math.max(0, n)).padStart(3, '0');

    const displayCells = cells || Array(ROWS * COLS).fill({ mine: false, revealed: false, flagged: false, neighborCount: 0 });

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 select-none" style={{ background: bg }}>
            {/* Header */}
            <div className="flex items-center gap-8 px-5 py-2 rounded-xl" style={{ background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.2)' }}>
                <span className="font-mono text-sm font-bold" style={{ color: '#ff453a' }}>💣 {fmt(MINES - flags)}</span>
                <button
                    onClick={reset}
                    className="text-xl hover:scale-125 transition-transform"
                    aria-label="Reset game"
                >
                    {phase === 'won' ? '😎' : phase === 'lost' ? '😵' : '🙂'}
                </button>
                <span className="font-mono text-sm font-bold" style={{ color: '#0078d4' }}>⏱ {fmt(time)}</span>
                {bestTime > 0 && (
                    <span className="font-mono text-xs font-bold" style={{ color: '#34c759' }}>🏆 {fmt(bestTime)}</span>
                )}
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 34px)`, gap: 2 }}>
                {displayCells.map((cell, i) => (
                    <button
                        key={i}
                        onClick={() => handleClick(i)}
                        onContextMenu={(e) => handleFlag(e, i)}
                        className="text-xs font-bold rounded flex items-center justify-center transition-colors"
                        style={{
                            width: 34, height: 34,
                            background: cell.revealed ? revealedBg : cellBg,
                            border: cell.revealed ? '1px solid transparent' : '1px solid rgba(0,120,212,0.2)',
                            color: cell.revealed && !cell.mine ? NUM_COLORS[cell.neighborCount] || textColor : textColor,
                            cursor: (phase === 'lost' || phase === 'won') ? 'default' : 'pointer',
                        }}
                        aria-label={cell.flagged ? 'Flagged' : cell.revealed ? (cell.mine ? 'Mine' : String(cell.neighborCount || '')) : 'Hidden'}
                    >
                        {cell.revealed ? (cell.mine ? '💣' : (cell.neighborCount || '')) : (cell.flagged ? '🚩' : '')}
                    </button>
                ))}
            </div>

            {(phase === 'won' || phase === 'lost') && (
                <p className="text-xs font-semibold" style={{ color: phase === 'won' ? '#34c759' : '#ff453a' }}>
                    {phase === 'won' ? '🎉 Board cleared!' : '💥 Game over — click 🙂 to retry'}
                </p>
            )}
            {phase === 'idle' && (
                <p className="text-xs" style={{ color: darkTheme ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>Click any cell to start · Right-click to flag</p>
            )}
        </div>
    );
}
