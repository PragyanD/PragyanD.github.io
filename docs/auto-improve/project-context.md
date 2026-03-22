# Project Context

## Identity
- **Name:** PDOS (Portfolio Desktop OS)
- **Type:** web-app
- **Purpose:** Interactive portfolio website styled as a desktop operating system, showcasing Pragyan Das's projects, experience, and resume
- **Target Users:** Recruiters, hiring managers, fellow developers visiting the portfolio

## Tech Stack
- **Languages:** JavaScript (~6230 LOC across 43 files)
- **Frameworks:** Next.js 13, React 18, Tailwind CSS 3
- **Database:** None (localStorage for persistence)
- **Build System:** Next.js built-in
- **Package Manager:** npm

## Architecture
- **Entry Points:** `pages/index.js` (mobile gate + boot sequence), `components/Desktop.js` (main shell)
- **Key Directories:**
  - `components/` — Desktop shell, Window, Taskbar, Spotlight, BootSequence, NotificationCenter, etc.
  - `components/apps/` — 9 app components (About, Projects, Resume, Terminal, TaskManager, Games, Notepad, Trash, Achievements)
  - `hooks/` — useWindowManager, useAudio
  - `contexts/` — NotificationContext, AchievementContext
  - `lib/` — apps.config.js (central registry)
  - `styles/` — globals.css
- **UI Layer:** React with Tailwind CSS, glassmorphism aesthetic
- **API Layer:** Minimal (pages/api/hello.js placeholder)
- **Data Layer:** localStorage for window state, wallpaper, achievements, theme

## Quality Signals
- **Test Coverage:** Minimal — Jest configured, 1 test file (`__tests__/achievements.test.js`)
- **CI/CD:** None
- **Linting:** ESLint (next config)
- **Type Safety:** No (plain JS, no TypeScript)

## Current State
- **Maturity:** MVP/early-production
- **Recent Activity:**
  - refine
  - change achievements icon
  - add notification system and achievement system with trophy case
  - add design spec for notification system and achievement system
  - update google tag for seo
