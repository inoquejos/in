"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, Menu, Search, X } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { TITLES } from "@/lib/data";
import { cn } from "@/lib/utils";
import PosterArt from "./PosterArt";

const NAV_LINKS = [
  { href: "/browse", label: "Home" },
  { href: "/tv-shows", label: "TV Shows" },
  { href: "/movies", label: "Movies" },
  { href: "/new-popular", label: "New & Popular" },
  { href: "/my-list", label: "My List" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const profiles = useProfileStore((s) => s.profiles);
  const currentProfileId = useProfileStore((s) => s.currentProfileId);
  const selectProfile = useProfileStore((s) => s.selectProfile);
  const signOut = useProfileStore((s) => s.signOut);
  const current = profiles.find((p) => p.id === currentProfileId);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const suggestions =
    query.trim().length > 0
      ? TITLES.filter((t) => t.title.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
      : [];

  function submitSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-4 transition-colors duration-300 sm:px-8 md:px-12",
        scrolled || mobileOpen ? "bg-background/95 backdrop-blur-sm shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="flex items-center gap-6 md:gap-8">
        <Link href="/browse" className="font-display text-2xl tracking-wide text-accent md:text-3xl">
          NOVASTREAM
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-white/75 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-white",
                pathname === link.href && "font-semibold text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          aria-label="Toggle menu"
          className="text-white md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <Menu size={22} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={submitSearch} className="relative flex items-center">
          <AnimatePresence initial={false}>
            {searchOpen && (
              <motion.input
                ref={searchRef}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => {
                  setTimeout(() => setSearchOpen(false), 120);
                }}
                placeholder="Titles, genres, people..."
                className="mr-1 rounded-sm border border-white/40 bg-black/80 px-3 py-1.5 text-sm text-white outline-none placeholder:text-white/50 sm:w-56"
              />
            )}
          </AnimatePresence>
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="text-white/90 hover:text-white"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          <AnimatePresence>
            {searchOpen && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 top-11 w-72 overflow-hidden rounded-md border border-white/10 bg-surface shadow-2xl"
              >
                {suggestions.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onMouseDown={() => router.push(`/search?q=${encodeURIComponent(t.title)}`)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-white/85 hover:bg-white/10"
                  >
                    <div className="h-9 w-16 shrink-0 overflow-hidden rounded">
                      <PosterArt title={t.title} palette={t.palette} genres={t.genres} variant="card" />
                    </div>
                    <span className="truncate">{t.title}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <button aria-label="Notifications" className="hidden text-white/90 hover:text-white sm:block">
          <Bell size={20} />
        </button>

        <div className="relative">
          <button
            className="flex items-center gap-1.5"
            onClick={() => setProfileMenuOpen((v) => !v)}
            onBlur={() => setTimeout(() => setProfileMenuOpen(false), 120)}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-white"
              style={{ backgroundColor: current?.avatarColor ?? "#e50914" }}
            >
              {current?.name.charAt(0).toUpperCase() ?? "?"}
            </span>
            <ChevronDown size={16} className={cn("text-white transition-transform", profileMenuOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 top-11 w-56 overflow-hidden rounded-md border border-white/10 bg-black/90 py-2 shadow-2xl backdrop-blur"
              >
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onMouseDown={() => selectProfile(p.id)}
                    className="flex w-full items-center gap-3 px-3 py-1.5 text-left text-sm text-white/85 hover:text-white"
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded text-xs font-bold text-white"
                      style={{ backgroundColor: p.avatarColor }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </span>
                    {p.name}
                    {p.id === currentProfileId && <span className="ml-auto text-accent">•</span>}
                  </button>
                ))}
                <div className="my-2 border-t border-white/10" />
                <Link
                  href="/profiles"
                  className="block px-3 py-1.5 text-sm text-white/85 hover:text-white"
                >
                  Manage Profiles
                </Link>
                <button
                  onMouseDown={() => {
                    signOut();
                    router.push("/profiles");
                  }}
                  className="block w-full px-3 py-1.5 text-left text-sm text-white/85 hover:text-white"
                >
                  Switch Profiles
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute inset-x-0 top-16 flex flex-col gap-1 bg-background/98 px-4 py-3 backdrop-blur-sm md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded px-2 py-2 text-sm text-white/80 hover:bg-white/5",
                  pathname === link.href && "font-semibold text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
