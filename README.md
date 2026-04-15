# PL Relegation Tracker 2025/26

A Premier League relegation probability tracker for the 2025/26 season. Uses Monte Carlo simulation (200,000 runs) to model relegation odds, expected points, and survival scenarios for bottom-6 teams.

## Tech Stack

- **Framework:** Next.js 16 with React 19, TypeScript
- **Styling:** Tailwind CSS v4 (dark theme)
- **Build:** Static export (`output: "export"`)
- **Hosting:** Cloudflare Pages

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production (static export to out/)
npm run lint     # Run ESLint
```

## Deploying to Cloudflare Pages

Build the static site, then deploy using Wrangler:

```bash
npm run build
npx wrangler pages deploy out --project-name=pl-relegation-tracker
```

## Updating Simulation Data

1. Update match results in `25-26-season.json`
2. Update the team points and bottom teams in `pl_analysis.py`
3. Run `python3 pl_analysis.py` to generate new simulation results
4. Update `app/page.tsx` with the new data
