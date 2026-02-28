# New Desktop UI Component

Create a new reusable UI component for this project: **$ARGUMENTS**

## Context

This is a Next.js portfolio styled as a desktop OS (PragyanOS / PDOS).
Stack: React, Tailwind CSS, no component library.

Key existing components to reference before writing:
- `components/DesktopIcon.js` — draggable icon with hover/click states
- `components/Window.js` — draggable, resizable window chrome
- `components/Taskbar.js` — bottom bar with app buttons and system tray

## Rules

- **File location**: `components/` for system UI, `components/apps/` for app content
- **Styling**: Tailwind utility classes only; use `rgba` via inline style only for semi-transparent glass effects
- **Glass effect pattern**: `bg-white/5 backdrop-blur border border-white/10 rounded-xl`
- **No prop-types or TypeScript** — plain JS, consistent with the rest of the codebase
- **No new npm packages** unless explicitly requested
- Export as default function

## After creating the file

Show the import line the user needs to add, and where to place it.
