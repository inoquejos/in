"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { poolForProfile } from "@/lib/data";
import { useProfileStore } from "@/store/useProfileStore";
import TitleGrid from "@/components/TitleGrid";

function matches(haystack: string[], needle: string) {
  return haystack.some((h) => h.toLowerCase().includes(needle));
}

function SearchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  // Local state drives instant filtering; the URL is kept in sync (debounced)
  // purely so a search is shareable/bookmarkable — it is never read back into
  // this state, so there's no state/props sync effect to reason about.
  const [query, setQuery] = useState(urlQuery);
  const profiles = useProfileStore((s) => s.profiles);
  const currentProfileId = useProfileStore((s) => s.currentProfileId);
  const profile = profiles.find((p) => p.id === currentProfileId);

  useEffect(() => {
    const id = setTimeout(() => {
      if (query.trim() === urlQuery.trim()) return;
      const url = query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search";
      router.replace(url);
    }, 250);
    return () => clearTimeout(id);
  }, [query, urlQuery, router]);

  const pool = useMemo(() => poolForProfile(!!profile?.isKids), [profile?.isKids]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return pool.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        matches(t.genres, q) ||
        matches(t.cast, q) ||
        t.creator.toLowerCase().includes(q) ||
        matches(t.tags, q)
    );
  }, [pool, query]);

  return (
    <div className="px-4 pt-24 pb-12 sm:px-8 md:px-12">
      <div className="relative mx-auto mb-8 max-w-xl">
        <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, genre, cast, or mood..."
          className="w-full rounded-md border border-white/20 bg-surface-raised py-3 pl-10 pr-4 text-white outline-none placeholder:text-white/40 focus:border-white/50"
        />
      </div>

      {query.trim() === "" ? (
        <p className="text-center text-white/40">Start typing to find something to watch.</p>
      ) : results.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-white/50">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
          </p>
          <TitleGrid items={results} />
        </>
      ) : (
        <p className="text-center text-white/40">No results for &ldquo;{query}&rdquo;. Try another title, genre, or actor.</p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="px-4 pt-24 sm:px-8 md:px-12" />}>
      <SearchInner />
    </Suspense>
  );
}
