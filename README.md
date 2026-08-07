# NFLIX — Netflix-style Streaming Dashboard

A Netflix-inspired member dashboard built with Next.js (App Router), TypeScript, and Tailwind CSS. It's a front-end demo — all catalog data is mocked and "playback" is a self-contained simulation, so the whole app runs with zero external services or API keys.

## Features

- **Authentication & profiles** — a mock sign-in screen and a Netflix-style "Who's watching?" profile gateway, with per-profile watchlists, ratings, and viewing progress.
- **Browse dashboard** — a hero banner for the featured title, horizontally scrolling rows ("Trending Now", "Top 10", "Continue Watching", genre rows, etc.), and hover cards with quick actions (play, add to list, like/dislike, more info).
- **More Info modal** — synopsis, cast, genres, and a season/episode browser for series.
- **Video player** — custom, auto-hiding controls: scrub bar, play/pause, skip ±10s, volume, fullscreen, skip intro, an episodes sidebar, and auto-advance to the next episode. The "video" is a generated, animated backdrop driven by a real playback clock (see below) rather than a hotlinked media file.
- **Search & discovery** — live search by title, genre, cast, or director, plus dedicated Movies, TV Shows, New & Popular, and My List pages.
- **Responsive, dark UI** — Netflix-style palette and typography, touch-friendly carousels, and skeleton loaders.

## Why simulated playback?

Rather than depending on a third-party video CDN (fragile, licensing-encumbered, and often blocked on restricted networks), the player's "screen" is the same generated poster/backdrop art used across the catalog, driven by a real clock. Every control — scrubbing, skip intro, resume, auto-advance — operates on that clock exactly as it would a `<video>` element, so wiring in real media later is a localized change (see `src/components/player/PlaybackSession.tsx`).

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Zustand** for session, profile, and library (watchlist/progress) state, persisted to `localStorage`
- **Framer Motion** for card hover/scale transitions and the info modal
- **Lucide React** for icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with any email/password (or "Continue as guest"), pick a profile, and browse.

## Project structure

```
src/
  app/            Routes: login, profiles, (member)/{browse,movies,tv-shows,new-popular,my-list,search}, watch/[id]
  components/     UI building blocks: browse (rows/cards/modal), player, layout, auth guard
  lib/            Mock catalog data, shared types, and small utilities
  store/          Zustand stores: session/profiles, watchlist & progress, modal UI state
```
