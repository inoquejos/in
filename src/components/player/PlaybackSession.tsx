"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
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
} from "lucide-react";
import type { Episode, Title } from "@/lib/types";
import { formatClock } from "@/lib/utils";
import type { PlaybackTarget } from "@/lib/player-helpers";
import { useSessionStore } from "@/store/useSessionStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import TitleArt from "@/components/ui/TitleArt";

const INTRO_WINDOW_SECONDS = 20;
const CONTROLS_HIDE_DELAY = 3000;

interface PlaybackSessionProps {
  title: Title;
  target: PlaybackTarget;
  upcoming?: Episode;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  onToggleSidebar: () => void;
  onBack: () => void;
  onEndedAdvance: () => void;
  onSelectEpisode: (episodeId: string) => void;
}

/**
 * Owns one episode/movie's playback clock end-to-end. Mounted fresh (via a `key` on
 * the caller) every time the episode changes, so all local state — position, loading,
 * play/pause — naturally resets on switch without any effect syncing state to a prop.
 */
export default function PlaybackSession({
  title,
  target,
  upcoming,
  fullscreen,
  onToggleFullscreen,
  onToggleSidebar,
  onBack,
  onEndedAdvance,
  onSelectEpisode,
}: PlaybackSessionProps) {
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const activeProfileId = useSessionStore((s) => s.activeProfileId) ?? "guest";
  const updateProgress = useLibraryStore((s) => s.updateProgress);
  const savedProgress = useLibraryStore((s) => s.getProgress(activeProfileId, title.id));

  const duration = target.durationHintMin * 60;
  const resumeSeconds =
    savedProgress && savedProgress.episodeId === target.episode?.id && savedProgress.progressSeconds < duration - 5
      ? savedProgress.progressSeconds
      : 0;

  const [currentTime, setCurrentTime] = useState(resumeSeconds);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  // Mirrors state for the RAF loop and the true-unmount cleanup, both of which run
  // outside React's render cycle and shouldn't read stale closure values.
  const latestRef = useRef({ currentTime: resumeSeconds, duration });

  function persistProgress(seconds: number) {
    if (!duration) return;
    updateProgress(activeProfileId, {
      titleId: title.id,
      episodeId: target.episode?.id,
      progressSeconds: seconds,
      durationSeconds: duration,
      updatedAt: Date.now(),
    });
  }

  function handleEnded() {
    persistProgress(duration);
    setPlaying(false);
    onEndedAdvance();
  }

  // Simulate a brief buffering delay, then autoplay — same beat as a real player.
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      setPlaying(true);
    }, 550);
    return () => clearTimeout(t);
  }, []);

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), CONTROLS_HIDE_DELAY);
  }, []);

  const wake = useCallback(() => {
    setControlsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    if (playing) scheduleHide();
    else if (hideTimer.current) clearTimeout(hideTimer.current);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [playing, scheduleHide]);

  // The playback clock: a plain rAF loop reading/writing latestRef so side effects
  // (persisting, detecting the end) stay out of any setState updater.
  useEffect(() => {
    if (!playing) {
      lastTickRef.current = null;
      return;
    }
    function tick(now: number) {
      if (lastTickRef.current == null) lastTickRef.current = now;
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      const next = Math.min(duration, latestRef.current.currentTime + delta);
      latestRef.current = { currentTime: next, duration };
      setCurrentTime(next);
      if (Math.floor(next) % 5 === 0) persistProgress(next);
      if (next >= duration) {
        handleEnded();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  function togglePlay() {
    setPlaying((p) => !p);
    wake();
  }

  function skipBy(seconds: number) {
    const next = Math.min(Math.max(0, latestRef.current.currentTime + seconds), duration);
    latestRef.current = { currentTime: next, duration };
    setCurrentTime(next);
    wake();
  }

  function skipIntro() {
    latestRef.current = { currentTime: INTRO_WINDOW_SECONDS, duration };
    setCurrentTime(INTRO_WINDOW_SECONDS);
    wake();
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    latestRef.current = { currentTime: value, duration };
    setCurrentTime(value);
  }

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    setVolume(value);
    setMuted(value === 0);
  }

  function toggleMute() {
    setMuted((m) => !m);
    wake();
  }

  // Keyboard shortcuts, captured once per mount (i.e. once per episode).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        skipBy(10);
      } else if (e.code === "ArrowLeft") {
        skipBy(-10);
      } else if (e.code === "KeyF") {
        onToggleFullscreen();
      } else if (e.code === "KeyM") {
        toggleMute();
      } else if (e.code === "Escape") {
        onBack();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the last known position when this episode's session unmounts — i.e. the
  // user switches episodes or navigates away entirely.
  useEffect(() => {
    return () => {
      const { currentTime: t, duration: d } = latestRef.current;
      if (d) persistProgress(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSkipIntro = currentTime > 0.5 && currentTime < INTRO_WINDOW_SECONDS && duration > 90;
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      className="absolute inset-0"
      onMouseMove={wake}
      onClick={(e) => {
        if (e.currentTarget === e.target) wake();
      }}
    >
      <div className="absolute inset-0">
        <TitleArt
          seed={target.episode?.colorSeed ?? title.colorSeed}
          genres={title.genres}
          variant="backdrop"
          className={`h-full w-full transition-transform duration-[6000ms] ease-linear ${
            playing ? "scale-110" : "scale-100"
          }`}
        />
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-nx-red" />
        </div>
      )}

      {/* Top bar */}
      <div
        className={`absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300 sm:p-6 ${
          controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            aria-label="Back"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
          >
            <ChevronLeft size={26} />
          </button>
          <div>
            <h1 className="text-shadow text-lg font-semibold text-white sm:text-xl">{title.title}</h1>
            {target.episode && (
              <p className="text-shadow text-xs text-nx-text-muted sm:text-sm">
                S{target.episode.seasonNumber} E{target.episode.episodeNumber} · {target.episode.title}
              </p>
            )}
          </div>
        </div>
        {title.seasons && (
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-2 rounded border border-white/30 px-3 py-1.5 text-sm text-white hover:border-white"
          >
            <ListVideo size={18} />
            <span className="hidden sm:inline">Episodes</span>
          </button>
        )}
      </div>

      {showSkipIntro && (
        <button
          onClick={skipIntro}
          className="absolute bottom-28 right-4 z-20 rounded border border-white/60 bg-black/70 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 sm:bottom-32 sm:right-10"
        >
          Skip Intro
        </button>
      )}

      {upcoming && duration > 0 && duration - currentTime < 12 && duration - currentTime > 0.3 && (
        <button
          onClick={() => onSelectEpisode(upcoming.id)}
          className="absolute bottom-28 right-4 z-20 rounded border border-white/60 bg-black/70 px-4 py-2 text-left text-sm text-white hover:bg-white/20 sm:bottom-32 sm:right-10"
        >
          <span className="block text-xs text-nx-text-muted">Next Episode</span>
          <span className="font-semibold">{upcoming.title}</span>
        </button>
      )}

      {/* Center play/pause + skip */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-10 transition-opacity duration-300 ${
          controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button aria-label="Back 10 seconds" onClick={() => skipBy(-10)} className="text-white transition hover:scale-110">
          <RotateCcw size={32} />
        </button>
        <button
          aria-label={playing ? "Pause" : "Play"}
          onClick={togglePlay}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white transition hover:scale-105 hover:bg-white/20"
        >
          {playing ? <Pause size={32} className="fill-white" /> : <Play size={32} className="fill-white" />}
        </button>
        <button aria-label="Forward 10 seconds" onClick={() => skipBy(10)} className="text-white transition hover:scale-110">
          <RotateCw size={32} />
        </button>
      </div>

      {/* Bottom controls */}
      <div
        className={`absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 sm:p-6 ${
          controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="w-12 text-right text-xs text-nx-text-muted sm:text-sm">{formatClock(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="h-1 flex-1 cursor-pointer accent-nx-red"
            style={{
              background: `linear-gradient(to right, #e50914 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) 0)`,
            }}
          />
          <span className="w-12 text-xs text-nx-text-muted sm:text-sm">{formatClock(duration)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button aria-label={playing ? "Pause" : "Play"} onClick={togglePlay} className="text-white">
              {playing ? <Pause size={22} className="fill-white" /> : <Play size={22} className="fill-white" />}
            </button>
            {upcoming && (
              <button aria-label="Next episode" onClick={() => onSelectEpisode(upcoming.id)} className="text-white">
                <SkipForward size={22} />
              </button>
            )}
            <div className="group/vol flex items-center gap-2">
              <button aria-label={muted ? "Unmute" : "Mute"} onClick={toggleMute} className="text-white">
                <VolumeIcon size={22} />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={handleVolume}
                className="h-1 w-0 cursor-pointer overflow-hidden accent-white transition-all duration-200 group-hover/vol:w-20"
              />
            </div>
            <span className="hidden text-sm text-white sm:inline">{target.displayTitle}</span>
          </div>
          <button aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={onToggleFullscreen} className="text-white">
            {fullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
}
