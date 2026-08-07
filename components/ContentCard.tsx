"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ChevronDown, Play, Plus, ThumbsUp, X } from "lucide-react";
import { Title } from "@/lib/types";
import { useProfileStore } from "@/store/useProfileStore";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { useTitleModal } from "@/context/TitleModalContext";
import { cn } from "@/lib/utils";
import PosterArt from "./PosterArt";

interface ContentCardProps {
  title: Title;
  rank?: number;
  showProgress?: boolean;
  onRemove?: (id: string) => void;
  fluid?: boolean;
}

export default function ContentCard({ title, rank, showProgress, onRemove, fluid }: ContentCardProps) {
  const router = useRouter();
  const { open } = useTitleModal();
  const currentProfileId = useProfileStore((s) => s.currentProfileId);
  const inList = useWatchlistStore((s) => (currentProfileId ? s.isInMyList(currentProfileId, title.id) : false));
  const like = useWatchlistStore((s) => (currentProfileId ? s.getLike(currentProfileId, title.id) : null));
  const progress = useWatchlistStore((s) => (currentProfileId ? s.getProgress(currentProfileId, title.id) : 0));
  const toggleMyList = useWatchlistStore((s) => s.toggleMyList);
  const setLike = useWatchlistStore((s) => s.setLike);

  return (
    <div className={cn("group relative shrink-0", rank ? "flex items-end" : "")}>
      {rank && (
        <span
          aria-hidden
          className="font-display -mr-4 shrink-0 text-[5.5rem] leading-none text-transparent sm:-mr-6 sm:text-[7.5rem]"
          style={{ WebkitTextStroke: "3px #4d4d4d" }}
        >
          {rank}
        </span>
      )}
      <motion.div
        initial={false}
        whileHover={{ scale: 1.12, zIndex: 30 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "relative z-0 shrink-0 cursor-pointer rounded-md bg-surface-raised shadow-md",
          fluid ? "w-full" : "w-[38vw] sm:w-[220px]"
        )}
        onClick={() => open(title.id)}
      >
        <div className="relative overflow-hidden rounded-md">
          <PosterArt title={title.title} palette={title.palette} genres={title.genres} variant="card" className="w-full">
            {title.isNew && (
              <span className="absolute left-2 top-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                New
              </span>
            )}
          </PosterArt>

          {showProgress && progress > 0 && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
              <div className="h-full bg-accent" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
          )}

          {onRemove && (
            <button
              aria-label="Remove from Continue Watching"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(title.id);
              }}
              className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 sm:p-3">
            <p className="mb-1.5 truncate text-xs font-semibold text-white sm:text-sm">{title.title}</p>
            <div className="flex items-center gap-1.5">
              <button
                aria-label="Play"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/watch/${title.slug}`);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black hover:bg-white/85"
              >
                <Play size={14} fill="black" />
              </button>
              <button
                aria-label="Add to My List"
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentProfileId) toggleMyList(currentProfileId, title.id);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-black/50 text-white hover:border-white"
              >
                {inList ? <Check size={14} /> : <Plus size={14} />}
              </button>
              <button
                aria-label="Like"
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentProfileId) setLike(currentProfileId, title.id, "like");
                }}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-black/50 text-white hover:border-white",
                  like === "like" && "border-accent text-accent"
                )}
              >
                <ThumbsUp size={13} />
              </button>
              <button
                aria-label="More info"
                onClick={(e) => {
                  e.stopPropagation();
                  open(title.id);
                }}
                className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-black/50 text-white hover:border-white"
              >
                <ChevronDown size={15} />
              </button>
            </div>
            <div className="mt-1.5 hidden items-center gap-2 text-[11px] text-white/70 sm:flex">
              <span className="font-semibold text-emerald-400">{title.match}% Match</span>
              <span className="rounded border border-white/40 px-1 text-[10px]">{title.maturity}</span>
              <span>{title.duration}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
