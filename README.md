# NOVASTREAM

A modern, high-performance streaming member dashboard inspired by Netflix — built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, and Zustand. All content is original mock data with generated gradient "poster art," so the app runs fully offline with no external image dependencies or API keys.

## Features

- **Profile Gateway** — select, add, edit, and delete profiles (including a Kids profile with filtered, age-appropriate content), all persisted locally.
- **Browse Dashboard** — hero banner with a featured title, "More Info" modal, and horizontally-scrolling content rows: Continue Watching, Trending Now, Top 10 (with ranked numerals), New Releases, and per-genre rows.
- **Card interactions** — hover-to-scale previews with inline quick actions (play, add to My List, like, more info), and a rich info modal with cast, tags, "More Like This," and an episode browser for series.
- **Custom video player** — auto-hiding controls, scrubber, volume, rewind/forward, skip intro, next-episode/up-next card, episodes sidebar, fullscreen, and keyboard shortcuts (space to play/pause, Esc to exit). Watch progress is persisted and powers the Continue Watching row.
- **Search & discovery** — a live, instant-filter search bar (in the nav and on a dedicated `/search` page) plus dedicated Movies, TV Shows, New & Popular, and My List pages with genre filter chips.
- **Responsive & animated** — touch-friendly carousels, mobile nav, and Framer Motion transitions throughout; skeleton loaders cover async/store-hydration states.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Icons:** lucide-react
- **State:** Zustand (with `persist` to `localStorage`) for profiles and per-profile watchlist/progress/likes

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll land on the profile gateway first — pick or create a profile to reach the browse dashboard.

Other useful scripts:

```bash
npm run lint     # ESLint
npm run build    # production build
npm start        # serve the production build
```

## Project Structure

```
app/
  profiles/          Profile gateway (no nav chrome)
  (member)/          Routes behind ProfileGuard + Navbar + modal provider
    browse/          Main dashboard (hero + rows)
    movies/, tv-shows/, new-popular/, my-list/, search/
  watch/[slug]/       Full-screen custom video player
components/           UI building blocks (cards, rows, modal, player chrome, etc.)
context/               TitleModalContext (global "More Info" modal)
store/                 Zustand stores (profiles, watchlist/progress/likes)
lib/                   Mock catalog, types, gradient "poster art" palette, helpers
```
