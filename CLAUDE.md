# PL Relegation Tracker 2025/26

## Project Overview
A Premier League relegation probability tracker for the 2025/26 season. Uses Monte Carlo simulation results (200k simulations) to visualize relegation odds, expected points, and survival scenarios for bottom-7 teams. Data is for Matchday 30 (15 March 2026).

## Tech Stack
- **Framework:** Next.js 16 with React 19, TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (dark theme)
- **Build:** Static export (`output: "export"` in next.config.ts)
- **Fonts:** Geist Sans / Geist Mono (Google Fonts)

## Project Structure
- `app/page.tsx` — Main page with all data, components, and UI (~606 lines)
- `app/layout.tsx` — Root layout with metadata and fonts
- `app/globals.css` — Tailwind import + dark theme CSS variables
- `next.config.ts` — Static export config, unoptimized images

## Development Commands
```bash
npm run dev      # Start dev server
npm run build    # Build for production (static export to out/)
npm run lint     # Run ESLint
```

## Architecture Notes
- Single-page app; all content lives in `app/page.tsx`
- Data is hardcoded in arrays/objects (standings, probabilities, fixtures, etc.)
- Helper components (`SectionHeading`, `Badge`) are defined inline in page.tsx
- Path alias: `@/*` maps to project root
