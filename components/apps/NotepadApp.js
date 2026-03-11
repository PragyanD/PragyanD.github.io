const CONTENT = `PDOS — Hidden Features & Easter Eggs
======================================
Written for curious recruiters and developers.

[ KEYBOARD SHORTCUTS ]
  Cmd/Ctrl + K      Open Spotlight search
  Right-click       Context menu (wallpaper, theme, about)

[ HIDDEN INTERACTIONS ]
  Taskbar clock     Click to open a calendar
  Volume icon       Click to open volume slider
  Start menu        Bottom-left PDOS button

[ CUSTOMISATION ]
  Right-click desktop → Change Wallpaper
    Includes: Bliss, Hierapolis, Mysore, Pamukkale, Salkantay
  Right-click desktop → Display Settings (dark theme toggle)

[ APPS WITH PERSONALITY ]
  Trash             Contains a curated list of files every
                    developer has definitely never committed
  Terminal          Fully interactive. Type help to see
                    all available commands
  Games             Hidden games hub

[ BOOT SEQUENCE ]
  Hit Restart in the Start Menu to replay the boot sequence.
  Specs are... slightly exaggerated.

[ SOURCE CODE ]
  github.com/PragyanD/PragyanD.github.io
`;

export default function NotepadApp({ darkTheme = false }) {
  const bg = darkTheme ? "#0a0a1e" : "#fff";
  const text = darkTheme ? "rgba(255,255,255,0.8)" : "#222";
  const headerBg = darkTheme ? "rgba(255,255,255,0.04)" : "#f5f5f5";
  const headerBorder = darkTheme ? "rgba(255,255,255,0.08)" : "#e0e0e0";

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: bg }}>
      {/* Toolbar */}
      <div
        className="flex items-center px-4 py-2 flex-shrink-0 text-xs gap-4"
        style={{ background: headerBg, borderBottom: `1px solid ${headerBorder}`, color: text, opacity: 0.6 }}
      >
        <span>easter_eggs.txt</span>
        <span style={{ marginLeft: "auto" }}>Read Only</span>
      </div>
      {/* Content */}
      <pre
        className="flex-1 overflow-y-auto os-scroll p-6 text-xs leading-relaxed whitespace-pre-wrap"
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          color: text,
          background: bg,
          userSelect: "text",
          WebkitUserSelect: "text",
        }}
      >
        {CONTENT}
      </pre>
    </div>
  );
}
