# AGENTS.md

## Cursor Cloud specific instructions

This is a **front-end-only** Next.js 16 prototype (no backend, no database, no external APIs). All data is hardcoded mock data.

### Services

| Service | Command | Port |
|---|---|---|
| Next.js dev server | `npm run dev` | 3000 |

No other services (database, backend, Docker) are needed.

### Common commands

See `package.json` scripts for standard commands:
- **Dev server**: `npm run dev`
- **Lint**: `npm run lint` (ESLint 9; note: there are 2 pre-existing lint errors in `src/app/page.tsx` related to `react-hooks/set-state-in-effect`)
- **Build**: `npm run build`
- **Start (production)**: `npm run start`

### Gotchas

- The project uses **npm** (lockfile: `package-lock.json`). Do not use pnpm/yarn.
- Next.js 16 with Turbopack is used for both dev and build.
- No `.env` files or environment variables are required.
