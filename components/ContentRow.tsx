"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Row } from "@/lib/types";
import { useProfileStore } from "@/store/useProfileStore";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { cn } from "@/lib/utils";
import ContentCard from "./ContentCard";

export default function ContentRow({ row }: { row: Row }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const currentProfileId = useProfileStore((s) => s.currentProfileId);
  const removeFromContinueWatching = useWatchlistStore((s) => s.removeFromContinueWatching);

  function updateArrows() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  function scrollBy(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
    setTimeout(updateArrows, 350);
  }

  const isContinueWatching = row.id === "continue-watching";

  if (row.titles.length === 0) return null;

  return (
    <section className="group/row relative mb-9 px-4 sm:px-8 md:px-12">
      <h2 className="mb-2.5 text-base font-semibold text-white/90 sm:text-lg">{row.title}</h2>
      <div className="relative">
        <button
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className={cn(
            "absolute left-0 top-0 z-20 hidden h-full w-10 items-center justify-center bg-gradient-to-r from-background to-transparent text-white opacity-0 transition-opacity group-hover/row:opacity-100 sm:flex",
            !canLeft && "pointer-events-none opacity-0"
          )}
        >
          <ChevronLeft size={28} />
        </button>

        <div
          ref={scrollerRef}
          onScroll={updateArrows}
          className="scrollbar-hide flex gap-1.5 overflow-x-auto overflow-y-visible scroll-smooth py-6 sm:gap-2"
        >
          {row.titles.map((t, i) => (
            <ContentCard
              key={t.id}
              title={t}
              rank={row.numbered ? i + 1 : undefined}
              showProgress={isContinueWatching}
              onRemove={
                isContinueWatching && currentProfileId
                  ? (id) => removeFromContinueWatching(currentProfileId, id)
                  : undefined
              }
            />
          ))}
        </div>

        <button
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className={cn(
            "absolute right-0 top-0 z-20 hidden h-full w-10 items-center justify-center bg-gradient-to-l from-background to-transparent text-white opacity-0 transition-opacity group-hover/row:opacity-100 sm:flex",
            !canRight && "pointer-events-none opacity-0"
          )}
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  );
}
