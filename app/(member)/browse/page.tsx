"use client";

import { useMemo } from "react";
import { HERO_TITLES, buildRows, poolForProfile } from "@/lib/data";
import { useProfileStore } from "@/store/useProfileStore";
import { EMPTY_ID_LIST, useWatchlistStore } from "@/store/useWatchlistStore";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import { HeroSkeleton, RowSkeleton } from "@/components/Skeletons";

export default function BrowsePage() {
  const currentProfileId = useProfileStore((s) => s.currentProfileId);
  const profiles = useProfileStore((s) => s.profiles);
  const watchlistHydrated = useWatchlistStore((s) => s.hasHydrated);
  const myList = useWatchlistStore((s) => (currentProfileId ? s.ensure(currentProfileId).myList : EMPTY_ID_LIST));
  const continueWatching = useWatchlistStore((s) =>
    currentProfileId ? s.continueWatchingIds(currentProfileId) : EMPTY_ID_LIST
  );

  const profile = profiles.find((p) => p.id === currentProfileId);

  const heroTitles = useMemo(
    () => (profile?.isKids ? poolForProfile(true) : HERO_TITLES),
    [profile?.isKids]
  );

  const rows = useMemo(
    () =>
      buildRows({
        isKids: !!profile?.isKids,
        myList,
        continueWatching,
      }),
    [profile?.isKids, myList, continueWatching]
  );

  if (!watchlistHydrated) {
    return (
      <div>
        <HeroSkeleton />
        <div className="mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroBanner titles={heroTitles} />
      <div className="relative z-10 -mt-6 sm:-mt-10">
        {rows.map((row) => (
          <ContentRow key={row.id} row={row} />
        ))}
      </div>
    </div>
  );
}
