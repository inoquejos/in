"use client";

import { cn } from "@/lib/utils";

export default function GenreChips({
  genres,
  active,
  onChange,
}: {
  genres: string[];
  active: string | null;
  onChange: (genre: string | null) => void;
}) {
  return (
    <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-8 sm:px-8 md:-mx-12 md:px-12">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "shrink-0 rounded-full border px-4 py-1.5 text-sm transition",
          active === null ? "border-white bg-white text-black" : "border-white/30 text-white/70 hover:border-white/70"
        )}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm transition",
            active === g ? "border-white bg-white text-black" : "border-white/30 text-white/70 hover:border-white/70"
          )}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
