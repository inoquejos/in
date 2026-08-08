"use client";

import { useEffect, useMemo, useState } from "react";
import { HERO_TITLE_ID, ROWS, TITLES_BY_ID, getTitle } from "@/lib/data";
import HeroBanner from "@/components/browse/HeroBanner";
import ContentRow from "@/components/browse/ContentRow";
import RowSkeleton from "@/components/browse/RowSkeleton";
import { useSessionStore } from "@/store/useSessionStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import type { Title } from "@/lib/types";

const EMPTY_PROGRESS = {};

export default function BrowsePage() {
  const [loading, setLoading] = useState(true);
  const activeProfileId = useSessionStore((s) => s.activeProfileId) ?? "guest";
  // Select the raw, stable progress map rather than calling a store method that
  // derives a brand-new filtered/sorted array on every render (that reference churn
  // trips useSyncExternalStore's "getSnapshot should be cached" infinite-loop guard).
  const progressMap = useLibraryStore((s) => s.progress[activeProfileId] ?? EMPTY_PROGRESS);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const hero = getTitle(HERO_TITLE_ID)!;

  const continueWatchingTitles: Title[] = useMemo(() => {
    return Object.values(progressMap)
      .filter((p) => p.progressSeconds > 5 && p.progressSeconds < p.durationSeconds * 0.95)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((p) => TITLES_BY_ID[p.titleId])
      .filter(Boolean);
  }, [progressMap]);

  return (
    <div>
      <HeroBanner title={hero} />
      <div className="relative z-10 -mt-10 sm:-mt-24">
        {loading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : (
          <>
            {continueWatchingTitles.length > 0 && (
              <ContentRow heading="Continue Watching" titles={continueWatchingTitles} />
            )}
            {ROWS.map((row) => (
              <ContentRow key={row.id} heading={row.heading} titles={row.titleIds.map((id) => TITLES_BY_ID[id])} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
