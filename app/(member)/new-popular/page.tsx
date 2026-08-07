"use client";

import { useMemo } from "react";
import { poolForProfile } from "@/lib/data";
import { useProfileStore } from "@/store/useProfileStore";
import TitleGrid from "@/components/TitleGrid";
import { GridSkeleton } from "@/components/Skeletons";

export default function NewPopularPage() {
  const profiles = useProfileStore((s) => s.profiles);
  const currentProfileId = useProfileStore((s) => s.currentProfileId);
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const profile = profiles.find((p) => p.id === currentProfileId);

  const pool = useMemo(() => poolForProfile(!!profile?.isKids), [profile?.isKids]);
  const fresh = pool.filter((t) => t.isNew);
  const trending = [...pool].sort((a, b) => b.match - a.match).slice(0, 12);

  if (!hasHydrated) {
    return (
      <div className="px-4 pt-24 sm:px-8 md:px-12">
        <GridSkeleton />
      </div>
    );
  }

  return (
    <div className="px-4 pt-24 pb-12 sm:px-8 md:px-12">
      <h1 className="mb-6 text-2xl font-semibold text-white sm:text-3xl">New &amp; Popular</h1>

      {fresh.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-3 text-lg font-semibold text-white/90">New Releases</h2>
          <TitleGrid items={fresh} />
        </div>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold text-white/90">Popular Right Now</h2>
        <TitleGrid items={trending} />
      </div>
    </div>
  );
}
