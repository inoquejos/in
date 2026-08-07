"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { searchTitles } from "@/lib/data";
import TitleGrid from "@/components/browse/TitleGrid";

function SearchContent({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const results = searchTitles(query);

  return (
    <div className="px-4 pt-24 sm:px-8 sm:pt-28">
      <div className="mb-6 flex max-w-xl items-center gap-3 rounded border border-white/30 bg-nx-bg-card px-4 py-3">
        <SearchIcon size={20} className="text-nx-text-muted" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, genre, or actor"
          className="w-full bg-transparent text-white placeholder:text-nx-text-muted focus:outline-none"
        />
      </div>

      {query.trim() ? (
        <>
          <p className="mb-2 text-sm text-nx-text-muted">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
          </p>
          <TitleGrid titles={results} emptyMessage="No matches. Try another title, genre, or actor." />
        </>
      ) : (
        <p className="text-nx-text-muted">Start typing to search movies and TV shows.</p>
      )}
    </div>
  );
}

/** Reads the URL once per navigation and remounts SearchContent (via key) so a fresh
 *  ?q= from the navbar always seeds the field, without syncing state inside an effect. */
function SearchRouter() {
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  return <SearchContent key={initialQuery} initialQuery={initialQuery} />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-28" />}>
      <SearchRouter />
    </Suspense>
  );
}
