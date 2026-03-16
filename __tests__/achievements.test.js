import { render, screen, act } from '@testing-library/react';
import { NotificationProvider, useNotifications } from '../contexts/NotificationContext';
import { AchievementProvider, useAchievements, ACHIEVEMENTS } from '../contexts/AchievementContext';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] ?? null,
        setItem: (key, val) => { store[key] = String(val); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {
    localStorageMock.clear();
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

// Helper: renders a component that exposes context via test IDs
function AchievementTestHarness({ onReady }) {
    return (
        <NotificationProvider>
            <AchievementProvider>
                <AchievementConsumer onReady={onReady} />
            </AchievementProvider>
        </NotificationProvider>
    );
}

function AchievementConsumer({ onReady }) {
    const ctx = useAchievements();
    const notifCtx = useNotifications();
    // Expose context to test via ref
    if (onReady) onReady(ctx, notifCtx);

    return (
        <div>
            <span data-testid="progress">{ctx.progress}</span>
            <span data-testid="total">{ctx.total}</span>
            {ACHIEVEMENTS.map(a => (
                <span key={a.id} data-testid={`unlocked-${a.id}`}>
                    {ctx.unlocked[a.id] ? 'true' : 'false'}
                </span>
            ))}
        </div>
    );
}

function NotificationTestHarness({ onReady }) {
    return (
        <NotificationProvider>
            <NotificationConsumer onReady={onReady} />
        </NotificationProvider>
    );
}

function NotificationConsumer({ onReady }) {
    const ctx = useNotifications();
    if (onReady) onReady(ctx);
    return (
        <div>
            <span data-testid="notif-count">{ctx.notifications.length}</span>
            {ctx.notifications.map(n => (
                <span key={n.nid} data-testid={`notif-${n.nid}`}>{n.message}</span>
            ))}
        </div>
    );
}

describe('AchievementContext', () => {
    test('starts with 0 progress', () => {
        let ctx;
        render(<AchievementTestHarness onReady={(c) => { ctx = c; }} />);
        expect(screen.getByTestId('progress').textContent).toBe('0');
        expect(screen.getByTestId('total').textContent).toBe(String(ACHIEVEMENTS.length));
    });

    test('unlock increments progress and persists to localStorage', () => {
        let ctx;
        render(<AchievementTestHarness onReady={(c) => { ctx = c; }} />);

        act(() => {
            ctx.unlock('first_boot');
        });

        expect(screen.getByTestId('progress').textContent).toBe('1');
        expect(screen.getByTestId('unlocked-first_boot').textContent).toBe('true');

        // Check localStorage persistence
        const stored = JSON.parse(localStorage.getItem('pdos_achievements'));
        expect(stored.first_boot).toBeTruthy();
    });

    test('duplicate unlock is a no-op', () => {
        let ctx;
        render(<AchievementTestHarness onReady={(c) => { ctx = c; }} />);

        act(() => {
            ctx.unlock('first_boot');
            ctx.unlock('first_boot');
        });

        expect(screen.getByTestId('progress').textContent).toBe('1');
    });

    test('unlocking all 9 non-completionist achievements auto-unlocks completionist', () => {
        let ctx;
        render(<AchievementTestHarness onReady={(c) => { ctx = c; }} />);

        const nonCompletionist = ACHIEVEMENTS.filter(a => a.id !== 'completionist');

        act(() => {
            nonCompletionist.forEach(a => ctx.unlock(a.id));
        });

        // Completionist unlocks after a 1500ms delay
        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(screen.getByTestId('unlocked-completionist').textContent).toBe('true');
        expect(screen.getByTestId('progress').textContent).toBe(String(ACHIEVEMENTS.length));
    });

    test('isUnlocked returns correct state', () => {
        let ctx;
        render(<AchievementTestHarness onReady={(c) => { ctx = c; }} />);

        expect(ctx.isUnlocked('first_boot')).toBe(false);

        act(() => {
            ctx.unlock('first_boot');
        });

        expect(ctx.isUnlocked('first_boot')).toBe(true);
    });

    test('loads persisted state from localStorage on mount', () => {
        localStorage.setItem('pdos_achievements', JSON.stringify({
            first_boot: Date.now(),
            explorer: Date.now(),
        }));

        render(<AchievementTestHarness onReady={() => {}} />);

        expect(screen.getByTestId('progress').textContent).toBe('2');
        expect(screen.getByTestId('unlocked-first_boot').textContent).toBe('true');
        expect(screen.getByTestId('unlocked-explorer').textContent).toBe('true');
        expect(screen.getByTestId('unlocked-hacker').textContent).toBe('false');
    });
});

describe('NotificationContext', () => {
    test('notify adds a notification', () => {
        let ctx;
        render(<NotificationTestHarness onReady={(c) => { ctx = c; }} />);

        act(() => {
            ctx.notify({ id: 'test1', message: 'Hello', showOnce: false });
        });

        expect(screen.getByTestId('notif-count').textContent).toBe('1');
    });

    test('showOnce prevents duplicate notifications', () => {
        let ctx;
        render(<NotificationTestHarness onReady={(c) => { ctx = c; }} />);

        act(() => {
            ctx.notify({ id: 'test_once', message: 'First', showOnce: true });
        });

        act(() => {
            ctx.notify({ id: 'test_once', message: 'Second', showOnce: true });
        });

        // Only the first should show
        expect(screen.getByTestId('notif-count').textContent).toBe('1');
    });

    test('max 3 notifications visible, extras queued', () => {
        let ctx;
        render(<NotificationTestHarness onReady={(c) => { ctx = c; }} />);

        act(() => {
            ctx.notify({ id: 'n1', message: 'One', showOnce: false });
            ctx.notify({ id: 'n2', message: 'Two', showOnce: false });
            ctx.notify({ id: 'n3', message: 'Three', showOnce: false });
            ctx.notify({ id: 'n4', message: 'Four', showOnce: false });
        });

        // Max 3 visible
        const count = parseInt(screen.getByTestId('notif-count').textContent);
        expect(count).toBeLessThanOrEqual(3);
    });

    test('notifications auto-dismiss after 4 seconds', () => {
        let ctx;
        render(<NotificationTestHarness onReady={(c) => { ctx = c; }} />);

        act(() => {
            ctx.notify({ id: 'auto', message: 'Auto dismiss', showOnce: false });
        });

        expect(screen.getByTestId('notif-count').textContent).toBe('1');

        act(() => {
            jest.advanceTimersByTime(4500);
        });

        expect(screen.getByTestId('notif-count').textContent).toBe('0');
    });

    test('dismiss removes notification immediately', () => {
        let ctx;
        render(<NotificationTestHarness onReady={(c) => { ctx = c; }} />);

        act(() => {
            ctx.notify({ id: 'dismiss_test', message: 'Dismiss me', showOnce: false });
        });

        expect(screen.getByTestId('notif-count').textContent).toBe('1');

        act(() => {
            const nid = ctx.notifications[0].nid;
            ctx.dismiss(nid);
        });

        expect(screen.getByTestId('notif-count').textContent).toBe('0');
    });
});

describe('Achievement + Notification integration', () => {
    test('unlocking an achievement dispatches a notification', () => {
        let achieveCtx, notifCtx;
        render(
            <AchievementTestHarness onReady={(a, n) => { achieveCtx = a; notifCtx = n; }} />
        );

        act(() => {
            achieveCtx.unlock('first_boot');
        });

        // Should have an achievement notification
        expect(notifCtx.notifications.length).toBeGreaterThanOrEqual(1);
        const msg = notifCtx.notifications.find(n => n.message.includes('Hello, World'));
        expect(msg).toBeTruthy();
        expect(msg.type).toBe('achievement');
    });
});
