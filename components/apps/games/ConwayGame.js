import { useState, useEffect, useCallback } from 'react';

const ROWS = 28, COLS = 40, CELL = 14;

function nextGen(grid) {
    return grid.map((alive, idx) => {
        const r = Math.floor(idx / COLS), c = idx % COLS;
        let live = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) live += grid[nr * COLS + nc] ? 1 : 0;
            }
        }
        return alive ? (live === 2 || live === 3) : live === 3;
    });
}

function emptyGrid() { return Array(ROWS * COLS).fill(false); }

const PRESETS = {
    Clear: () => emptyGrid(),
    Glider: () => {
        const g = emptyGrid();
        [[1,0],[2,1],[0,2],[1,2],[2,2]].forEach(([r,c]) => { g[r * COLS + c] = true; });
        return g;
    },
    Blinker: () => {
        const g = emptyGrid();
        const r = Math.floor(ROWS / 2), c = Math.floor(COLS / 2);
        [c - 1, c, c + 1].forEach(col => { g[r * COLS + col] = true; });
        return g;
    },
    Beacon: () => {
        const g = emptyGrid();
        const sr = 5, sc = 5;
        [[0,0],[0,1],[1,0],[2,3],[3,2],[3,3]].forEach(([dr,dc]) => { g[(sr+dr)*COLS+(sc+dc)] = true; });
        return g;
    },
    'R-Pentomino': () => {
        const g = emptyGrid();
        const r = Math.floor(ROWS / 2), c = Math.floor(COLS / 2);
        [[0,1],[0,2],[1,0],[1,1],[2,1]].forEach(([dr,dc]) => { g[(r+dr)*COLS+(c+dc)] = true; });
        return g;
    },
};

export default function ConwayGame({ darkTheme }) {
    const [grid,    setGrid]    = useState(emptyGrid);
    const [running, setRunning] = useState(false);
    const [gen,     setGen]     = useState(0);
    const [speed,   setSpeed]   = useState(150);

    const bg = darkTheme ? '#0a0a1e' : '#f7f8fb';

    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => {
            setGrid(prev => nextGen(prev));
            setGen(g => g + 1);
        }, speed);
        return () => clearInterval(id);
    }, [running, speed]);

    const toggleCell = useCallback((idx) => {
        setGrid(prev => prev.map((v, i) => i === idx ? !v : v));
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 select-none" style={{ background: bg }}>
            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                    onClick={() => setRunning(r => !r)}
                    className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105"
                    style={{
                        background: running ? 'rgba(255,68,58,0.15)' : 'rgba(52,199,89,0.15)',
                        color: running ? '#ff453a' : '#34c759',
                        border: `1px solid ${running ? 'rgba(255,68,58,0.3)' : 'rgba(52,199,89,0.3)'}`,
                    }}
                >
                    {running ? '⏸ Pause' : '▶ Play'}
                </button>
                <button
                    onClick={() => { setGrid(g => nextGen(g)); setGen(n => n + 1); }}
                    className="px-3 py-1 rounded-lg text-xs transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                    Step
                </button>
                <select
                    value={speed}
                    onChange={e => setSpeed(Number(e.target.value))}
                    className="px-2 py-1 rounded-lg text-xs"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
                >
                    <option value={400}>Slow</option>
                    <option value={150}>Normal</option>
                    <option value={50}>Fast</option>
                </select>
                {Object.keys(PRESETS).map(name => (
                    <button
                        key={name}
                        onClick={() => { setGrid(PRESETS[name]()); setGen(0); setRunning(false); }}
                        className="px-2 py-1 rounded-lg text-xs transition-all hover:scale-105"
                        style={{ background: 'rgba(0,120,212,0.1)', color: '#0078d4', border: '1px solid rgba(0,120,212,0.25)' }}
                    >
                        {name}
                    </button>
                ))}
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>Gen {gen}</span>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
                gap: 1,
                background: 'rgba(0,0,0,0.3)',
                padding: 4,
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'crosshair',
            }}>
                {grid.map((alive, i) => (
                    <div
                        key={i}
                        onClick={() => toggleCell(i)}
                        style={{
                            width: CELL, height: CELL,
                            background: alive ? '#0078d4' : 'rgba(255,255,255,0.03)',
                            borderRadius: 2,
                            transition: 'background 0.04s',
                        }}
                    />
                ))}
            </div>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>Click cells to draw · Press Play to simulate</p>
        </div>
    );
}
