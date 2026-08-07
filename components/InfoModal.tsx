"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Play, Plus, ThumbsDown, ThumbsUp, Volume2, VolumeX, X } from "lucide-react";
import { getTitleBySlug, TITLES } from "@/lib/data";
import { useProfileStore } from "@/store/useProfileStore";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import PosterArt from "./PosterArt";
import { cn } from "@/lib/utils";

export default function InfoModal({ titleId, onClose }: { titleId: string; onClose: () => void }) {
  const title = getTitleBySlug(titleId);
  const router = useRouter();
  const [muted, setMuted] = useState(true);
  const [season, setSeason] = useState(1);
  const currentProfileId = useProfileStore((s) => s.currentProfileId);
  const inList = useWatchlistStore((s) => (currentProfileId ? s.isInMyList(currentProfileId, titleId) : false));
  const like = useWatchlistStore((s) => (currentProfileId ? s.getLike(currentProfileId, titleId) : null));
  const toggleMyList = useWatchlistStore((s) => s.toggleMyList);
  const setLike = useWatchlistStore((s) => s.setLike);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const similar = useMemo(() => {
    if (!title) return [];
    return TITLES.filter(
      (t) => t.id !== title.id && t.genres.some((g) => title.genres.includes(g))
    ).slice(0, 6);
  }, [title]);

  if (!title) return null;
  const activeSeason = title.seasons?.find((s) => s.number === season) ?? title.seasons?.[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-0 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl overflow-hidden rounded-none bg-surface shadow-2xl sm:rounded-lg"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
        >
          <X size={20} />
        </button>

        <div className="relative">
          <PosterArt title={title.title} palette={title.palette} genres={title.genres} variant="backdrop" className="w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
            <h2 className="font-display text-3xl text-white text-shadow sm:text-5xl">{title.title}</h2>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => router.push(`/watch/${title.slug}`)}
                className="flex items-center gap-2 rounded bg-white px-5 py-2 font-semibold text-black transition hover:bg-white/85"
              >
                <Play size={20} fill="black" /> Play
              </button>
              <button
                onClick={() => currentProfileId && toggleMyList(currentProfileId, title.id)}
                aria-label="Add to My List"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 bg-black/40 text-white hover:border-white"
              >
                {inList ? <Check size={20} /> : <Plus size={20} />}
              </button>
              <button
                onClick={() => currentProfileId && setLike(currentProfileId, title.id, "like")}
                aria-label="Like"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 bg-black/40 text-white hover:border-white",
                  like === "like" && "border-accent text-accent"
                )}
              >
                <ThumbsUp size={18} />
              </button>
              <button
                onClick={() => currentProfileId && setLike(currentProfileId, title.id, "dislike")}
                aria-label="Dislike"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 bg-black/40 text-white hover:border-white",
                  like === "dislike" && "border-accent text-accent"
                )}
              >
                <ThumbsDown size={18} />
              </button>
              <button
                onClick={() => setMuted((m) => !m)}
                aria-label="Toggle sound"
                className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 bg-black/40 text-white hover:border-white"
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-3 sm:p-8">
          <div className="sm:col-span-2">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-emerald-400">{title.match}% Match</span>
              <span className="text-white/70">{title.year}</span>
              <span className="rounded border border-white/40 px-1.5 py-0.5 text-xs text-white/70">{title.maturity}</span>
              <span className="text-white/70">{title.duration}</span>
              <span className="rounded border border-white/30 px-1.5 py-0.5 text-xs uppercase tracking-wide text-white/60">
                {title.kind === "series" ? "Series" : "Film"}
              </span>
            </div>
            <p className="text-[15px] leading-relaxed text-white/90">{title.longDescription}</p>
          </div>
          <div className="space-y-3 text-sm">
            {title.cast.length > 0 && (
              <p>
                <span className="text-white/50">Cast: </span>
                <span className="text-white/80">{title.cast.join(", ")}</span>
              </p>
            )}
            <p>
              <span className="text-white/50">Creator: </span>
              <span className="text-white/80">{title.creator}</span>
            </p>
            <p>
              <span className="text-white/50">Genres: </span>
              <span className="text-white/80">{title.genres.join(", ")}</span>
            </p>
            <p>
              <span className="text-white/50">This show is: </span>
              <span className="text-white/80">{title.tags.join(", ")}</span>
            </p>
          </div>
        </div>

        {title.seasons && title.seasons.length > 0 && (
          <div className="border-t border-white/10 px-5 py-6 sm:px-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Episodes</h3>
              {title.seasons.length > 1 && (
                <select
                  value={season}
                  onChange={(e) => setSeason(Number(e.target.value))}
                  className="rounded border border-white/30 bg-surface-raised px-3 py-1.5 text-sm text-white outline-none"
                >
                  {title.seasons.map((s) => (
                    <option key={s.number} value={s.number}>
                      Season {s.number}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-4">
              {activeSeason?.episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => router.push(`/watch/${title.slug}?ep=${ep.id}`)}
                  className="flex w-full items-center gap-4 rounded-md p-2 text-left transition hover:bg-white/5"
                >
                  <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded">
                    <PosterArt title={title.title} palette={title.palette} genres={title.genres} variant="card" />
                    <Play className="absolute inset-0 m-auto text-white/80" size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-white">
                        {ep.number}. {ep.title}
                      </span>
                      <span className="shrink-0 text-xs text-white/50">{ep.duration}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-white/60">{ep.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {similar.length > 0 && (
          <div className="border-t border-white/10 px-5 py-6 sm:px-8">
            <h3 className="mb-4 text-lg font-semibold text-white">More Like This</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {similar.map((t) => (
                <button
                  key={t.id}
                  onClick={() => router.push(`/watch/${t.slug}`)}
                  className="group overflow-hidden rounded-md bg-surface-raised text-left"
                >
                  <PosterArt title={t.title} palette={t.palette} genres={t.genres} variant="card" />
                  <div className="p-2">
                    <p className="truncate text-sm text-white/90">{t.title}</p>
                    <p className="text-xs text-white/50">
                      {t.year} · {t.maturity}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
