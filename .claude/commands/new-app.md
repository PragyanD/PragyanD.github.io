# New Desktop App

Scaffold a new app window for this project: **$ARGUMENTS**

## Steps

1. **Create `components/apps/${AppName}App.js`** following the existing app pattern.
   Reference `components/apps/ProjectsApp.js` or `components/apps/TerminalApp.js` for structure.
   The component should be a default export with no required props (it renders inside a `<Window>`).

2. **Register in `components/Desktop.js`**:
   - Import the new component at the top
   - Add an entry to the `APPS` object with `title`, `icon`, `component`, `width`, `height`, `initialX`, `initialY`
   - Add an entry to `DESKTOP_ICONS` array with `id`, `icon`, `label`

3. **Style rules**:
   - Background: `bg-[#1a1a2e]` or match existing app backgrounds
   - Text: white/muted white, `font-mono` for terminal-style content
   - Scrollable content: `overflow-y-auto` with custom scrollbar via `globals.css` pattern
   - Use Tailwind only — no inline style objects unless necessary for dynamic values

4. **Verify**: confirm the app opens from both the desktop icon (double-click) and the Start Menu.
