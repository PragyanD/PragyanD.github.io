import { useState, useEffect, useRef } from 'react';
import { APPS_CONFIG } from '../lib/apps.config';

const SEARCH_ITEMS = APPS_CONFIG.map(app => ({
    id: app.id,
    name: app.spotlightName,
    type: 'app',
    iconSrc: app.iconSrc,
    keywords: app.spotlightKeywords,
}));

export default function Spotlight({ isOpen, onClose, onOpenApp }) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    const filtered = SEARCH_ITEMS.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.keywords.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filtered.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
        } else if (e.key === 'Enter') {
            const item = filtered[selectedIndex];
            if (item) {
                onOpenApp(item.id);
                onClose();
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
            <div
                className="w-full max-w-[600px] bg-[#1a1a1a]/80 backdrop-blur-[60px] rounded-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 flex items-center gap-4 border-b border-white/5">
                    <svg className="w-5 h-5 opacity-40 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search apps, files, or settings..."
                        aria-label="Spotlight search"
                        role="combobox"
                        aria-expanded={filtered.length > 0}
                        aria-controls="spotlight-listbox"
                        aria-autocomplete="list"
                        className="flex-1 bg-transparent border-none outline-none text-xl text-white/90 placeholder:text-white/20"
                        value={query}
                        onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/40 font-mono">
                        ESC
                    </div>
                </div>

                <div id="spotlight-listbox" className="max-h-[400px] overflow-y-auto os-scroll" role="listbox" aria-label="Search results">
                    {filtered.length > 0 ? (
                        <div className="p-2">
                            {filtered.map((item, index) => (
                                <div
                                    key={item.id}
                                    role="option"
                                    aria-selected={index === selectedIndex}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-default transition-all ${index === selectedIndex ? 'bg-white/10 shadow-inner' : 'hover:bg-white/5'
                                        }`}
                                    onClick={() => { onOpenApp(item.id); onClose(); }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg border border-white/5 overflow-hidden p-1.5">
                                        <img src={item.iconSrc} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white/90">{item.name}</p>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{item.type}</p>
                                    </div>
                                    {index === selectedIndex && (
                                        <span className="text-[10px] text-white/40 font-mono">ENTER</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-sm text-white/20 italic">No results found for &quot;{query}&quot;</p>
                        </div>
                    )}
                </div>

                <div className="p-3 bg-black/20 border-t border-white/5 flex justify-between items-center px-5">
                    <div className="flex gap-4 text-[10px] text-white/30">
                        <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1 rounded">↑↓</kbd> Navigate</span>
                        <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1 rounded">Enter</kbd> Open</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
