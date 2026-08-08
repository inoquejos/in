"use client";

import { useMemo } from "react";
import { TITLES_BY_ID } from "@/lib/data";
import TitleGrid from "@/components/browse/TitleGrid";
import { useSessionStore } from "@/store/useSessionStore";
import { useLibraryStore } from "@/store/useLibraryStore";

const EMPTY_LIST: string[] = [];

export default function MyListPage() {
  const activeProfileId = useSessionStore((s) => s.activeProfileId) ?? "guest";
  // Select the stable stored array directly (falling back to a module-level empty
  // array, not a freshly-allocated one) so the selector snapshot never churns.
  const watchlist = useLibraryStore((s) => s.watchlists[activeProfileId] ?? EMPTY_LIST);
  const titles = useMemo(
    () => watchlist.map((id) => TITLES_BY_ID[id]).filter(Boolean),
    [watchlist],
  );

  return (
    <div>
      <h1 className="px-4 pt-24 text-2xl font-bold text-white sm:px-8 sm:pt-28 sm:text-4xl">My List</h1>
      <TitleGrid
        titles={titles}
        emptyMessage="Your list is empty. Add shows and movies by clicking the + on any title."
      />
    </div>
  );
}
