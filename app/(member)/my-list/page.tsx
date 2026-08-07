"use client";

import { useMemo } from "react";
import { Bookmark } from "lucide-react";
import { TITLES } from "@/lib/data";
import { useProfileStore } from "@/store/useProfileStore";
import { EMPTY_ID_LIST, useWatchlistStore } from "@/store/useWatchlistStore";
import TitleGrid from "@/components/TitleGrid";
import { GridSkeleton } from "@/components/Skeletons";

export default function MyListPage() {
  const currentProfileId = useProfileStore((s) => s.currentProfileId);
  const hasHydrated = useWatchlistStore((s) => s.hasHydrated);
  const myList = useWatchlistStore((s) => (currentProfileId ? s.ensure(currentProfileId).myList : EMPTY_ID_LIST));

  const items = useMemo(
    () => myList.map((id) => TITLES.find((t) => t.id === id)).filter((t): t is NonNullable<typeof t> => !!t),
    [myList]
  );

  if (!hasHydrated) {
    return (
      <div className="px-4 pt-24 sm:px-8 md:px-12">
        <GridSkeleton />
      </div>
    );
  }

  return (
    <div className="px-4 pt-24 pb-12 sm:px-8 md:px-12">
      <h1 className="mb-6 text-2xl font-semibold text-white sm:text-3xl">My List</h1>
      {items.length > 0 ? (
        <TitleGrid items={items} />
      ) : (
        <div className="flex flex-col items-center gap-3 py-24 text-center text-white/50">
          <Bookmark size={40} className="text-white/25" />
          <p>Your list is empty.</p>
          <p className="text-sm">Tap the + on any title to add it here.</p>
        </div>
      )}
    </div>
  );
}
