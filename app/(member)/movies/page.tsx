"use client";

import { useMemo, useState } from "react";
import { poolForProfile } from "@/lib/data";
import { useProfileStore } from "@/store/useProfileStore";
import GenreChips from "@/components/GenreChips";
import TitleGrid from "@/components/TitleGrid";
import { GridSkeleton } from "@/components/Skeletons";

export default function MoviesPage() {
  const [genre, setGenre] = useState<string | null>(null);
  const profiles = useProfileStore((s) => s.profiles);
  const currentProfileId = useProfileStore((s) => s.currentProfileId);
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const profile = profiles.find((p) => p.id === currentProfileId);

  const movies = useMemo(() => poolForProfile(!!profile?.isKids).filter((t) => t.kind === "movie"), [profile?.isKids]);
  const genres = useMemo(() => Array.from(new Set(movies.flatMap((t) => t.genres))).sort(), [movies]);
  const filtered = genre ? movies.filter((t) => t.genres.includes(genre)) : movies;

  if (!hasHydrated) {
    return (
      <div className="px-4 pt-24 sm:px-8 md:px-12">
        <GridSkeleton />
      </div>
    );
  }

  return (
    <div className="px-4 pt-24 pb-12 sm:px-8 md:px-12">
      <h1 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">Movies</h1>
      <div className="mb-6">
        <GenreChips genres={genres} active={genre} onChange={setGenre} />
      </div>
      {filtered.length > 0 ? (
        <TitleGrid items={filtered} />
      ) : (
        <p className="mt-10 text-center text-white/50">No movies found in this genre yet.</p>
      )}
    </div>
  );
}
