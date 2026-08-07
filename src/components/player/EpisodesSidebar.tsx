"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import type { Title } from "@/lib/types";
import TitleArt from "@/components/ui/TitleArt";
import { cn } from "@/lib/utils";

interface EpisodesSidebarProps {
  title: Title;
  open: boolean;
  activeEpisodeId?: string;
  onClose: () => void;
  onSelect: (episodeId: string) => void;
}

export default function EpisodesSidebar({ title, open, activeEpisodeId, onClose, onSelect }: EpisodesSidebarProps) {
  const seasons = title.seasons ?? [];
  const activeSeasonIndex = seasons.findIndex((s) =>
    s.episodes.some((e) => e.id === activeEpisodeId),
  );
  const [seasonIdx, setSeasonIdx] = useState(Math.max(0, activeSeasonIndex));

  return (
    <>
      {open && <div className="absolute inset-0 z-30 bg-black/40" onClick={onClose} />}
      <aside
        className={cn(
          "absolute inset-y-0 right-0 z-40 w-full max-w-sm transform overflow-y-auto bg-nx-bg-elevated shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h2 className="text-lg font-bold text-white">Episodes</h2>
          <button aria-label="Close" onClick={onClose} className="text-white hover:text-nx-text-muted">
            <X size={22} />
          </button>
        </div>

        {seasons.length > 1 && (
          <div className="p-4">
            <select
              value={seasonIdx}
              onChange={(e) => setSeasonIdx(Number(e.target.value))}
              className="w-full rounded border border-white/30 bg-nx-bg-card px-3 py-2 text-sm text-white"
            >
              {seasons.map((s, i) => (
                <option key={s.seasonNumber} value={i}>
                  Season {s.seasonNumber}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-1 px-2 pb-6">
          {seasons[seasonIdx]?.episodes.map((ep) => {
            const active = ep.id === activeEpisodeId;
            return (
              <button
                key={ep.id}
                onClick={() => onSelect(ep.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded p-2 text-left hover:bg-white/5",
                  active && "bg-white/10",
                )}
              >
                <span className="w-5 shrink-0 text-sm text-nx-text-muted">{ep.episodeNumber}</span>
                <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded">
                  <TitleArt seed={ep.colorSeed} genres={title.genres} className="h-full w-full" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play size={16} className={cn("fill-white text-white", active ? "opacity-100" : "opacity-0 hover:opacity-100")} />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm", active ? "font-semibold text-nx-red" : "text-white")}>
                    {ep.title}
                  </p>
                  <p className="text-xs text-nx-text-muted">{ep.durationMin}m</p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
