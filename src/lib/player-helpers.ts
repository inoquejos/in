import type { Episode, Title } from "@/lib/types";

export interface PlaybackTarget {
  videoUrl: string;
  durationHintMin: number;
  displayTitle: string;
  episode?: Episode;
  seasonNumber?: number;
}

export function resolvePlaybackTarget(title: Title, episodeId?: string | null): PlaybackTarget {
  if (title.kind === "movie" || !title.seasons) {
    return {
      videoUrl: title.videoUrl,
      durationHintMin: title.durationMin ?? 100,
      displayTitle: title.title,
    };
  }

  const allEpisodes = title.seasons.flatMap((s) => s.episodes);
  const episode = (episodeId && allEpisodes.find((e) => e.id === episodeId)) || allEpisodes[0];

  return {
    videoUrl: episode.videoUrl,
    durationHintMin: episode.durationMin,
    displayTitle: `${title.title}: S${episode.seasonNumber} E${episode.episodeNumber} "${episode.title}"`,
    episode,
    seasonNumber: episode.seasonNumber,
  };
}

export function nextEpisode(title: Title, currentEpisodeId: string): Episode | undefined {
  if (!title.seasons) return undefined;
  const allEpisodes = title.seasons.flatMap((s) => s.episodes);
  const idx = allEpisodes.findIndex((e) => e.id === currentEpisodeId);
  if (idx === -1 || idx === allEpisodes.length - 1) return undefined;
  return allEpisodes[idx + 1];
}
