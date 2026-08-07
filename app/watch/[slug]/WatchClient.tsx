"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  ListVideo,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { getTitleBySlug } from "@/lib/data";
import { Episode } from "@/lib/types";
import { useProfileStore } from "@/store/useProfileStore";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { cn, formatTime } from "@/lib/utils";
import PosterArt from "@/components/PosterArt";

function parseDuration(str: string): number {
  const h = /(\d+)h/.exec(str);
  const m = /(\d+)m/.exec(str);
  const hours = h ? parseInt(h[1], 10) : 0;
  const mins = m ? parseInt(m[1], 10) : 0;
  if (hours === 0 && mins === 0) return 25 * 60;
  return hours * 3600 + mins * 60;
}

export default function WatchClient({ slug, initialEpisodeId }: { slug: string; initialEpisodeId?: string }) {
  const router = useRouter();
  const title = getTitleBySlug(slug);
  const currentProfileId = useProfileStore((s) => s.currentProfileId);
  const setProgress = useWatchlistStore((s) => s.setProgress);
  const savedProgress = useWatchlistStore((s) =>
    currentProfileId && title ? s.getProgress(currentProfileId, title.id) : 0
  );

  const allEpisodes = useMemo(
    () => title?.seasons?.flatMap((s) => s.episodes.map((e) => ({ ...e, season: s.number }))) ?? [],
    [title]
  );

  const [season, setSeason] = useState(() => {
    const found = allEpisodes.find((e) => e.id === initialEpisodeId);
    return found?.season ?? title?.seasons?.[0]?.number ?? 1;
  });
  const [episode, setEpisode] = useState<(Episode & { season: number }) | undefined>(() => {
    return allEpisodes.find((e) => e.id === initialEpisodeId) ?? allEpisodes[0];
  });

  const duration = episode ? parseDuration(episode.duration) : title ? parseDuration(title.duration) : 25 * 60;

  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(() => (savedProgress / 100) * duration || 0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [seeking, setSeeking] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedPct = useRef(-1);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setShowControls((sc) => (playing ? false : sc));
    }, 3000);
  }, [playing]);

  // Arm the initial auto-hide timer on mount. The state change lives inside
  // the timer callback (a deferred, external-clock-driven event), not at the
  // top level of the effect — subsequent resets happen directly from the
  // mouse/touch/keyboard/click handlers below via resetHideTimer().
  useEffect(() => {
    hideTimer.current = setTimeout(() => setShowControls((sc) => (playing ? false : sc)), 3000);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!playing || seeking) return;
    const id = setInterval(() => {
      setCurrentTime((t) => {
        const next = Math.min(duration, t + 1);
        if (next >= duration) setPlaying(false);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, seeking, duration]);

  useEffect(() => {
    if (!title || !currentProfileId) return;
    const pct = Math.round((currentTime / duration) * 100);
    if (Math.abs(pct - lastSavedPct.current) >= 1) {
      lastSavedPct.current = pct;
      setProgress(currentProfileId, title.id, pct);
    }
  }, [currentTime, duration, title, currentProfileId, setProgress]);

  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "Escape") {
        router.back();
      }
      resetHideTimer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, resetHideTimer]);

  if (!title) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-white">
        <p>Title not found.</p>
      </div>
    );
  }

  function playEpisode(ep: Episode & { season: number }) {
    setSeason(ep.season);
    setEpisode(ep);
    setCurrentTime(0);
    setPlaying(true);
    lastSavedPct.current = -1;
    setShowEpisodes(false);
  }

  function playNextEpisode() {
    const idx = allEpisodes.findIndex((e) => e.id === episode?.id);
    const next = allEpisodes[idx + 1];
    if (next) playEpisode(next);
  }

  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const showSkipIntro = playing && currentTime > 2 && currentTime < Math.min(duration * 0.35, 90);
  const showUpNext = title.kind === "series" && currentTime >= duration - 12 && currentTime < duration;
  const nextEp = title.kind === "series" ? allEpisodes[allEpisodes.findIndex((e) => e.id === episode?.id) + 1] : undefined;
  const effectiveVolume = muted ? 0 : volume;
  const VolumeIcon = effectiveVolume === 0 ? VolumeX : effectiveVolume < 50 ? Volume1 : Volume2;
  const activeSeason = title.seasons?.find((s) => s.number === season) ?? title.seasons?.[0];

  return (
    <div
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
      onClick={() => {
        setPlaying((p) => !p);
        resetHideTimer();
      }}
      className="relative h-screen w-screen cursor-pointer overflow-hidden bg-black select-none"
    >
      <motion.div
        animate={{ scale: playing ? 1.06 : 1 }}
        transition={{ duration: duration, ease: "linear" }}
        className="absolute inset-0"
      >
        <PosterArt title={episode?.title ?? title.title} palette={title.palette} genres={title.genres} variant="backdrop" className="h-full w-full" />
      </motion.div>
      <div className="absolute inset-0 bg-black/25" />

      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <Play size={72} className="text-white/90" fill="white" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showControls && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 top-0 flex items-center gap-4 bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6"
            >
              <button
                aria-label="Back"
                onClick={() => router.back()}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
              >
                <ArrowLeft size={22} />
              </button>
              <div>
                <h1 className="font-display text-lg tracking-wide text-white sm:text-2xl">{title.title}</h1>
                {episode && (
                  <p className="text-xs text-white/70 sm:text-sm">
                    S{episode.season}:E{episode.number} {episode.title}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-16 sm:p-6 sm:pt-24"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="w-10 shrink-0 text-right text-xs tabular-nums text-white/80">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={1}
                  value={currentTime}
                  onMouseDown={() => setSeeking(true)}
                  onMouseUp={() => setSeeking(false)}
                  onTouchStart={() => setSeeking(true)}
                  onTouchEnd={() => setSeeking(false)}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  className="range-slim h-1 w-full flex-1 cursor-pointer rounded-full"
                  style={{
                    background: `linear-gradient(to right, var(--color-accent) ${pct}%, rgba(255,255,255,0.3) ${pct}%)`,
                  }}
                />
                <span className="w-10 shrink-0 text-xs tabular-nums text-white/80">{formatTime(duration)}</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  aria-label={playing ? "Pause" : "Play"}
                  onClick={() => {
                    setPlaying((p) => !p);
                    resetHideTimer();
                  }}
                  className="text-white hover:text-white/70"
                >
                  {playing ? <Pause size={26} fill="white" /> : <Play size={26} fill="white" />}
                </button>
                <button
                  aria-label="Rewind 10 seconds"
                  onClick={() => setCurrentTime((t) => Math.max(0, t - 10))}
                  className="hidden text-white hover:text-white/70 sm:block"
                >
                  <RotateCcw size={22} />
                </button>
                <button
                  aria-label="Forward 10 seconds"
                  onClick={() => setCurrentTime((t) => Math.min(duration, t + 10))}
                  className="hidden text-white hover:text-white/70 sm:block"
                >
                  <RotateCw size={22} />
                </button>
                {title.kind === "series" && nextEp && (
                  <button
                    aria-label="Next episode"
                    onClick={playNextEpisode}
                    className="text-white hover:text-white/70"
                  >
                    <SkipForward size={22} />
                  </button>
                )}

                <div className="group/vol flex items-center gap-2">
                  <button
                    aria-label="Mute"
                    onClick={() => setMuted((m) => !m)}
                    className="text-white hover:text-white/70"
                  >
                    <VolumeIcon size={22} />
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={effectiveVolume}
                    onChange={(e) => {
                      setMuted(false);
                      setVolume(Number(e.target.value));
                    }}
                    className="range-slim h-1 w-0 cursor-pointer rounded-full opacity-0 transition-all duration-200 group-hover/vol:w-20 group-hover/vol:opacity-100 sm:w-20 sm:opacity-100"
                    style={{
                      background: `linear-gradient(to right, white ${effectiveVolume}%, rgba(255,255,255,0.3) ${effectiveVolume}%)`,
                    }}
                  />
                </div>

                <span className="hidden text-xs text-white/70 sm:block">
                  {title.year} · {title.maturity}
                </span>

                <div className="ml-auto flex items-center gap-3 sm:gap-4">
                  {title.kind === "series" && (
                    <button
                      aria-label="Episodes"
                      onClick={() => setShowEpisodes((v) => !v)}
                      className="text-white hover:text-white/70"
                    >
                      <ListVideo size={22} />
                    </button>
                  )}
                  <button
                    aria-label="Toggle fullscreen"
                    onClick={toggleFullscreen}
                    className="text-white hover:text-white/70"
                  >
                    {fullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSkipIntro && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentTime(Math.min(duration, Math.min(duration * 0.35, 90)));
            }}
            className="absolute bottom-28 right-6 z-10 rounded border border-white/40 bg-black/70 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-black/90 sm:bottom-32 sm:right-10"
          >
            Skip Intro
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUpNext && nextEp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-28 right-6 z-10 w-64 overflow-hidden rounded-md border border-white/10 bg-surface shadow-2xl sm:bottom-32 sm:right-10 sm:w-72"
          >
            <div className="relative">
              <PosterArt title={nextEp.title} palette={title.palette} genres={title.genres} variant="card" />
              <button
                onClick={() => playNextEpisode()}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50"
              >
                <Play size={36} className="text-white" fill="white" />
              </button>
            </div>
            <div className="p-3">
              <p className="text-xs text-white/50">Next Episode</p>
              <p className="truncate text-sm font-semibold text-white">
                {nextEp.number}. {nextEp.title}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEpisodes && title.seasons && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 right-0 z-20 w-full max-w-sm overflow-y-auto bg-surface/98 backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <h3 className="text-lg font-semibold text-white">Episodes</h3>
              <div className="flex items-center gap-3">
                {title.seasons.length > 1 && (
                  <select
                    value={season}
                    onChange={(e) => setSeason(Number(e.target.value))}
                    className="rounded border border-white/30 bg-surface-raised px-2 py-1 text-sm text-white outline-none"
                  >
                    {title.seasons.map((s) => (
                      <option key={s.number} value={s.number}>
                        Season {s.number}
                      </option>
                    ))}
                  </select>
                )}
                <button onClick={() => setShowEpisodes(false)} className="text-white/70 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {activeSeason?.episodes.map((ep) => {
                const isActive = ep.id === episode?.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => playEpisode({ ...ep, season })}
                    className={cn(
                      "flex w-full items-center gap-3 p-3 text-left hover:bg-white/5",
                      isActive && "bg-white/10"
                    )}
                  >
                    <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded">
                      <PosterArt title={ep.title} palette={title.palette} genres={title.genres} variant="card" />
                      {isActive ? (
                        playing ? (
                          <Pause size={18} className="absolute inset-0 m-auto text-white" fill="white" />
                        ) : (
                          <Play size={18} className="absolute inset-0 m-auto text-white" fill="white" />
                        )
                      ) : (
                        <ChevronRight size={18} className="absolute inset-0 m-auto text-white/70 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("truncate text-sm font-medium", isActive ? "text-accent" : "text-white")}>
                          {ep.number}. {ep.title}
                        </span>
                        <span className="shrink-0 text-xs text-white/50">{ep.duration}</span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-white/50">{ep.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
