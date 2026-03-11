# PDOS — Portfolio Desktop OS

Next.js 13 + React 18 + Tailwind. No TypeScript.

## Commands

```bash
npm run dev    # localhost:3000
npm run build
npm run lint
```

## Key Files

- `pages/index.js` — entry, gates mobile (<768px)
- `lib/apps.config.js` — **central app registry** (APPS_CONFIG array)
- `components/Desktop.js` — OS shell
- `components/Window.js` — draggable/resizable window chrome
- `hooks/useWindowManager.js` — open/close/minimize/maximize state
- `components/apps/` — individual app components
- `public/startup.wav` — boot chime

## Adding an App

1. Create `components/apps/YourApp.js`
2. Add entry to `APPS_CONFIG` in `lib/apps.config.js` with: `id`, `title`, `label`, `iconSrc`, `component`, `width`, `height`, `initialX`, `initialY`, `themeColor`, `spotlightName/Emoji/Keywords`
3. Add icon to `public/`

`rightColumn: true` places desktop icon on the right side.

## Gotchas

- `themeColor` drives per-window accent color
- Custom Tailwind colors: `os-accent` (#0078d4), `os-dark`, `os-title`, `os-window`
- Custom fonts: `font-inter`, `font-grotesk`

## Git Workflow

When making commits, only commit — do not push unless explicitly asked. User manages push timing separately.
