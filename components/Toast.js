import { useEffect } from "react";

/**
 * @param {{ toasts: Array<{id:number, message:string, type?:string}>, onDismiss: (id:number)=>void }} props
 */
export default function Toast({ toasts, onDismiss }) {
    return (
        <div className="fixed bottom-16 right-4 flex flex-col gap-2 z-[500] pointer-events-none">
            {toasts.map(t => (
                <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onDismiss }) {
    useEffect(() => {
        const timer = setTimeout(() => onDismiss(toast.id), 3000);
        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    return (
        <div
            className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-2xl border border-white/10 text-xs font-medium text-white/90 animate-fadeIn"
            style={{
                background: "rgba(18,18,30,0.92)",
                backdropFilter: "blur(20px)",
                minWidth: 200,
                maxWidth: 280,
            }}
        >
            <span className="text-sm">
                {toast.type === 'error' ? '⚠' : toast.type === 'success' ? '✓' : 'ℹ'}
            </span>
            <span className="flex-1">{toast.message}</span>
            <button
                onClick={() => onDismiss(toast.id)}
                className="opacity-40 hover:opacity-100 transition-opacity text-[10px] pointer-events-auto"
                aria-label="Dismiss notification"
            >
                ✕
            </button>
        </div>
    );
}
