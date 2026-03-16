import { useNotifications } from '../contexts/NotificationContext';

export default function NotificationCenter() {
    const { notifications, dismiss } = useNotifications();

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 flex flex-col gap-2 z-[600] pointer-events-none" style={{ maxWidth: 340 }}>
            {notifications.map((n) => (
                <div
                    key={n.nid}
                    className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium"
                    style={{
                        background: n.type === 'achievement'
                            ? 'linear-gradient(135deg, rgba(30, 25, 10, 0.95), rgba(40, 30, 15, 0.95))'
                            : 'rgba(18, 18, 30, 0.92)',
                        backdropFilter: 'blur(24px)',
                        borderColor: n.type === 'achievement'
                            ? 'rgba(255, 200, 50, 0.3)'
                            : 'rgba(255, 255, 255, 0.1)',
                        boxShadow: n.type === 'achievement'
                            ? '0 8px 32px rgba(255, 180, 0, 0.15), inset 0 1px 0 rgba(255, 200, 50, 0.2)'
                            : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        animation: 'notifSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
                        color: n.type === 'achievement' ? 'rgba(255, 220, 100, 0.95)' : 'rgba(255, 255, 255, 0.9)',
                    }}
                >
                    <span className="text-base flex-shrink-0 mt-0.5">
                        {n.icon || (n.type === 'achievement' ? '🏆' : n.type === 'hint' ? '💡' : 'ℹ️')}
                    </span>
                    <span className="flex-1 leading-relaxed">{n.message}</span>
                    <button
                        onClick={() => dismiss(n.nid)}
                        className="opacity-40 hover:opacity-100 transition-opacity text-xs flex-shrink-0 mt-0.5"
                        aria-label="Dismiss notification"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
