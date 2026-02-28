# Build Check

Run a full build validation for this Next.js project and report any errors.

## Steps

1. Run `npm run build` and capture full output
2. If build fails:
   - Identify each error with its file and line number
   - Explain what's wrong
   - Fix the errors directly (read the relevant files first)
   - Re-run the build to confirm it passes
3. If build succeeds:
   - Report bundle sizes for any pages that seem unusually large (>200kB First Load JS)
   - Note any warnings worth addressing

## Common issues to watch for in this project

- Missing imports for new components added to `Desktop.js`
- `useState`/`useEffect` imported from `react` in every component file
- `next/image` vs plain `<img>` warnings
- Unescaped entities in JSX (`'` → `&apos;`, `"` → `&quot;`)
