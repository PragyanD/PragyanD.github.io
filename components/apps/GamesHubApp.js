import { useState } from 'react';
import TicTacToeGame  from './games/TicTacToeGame';
import MinesweeperGame from './games/MinesweeperGame';
import SnakeGame      from './games/SnakeGame';
import Game2048       from './games/Game2048';
import ConwayGame     from './games/ConwayGame';

const GAMES = [
    {
        id: 'tictactoe',
        name: 'Tic Tac Toe',
        emoji: '⭕',
        description: 'Beat the unbeatable CPU',
        color: '#0078d4',
        component: TicTacToeGame,
    },
    {
        id: 'minesweeper',
        name: 'Minesweeper',
        emoji: '💣',
        description: 'Classic 9×9 beginner board',
        color: '#ff453a',
        component: MinesweeperGame,
    },
    {
        id: 'snake',
        name: 'Snake',
        emoji: '🐍',
        description: 'Arrow keys to move, grow, survive',
        color: '#34c759',
        component: SnakeGame,
    },
    {
        id: '2048',
        name: '2048',
        emoji: '🔢',
        description: 'Merge tiles to reach 2048',
        color: '#febc2e',
        component: Game2048,
    },
    {
        id: 'conway',
        name: "Conway's Life",
        emoji: '🔬',
        description: 'Draw cells and simulate life',
        color: '#a855f7',
        component: ConwayGame,
    },
];

export default function GamesHubApp({ darkTheme = false }) {
    const [activeGame, setActiveGame] = useState(null);

    const bg         = darkTheme ? '#0a0a1e' : '#f7f8fb';
    const cardBg     = darkTheme ? 'rgba(255,255,255,0.05)' : '#fff';
    const headingColor = darkTheme ? 'rgba(255,255,255,0.45)' : '#999';
    const titleColor = darkTheme ? '#fff' : '#111';
    const subColor   = darkTheme ? 'rgba(255,255,255,0.45)' : '#888';
    const cardShadow = darkTheme ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)';

    if (activeGame) {
        const game = GAMES.find(g => g.id === activeGame);
        const GameComponent = game.component;
        return (
            <div className="w-full h-full flex flex-col" style={{ background: bg }}>
                <div
                    className="flex items-center gap-3 px-4 py-2 flex-shrink-0"
                    style={{ borderBottom: `1px solid ${game.color}22`, background: darkTheme ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
                >
                    <button
                        onClick={() => setActiveGame(null)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg transition-all hover:scale-105"
                        style={{
                            background: darkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                            color:      darkTheme ? 'rgba(255,255,255,0.65)' : '#444',
                            border: `1px solid ${darkTheme ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                        }}
                    >
                        ← Back
                    </button>
                    <span className="text-sm font-semibold" style={{ color: game.color }}>
                        {game.emoji} {game.name}
                    </span>
                </div>
                <div className="flex-1 overflow-auto">
                    <GameComponent darkTheme={darkTheme} />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-y-auto os-scroll" style={{ background: bg }}>
            {/* Header */}
            <div className="px-8 pt-8 pb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: headingColor }}>
                    Easter Egg
                </h2>
                <h1 className="text-2xl font-bold" style={{ color: titleColor }}>🎮 Games</h1>
                <p className="text-sm mt-1" style={{ color: subColor }}>
                    You found the hidden games. Congratulations, explorer.
                </p>
            </div>

            {/* Game cards */}
            <div className="px-8 pb-8 grid grid-cols-2 gap-4">
                {GAMES.map(game => (
                    <button
                        key={game.id}
                        onClick={() => setActiveGame(game.id)}
                        className="p-5 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.99]"
                        style={{
                            background: cardBg,
                            border: `1px solid ${game.color}33`,
                            boxShadow: cardShadow,
                            cursor: 'pointer',
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = `${game.color}66`;
                            e.currentTarget.style.boxShadow  = `0 8px 24px ${game.color}22`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = `${game.color}33`;
                            e.currentTarget.style.boxShadow  = cardShadow;
                        }}
                    >
                        <div className="text-3xl mb-3">{game.emoji}</div>
                        <h3 className="text-sm font-semibold mb-1" style={{ color: game.color }}>{game.name}</h3>
                        <p className="text-xs" style={{ color: subColor }}>{game.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
