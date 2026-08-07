"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ChevronDown, Play, Plus, ThumbsDown, ThumbsUp } from "lucide-react";
import type { Title } from "@/lib/types";
import TitleArt from "@/components/ui/TitleArt";
import { useSessionStore } from "@/store/useSessionStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useModalStore } from "@/store/useModalStore";
import { cn, formatMinutes } from "@/lib/utils";

interface ContentCardProps {
  title: Title;
  /** "row": fixed width for horizontal carousels. "grid": fills its parent grid cell. */
  variant?: "row" | "grid";
}

export default function ContentCard({ title, variant = "row" }: ContentCardProps) {
  const router = useRouter();
  const activeProfileId = useSessionStore((s) => s.activeProfileId) ?? "guest";
  const inWatchlist = useLibraryStore((s) => s.isInWatchlist(activeProfileId, title.id));
  const toggleWatchlist = useLibraryStore((s) => s.toggleWatchlist);
  const reaction = useLibraryStore((s) => s.getReaction(activeProfileId, title.id));
  const setReaction = useLibraryStore((s) => s.setReaction);
  const openModal = useModalStore((s) => s.open);

  const meta =
    title.kind === "movie"
      ? `${title.releaseYear} · ${title.durationMin ? formatMinutes(title.durationMin) : ""}`
      : `${title.releaseYear} · ${title.seasons?.length ?? 1} Season${(title.seasons?.length ?? 1) > 1 ? "s" : ""}`;

  return (
    <motion.div
      className={cn(
        "group relative",
        variant === "row" ? "w-[42vw] shrink-0 sm:w-[220px]" : "w-full",
      )}
      initial={false}
      whileHover={{ scale: 1.3, zIndex: 30 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ transformOrigin: "center" }}
    >
      <div
        className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-md shadow-lg ring-1 ring-white/10 group-hover:rounded-b-none group-hover:shadow-2xl"
        onClick={() => router.push(`/watch/${title.id}`)}
      >
        <TitleArt seed={title.colorSeed} genres={title.genres} label={title.title} className="h-full w-full" />
        {title.isNew && (
          <span className="absolute left-2 top-2 rounded bg-nx-red px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            New
          </span>
        )}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="rounded-full bg-black/50 p-3">
            <Play size={22} className="fill-white text-white" />
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 top-full hidden rounded-b-md bg-nx-bg-card p-3 shadow-2xl ring-1 ring-white/10 group-hover:block">
        <div className="mb-2 flex items-center gap-2">
          <button
            aria-label="Play"
            onClick={() => router.push(`/watch/${title.id}`)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-white/80"
          >
            <Play size={16} className="fill-black" />
          </button>
          <button
            aria-label={inWatchlist ? "Remove from My List" : "Add to My List"}
            onClick={() => toggleWatchlist(activeProfileId, title.id)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 text-white hover:border-white"
          >
            {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
          </button>
          <button
            aria-label="Like"
            onClick={() => setReaction(activeProfileId, title.id, reaction === 1 ? 0 : 1)}
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-white hover:border-white ${reaction === 1 ? "border-white bg-white/20" : "border-white/40"}`}
          >
            <ThumbsUp size={14} />
          </button>
          <button
            aria-label="Not for me"
            onClick={() => setReaction(activeProfileId, title.id, reaction === -1 ? 0 : -1)}
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-white hover:border-white ${reaction === -1 ? "border-white bg-white/20" : "border-white/40"}`}
          >
            <ThumbsDown size={14} />
          </button>
          <button
            aria-label="More info"
            onClick={() => openModal(title.id)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/40 text-white hover:border-white"
          >
            <ChevronDown size={16} />
          </button>
        </div>
        <p className="flex items-center gap-2 text-xs font-semibold text-green-500">
          {title.matchScore}% Match
          <span className="rounded border border-white/40 px-1 text-[10px] font-normal text-nx-text-muted">
            {title.maturity}
          </span>
        </p>
        <p className="mt-1 text-[11px] text-nx-text-muted">{meta}</p>
        <p className="mt-1 line-clamp-1 text-[11px] text-nx-text-muted">{title.genres.join(" · ")}</p>
      </div>
    </motion.div>
  );
}
