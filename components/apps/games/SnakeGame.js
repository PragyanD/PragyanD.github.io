import { useState, useEffect, useCallback, useRef } from 'react';

const ROWS = 20, COLS = 20, CELL = 22, TICK = 120;

function randomFood(snake) {
    const occupied = new Set(snake.map(([r, c]) => `${r},${c}`));
    let r, c;
    do {
        r = Math.floor(Math.random() * ROWS);
        c = Math.floor(Math.random() * COLS);
    } while (occupied.has(`${r},${c}`));
    return [r, c];
}

const INIT_SNAKE = [[10, 10], [10, 9], [10, 8]];
const INIT_FOOD  = [5, 10];
const INIT_DIR   = [0, 1];

export default function SnakeGame({ darkTheme }) {
    const [snake, setSnake] = useState(INIT_SNAKE);
    const [food,  setFood]  = useState(INIT_FOOD);
    const [phase, setPhase] = useState('idle');
    const [score, setScore] = useState(0);

    const snakeRef = useRef(INIT_SNAKE);
    const foodRef  = useRef(INIT_FOOD);
    const dirRef   = useRef(INIT_DIR);
    const phaseRef = useRef('idle');

    const bg        = darkTheme ? '#0a0a1e' : '#f7f8fb';
    const textColor = darkTheme ? 'rgba(255,255,255,0.85)' : '#222';

    const reset = useCallback(() => {
        const s = [[10, 10], [10, 9], [10, 8]];
        const f = [5, 10];
        setSnake(s); snakeRef.current = s;
        setFood(f);  foodRef.current  = f;
        dirRef.current = [0, 1];
        setScore(0);
        setPhase('playing'); phaseRef.current = 'playing';
    }, []);

    useEffect(() => {
        const handleKey = (e) => {
            if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
            if (phaseRef.current === 'idle') { reset(); return; }
            if (phaseRef.current === 'dead') {
                if (e.key === 'r' || e.key === 'R') reset();
                return;
            }
            const map = {
                ArrowUp: [-1,0], w: [-1,0],
                ArrowDown: [1,0], s: [1,0],
                ArrowLeft: [0,-1], a: [0,-1],
                ArrowRight: [0,1], d: [0,1],
            };
            const newDir = map[e.key];
            if (!newDir) return;
            const [dr, dc] = dirRef.current;
            if (newDir[0] === -dr && newDir[1] === -dc) return;
            dirRef.current = newDir;
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [reset]);

    useEffect(() => {
        if (phase !== 'playing') return;
        const id = setInterval(() => {
            const s = snakeRef.current;
            const [dr, dc] = dirRef.current;
            const [hr, hc] = s[0];
            const nr = hr + dr, nc = hc + dc;

            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) {
                setPhase('dead'); phaseRef.current = 'dead'; return;
            }
            if (s.slice(0, -1).some(([r, c]) => r === nr && c === nc)) {
                setPhase('dead'); phaseRef.current = 'dead'; return;
            }

            const [fr, fc] = foodRef.current;
            const atFood   = nr === fr && nc === fc;
            const newSnake = atFood ? [[nr,nc], ...s] : [[nr,nc], ...s.slice(0,-1)];
            snakeRef.current = newSnake;
            setSnake(newSnake);

            if (atFood) {
                setScore(sc => sc + 1);
                const nf = randomFood(newSnake);
                foodRef.current = nf;
                setFood(nf);
            }
        }, TICK);
        return () => clearInterval(id);
    }, [phase]);

    const snakeSet = new Set(snake.map(([r,c]) => `${r},${c}`));
    const headKey  = `${snake[0][0]},${snake[0][1]}`;
    const foodKey  = `${food[0]},${food[1]}`;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 select-none" style={{ background: bg }}>
            <div className="flex items-center gap-4">
                <p className="text-xs font-semibold" style={{ color: textColor }}>Score: {score}</p>
                {phase === 'idle' && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Press any arrow key to start</p>}
                {phase === 'dead' && <p className="text-xs" style={{ color: '#ff453a' }}>Game over! Press R to restart</p>}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
                gridTemplateRows:    `repeat(${ROWS}, ${CELL}px)`,
                border: '1px solid rgba(0,120,212,0.25)',
                borderRadius: 8,
                overflow: 'hidden',
                background: darkTheme ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.04)',
                gap: 1,
            }}>
                {Array.from({ length: ROWS * COLS }, (_, i) => {
                    const r = Math.floor(i / COLS), c = i % COLS;
                    const key    = `${r},${c}`;
                    const isHead  = key === headKey;
                    const isSnake = snakeSet.has(key);
                    const isFood  = key === foodKey;
                    return (
                        <div key={key} style={{
                            width: CELL, height: CELL,
                            background: isHead ? '#0078d4' : isSnake ? 'rgba(0,120,212,0.55)' : isFood ? '#34c759' : 'transparent',
                            borderRadius: isHead ? 5 : isSnake ? 3 : isFood ? CELL : 0,
                        }} />
                    );
                })}
            </div>

            {phase !== 'idle' && (
                <button
                    onClick={reset}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                    style={{ background: 'rgba(0,120,212,0.15)', color: '#0078d4', border: '1px solid rgba(0,120,212,0.35)' }}
                >
                    Restart (R)
                </button>
            )}
        </div>
    );
}
