export type TitleKind = "movie" | "series";

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
  description: string;
  progress?: number; // 0-100, watched percentage
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface Title {
  id: string;
  slug: string;
  title: string;
  kind: TitleKind;
  genres: string[];
  year: number;
  maturity: string;
  duration: string;
  match: number;
  description: string;
  longDescription: string;
  cast: string[];
  creator: string;
  tags: string[];
  palette: string;
  isNew?: boolean;
  isKids?: boolean;
  seasons?: Season[];
}

export interface Row {
  id: string;
  title: string;
  titles: Title[];
  numbered?: boolean;
  size?: "standard" | "large";
}

export interface Profile {
  id: string;
  name: string;
  avatarColor: string;
  isKids: boolean;
}
