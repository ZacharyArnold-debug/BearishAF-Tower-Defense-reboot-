# BearishAF Tower Defense (Reboot)

This repo contains the Next.js game under `tower-defense-game (1)/` and the PRD.

Quick start (local):

- Requirements: Node 18+ (or 20+), PNPM or NPM
- Change into the app folder:
  - `cd "tower-defense-game (1)"`
- Install deps:
  - With PNPM: `pnpm install`
  - Or with NPM: `npm install`
- Run dev server:
  - PNPM: `pnpm dev`
  - NPM: `npm run dev`

Notes:

- If Tailwind isn’t installed, run: `pnpm add -D tailwindcss autoprefixer` (or the npm equivalent). The config files are already present.
- Game entry: `app/game/page.tsx`. Landing page at `/` links to `/game`.
- PRD: `PRD_Grind_Tower_Defense_v1.md`.
