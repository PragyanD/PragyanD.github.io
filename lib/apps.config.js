import TaskManagerApp from '../components/apps/TaskManagerApp';
import ResumeApp from '../components/apps/ResumeApp';
import AboutApp from '../components/apps/AboutApp';
import ProjectsApp from '../components/apps/ProjectsApp';
import TerminalApp from '../components/apps/TerminalApp';
import TrashApp from '../components/apps/TrashApp';
import GamesHubApp from '../components/apps/GamesHubApp';
import NotepadApp from '../components/apps/NotepadApp';

export const APPS_CONFIG = [
    {
        id: 'about',
        themeColor: '#0078d4',
        title: 'About Me',
        label: 'About Me',
        startMenuLabel: 'About\nMe',
        spotlightName: 'About Me',
        spotlightEmoji: '👤',
        spotlightKeywords: 'profile, bio, personal',
        iconSrc: '/icon_about.png',
        component: AboutApp,
        width: 680,
        height: 520,
        initialX: 180,
        initialY: 70,
    },
    {
        id: 'taskmanager',
        themeColor: '#34c759',
        title: 'Task Manager',
        label: 'Task Manager',
        startMenuLabel: 'Task\nManager',
        spotlightName: 'Task Manager',
        spotlightEmoji: '📊',
        spotlightKeywords: 'experience, skills, work',
        iconSrc: '/icon_task_manager.png',
        component: TaskManagerApp,
        width: 820,
        height: 560,
        initialX: 140,
        initialY: 60,
    },
    {
        id: 'projects',
        themeColor: '#a855f7',
        title: 'Projects',
        label: 'Projects',
        startMenuLabel: 'Projects',
        spotlightName: 'Projects',
        spotlightEmoji: '📁',
        spotlightKeywords: 'work, code, portfolio',
        iconSrc: '/icon_projects.png',
        component: ProjectsApp,
        width: 820,
        height: 560,
        initialX: 160,
        initialY: 65,
    },
    {
        id: 'terminal',
        themeColor: '#34c759',
        title: 'Terminal',
        label: 'Terminal',
        startMenuLabel: 'Terminal',
        spotlightName: 'Terminal',
        spotlightEmoji: '⌨️',
        spotlightKeywords: 'shell, bash, command line',
        iconSrc: '/icon_terminal.png',
        component: TerminalApp,
        width: 640,
        height: 480,
        initialX: 300,
        initialY: 150,
    },
    {
        id: 'resume',
        themeColor: '#febc2e',
        title: "Pragyan's Resume — Viewer",
        label: "Pragyan's Resume",
        startMenuLabel: 'Resume',
        spotlightName: 'Resume viewer',
        spotlightEmoji: '📄',
        spotlightKeywords: 'cv, download, pdf',
        iconSrc: '/icon_resume.png',
        component: ResumeApp,
        width: 720,
        height: 580,
        initialX: 220,
        initialY: 80,
    },
    {
        id: 'trash',
        themeColor: '#ff453a',
        title: 'Trash',
        label: 'Trash',
        startMenuLabel: 'Trash',
        spotlightName: 'Trash',
        spotlightEmoji: '🗑️',
        spotlightKeywords: 'delete, recycle, bin, files, junk',
        iconSrc: '/icon_trash.png',
        component: TrashApp,
        width: 640,
        height: 480,
        initialX: 340,
        initialY: 120,
        rightColumn: true,
    },
    {
        id: 'games_hub',
        themeColor: '#f97316',
        title: 'Games',
        label: 'Games',
        startMenuLabel: 'Games',
        spotlightName: 'Games',
        spotlightEmoji: '🎮',
        spotlightKeywords: 'games, play, fun, minesweeper, snake, 2048, conway, tictactoe, easter egg',
        iconSrc: '/icon_games.svg',
        component: GamesHubApp,
        width: 720,
        height: 540,
        initialX: 180,
        initialY: 70,
        rightColumn: true,
    },
    {
        id: 'notepad',
        themeColor: '#38bdf8',
        title: 'easter_eggs.txt — Notepad',
        label: 'easter_eggs.txt',
        startMenuLabel: 'Notes',
        spotlightName: 'Easter Eggs',
        spotlightEmoji: '🥚',
        spotlightKeywords: 'easter egg, hidden, secrets, features, notepad',
        iconSrc: '/icon_notepad.png',
        component: NotepadApp,
        width: 560,
        height: 420,
        initialX: 260,
        initialY: 110,
        rightColumn: true,
    },
];

/** Icon for use in window title bars, taskbar pills, and start menu (small). */
export function renderWindowIcon(app) {
    if (app.iconSrc) {
        return <img src={app.iconSrc} alt={app.label} className="w-full h-full object-contain" />;
    }
    return (
        <div className="w-full h-full flex items-center justify-center bg-black rounded text-xs font-bold text-green-500 border border-green-900/50">
            _&gt;
        </div>
    );
}

/** Icon for use on the desktop (larger, with drop shadow). */
export function renderDesktopIcon(app) {
    if (app.iconSrc) {
        return <img src={app.iconSrc} alt={app.label} className="w-full h-full object-contain drop-shadow-md" />;
    }
    return (
        <div className="w-full h-full flex items-center justify-center bg-black rounded-xl text-2xl font-bold text-green-500 border border-green-900/50 shadow-inner group-hover:border-green-400/50 transition-colors">
            _&gt;
        </div>
    );
}
