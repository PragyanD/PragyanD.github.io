# Auto-Improve Implementation Plan — 2026-03-22

## Overview
16 improvement proposals across performance, accessibility, UX, refactoring, and features.
Organized into 4 phases by dependency order. Each phase can have tasks run in parallel.

---

## Phase 1: Quick Fixes & Foundation (no dependencies, all parallel)

### Task 1.1: Compress Wallpaper JPGs
- **Proposal:** #3
- **Files:** `public/wallpaper_*.jpg`
- **Action:** Use ImageMagick to resize to max 2560px wide, compress to quality 82, strip metadata. Target: each JPG under 500KB.
- **Command:** `mogrify -strip -quality 82 -resize "2560x>" -sampling-factor 4:2:0 -interlace JPEG public/wallpaper_*.jpg`

### Task 1.2: Fix ProjectsApp Light-Theme Bug
- **Proposal:** #10
- **Files:** `components/apps/ProjectsApp.js`
- **Action:** Replace hardcoded `rgba(255,255,255,...)` and `text-white/*` in the GitHub links and "On GitHub" section with theme-aware values from the existing `t` theme object.

### Task 1.3: Add Boot Skip Button
- **Proposal:** #1
- **Files:** `components/BootSequence.js`
- **Action:** Add a "Press any key or click to skip" handler. Add `role="progressbar"` with `aria-valuenow/min/max` to the progress bar. Add `aria-live="polite"` for screen readers.

### Task 1.4: Preload Default Wallpaper During Boot
- **Proposal:** #13
- **Files:** `pages/index.js`
- **Action:** Add `<link rel="preload" as="image" href="/wallpaper_bliss.avif" type="image/avif">` and JPG fallback in `<Head>`.

### Task 1.5: Create localStorage Utility
- **Proposal:** #12
- **Files:** New `lib/storage.js`
- **Action:** Create `getJSON(key, fallback)` and `setJSON(key, value)` helpers with try/catch. Define `STORAGE_KEYS` constant. Update all direct localStorage calls across the codebase.

---

## Phase 2: Architecture & Performance (builds on Phase 1)

### Task 2.1: Replace onAchievement Prop Drilling
- **Proposal:** #11
- **Files:** `components/Desktop.js`, `components/apps/GamesHubApp.js`, `components/apps/TerminalApp.js`, all game components
- **Action:** Remove `onAchievement` prop passing. Each app/game calls `useAchievements()` directly.

### Task 2.2: Lazy-Load App Components
- **Proposal:** #2
- **Files:** `lib/apps.config.js`
- **Action:** Replace static imports with `next/dynamic` imports using `ssr: false` and loading placeholders.

### Task 2.3: Extract Desktop.js Into Smaller Components
- **Proposal:** #6
- **Files:** `components/Desktop.js` → extract into:
  - `components/WallpaperPicker.js`
  - `components/DisplaySettings.js`
  - `components/VolumeControl.js`
  - `components/DesktopContextMenu.js`
- **Action:** Extract each inline modal/popup into its own component. Desktop.js should drop to ~300 lines.

### Task 2.4: Deduplicate Context Menu Styling
- **Proposal:** #15
- **Files:** New `components/ContextMenu.js`, update `Desktop.js`, `Window.js`, `Taskbar.js`
- **Action:** Create shared `<ContextMenu>`, `<MenuItem>`, `<MenuDivider>` components. Replace 3 duplicate implementations.

### Task 2.5: Optimize Window Mousemove Listeners
- **Proposal:** #14
- **Files:** `components/Window.js`
- **Action:** Move `addEventListener('mousemove/mouseup')` into `onMouseDown` handlers. Remove from `useEffect`. Clean up on mouseup.

---

## Phase 3: Accessibility (builds on Phase 2's cleaner architecture)

### Task 3.1: ARIA Live Regions & Dialog Semantics
- **Proposal:** #4
- **Files:** `components/NotificationCenter.js`, `components/Toast.js`, `components/WallpaperPicker.js`, `components/DisplaySettings.js`, `components/StartMenu.js`
- **Action:**
  - Add `aria-live="polite"` to notification container
  - Add `role="status"` to notification items
  - Add `role="dialog"` + `aria-modal="true"` to all modal overlays
  - Add focus trapping to modals (lightweight custom implementation, no new deps)

### Task 3.2: Keyboard Accessibility for Icons & Windows
- **Proposal:** #5
- **Files:** `components/DesktopIcon.js`, `components/Window.js`
- **Action:**
  - Add `onKeyDown` to DesktopIcon: Enter/Space opens the app
  - Add `tabIndex={0}` and `role="dialog"` + `aria-label` to Window
  - Add keyboard shortcuts for window management (already partially done with Cmd+W/M)

---

## Phase 4: Features (independent new work)

### Task 4.1: Project Case Studies with Impact Metrics
- **Proposal:** #7
- **Files:** `components/apps/ProjectsApp.js`
- **Action:** Add "challenge / approach / impact" expandable detail view to project cards. Add quantified impact metrics where available.

### Task 4.2: Functional Mobile Experience
- **Proposal:** #8
- **Files:** `pages/index.js`, new `components/MobileLayout.js`
- **Action:** Replace the 3-link mobile gate with a scrollable card-based layout showing About bio, experience, project cards, and resume download. Reuse data from existing app components.

### Task 4.3: AI Portfolio Chatbot in Terminal
- **Proposal:** #9
- **Files:** `components/apps/TerminalApp.js`, new `lib/chatbot.js`
- **Action:** Add `ask` or `chat` command to Terminal. Rule-based keyword matcher against structured Q&A data from existing bio/project/skills content.

### Task 4.4: Visitor Analytics Dashboard
- **Proposal:** #16
- **Files:** New `components/apps/SystemMonitorApp.js`, update `lib/apps.config.js`
- **Action:** Client-side analytics using localStorage: track app opens, session count, time spent, achievement completion. Display as an OS-style system monitor widget.

---

## Execution Strategy
- **Phases 1-2:** Tasks within each phase are independent → run as parallel worktree agents
- **Phase 3:** Depends on Phase 2 (cleaner component structure) → run after Phase 2 merges
- **Phase 4:** Independent features → run as parallel worktree agents after Phase 3
- Each agent commits its changes in its worktree; main agent merges sequentially
