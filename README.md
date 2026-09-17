# Workout Tracker 🏋️

A local-first workout tracker: plan your training, log sets on your phone at the
gym (even with no signal), get progressive-overload suggestions, and chart your
progress over time. Works fully offline by default, with optional cloud sync
across devices.

**Live demo:** _add your deployment URL here_

<!-- Add a screenshot or GIF of the "Today" workout view and the progress charts here. -->

---

## Highlights

- **Local-first / offline-first** — all data lives in the browser (IndexedDB via [Dexie](https://dexie.org/)), so the app is instant and works with no network at the gym. No account required to use it.
- **Optional cloud sync** — when Supabase is configured, Dexie write-hooks capture every change into a sync queue and a background pusher mirrors it to the cloud; opening the app on a fresh device pulls your data back down. If Supabase isn't configured, the app simply runs local-only.
- **Progressive-overload engine** — surfaces your most recent completed weight per exercise alongside the template's rep target and pre-fills the input, so progressing is a single nudge upward.
- **Structured programming** — programs → weekly templates → exercises, with per-exercise form cues, warm-ups, rest timers, and fixed vs. rotating exercise slots.
- **Progress tracking** — history, weekly view, body-weight log, and charts (Recharts).

## Architecture

```
        ┌───────────────────────────────────────────────┐
        │  Next.js 16 (App Router) · React 19 · TS      │
        │  Tailwind v4 · shadcn/ui + Base UI · Zustand  │
        └───────────────────────┬───────────────────────┘
                                 │  reads/writes
                    ┌────────────▼─────────────┐
                    │  Dexie (IndexedDB)        │  ← source of truth
                    │  programs, templates,     │     (works fully offline)
                    │  exercises, workout logs, │
                    │  set logs, body weight    │
                    └────────────┬─────────────┘
                                 │ write-hooks capture changes
                    ┌────────────▼─────────────┐
                    │  Sync layer (optional)    │
                    │  queue → background push  │──▶ Supabase (Postgres)
                    │  pull-on-restore          │◀── cross-device restore
                    └───────────────────────────┘
```

The local IndexedDB store is always authoritative, so the UI never blocks on the
network. The sync layer is additive: Dexie hooks enqueue every write, a
background loop upserts them to Supabase (keyed by id for idempotency), and a
cleared or new device restores state by pulling from the cloud.

## Tech stack

| Area | Tech |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS v4, shadcn/ui, Base UI, lucide-react |
| State | Zustand, Dexie React hooks |
| Local storage | Dexie (IndexedDB) |
| Cloud sync | Supabase (`@supabase/supabase-js`) — optional |
| Charts | Recharts |

## Features by screen

- **Today** — the day's workout: exercises, warm-up, per-set logging, progressive-overload suggestions, form-cue links.
- **Week** — the current program week at a glance.
- **History** — past workouts and completed sets.
- **Progress** — charts of strength/volume trends over time.
- **Weight log** — body-weight tracking.

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
```

That's it — the app runs local-only out of the box (data stored in your
browser).

### Optional: enable cloud sync

Create a Supabase project and add its URL and anon key to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

With these set, the app syncs local changes to Supabase in the background and
restores from the cloud on a new device. Without them, sync is skipped and the
app stays fully functional offline.

## Deployment

Standard Next.js build (`npm run build`), deployable to Vercel or any Node host.
Cloud sync requires the two `NEXT_PUBLIC_SUPABASE_*` environment variables to be
set in the host.
