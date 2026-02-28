import TaskManagerApp from '../components/apps/TaskManagerApp';
import ResumeApp from '../components/apps/ResumeApp';
import AboutApp from '../components/apps/AboutApp';
import ProjectsApp from '../components/apps/ProjectsApp';
import TerminalApp from '../components/apps/TerminalApp';
import TrashApp from '../components/apps/TrashApp';

export const APPS_CONFIG = [
    {
        id: 'about',
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
        id: 'resume',
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
        id: 'terminal',
        title: 'Terminal',
        label: 'Terminal',
        startMenuLabel: 'Terminal',
        spotlightName: 'Terminal',
        spotlightEmoji: '⌨️',
        spotlightKeywords: 'shell, bash, command line',
        iconSrc: '/icon_terminal.svg',
        component: TerminalApp,
        width: 640,
        height: 480,
        initialX: 300,
        initialY: 150,
    },
    {
        id: 'trash',
        title: 'Trash',
        label: 'Trash',
        startMenuLabel: 'Trash',
        spotlightName: 'Trash',
        spotlightEmoji: '🗑️',
        spotlightKeywords: 'delete, recycle, bin, files, junk',
        iconSrc: '/icon_trash.svg',
        component: TrashApp,
        width: 640,
        height: 480,
        initialX: 340,
        initialY: 120,
    },
];

/** Icon for use in window title bars, taskbar pills, and start menu (small). */
export function renderWindowIcon(app) {
    if (app.iconSrc) {
        return <img src={app.iconSrc} alt={app.label} className="w-full h-full object-contain" />;
    }
    return (
        <div className="w-full h-full flex items-center justify-center bg-black rounded text-[10px] font-bold text-green-500 border border-green-900/50">
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
