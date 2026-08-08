export type TitleKind = "movie" | "series";

export type MaturityRating = "G" | "PG" | "PG-13" | "TV-14" | "TV-MA" | "R";

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  durationMin: number;
  videoUrl: string;
  colorSeed: string;
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface Title {
  id: string;
  title: string;
  kind: TitleKind;
  synopsis: string;
  genres: string[];
  cast: string[];
  director: string;
  releaseYear: number;
  maturity: MaturityRating;
  durationMin?: number; // movies
  seasons?: Season[]; // series
  matchScore: number; // 0-100, netflix-style "match"
  colorSeed: string; // deterministic key for generated art
  videoUrl: string; // for movies, or trailer/first-episode fallback
  isNew?: boolean;
  isTop10?: boolean;
  trending?: boolean;
}

export interface Row {
  id: string;
  heading: string;
  titleIds: string[];
}

export interface Profile {
  id: string;
  name: string;
  isKids: boolean;
  avatarSeed: string;
  avatarColor: string;
}

export interface WatchProgress {
  titleId: string;
  episodeId?: string;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt: number;
}
