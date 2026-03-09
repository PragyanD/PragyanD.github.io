# Wallpaper Picker + Taskbar Pill Context Menu Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Widen the wallpaper picker panel so labels aren't crowded, and add a right-click context menu to taskbar pills with Close, Minimize/Restore, Maximize/Restore, Bring to Front, and Send to Back.

**Architecture:** Wallpaper fix is a single CSS value change. Pill menu requires: (1) moving `maximized` boolean from Window.js local state into `useWindowManager`; (2) adding `sendToBack` to the window manager; (3) threading 6 new props from Desktop.js to Taskbar.js; (4) a `pillMenu` state-driven popup rendered via `createPortal` in Taskbar.js.

**Tech Stack:** React 18, Next.js 13, Tailwind CSS, `createPortal` for the context menu.

---

## Task 1 — Fix wallpaper picker panel width

**File:** `components/Desktop.js`

**Problem:** The wallpaper picker panel is `width: 320`, giving each of the 5 grid cells only ~56px — not enough for labels like "Hierapolis" or "Pamukkale".

**Step 1: Find the wallpaper picker panel div**

Read `components/Desktop.js`. Find the `{/* Wallpaper Picker */}` section (around line 419). Inside, there is a nested `<div>` with `style={{ background: "rgba(18,18,30,0.95)", backdropFilter: "blur(40px)", width: 320 }}`. This is the panel to widen.

**Step 2: Change the width**

Change `width: 320` to `width: 440` in that style object. Do not change anything else.

**Step 3: Verify**

Open the app in dev server (`npm run dev` on port 3001). Right-click the desktop → "Change Wallpaper". All 5 labels ("Bliss", "Hierapolis", "Mysore", "Pamukkale", "Salkantay") should be readable with no truncation or wrapping.

**Step 4: Commit**

```bash
git add components/Desktop.js
git commit -m "fix: widen wallpaper picker panel from 320 to 440px"
```

---

## Task 2 — Add `maximizedWindows` + `toggleMaximize` + `sendToBack` to useWindowManager

**File:** `hooks/useWindowManager.js`

**Context:** Currently `useWindowManager` tracks `openWindows`, `minimizedWindows`, `focusOrder`, and animation states. We need to add:
- `maximizedWindows` — a `Set` of app IDs that are currently maximized
- `toggleMaximize(appId)` — adds/removes appId from the set
- `sendToBack(appId)` — moves appId to the FRONT of `focusOrder` (lowest z-index)

**Step 1: Read the file**

Read `hooks/useWindowManager.js` to understand the current state structure (it's ~103 lines). Note:
- State is at lines 8–18
- `closeApp` cleanup at lines 42–52
- Return object at lines 89–102

**Step 2: Add the new state and actions**

After the existing state declarations (after line 18, before `const openApp`), add:

```js
const [maximizedWindows, setMaximizedWindows] = useState(new Set());
```

After the existing `closeApp` useCallback, add:

```js
const toggleMaximize = useCallback((appId) => {
    setMaximizedWindows(prev => {
        const next = new Set(prev);
        if (next.has(appId)) next.delete(appId);
        else next.add(appId);
        return next;
    });
}, []);

const sendToBack = useCallback((appId) => {
    setFocusOrder(prev => [appId, ...prev.filter(id => id !== appId)]);
}, []);
```

Also update `closeApp` to clean up when a window closes. Inside the `setTimeout` callback in `closeApp` (the one that calls `setOpenWindows`, `setMinimizedWindows`, `setFocusOrder`), also add:

```js
setMaximizedWindows(prev => { const next = new Set(prev); next.delete(appId); return next; });
```

**Step 3: Add to the return object**

In the `return { ... }` at the end of the hook, add:

```js
maximizedWindows,
toggleMaximize,
sendToBack,
```

**Step 4: Verify**

The hook now exports 3 new items. No visual change yet.

**Step 5: Commit**

```bash
git add hooks/useWindowManager.js
git commit -m "feat: add maximizedWindows, toggleMaximize, sendToBack to useWindowManager"
```

---

## Task 3 — Update Window.js to use prop-based `maximized`

**File:** `components/Window.js`

**Context:** Currently `maximized` is `useState(false)` at line 23. We're moving it to a prop so the window manager (and taskbar) can control it. The prevState save/restore logic stays in Window.js — the local `toggleMaximize` function handles it when triggered from the title bar/button. A separate `useEffect` handles the external case (triggered from Taskbar context menu).

**Step 1: Read Window.js (lines 1–60)**

Understand the props destructuring (lines 4–22) and state declarations (lines 23–55). Key things to note:
- Line 23: `const [maximized, setMaximized] = useState(false);` — this gets removed
- Lines 51–55: `posRef`, `sizeRef` already exist as refs
- Line 49: `prevState` ref already exists

**Step 2: Update props and remove local state**

In the function signature (line 4–22), add two new props after `themeColor`:

```js
    maximized = false,
    onMaximize,
```

Remove line 23 entirely:
```js
const [maximized, setMaximized] = useState(false);  // DELETE THIS LINE
```

**Step 3: Replace the `toggleMaximize` local function**

Find the `const toggleMaximize = () => { ... }` block at lines 182–194. Replace the entire block with:

```js
const toggleMaximize = useCallback(() => {
    if (!maximized) {
        prevState.current = { pos: { ...posRef.current }, size: { ...sizeRef.current } };
    } else {
        if (prevState.current) {
            setPos(prevState.current.pos);
            setSize(prevState.current.size);
            prevState.current = null;
        }
    }
    onMaximize?.();
    onFocus?.(id);
}, [maximized, onMaximize, id, onFocus]);
```

**Step 4: Add `useEffect` for external (Taskbar) maximize changes**

After the `useEffect(() => { posRef.current = pos; }, [pos]);` line (line 54), add:

```js
const prevMaximizedRef = useRef(maximized);
useEffect(() => {
    const was = prevMaximizedRef.current;
    prevMaximizedRef.current = maximized;
    if (maximized && !was && !prevState.current) {
        // External maximize (from Taskbar): save current state
        prevState.current = { pos: { ...posRef.current }, size: { ...sizeRef.current } };
    } else if (!maximized && was && prevState.current) {
        // External unmaximize (from Taskbar): restore
        setPos(prevState.current.pos);
        setSize(prevState.current.size);
        prevState.current = null;
    }
}, [maximized]); // eslint-disable-line react-hooks/exhaustive-deps
```

Note: `posRef` and `sizeRef` are intentionally not in deps (we want the values at the moment of maximizing, not stale closure values — refs are the correct tool here).

**Step 5: Verify no other setMaximized calls remain**

Check that no `setMaximized` calls remain in the file. The only references to `maximized` should be reads. All toggle calls go through the local `toggleMaximize` → `onMaximize()` chain.

**Step 6: Verify in browser**

- Open any window, double-click the title bar → maximizes ✓
- Double-click again → restores to previous pos/size ✓
- Click the green traffic light → toggles maximize ✓
- (Taskbar trigger tested after Task 5)

**Step 7: Commit**

```bash
git add components/Window.js
git commit -m "refactor: move maximized state to useWindowManager, Window reads it as prop"
```

---

## Task 4 — Thread new props through Desktop.js

**File:** `components/Desktop.js`

**Context:** Desktop.js calls `useWindowManager` (line 82–87) and renders both `<Window>` (lines 318–300) and `<Taskbar>` (lines 356–364). We need to:
1. Destructure `maximizedWindows, toggleMaximize, sendToBack` from the hook
2. Pass `maximized` and `onMaximize` to each `<Window>`
3. Pass 6 new props to `<Taskbar>`

**Step 1: Update useWindowManager destructuring**

Find the `useWindowManager` call (around line 82). Currently:

```js
const {
    minimizedWindows, focusOrder, minimizing, restoring, closing,
    activeWindows, allRunning,
    openApp, closeApp, minimizeApp, focusApp,
} = useWindowManager(useCallback(() => setStartOpen(false), []));
```

Add the three new items:

```js
const {
    minimizedWindows, focusOrder, minimizing, restoring, closing,
    activeWindows, allRunning,
    openApp, closeApp, minimizeApp, focusApp,
    maximizedWindows, toggleMaximize, sendToBack,
} = useWindowManager(useCallback(() => setStartOpen(false), []));
```

**Step 2: Pass props to `<Window>`**

Find the `<Window>` JSX (lines 318–300). Currently it has `themeColor={app.themeColor}` as the last prop before `>`. Add two more props:

```jsx
maximized={maximizedWindows.has(appId)}
onMaximize={() => toggleMaximize(appId)}
```

**Step 3: Pass props to `<Taskbar>`**

Find the `<Taskbar>` JSX (lines 356–364). Currently:

```jsx
<Taskbar
    openWindows={allRunning}
    minimizedWindows={minimizedWindows}
    onStartClick={() => setStartOpen((prev) => !prev)}
    startOpen={startOpen}
    onRestoreWindow={openApp}
    onOpenApp={openApp}
    onVolumeClick={() => setSoundOpen(prev => !prev)}
/>
```

Add 6 new props:

```jsx
<Taskbar
    openWindows={allRunning}
    minimizedWindows={minimizedWindows}
    maximizedWindows={maximizedWindows}
    onStartClick={() => setStartOpen((prev) => !prev)}
    startOpen={startOpen}
    onRestoreWindow={openApp}
    onOpenApp={openApp}
    onVolumeClick={() => setSoundOpen(prev => !prev)}
    onCloseApp={closeApp}
    onMinimizeApp={minimizeApp}
    onMaximizeApp={toggleMaximize}
    onBringToFront={focusApp}
    onSendToBack={sendToBack}
/>
```

**Step 4: Verify**

No visual change yet. The window maximize button and title-bar double-click should still work (Task 3 should have ensured this). Taskbar context menu is in Task 5.

**Step 5: Commit**

```bash
git add components/Desktop.js
git commit -m "feat: thread maximize and taskbar action props through Desktop"
```

---

## Task 5 — Add pill context menu to Taskbar.js

**File:** `components/Taskbar.js`

**Context:** The `Taskbar` function signature currently accepts `openWindows, minimizedWindows, onStartClick, startOpen, onRestoreWindow, onOpenApp, onVolumeClick`. We're adding 6 new props and a `pillMenu` popup.

The pill `<button>` currently has `onMouseDown` for drag+click. We add `onContextMenu` to open the menu. The menu renders via `createPortal` to `document.body`, positioned just above the taskbar at the cursor's X position.

**Step 1: Read Taskbar.js lines 112–180**

Find the function signature and state declarations. The `handlePillMouseDown` function is at lines 236–289.

**Step 2: Update the function signature**

Change the Taskbar function signature from:

```js
export default function Taskbar({ openWindows, minimizedWindows, onStartClick, startOpen, onRestoreWindow, onOpenApp, onVolumeClick }) {
```

to:

```js
export default function Taskbar({
    openWindows, minimizedWindows, maximizedWindows,
    onStartClick, startOpen,
    onRestoreWindow, onOpenApp, onVolumeClick,
    onCloseApp, onMinimizeApp, onMaximizeApp,
    onBringToFront, onSendToBack,
}) {
```

**Step 3: Add `pillMenu` state and dismiss logic**

After the existing `closingPills` state declaration (around line 113), add:

```js
const [pillMenu, setPillMenu] = useState(null); // { appId, x, y } | null
const pillMenuRef = useRef(null);
```

Add a `useEffect` for keyboard dismiss and outside-click dismiss. Place it after the `pillOrder` state declarations (around line 148):

```js
useEffect(() => {
    if (!pillMenu) return;
    const onKey = (e) => { if (e.key === 'Escape') setPillMenu(null); };
    const onDown = (e) => {
        if (pillMenuRef.current && !pillMenuRef.current.contains(e.target))
            setPillMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('mousedown', onDown);
    };
}, [pillMenu]);
```

**Step 4: Add `onContextMenu` to the pill button**

Find the pill `<button>` element (around line 363). It currently starts with:

```jsx
<button
    onMouseDown={(e) => handlePillMouseDown(e, appId)}
    aria-label={...}
```

Add the `onContextMenu` handler:

```jsx
<button
    onMouseDown={(e) => handlePillMouseDown(e, appId)}
    onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setPillMenu({ appId, x: e.clientX, y: e.clientY });
    }}
    aria-label={...}
```

**Step 5: Add the context menu portal**

Find the `return (` in the Taskbar component (around line 291). Just before the closing `</div>` at the very end of the return (around line 414, after the Clock), add the portal:

```jsx
{/* Pill right-click context menu */}
{pillMenu && typeof document !== 'undefined' && createPortal(
    <div
        ref={pillMenuRef}
        role="menu"
        className="fixed flex flex-col p-1 rounded-xl shadow-2xl"
        style={{
            left: Math.min(pillMenu.x, window.innerWidth - 164),
            bottom: 52,
            width: 156,
            zIndex: 9999,
            background: "rgba(18,18,30,0.96)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.4)",
        }}
        onContextMenu={e => e.preventDefault()}
        onMouseDown={e => e.stopPropagation()}
    >
        {/* Minimize / Restore */}
        {minimizedWindows.includes(pillMenu.appId) ? (
            <button role="menuitem" className="text-left px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded-lg transition-colors w-full"
                onClick={() => { onRestoreWindow(pillMenu.appId); setPillMenu(null); }}>
                Restore
            </button>
        ) : (
            <button role="menuitem" className="text-left px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded-lg transition-colors w-full"
                onClick={() => { onMinimizeApp(pillMenu.appId); setPillMenu(null); }}>
                Minimize
            </button>
        )}

        {/* Maximize / Restore Down — only if not minimized */}
        {!minimizedWindows.includes(pillMenu.appId) && (
            maximizedWindows?.has(pillMenu.appId) ? (
                <button role="menuitem" className="text-left px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded-lg transition-colors w-full"
                    onClick={() => { onMaximizeApp(pillMenu.appId); setPillMenu(null); }}>
                    Restore Down
                </button>
            ) : (
                <button role="menuitem" className="text-left px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded-lg transition-colors w-full"
                    onClick={() => { onMaximizeApp(pillMenu.appId); setPillMenu(null); }}>
                    Maximize
                </button>
            )
        )}

        <div className="h-px my-1 mx-2 bg-white/10" />

        {/* Bring to Front */}
        <button role="menuitem" className="text-left px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded-lg transition-colors w-full"
            onClick={() => { onBringToFront(pillMenu.appId); setPillMenu(null); }}>
            Bring to Front
        </button>

        {/* Send to Back */}
        <button role="menuitem" className="text-left px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded-lg transition-colors w-full"
            onClick={() => { onSendToBack(pillMenu.appId); setPillMenu(null); }}>
            Send to Back
        </button>

        <div className="h-px my-1 mx-2 bg-white/10" />

        {/* Close */}
        <button role="menuitem" className="text-left px-3 py-1.5 text-xs hover:bg-white/10 rounded-lg transition-colors w-full"
            style={{ color: '#ff453a' }}
            onClick={() => { onCloseApp(pillMenu.appId); setPillMenu(null); }}>
            Close
        </button>
    </div>,
    document.body
)}
```

**Step 6: Add `createPortal` import**

At the top of `Taskbar.js` (line 1), update the React import to include `createPortal`:

```js
import { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
```

**Step 7: Verify**

- Right-click a pill → context menu appears above the taskbar at cursor position
- Press Escape → menu closes
- Click outside → menu closes
- Click Minimize → window minimizes; pill right-click now shows "Restore"
- Click Restore → window restores
- Click Maximize → window fills screen; right-click shows "Restore Down"
- Click Restore Down → window returns to previous size and position
- Click Bring to Front → window comes to front (focused)
- Click Send to Back → window goes behind all others
- Click Close → window closes with animation, pill disappears

**Step 8: Commit**

```bash
git add components/Taskbar.js
git commit -m "feat: add right-click context menu to taskbar pills"
```

---

## Execution Order Summary

| # | Task | Files | Complexity |
|---|---|---|---|
| 1 | Wallpaper picker width | Desktop.js | Trivial (1 line) |
| 2 | Window manager state | useWindowManager.js | Easy |
| 3 | Window.js prop-based maximize | Window.js | Medium |
| 4 | Thread props through Desktop | Desktop.js | Easy |
| 5 | Pill context menu | Taskbar.js | Medium |

## Verification Checklist

- [ ] Wallpaper picker labels all readable (not truncated)
- [ ] Window maximize via title-bar double-click still works
- [ ] Window maximize via green traffic light still works
- [ ] Right-click pill → menu appears above taskbar
- [ ] Menu dismisses on Escape and outside click
- [ ] Minimize / Restore toggles correctly via pill menu
- [ ] Maximize / Restore Down toggles correctly (restores window to previous size/position)
- [ ] Bring to Front focuses the window
- [ ] Send to Back moves window behind others
- [ ] Close removes the window and pill
- [ ] No regressions: dragging, snapping, resize handles all still work
