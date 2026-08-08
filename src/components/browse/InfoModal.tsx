"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Play, Plus, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { getTitle } from "@/lib/data";
import TitleArt from "@/components/ui/TitleArt";
import { useModalStore } from "@/store/useModalStore";
import { useSessionStore } from "@/store/useSessionStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { formatMinutes } from "@/lib/utils";

export default function InfoModal() {
  const titleId = useModalStore((s) => s.titleId);
  const close = useModalStore((s) => s.close);
  const router = useRouter();
  const activeProfileId = useSessionStore((s) => s.activeProfileId) ?? "guest";
  const inWatchlist = useLibraryStore((s) => (titleId ? s.isInWatchlist(activeProfileId, titleId) : false));
  const toggleWatchlist = useLibraryStore((s) => s.toggleWatchlist);
  const reaction = useLibraryStore((s) => (titleId ? s.getReaction(activeProfileId, titleId) : 0));
  const setReaction = useLibraryStore((s) => s.setReaction);
  const [seasonIdx, setSeasonIdx] = useState(0);

  const title = titleId ? getTitle(titleId) : undefined;

  return (
    <AnimatePresence>
      {title && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-0 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="relative w-full max-w-3xl overflow-hidden bg-nx-bg-elevated shadow-2xl sm:rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              onClick={close}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-nx-bg-elevated/80 text-white hover:bg-nx-bg-elevated"
            >
              <X size={20} />
            </button>

            <div className="relative aspect-video w-full">
              <TitleArt seed={title.colorSeed} genres={title.genres} variant="backdrop" className="h-full w-full" label={title.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-nx-bg-elevated via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-4 sm:p-8">
                <button
                  onClick={() => router.push(`/watch/${title.id}`)}
                  className="flex items-center gap-2 rounded bg-white px-4 py-2 text-sm font-bold text-black hover:bg-white/80 sm:px-6 sm:py-2.5 sm:text-base"
                >
                  <Play size={20} className="fill-black" /> Play
                </button>
                <button
                  aria-label={inWatchlist ? "Remove from My List" : "Add to My List"}
                  onClick={() => toggleWatchlist(activeProfileId, title.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 text-white hover:border-white"
                >
                  {inWatchlist ? <Check size={18} /> : <Plus size={18} />}
                </button>
                <button
                  aria-label="Like"
                  onClick={() => setReaction(activeProfileId, title.id, reaction === 1 ? 0 : 1)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-white hover:border-white ${reaction === 1 ? "border-white bg-white/20" : "border-white/50"}`}
                >
                  <ThumbsUp size={16} />
                </button>
                <button
                  aria-label="Not for me"
                  onClick={() => setReaction(activeProfileId, title.id, reaction === -1 ? 0 : -1)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-white hover:border-white ${reaction === -1 ? "border-white bg-white/20" : "border-white/50"}`}
                >
                  <ThumbsDown size={16} />
                </button>
              </div>
            </div>

            <div className="grid gap-6 p-4 sm:grid-cols-3 sm:p-8">
              <div className="sm:col-span-2">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-green-500">{title.matchScore}% Match</span>
                  <span className="text-nx-text-muted">{title.releaseYear}</span>
                  <span className="rounded border border-white/40 px-1.5 text-xs text-nx-text-muted">{title.maturity}</span>
                  {title.kind === "movie" && title.durationMin && (
                    <span className="text-nx-text-muted">{formatMinutes(title.durationMin)}</span>
                  )}
                  {title.kind === "series" && (
                    <span className="text-nx-text-muted">{title.seasons?.length} Seasons</span>
                  )}
                  <span className="rounded border border-white/40 px-1.5 text-xs text-nx-text-muted">HD</span>
                </div>
                <p className="text-sm leading-relaxed text-white sm:text-base">{title.synopsis}</p>
              </div>
              <div className="space-y-2 text-xs text-nx-text-muted sm:text-sm">
                <p>
                  <span className="text-nx-text-muted/70">Cast: </span>
                  <span className="text-white">{title.cast.length ? title.cast.join(", ") : "N/A"}</span>
                </p>
                <p>
                  <span className="text-nx-text-muted/70">Director: </span>
                  <span className="text-white">{title.director}</span>
                </p>
                <p>
                  <span className="text-nx-text-muted/70">Genres: </span>
                  <span className="text-white">{title.genres.join(", ")}</span>
                </p>
              </div>
            </div>

            {title.kind === "series" && title.seasons && (
              <div className="border-t border-white/10 px-4 py-4 sm:px-8 sm:py-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Episodes</h3>
                  <select
                    value={seasonIdx}
                    onChange={(e) => setSeasonIdx(Number(e.target.value))}
                    className="rounded border border-white/30 bg-nx-bg-elevated px-3 py-1.5 text-sm text-white"
                  >
                    {title.seasons.map((s, i) => (
                      <option key={s.seasonNumber} value={i}>
                        Season {s.seasonNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  {title.seasons[seasonIdx].episodes.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => router.push(`/watch/${title.id}?ep=${ep.id}`)}
                      className="flex w-full items-center gap-3 rounded p-2 text-left hover:bg-white/5"
                    >
                      <span className="w-6 shrink-0 text-lg text-nx-text-muted">{ep.episodeNumber}</span>
                      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded sm:w-36">
                        <TitleArt seed={ep.colorSeed} genres={title.genres} className="h-full w-full" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 hover:opacity-100 hover:bg-black/40">
                          <Play size={18} className="fill-white text-white" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-white">{ep.title}</p>
                          <span className="shrink-0 text-xs text-nx-text-muted">{ep.durationMin}m</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-nx-text-muted">{ep.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
