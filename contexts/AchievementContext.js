import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useNotifications } from './NotificationContext';
import { getJSON, setJSON, STORAGE_KEYS } from '../lib/storage';

const AchievementContext = createContext(null);

export const ACHIEVEMENTS = [
    {
        id: 'first_boot',
        name: 'Hello, World',
        description: 'Complete the boot sequence',
        hint: 'Everyone starts somewhere',
        icon: '🚀',
    },
    {
        id: 'explorer',
        name: 'Explorer',
        description: 'Open every app at least once',
        hint: "There's more to see",
        icon: '🗺️',
    },
    {
        id: 'multitasker',
        name: 'Multitasker',
        description: 'Have 4+ windows open at once',
        hint: 'Why use one when you can use four?',
        icon: '🪟',
    },
    {
        id: 'terminal_user',
        name: 'Power User',
        description: 'Run 5 commands in Terminal',
        hint: 'The command line awaits',
        icon: '⌨️',
    },
    {
        id: 'gamer',
        name: 'Winner',
        description: 'Win any game',
        hint: 'Try the Games app',
        icon: '🏆',
    },
    {
        id: 'hacker',
        name: 'Root Access',
        description: 'Run sudo in Terminal',
        hint: 'Elevate your privileges',
        icon: '🔓',
    },
    {
        id: 'archaeologist',
        name: 'Digital Archaeologist',
        description: 'Open the Trash app',
        hint: 'Check the bin',
        icon: '🗑️',
    },
    {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Toggle dark mode',
        hint: 'Try the other side',
        icon: '🌙',
    },
    {
        id: 'wallpaper',
        name: 'Interior Designer',
        description: 'Change the wallpaper',
        hint: 'Make yourself at home',
        icon: '🖼️',
    },
    {
        id: 'konami',
        name: 'Konami',
        description: 'Enter the Konami code',
        hint: '↑↑↓↓←→←→BA',
        icon: '🎮',
    },
    {
        id: 'completionist',
        name: '100%',
        description: 'Unlock all other achievements',
        hint: 'You know what to do',
        icon: '💯',
    },
];

function getUnlockedState() {
    return getJSON(STORAGE_KEYS.ACHIEVEMENTS, {});
}

function saveUnlockedState(state) {
    setJSON(STORAGE_KEYS.ACHIEVEMENTS, state);
}

export function AchievementProvider({ children }) {
    const [unlocked, setUnlocked] = useState(getUnlockedState);
    const { notify } = useNotifications();
    const unlockedRef = useRef(unlocked);
    unlockedRef.current = unlocked;

    const isUnlocked = useCallback((id) => !!unlockedRef.current[id], []);

    const unlock = useCallback((id) => {
        if (unlockedRef.current[id]) return;

        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        if (!achievement) return;

        const next = { ...unlockedRef.current, [id]: Date.now() };
        unlockedRef.current = next;
        setUnlocked(next);
        saveUnlockedState(next);

        notify({
            id: `achievement_${id}`,
            message: `Achievement Unlocked: ${achievement.name}`,
            icon: achievement.icon,
            type: 'achievement',
            showOnce: true,
        });
    }, [notify]);

    // Check completionist whenever unlocked changes
    useEffect(() => {
        const nonCompletionist = ACHIEVEMENTS.filter(a => a.id !== 'completionist');
        const allUnlocked = nonCompletionist.every(a => unlocked[a.id]);
        if (allUnlocked && !unlocked.completionist && nonCompletionist.length > 0) {
            // Small delay so the last achievement toast shows first
            const timer = setTimeout(() => unlock('completionist'), 1500);
            return () => clearTimeout(timer);
        }
    }, [unlocked, unlock]);

    const progress = ACHIEVEMENTS.filter(a => unlocked[a.id]).length;
    const total = ACHIEVEMENTS.length;

    return (
        <AchievementContext.Provider value={{ achievements: ACHIEVEMENTS, unlocked, unlock, isUnlocked, progress, total }}>
            {children}
        </AchievementContext.Provider>
    );
}

export function useAchievements() {
    const ctx = useContext(AchievementContext);
    if (!ctx) throw new Error('useAchievements must be used within AchievementProvider');
    return ctx;
}
