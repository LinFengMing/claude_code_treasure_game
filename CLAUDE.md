# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install           # Install dependencies
npm run dev           # Start both Vite (frontend) + Express (backend) concurrently
npm run dev:frontend  # Frontend only (Vite on http://localhost:3000)
npm run dev:server    # Backend only (Express via tsx watch)
npm run build         # Production build to build/ directory
```

There are no lint or test commands configured.

## Architecture

Full-stack treasure hunt game: React 18 + TypeScript frontend (Vite/SWC) + Express 5 backend with SQLite.

### Frontend (`src/`)

**Entry flow:** `index.html` → `src/main.tsx` → `src/App.tsx`

**Game logic in `src/App.tsx`:**
- 3 treasure boxes; one randomly holds treasure (`initializeGame`)
- `openBox()` flips a box with a 3D animation (Framer Motion via `motion/react`), updates score (+$100 treasure, -$50 skeleton), plays sound via `new Audio()`
- Game ends when treasure is found or all boxes opened; `resetGame()` restarts
- On game end, if logged in, POSTs score to `/api/scores`
- Custom key cursor on closed chests via CSS `cursor: url(keyIcon)`

**Auth layer:**
- `src/lib/auth-context.tsx` — `AuthProvider` context with `login`, `register`, `logout`; persists JWT + username in `localStorage`
- `src/lib/api.ts` — `apiFetch` wrapper that attaches `Authorization: Bearer <token>` header
- `src/components/AuthDialog.tsx` — sign up / sign in dialog
- `src/components/ScoreHistory.tsx` — shows logged-in user's past scores

**Styling:** Tailwind CSS v4 with design tokens (CSS custom properties) in `src/styles/globals.css`, imported through `src/index.css`. Dark mode via `.dark` class.

**UI components:** `src/components/ui/` contains a full shadcn/Radix UI component library.

**Path alias:** `@` maps to `src/` (configured in `vite.config.ts`).

**Assets:** Game images in `src/assets/` (treasure_closed.png, treasure_opened.png, treasure_opened_skeleton.png, key.png). Audio in `src/audios/`.

### Backend (`server/src/`)

Express 5 server run via `tsx watch` (no compile step needed).

- `server/src/index.ts` — app entry; mounts `/api/auth` and `/api/scores` routers; proxied by Vite in dev
- `server/src/db.ts` — initializes better-sqlite3 database at `server/data/game.db`; creates `users` and `scores` tables on startup
- `server/src/routes/auth.ts` — `POST /api/auth/register` and `POST /api/auth/login`; passwords hashed with bcryptjs; returns JWT
- `server/src/routes/scores.ts` — `POST /api/scores` (save score) and `GET /api/scores` (fetch history); protected by JWT middleware
- `server/src/middleware/auth.ts` — JWT verification middleware
