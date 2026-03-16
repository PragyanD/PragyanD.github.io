# Notification System + Achievement System — Design Spec

## Overview
Add two interconnected features to PDOS: a global toast notification system and a 10-achievement unlock system with a Trophy Case app.

---

## 1. Notification System

### Architecture
- `NotificationContext` provider wrapping the Desktop
- `<NotificationCenter>` component mounted in `Desktop.js`
- Any component can call `notify({ id, message, icon, type })` via context

### Toast Design
- Slides in from top-right, stacks downward (max 3 visible)
- Glass-morphism: `backdrop-filter: blur(40px)`, semi-transparent dark bg
- Layout: small icon left, message text, dismiss X button
- Auto-dismiss after 4s with fade-out animation
- Click to dismiss early

### Notification Types
- `info` — contextual quips on app open
- `achievement` — gold-accented with trophy icon
- `hint` — tips for undiscovered features

### Dedup & Persistence
- Each notification has a unique `id`
- `shownOnce` notifications tracked in localStorage — won't repeat across visits
- Achievement notifications always show on unlock (once per achievement)

### Tone (witty, charming, never corny)
- Terminal open: "Welcome to the command line. Type 'help' if you're feeling lost."
- Games open: "Careful — productivity is about to drop."
- Trash open: "One person's trash is another person's... no, it's still trash."
- 5-min mark: "Still here? I'm flattered."
- 3 apps open: "Multitasker."
- First right-click hint (if not done after 30s): "Psst — try right-clicking the desktop."

---

## 2. Achievement System

### Architecture
- `AchievementProvider` context (can be combined with notification context or separate)
- Static `ACHIEVEMENTS` config array
- Unlock state persisted in localStorage as `{ [id]: timestamp }`
- `useAchievements()` hook exposes: `achievements`, `unlock(id)`, `isUnlocked(id)`, `progress`

### Achievements (10 total)

| ID | Name | Trigger | Locked Hint |
|---|---|---|---|
| `first_boot` | Hello, World | Boot sequence completes | "Everyone starts somewhere" |
| `explorer` | Explorer | Open every app at least once | "There's more to see" |
| `multitasker` | Multitasker | 4+ windows open simultaneously | "Why use one when you can use four?" |
| `terminal_user` | Script Kiddie | Run 5 commands in Terminal | "The command line awaits" |
| `gamer` | Alt+Tab Champion | Win any game | "All work and no play..." |
| `hacker` | Root Access | Run `sudo` in Terminal | "With great power..." |
| `archaeologist` | Digital Archaeologist | Open Trash app | "One person's trash..." |
| `night_owl` | Night Owl | Toggle dark mode | "Try the other side" |
| `wallpaper` | Interior Designer | Change the wallpaper | "Make yourself at home" |
| `completionist` | 100% | All other 9 unlocked | "You know what to do" |

### Unlock Flow
1. Condition met → `unlock(id)` called
2. State saved to localStorage with timestamp
3. Gold notification toast: "Achievement Unlocked: {name}"
4. Trophy Case reflects new unlock on next view
5. Completionist auto-checks when 9/9 others unlocked

### Trophy Case App
- New entry in `APPS_CONFIG`: id `achievements`, icon placeholder (trophy emoji rendered to canvas or simple PNG), rightColumn: true
- UI: progress bar at top ("5/10 Achievements Unlocked")
- Grid of cards: unlocked = vibrant with icon + name + description; locked = greyed, "???" name, hint text
- Newly unlocked cards get a brief glow animation on first view

---

## 3. Integration Points

### Desktop.js
- Wrap children with `NotificationProvider` and `AchievementProvider`
- Mount `<NotificationCenter />`
- Add time-based notification trigger (5-min timer)
- Pass `notify` to context menu dark mode toggle (for night_owl achievement)
- Pass `notify` to wallpaper picker (for wallpaper achievement)

### Window.js / useWindowManager.js
- Track which apps have been opened (for `explorer` achievement)
- Track simultaneous open count (for `multitasker` achievement)

### TerminalApp.js
- Count commands executed (for `terminal_user`)
- Detect `sudo` command (for `hacker`)

### Game components
- Emit win event (for `gamer` achievement)

### BootSequence.js
- Trigger `first_boot` on completion

### apps.config.js
- Add Trophy Case app entry

---

## 4. New Files
- `contexts/NotificationContext.js` — provider, hook, queue logic
- `contexts/AchievementContext.js` — provider, hook, unlock logic, config
- `components/NotificationCenter.js` — toast rendering
- `components/apps/AchievementsApp.js` — trophy case UI

---

## 5. Testing

### Achievement verification tests
Manual test plan + automated checks where feasible:

| Test | Steps | Expected |
|---|---|---|
| `first_boot` unlocks | Load site, complete boot | Toast appears, achievement saved to localStorage |
| `explorer` unlocks | Open all 9 apps (including Achievements) | Unlocks after last unique app opened |
| `multitasker` unlocks | Open 4+ apps without closing any | Unlocks when 4th window opens |
| `terminal_user` unlocks | Open Terminal, run 5 commands | Unlocks after 5th command |
| `hacker` unlocks | Type `sudo` in Terminal | Unlocks immediately |
| `gamer` unlocks | Win any game (e.g., Tic Tac Toe) | Unlocks on win condition |
| `archaeologist` unlocks | Open Trash app | Unlocks on open |
| `night_owl` unlocks | Toggle dark mode via context menu | Unlocks on toggle |
| `wallpaper` unlocks | Change wallpaper via context menu | Unlocks on selection |
| `completionist` unlocks | Unlock all 9 above | Auto-unlocks, toast appears |
| No duplicate toasts | Trigger same achievement twice | Only one toast ever shown |
| Persistence | Unlock achievements, reload page | All still unlocked in Trophy Case |
| Toast stacking | Trigger 4+ notifications rapidly | Max 3 visible, 4th queues |
| Toast auto-dismiss | Wait after notification | Fades after 4s |
| Trophy Case progress | Unlock 5 achievements, open app | Progress bar shows "5/10" |

### Automated test approach
- Create `__tests__/achievements.test.js` using Jest + React Testing Library
- Test `AchievementContext` in isolation: unlock, persistence, completionist auto-detection
- Test `NotificationContext`: queue management, max visible, dedup
- Test integration: triggering unlock dispatches notification
