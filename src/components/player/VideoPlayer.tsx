"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Title } from "@/lib/types";
import { nextEpisode, resolvePlaybackTarget } from "@/lib/player-helpers";
import { useSessionStore } from "@/store/useSessionStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import EpisodesSidebar from "./EpisodesSidebar";
import PlaybackSession from "./PlaybackSession";

interface VideoPlayerProps {
  title: Title;
  initialEpisodeId?: string | null;
}

export default function VideoPlayer({ title, initialEpisodeId }: VideoPlayerProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [episodeId, setEpisodeId] = useState<string | undefined>(() => {
    if (initialEpisodeId) return initialEpisodeId;
    const profileId = useSessionStore.getState().activeProfileId ?? "guest";
    return useLibraryStore.getState().getProgress(profileId, title.id)?.episodeId;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const target = resolvePlaybackTarget(title, episodeId);
  const upcoming = title.seasons && target.episode ? nextEpisode(title, target.episode.id) : undefined;

  useEffect(() => {
    function onFsChange() {
      setFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  function toggleFullscreen() {
    const node = containerRef.current;
    if (!node) return;
    if (!document.fullscreenElement) {
      node.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function handleBack() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    router.back();
  }

  function goToEpisode(id: string) {
    setEpisodeId(id);
    setSidebarOpen(false);
  }

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      <PlaybackSession
        key={target.episode?.id ?? title.id}
        title={title}
        target={target}
        upcoming={upcoming}
        fullscreen={fullscreen}
        onToggleFullscreen={toggleFullscreen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onBack={handleBack}
        onEndedAdvance={() => upcoming && goToEpisode(upcoming.id)}
        onSelectEpisode={goToEpisode}
      />

      {title.seasons && (
        <EpisodesSidebar
          title={title}
          open={sidebarOpen}
          activeEpisodeId={target.episode?.id}
          onClose={() => setSidebarOpen(false)}
          onSelect={goToEpisode}
        />
      )}
    </div>
  );
}
