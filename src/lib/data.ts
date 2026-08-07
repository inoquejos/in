import type { Episode, MaturityRating, Row, Season, Title, TitleKind } from "./types";

/**
 * Open, freely redistributable sample films (Blender Foundation / Google GTV demo reel)
 * used as stand-in playable sources so the player view has real, working video.
 */
const VIDEO_SOURCES = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
];

function videoFor(index: number): string {
  return VIDEO_SOURCES[index % VIDEO_SOURCES.length];
}

interface RawTitle {
  id: string;
  title: string;
  kind: TitleKind;
  synopsis: string;
  genres: string[];
  cast: string[];
  director: string;
  releaseYear: number;
  maturity: MaturityRating;
  durationMin?: number;
  seasonCount?: number;
  episodesPerSeason?: number;
  isNew?: boolean;
  isTop10?: boolean;
  trending?: boolean;
}

const RAW_TITLES: RawTitle[] = [
  {
    id: "crimson-horizon",
    title: "Crimson Horizon",
    kind: "series",
    synopsis:
      "When a covert operative uncovers a conspiracy inside her own agency, she must outrun former allies to expose the truth before the horizon burns red.",
    genres: ["Action", "Thriller", "Drama"],
    cast: ["Mara Voss", "Idris Kane", "Priya Anand"],
    director: "Lena Reyes",
    releaseYear: 2025,
    maturity: "TV-MA",
    seasonCount: 2,
    episodesPerSeason: 6,
    trending: true,
    isTop10: true,
  },
  {
    id: "glass-city",
    title: "Glass City",
    kind: "series",
    synopsis:
      "In a near-future metropolis built entirely of smart-glass, a detective who trusts no algorithm hunts a killer the city's AI insists doesn't exist.",
    genres: ["Sci-Fi", "Crime", "Mystery"],
    cast: ["Toma Reyes", "Ana Bergström", "Devon Cole"],
    director: "Hiro Watanabe",
    releaseYear: 2024,
    maturity: "TV-MA",
    seasonCount: 3,
    episodesPerSeason: 8,
    trending: true,
  },
  {
    id: "the-last-orchard",
    title: "The Last Orchard",
    kind: "movie",
    synopsis:
      "As drought consumes the valley, three estranged siblings return to their family orchard for one final harvest — and one last chance to forgive each other.",
    genres: ["Drama", "Family"],
    cast: ["Wren Castillo", "Marcus Ade", "Ines Solberg"],
    director: "Claire Dupont",
    releaseYear: 2023,
    maturity: "PG-13",
    durationMin: 118,
  },
  {
    id: "nightshade-protocol",
    title: "Nightshade Protocol",
    kind: "movie",
    synopsis:
      "A disavowed intelligence officer has twelve hours to stop a bioweapon auction — armed with nothing but a stolen badge and a grudge.",
    genres: ["Action", "Thriller"],
    cast: ["Idris Kane", "Sofia Marchetti"],
    director: "Ben Okafor",
    releaseYear: 2025,
    maturity: "R",
    durationMin: 104,
    isNew: true,
    trending: true,
  },
  {
    id: "starlit-academy",
    title: "Starlit Academy",
    kind: "series",
    synopsis:
      "Four gifted teenagers enroll in a hidden academy for young starship pilots, where friendship is tested against the vast, unforgiving dark.",
    genres: ["Sci-Fi", "Fantasy", "Teen"],
    cast: ["Nova Okonkwo", "Felix Bram", "Yuki Tanaka"],
    director: "Renee Aubert",
    releaseYear: 2024,
    maturity: "TV-14",
    seasonCount: 2,
    episodesPerSeason: 10,
    isNew: true,
  },
  {
    id: "paper-hearts",
    title: "Paper Hearts",
    kind: "movie",
    synopsis:
      "A origami artist and a failing bakery owner keep leaving anonymous notes for each other in the same coffee shop mailbox — never quite meeting.",
    genres: ["Romance", "Comedy"],
    cast: ["Ines Solberg", "Devon Cole"],
    director: "Marisol Vega",
    releaseYear: 2022,
    maturity: "PG-13",
    durationMin: 97,
  },
  {
    id: "the-quiet-signal",
    title: "The Quiet Signal",
    kind: "movie",
    synopsis:
      "A radio astronomer detects a signal that shouldn't exist — and realizes someone in her observatory is trying to make sure no one else finds out.",
    genres: ["Sci-Fi", "Mystery", "Thriller"],
    cast: ["Ana Bergström", "Toma Reyes"],
    director: "Hiro Watanabe",
    releaseYear: 2023,
    maturity: "PG-13",
    durationMin: 111,
    isTop10: true,
  },
  {
    id: "kingdom-of-ash-and-ember",
    title: "Kingdom of Ash & Ember",
    kind: "series",
    synopsis:
      "Two rival houses forge an uneasy truce to face a rising army of the dead — but old betrayals burn hotter than any dragonfire.",
    genres: ["Fantasy", "Action", "Drama"],
    cast: ["Mara Voss", "Felix Bram", "Priya Anand"],
    director: "Owen Fitzgerald",
    releaseYear: 2021,
    maturity: "TV-MA",
    seasonCount: 4,
    episodesPerSeason: 8,
    isTop10: true,
    trending: true,
  },
  {
    id: "laugh-track",
    title: "Laugh Track",
    kind: "series",
    synopsis:
      "A struggling stand-up comic accidentally becomes the head writer of the biggest late-night show in the country — and has no idea what she's doing.",
    genres: ["Comedy"],
    cast: ["Sofia Marchetti", "Devon Cole", "Yuki Tanaka"],
    director: "Marisol Vega",
    releaseYear: 2024,
    maturity: "TV-14",
    seasonCount: 2,
    episodesPerSeason: 8,
    isNew: true,
  },
  {
    id: "deep-current",
    title: "Deep Current",
    kind: "movie",
    synopsis:
      "A salvage crew discovers a sunken research vessel with its logs intact — and something in the cargo hold that's still alive.",
    genres: ["Horror", "Thriller"],
    cast: ["Marcus Ade", "Nova Okonkwo"],
    director: "Ben Okafor",
    releaseYear: 2023,
    maturity: "R",
    durationMin: 101,
  },
  {
    id: "wildfire-summer",
    title: "Wildfire Summer",
    kind: "movie",
    synopsis:
      "Four childhood friends spend one last summer at the lake house before it's sold — and confront the choices pulling them apart.",
    genres: ["Drama", "Romance"],
    cast: ["Wren Castillo", "Ines Solberg", "Felix Bram"],
    director: "Claire Dupont",
    releaseYear: 2022,
    maturity: "PG-13",
    durationMin: 108,
  },
  {
    id: "the-cartographers",
    title: "The Cartographers",
    kind: "series",
    synopsis:
      "A guild of secret mapmakers races to chart a continent that keeps rearranging itself, one border at a time.",
    genres: ["Fantasy", "Adventure", "Mystery"],
    cast: ["Yuki Tanaka", "Mara Voss"],
    director: "Renee Aubert",
    releaseYear: 2025,
    maturity: "TV-14",
    seasonCount: 1,
    episodesPerSeason: 6,
    isNew: true,
  },
  {
    id: "iron-lotus",
    title: "Iron Lotus",
    kind: "movie",
    synopsis:
      "A retired martial arts champion is pulled back into the ring to protect her estranged daughter from the syndicate she once ran from.",
    genres: ["Action", "Drama"],
    cast: ["Priya Anand", "Idris Kane"],
    director: "Owen Fitzgerald",
    releaseYear: 2024,
    maturity: "PG-13",
    durationMin: 115,
    trending: true,
  },
  {
    id: "the-graveyard-shift",
    title: "The Graveyard Shift",
    kind: "series",
    synopsis:
      "Overnight workers at a big-box store discover the building is a lot bigger — and a lot older — than corporate ever mentioned.",
    genres: ["Horror", "Comedy"],
    cast: ["Devon Cole", "Sofia Marchetti", "Marcus Ade"],
    director: "Ben Okafor",
    releaseYear: 2023,
    maturity: "TV-MA",
    seasonCount: 2,
    episodesPerSeason: 7,
  },
  {
    id: "second-nature",
    title: "Second Nature",
    kind: "movie",
    synopsis:
      "A wildlife photographer documenting a rewilded national park befriends a wolf pack — and stumbles onto a poaching ring targeting them.",
    genres: ["Documentary", "Adventure"],
    cast: ["Nova Okonkwo"],
    director: "Renee Aubert",
    releaseYear: 2022,
    maturity: "PG",
    durationMin: 92,
  },
  {
    id: "signal-lost",
    title: "Signal Lost",
    kind: "movie",
    synopsis:
      "The last transmission from a Mars colony cuts off mid-sentence. Six months later, mission control gets a reply.",
    genres: ["Sci-Fi", "Thriller"],
    cast: ["Toma Reyes", "Yuki Tanaka"],
    director: "Hiro Watanabe",
    releaseYear: 2025,
    maturity: "PG-13",
    durationMin: 122,
    isNew: true,
    isTop10: true,
  },
  {
    id: "the-understudy",
    title: "The Understudy",
    kind: "movie",
    synopsis:
      "A theater understudy gets her one shot at the lead role — the same night she discovers the star's disappearance wasn't an accident.",
    genres: ["Thriller", "Drama"],
    cast: ["Ines Solberg", "Wren Castillo"],
    director: "Marisol Vega",
    releaseYear: 2021,
    maturity: "PG-13",
    durationMin: 106,
  },
  {
    id: "mission-cupcake",
    title: "Mission: Cupcake",
    kind: "series",
    synopsis:
      "A team of pint-sized secret agents run their missions out of a bakery — and no villain can resist the frosting.",
    genres: ["Kids", "Comedy", "Family"],
    cast: ["Junior Cast"],
    director: "Studio Pinwheel",
    releaseYear: 2024,
    maturity: "G",
    seasonCount: 3,
    episodesPerSeason: 12,
  },
  {
    id: "dino-dash",
    title: "Dino Dash",
    kind: "series",
    synopsis:
      "A friendly pack of cartoon dinosaurs races around the prehistoric valley solving problems for all their jungle neighbors.",
    genres: ["Kids", "Family", "Animation"],
    cast: ["Junior Cast"],
    director: "Studio Pinwheel",
    releaseYear: 2023,
    maturity: "G",
    seasonCount: 2,
    episodesPerSeason: 14,
  },
  {
    id: "the-boardroom",
    title: "The Boardroom",
    kind: "series",
    synopsis:
      "Siblings inherit their late father's media empire and immediately start plotting against each other for control.",
    genres: ["Drama"],
    cast: ["Marcus Ade", "Wren Castillo", "Priya Anand"],
    director: "Owen Fitzgerald",
    releaseYear: 2022,
    maturity: "TV-MA",
    seasonCount: 3,
    episodesPerSeason: 9,
    isTop10: true,
  },
  {
    id: "midnight-market",
    title: "Midnight Market",
    kind: "movie",
    synopsis:
      "A night market that only appears once a year sells things that shouldn't exist — and takes payments no one wants to make twice.",
    genres: ["Fantasy", "Horror"],
    cast: ["Yuki Tanaka", "Nova Okonkwo"],
    director: "Renee Aubert",
    releaseYear: 2024,
    maturity: "TV-14",
    durationMin: 99,
    trending: true,
  },
  {
    id: "the-long-lap",
    title: "The Long Lap",
    kind: "movie",
    synopsis:
      "An unflinching look inside a rookie racing team's first season, from garage floor to podium.",
    genres: ["Documentary", "Sport"],
    cast: [],
    director: "Claire Dupont",
    releaseYear: 2023,
    maturity: "PG-13",
    durationMin: 89,
  },
  {
    id: "the-collector",
    title: "The Collector",
    kind: "movie",
    synopsis:
      "An insurance fraud investigator gets pulled into the orbit of a charming art thief who may be the only lead on a decade-old case.",
    genres: ["Crime", "Romance", "Comedy"],
    cast: ["Sofia Marchetti", "Idris Kane"],
    director: "Marisol Vega",
    releaseYear: 2021,
    maturity: "PG-13",
    durationMin: 103,
  },
  {
    id: "ashfall",
    title: "Ashfall",
    kind: "series",
    synopsis:
      "When a supervolcano finally erupts, a scattered family fights to reunite across a country that no longer looks like home.",
    genres: ["Drama", "Thriller", "Action"],
    cast: ["Mara Voss", "Marcus Ade", "Felix Bram"],
    director: "Ben Okafor",
    releaseYear: 2025,
    maturity: "TV-MA",
    seasonCount: 1,
    episodesPerSeason: 8,
    isNew: true,
    trending: true,
  },
  {
    id: "the-improv-house",
    title: "The Improv House",
    kind: "series",
    synopsis:
      "A ragtag improv troupe tries to keep their tiny theater open one chaotic show at a time.",
    genres: ["Comedy"],
    cast: ["Devon Cole", "Ines Solberg", "Yuki Tanaka"],
    director: "Marisol Vega",
    releaseYear: 2020,
    maturity: "TV-14",
    seasonCount: 4,
    episodesPerSeason: 10,
  },
  {
    id: "borderland-blues",
    title: "Borderland Blues",
    kind: "movie",
    synopsis:
      "A weary sheriff and a wanted fugitive form an unlikely truce to survive a three-day storm that's cut off the whole county.",
    genres: ["Drama", "Thriller"],
    cast: ["Toma Reyes", "Wren Castillo"],
    director: "Owen Fitzgerald",
    releaseYear: 2022,
    maturity: "R",
    durationMin: 113,
  },
  {
    id: "the-orbiters",
    title: "The Orbiters",
    kind: "series",
    synopsis:
      "A found-family crew of misfit engineers keep a barely-functional cargo station running one duct-taped miracle at a time.",
    genres: ["Sci-Fi", "Comedy", "Adventure"],
    cast: ["Nova Okonkwo", "Felix Bram", "Sofia Marchetti"],
    director: "Hiro Watanabe",
    releaseYear: 2023,
    maturity: "TV-14",
    seasonCount: 2,
    episodesPerSeason: 10,
    trending: true,
  },
  {
    id: "the-recipe",
    title: "The Recipe",
    kind: "movie",
    synopsis:
      "Two rival food-truck owners are forced to share a single kitchen window — and, slowly, everything else.",
    genres: ["Romance", "Comedy"],
    cast: ["Priya Anand", "Devon Cole"],
    director: "Claire Dupont",
    releaseYear: 2024,
    maturity: "PG-13",
    durationMin: 95,
    isNew: true,
  },
  {
    id: "hollow-pines",
    title: "Hollow Pines",
    kind: "series",
    synopsis:
      "A true-crime podcaster moves to the small town behind her hit series — and starts hearing the same stories the victims did.",
    genres: ["Horror", "Mystery", "Thriller"],
    cast: ["Ana Bergström", "Marcus Ade"],
    director: "Ben Okafor",
    releaseYear: 2024,
    maturity: "TV-MA",
    seasonCount: 1,
    episodesPerSeason: 8,
    isTop10: true,
  },
  {
    id: "the-summit",
    title: "The Summit",
    kind: "movie",
    synopsis:
      "Seven climbers, one radio, and a storm that isn't in any forecast. Only some of them signed up for what's waiting at the top.",
    genres: ["Adventure", "Thriller"],
    cast: ["Idris Kane", "Ana Bergström", "Toma Reyes"],
    director: "Hiro Watanabe",
    releaseYear: 2021,
    maturity: "PG-13",
    durationMin: 119,
  },
];

const GENRE_COLOR_HINTS: Record<string, [string, string]> = {
  Action: ["#7f1d1d", "#1c1917"],
  Thriller: ["#111827", "#312e81"],
  Drama: ["#3f2d20", "#171310"],
  "Sci-Fi": ["#0f172a", "#0891b2"],
  Crime: ["#1c1917", "#450a0a"],
  Mystery: ["#1e1b3a", "#0b0b0b"],
  Fantasy: ["#312e81", "#7c3aed"],
  Romance: ["#831843", "#3f0d20"],
  Comedy: ["#78350f", "#b45309"],
  Family: ["#065f46", "#0b3b2e"],
  Teen: ["#6d28d9", "#1e1b4b"],
  Horror: ["#0b0b0b", "#450a0a"],
  Documentary: ["#1f2937", "#334155"],
  Adventure: ["#134e4a", "#0f766e"],
  Kids: ["#f59e0b", "#ec4899"],
  Animation: ["#2563eb", "#7c3aed"],
  Sport: ["#166534", "#052e16"],
};

function colorsForGenres(genres: string[]): [string, string] {
  const first = genres.find((g) => GENRE_COLOR_HINTS[g]);
  return first ? GENRE_COLOR_HINTS[first] : ["#1f1f1f", "#0b0b0b"];
}

function buildEpisode(
  raw: RawTitle,
  seasonNumber: number,
  episodeNumber: number,
  globalIndex: number,
): Episode {
  return {
    id: `${raw.id}-s${seasonNumber}e${episodeNumber}`,
    seasonNumber,
    episodeNumber,
    title: `${episodeTitle(raw.title, seasonNumber, episodeNumber)}`,
    description: episodeSynopsis(raw, seasonNumber, episodeNumber),
    durationMin: 38 + ((globalIndex * 7) % 20),
    videoUrl: videoFor(globalIndex),
    colorSeed: `${raw.id}-${seasonNumber}-${episodeNumber}`,
  };
}

const EPISODE_TITLE_WORDS = [
  "Ashes", "Departure", "The Signal", "No Turning Back", "Fault Lines", "Reckoning",
  "Static", "Old Ghosts", "The Long Way Down", "Daybreak", "Aftermath", "Crossing",
  "The Quiet Part", "Undertow", "Fracture", "What Remains", "First Light", "Blackout",
];

function episodeTitle(_show: string, season: number, ep: number): string {
  const idx = (season * 7 + ep * 3) % EPISODE_TITLE_WORDS.length;
  return EPISODE_TITLE_WORDS[idx];
}

function episodeSynopsis(raw: RawTitle, season: number, ep: number): string {
  return `Season ${season}, Episode ${ep} of ${raw.title}. ${raw.synopsis}`;
}

function buildSeasons(raw: RawTitle, startIndex: number): Season[] {
  const seasonCount = raw.seasonCount ?? 1;
  const perSeason = raw.episodesPerSeason ?? 8;
  const seasons: Season[] = [];
  let counter = startIndex;
  for (let s = 1; s <= seasonCount; s++) {
    const episodes: Episode[] = [];
    for (let e = 1; e <= perSeason; e++) {
      episodes.push(buildEpisode(raw, s, e, counter));
      counter++;
    }
    seasons.push({ seasonNumber: s, episodes });
  }
  return seasons;
}

function buildTitle(raw: RawTitle, index: number): Title {
  const seasons = raw.kind === "series" ? buildSeasons(raw, index * 50) : undefined;
  const videoUrl = seasons ? seasons[0].episodes[0].videoUrl : videoFor(index);
  const matchScore = 74 + ((index * 13) % 26); // 74-99

  return {
    id: raw.id,
    title: raw.title,
    kind: raw.kind,
    synopsis: raw.synopsis,
    genres: raw.genres,
    cast: raw.cast,
    director: raw.director,
    releaseYear: raw.releaseYear,
    maturity: raw.maturity,
    durationMin: raw.durationMin,
    seasons,
    matchScore,
    colorSeed: raw.id,
    videoUrl,
    isNew: raw.isNew,
    isTop10: raw.isTop10,
    trending: raw.trending,
  };
}

export const TITLES: Title[] = RAW_TITLES.map(buildTitle);

export const TITLES_BY_ID: Record<string, Title> = Object.fromEntries(
  TITLES.map((t) => [t.id, t]),
);

export function getTitle(id: string): Title | undefined {
  return TITLES_BY_ID[id];
}

export function getGradientForSeed(seed: string, genres: string[] = []): [string, string] {
  const [a, b] = colorsForGenres(genres);
  return [a, b];
}

function idsWhere(predicate: (t: Title) => boolean): string[] {
  return TITLES.filter(predicate).map((t) => t.id);
}

function idsByGenre(genre: string): string[] {
  return idsWhere((t) => t.genres.includes(genre));
}

function dedupe(ids: string[]): string[] {
  return Array.from(new Set(ids));
}

export const HERO_TITLE_ID = "crimson-horizon";

export const ROWS: Row[] = [
  { id: "trending", heading: "Trending Now", titleIds: idsWhere((t) => !!t.trending) },
  { id: "top10", heading: "Top 10 in Your Country Today", titleIds: idsWhere((t) => !!t.isTop10) },
  { id: "new", heading: "New Releases", titleIds: idsWhere((t) => !!t.isNew) },
  { id: "scifi", heading: "Sci-Fi & Fantasy", titleIds: dedupe([...idsByGenre("Sci-Fi"), ...idsByGenre("Fantasy")]) },
  { id: "action", heading: "Action & Adventure", titleIds: dedupe([...idsByGenre("Action"), ...idsByGenre("Adventure")]) },
  { id: "comedy", heading: "Comedies", titleIds: idsByGenre("Comedy") },
  { id: "drama", heading: "Acclaimed Dramas", titleIds: idsByGenre("Drama") },
  { id: "thriller", heading: "Edge-of-Your-Seat Thrillers", titleIds: dedupe([...idsByGenre("Thriller"), ...idsByGenre("Horror")]) },
  { id: "docs", heading: "Documentaries", titleIds: idsByGenre("Documentary") },
  { id: "kids", heading: "Kids & Family", titleIds: dedupe([...idsByGenre("Kids"), ...idsByGenre("Family")]) },
].filter((r) => r.titleIds.length > 0);

export const KIDS_TITLE_IDS = new Set(idsByGenre("Kids"));

export function searchTitles(query: string): Title[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return TITLES.filter((t) => {
    if (t.title.toLowerCase().includes(q)) return true;
    if (t.genres.some((g) => g.toLowerCase().includes(q))) return true;
    if (t.cast.some((c) => c.toLowerCase().includes(q))) return true;
    if (t.director.toLowerCase().includes(q)) return true;
    return false;
  });
}
