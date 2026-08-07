"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useSessionStore } from "@/store/useSessionStore";
import { cn } from "@/lib/utils";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);

  const profiles = useSessionStore((s) => s.profiles);
  const activeProfileId = useSessionStore((s) => s.activeProfileId);
  const exitProfile = useSessionStore((s) => s.exitProfile);
  const selectProfile = useSessionStore((s) => s.selectProfile);
  const logout = useSessionStore((s) => s.logout);
  const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? profiles[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-3 transition-colors duration-300 sm:px-8",
        scrolled || pathname !== "/browse" ? "bg-nx-bg/95 shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent",
      )}
    >
      <div className="flex items-center gap-6 sm:gap-8">
        <Link href="/browse" className="shrink-0 text-2xl font-black tracking-tight text-nx-red sm:text-3xl">
          NFLIX
        </Link>
        <nav className="hidden gap-5 text-sm text-nx-text-muted md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-white",
                pathname === link.href && "font-semibold text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <form onSubmit={submitSearch} className="flex items-center">
          <div
            className={cn(
              "flex items-center overflow-hidden rounded border border-white/0 bg-black/70 transition-all duration-200",
              searchOpen ? "w-40 border-white/50 px-2 sm:w-64" : "w-0",
            )}
          >
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Titles, genres, people"
              className="w-full bg-transparent py-1.5 text-sm text-white placeholder:text-nx-text-muted focus:outline-none"
            />
          </div>
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="p-2 text-white hover:text-nx-text-muted"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </form>

        {activeProfile && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded p-1 hover:bg-white/10"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-white sm:h-9 sm:w-9"
                style={{ backgroundColor: activeProfile.avatarColor }}
              >
                {activeProfile.name.slice(0, 1).toUpperCase()}
              </span>
              <ChevronDown
                size={16}
                className={cn("hidden text-white transition-transform sm:block", menuOpen && "rotate-180")}
              />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-56 rounded border border-white/10 bg-black/95 py-2 shadow-2xl animate-fade-in">
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        selectProfile(p.id);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-nx-text-muted hover:text-white"
                    >
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded text-xs font-bold text-white"
                        style={{ backgroundColor: p.avatarColor }}
                      >
                        {p.name.slice(0, 1).toUpperCase()}
                      </span>
                      {p.name}
                      {p.id === activeProfileId && <span className="ml-auto text-xs text-nx-red">Active</span>}
                    </button>
                  ))}
                  <div className="my-2 border-t border-white/10" />
                  <button
                    onClick={() => {
                      exitProfile();
                      router.push("/profiles");
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-nx-text-muted hover:text-white"
                  >
                    Manage Profiles
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/login");
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-nx-text-muted hover:text-white"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
