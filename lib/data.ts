import { Episode, Row, Season, Title } from "./types";
import { hashString, paletteFor } from "./palette";

type RawTitle = Omit<Title, "id" | "slug" | "palette" | "match"> & {
  seasonCount?: number;
  episodesPerSeason?: number;
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generateSeasons(
  showTitle: string,
  seasonCount: number,
  episodesPerSeason: number,
  synopsis: string
): Season[] {
  const episodeTitles = [
    "Pilot Light",
    "The Long Way Down",
    "Static",
    "Blood & Signal",
    "Nothing Left to Lose",
    "The Quiet Room",
    "Ghosts of the Old Line",
    "Fault Lines",
    "Aftershock",
    "The Long Game",
    "Crossfire",
    "Point of No Return",
  ];
  const seasons: Season[] = [];
  for (let s = 1; s <= seasonCount; s++) {
    const episodes: Episode[] = [];
    for (let e = 1; e <= episodesPerSeason; e++) {
      const idx = (s * episodesPerSeason + e) % episodeTitles.length;
      episodes.push({
        id: `${slugify(showTitle)}-s${s}e${e}`,
        number: e,
        title: episodeTitles[idx],
        duration: `${38 + ((s + e) % 5) * 3}m`,
        description: `${synopsis} Episode ${e} of season ${s} raises the stakes as the story pushes toward its next turning point.`,
      });
    }
    seasons.push({ number: s, episodes });
  }
  return seasons;
}

const raw: RawTitle[] = [
  {
    title: "Nightfall Protocol",
    kind: "series",
    genres: ["Sci-Fi", "Thriller"],
    year: 2025,
    maturity: "16+",
    duration: "3 Seasons",
    description: "A rogue signal from orbit forces a fractured intelligence team back together.",
    longDescription:
      "When a decommissioned surveillance satellite starts broadcasting an encrypted signal, a disbanded team of intelligence officers is pulled back into a conspiracy that reaches the highest levels of government. Trust is the first casualty.",
    cast: ["Maren Voss", "Idris Okafor", "Lena Park"],
    creator: "Simone Achterberg",
    tags: ["Suspenseful", "Cerebral"],
    isNew: true,
    seasonCount: 3,
    episodesPerSeason: 8,
  },
  {
    title: "Glass Horizon",
    kind: "movie",
    genres: ["Sci-Fi", "Drama"],
    year: 2024,
    maturity: "13+",
    duration: "2h 8m",
    description: "A terraforming engineer discovers the colony she built is hiding a secret.",
    longDescription:
      "On the eve of humanity's first self-sustaining Mars colony, chief engineer Ada Solano uncovers falsified atmospheric data that could doom every resident. She has seventy-two hours to expose the truth before the anniversary broadcast goes live.",
    cast: ["Priya Nandakumar", "Tom Villanueva"],
    creator: "Hoyt Bregman",
    tags: ["Visually Stunning", "Thought-Provoking"],
  },
  {
    title: "Iron Meridian",
    kind: "movie",
    genres: ["Action", "Adventure"],
    year: 2023,
    maturity: "13+",
    duration: "2h 21m",
    description: "An ex-smuggler is dragged into one last run across a war-torn border.",
    longDescription:
      "Cal Renner swore off the smuggling life years ago. When his estranged brother is taken by a militia controlling the Meridian Pass, he has one night to assemble a crew, cross the border, and bring him home alive.",
    cast: ["Marcus Reyes", "Fiona Kang", "Denny Osei"],
    creator: "Wren Castellan",
    tags: ["Adrenaline-Fueled", "Gritty"],
  },
  {
    title: "The Last Reservation",
    kind: "series",
    genres: ["Drama", "Crime"],
    year: 2022,
    maturity: "16+",
    duration: "2 Seasons",
    description: "A tribal police chief investigates a string of disappearances on ancestral land.",
    longDescription:
      "Chief Nova Whitehorse polices a reservation the state has long ignored. When land developers move in and people start vanishing, she must navigate jurisdictional dead ends and old family secrets to find the truth.",
    cast: ["Nova Whitehorse", "Callum Ridge", "Etta Blackfeather"],
    creator: "Delia Runningwater",
    tags: ["Atmospheric", "Character-Driven"],
    seasonCount: 2,
    episodesPerSeason: 6,
  },
  {
    title: "Sugar & Static",
    kind: "movie",
    genres: ["Comedy", "Romance"],
    year: 2024,
    maturity: "13+",
    duration: "1h 46m",
    description: "Two rival radio hosts are forced to co-host a show neither of them wants.",
    longDescription:
      "Morning-drive veteran Jules and internet upstart Priya despise each other's style — until a merger chains their shows together. Between on-air sabotage and after-hours honesty, something neither expected starts to grow.",
    cast: ["Priya Anand", "Jules Ferris"],
    creator: "Meg O'Callahan",
    tags: ["Feel-Good", "Witty"],
    isNew: true,
  },
  {
    title: "Kettle & Bone",
    kind: "movie",
    genres: ["Horror", "Thriller"],
    year: 2023,
    maturity: "18+",
    duration: "1h 54m",
    description: "A restoration crew wakes something that never left the manor's walls.",
    longDescription:
      "Hired to restore a condemned Victorian manor, a small crew discovers the renovation is unearthing more than rotten timber. Every wall they open lets something closer to the surface.",
    cast: ["Harriet Song", "Desmond Okafor"],
    creator: "Petra Lindqvist",
    tags: ["Chilling", "Slow-Burn"],
  },
  {
    title: "Paper Tigers",
    kind: "series",
    genres: ["Drama", "Comedy"],
    year: 2021,
    maturity: "16+",
    duration: "4 Seasons",
    description: "Four struggling founders chase one last pitch before their startup folds.",
    longDescription:
      "The founders of a failing fintech app have ninety days of runway left and one shot at a Series A. A sharp, funny, and occasionally devastating look at ambition, friendship, and burn rate.",
    cast: ["Alexis Torbin", "Rashid Malick", "Gwen Ashby"],
    creator: "Neil Farrow",
    tags: ["Sharp Writing", "Binge-Worthy"],
    seasonCount: 4,
    episodesPerSeason: 10,
  },
  {
    title: "Vantablack",
    kind: "movie",
    genres: ["Sci-Fi", "Thriller"],
    year: 2025,
    maturity: "16+",
    duration: "2h 2m",
    description: "A physicist trapped in a light-absorbing anomaly must think her way out.",
    longDescription:
      "During a classified materials test, physicist Ilsa Kroner is pulled into an anomaly that swallows all light and, slowly, all sense of time. Rescue teams can't reach her — she has to reach them.",
    cast: ["Ilsa Kroner", "Femi Adebayo"],
    creator: "Callan Reyes",
    tags: ["Mind-Bending", "Tense"],
    isNew: true,
  },
  {
    title: "The Understudy",
    kind: "movie",
    genres: ["Drama", "Thriller"],
    year: 2022,
    maturity: "16+",
    duration: "1h 58m",
    description: "A stage understudy's ambition curdles into obsession on opening night.",
    longDescription:
      "Years of being second choice finally break something in Odette Marchetti. As opening night approaches, the line between preparation and sabotage starts to blur — and so does her grip on reality.",
    cast: ["Odette Marchetti", "Brant Iverson"],
    creator: "Sabine Uy",
    tags: ["Psychological", "Award-Worthy"],
  },
  {
    title: "Salt Circuit",
    kind: "series",
    genres: ["Action", "Sci-Fi"],
    year: 2024,
    maturity: "16+",
    duration: "1 Season",
    description: "Street racers smuggle black-market tech across a flooded mega-city.",
    longDescription:
      "In a mega-city half-swallowed by rising tides, a crew of underground racers moonlights as smugglers for the city's last independent tech lab — staying one lap ahead of corporate enforcers.",
    cast: ["Kaia Renfrew", "Bo Nakamura", "Trace Amoako"],
    creator: "Renny Dubois",
    tags: ["High-Octane", "Stylish"],
    isNew: true,
    seasonCount: 1,
    episodesPerSeason: 8,
  },
  {
    title: "Hollow Orchard",
    kind: "movie",
    genres: ["Horror", "Mystery"],
    year: 2021,
    maturity: "18+",
    duration: "1h 41m",
    description: "A family orchard's bumper harvest hides a decades-old debt.",
    longDescription:
      "When the Callowell orchard produces its best harvest in forty years, the family's return to prosperity comes with a price only the eldest daughter starts to understand.",
    cast: ["Rue Callowell", "Absalom Frye"],
    creator: "Petra Lindqvist",
    tags: ["Folk Horror", "Unsettling"],
  },
  {
    title: "Blue Hour Diaries",
    kind: "series",
    genres: ["Documentary"],
    year: 2023,
    maturity: "7+",
    duration: "1 Season",
    description: "A globe-spanning look at the people who work while the world sleeps.",
    longDescription:
      "From lighthouse keepers in the North Atlantic to night-market vendors in Taipei, this series follows the quiet, essential labor that happens in the hours before dawn.",
    cast: [],
    creator: "Documentary Collective",
    tags: ["Inspiring", "Beautifully Shot"],
    seasonCount: 1,
    episodesPerSeason: 6,
  },
  {
    title: "Continental Drift",
    kind: "movie",
    genres: ["Documentary", "Nature"],
    year: 2022,
    maturity: "7+",
    duration: "1h 32m",
    description: "A visual journey through the tectonic forces that shaped seven continents.",
    longDescription:
      "Using cutting-edge geological imaging, this documentary traces the slow violence of plate tectonics — and the astonishing landscapes left behind.",
    cast: [],
    creator: "Documentary Collective",
    tags: ["Visually Stunning", "Educational"],
  },
  {
    title: "Rustbelt Requiem",
    kind: "movie",
    genres: ["Drama"],
    year: 2020,
    maturity: "13+",
    duration: "2h 4m",
    description: "A shuttered steel town pins its last hope on a returning prodigal son.",
    longDescription:
      "Ten years after leaving, Danny Kowalczyk returns to his hometown to bury his father — and finds a community betting its survival on a factory reopening that may never come.",
    cast: ["Danny Kowalczyk", "Marisol Vega"],
    creator: "Hoyt Bregman",
    tags: ["Emotional", "Award-Worthy"],
  },
  {
    title: "Static Bloom",
    kind: "series",
    genres: ["Sci-Fi", "Fantasy"],
    year: 2025,
    maturity: "13+",
    duration: "2 Seasons",
    description: "Flowers that bloom out of season start rewriting a small town's memories.",
    longDescription:
      "In a farming town where an unseasonal bloom appears overnight, residents start remembering things that never happened — and forgetting things that did. A botanist and a skeptical sheriff race to find the source.",
    cast: ["Wren Halloway", "Sheriff Dutta"],
    creator: "Simone Achterberg",
    tags: ["Whimsical", "Eerie"],
    isNew: true,
    seasonCount: 2,
    episodesPerSeason: 7,
  },
  {
    title: "Kingdom of Ash & Ember",
    kind: "movie",
    genres: ["Fantasy", "Adventure"],
    year: 2023,
    maturity: "13+",
    duration: "2h 34m",
    description: "An exiled princess forges an army from the kingdom's forgotten outcasts.",
    longDescription:
      "Stripped of her crown and left for dead in the ash wastes, Princess Yseult rallies smugglers, deserters, and forgotten gods to reclaim a throne built on a lie.",
    cast: ["Yseult Corrin", "Baram Adair", "Talia Vosk"],
    creator: "Wren Castellan",
    tags: ["Epic", "Visually Stunning"],
  },
  {
    title: "Midnight Ledger",
    kind: "series",
    genres: ["Crime", "Thriller"],
    year: 2024,
    maturity: "18+",
    duration: "1 Season",
    description: "A forensic accountant untangles a laundering scheme tied to her own firm.",
    longDescription:
      "Numbers don't lie, but the people behind them do. When forensic accountant Priya Sethna finds a decade of falsified ledgers inside her own firm, she becomes the only witness someone is willing to kill to silence.",
    cast: ["Priya Sethna", "Marcus Doyle"],
    creator: "Neil Farrow",
    tags: ["Twisty", "Suspenseful"],
    seasonCount: 1,
    episodesPerSeason: 8,
  },
  {
    title: "The Cartographer's Daughter",
    kind: "movie",
    genres: ["Adventure", "Drama"],
    year: 2021,
    maturity: "7+",
    duration: "1h 57m",
    description: "A young mapmaker sets out to chart the last blank space on the world map.",
    longDescription:
      "Following her late father's unfinished maps, Noor Aslani sets sail to chart the last uncharted archipelago on Earth — and to finish the work he never got to see completed.",
    cast: ["Noor Aslani", "Captain Reyes"],
    creator: "Sabine Uy",
    tags: ["Heartwarming", "Adventurous"],
  },
  {
    title: "Comet Tail Crew",
    kind: "series",
    genres: ["Kids & Family", "Sci-Fi"],
    year: 2023,
    maturity: "All",
    duration: "3 Seasons",
    description: "Five kids build a backyard rocket and accidentally reach the edge of the solar system.",
    longDescription:
      "What started as a science-fair project turns into an intergalactic road trip when the Comet Tail Crew's homemade rocket actually works. Join them as they make friends across the solar system.",
    cast: ["Milo", "Zaza", "Benny", "Coco"],
    creator: "Family Animation Studio",
    tags: ["Fun", "Adventurous"],
    isKids: true,
    seasonCount: 3,
    episodesPerSeason: 12,
  },
  {
    title: "Bramblewood Buddies",
    kind: "series",
    genres: ["Kids & Family", "Animation"],
    year: 2022,
    maturity: "All",
    duration: "2 Seasons",
    description: "Forest critters solve everyday problems with kindness and a little chaos.",
    longDescription:
      "In the tangled heart of Bramblewood, a fox, a hedgehog, and an overly confident duckling learn that the best solutions come from working together — usually after trying everything else first.",
    cast: ["Fenn Fox", "Prickle", "Duckling Dash"],
    creator: "Family Animation Studio",
    tags: ["Sweet", "Educational"],
    isKids: true,
    seasonCount: 2,
    episodesPerSeason: 10,
  },
  {
    title: "Noodle & the Night Market",
    kind: "movie",
    genres: ["Kids & Family", "Animation"],
    year: 2024,
    maturity: "All",
    duration: "1h 28m",
    description: "A noodle-shop cat discovers his night market is powered by wandering spirits.",
    longDescription:
      "Every night after closing, the noodle shop's resident cat Bao discovers a hidden market run by friendly spirits — and one night, he has to save it from vanishing forever.",
    cast: ["Bao", "Lantern Spirit Mei"],
    creator: "Family Animation Studio",
    tags: ["Charming", "Beautifully Animated"],
    isKids: true,
    isNew: true,
  },
  {
    title: "Circuit Breakers",
    kind: "series",
    genres: ["Kids & Family", "Sci-Fi"],
    year: 2021,
    maturity: "All",
    duration: "1 Season",
    description: "Three siblings inherit a garage full of half-built robot friends.",
    longDescription:
      "When their inventor grandfather disappears, the Osei siblings discover his garage full of unfinished robots — and have to finish his last, most important invention before it's too late.",
    cast: ["Junior Osei", "Nia Osei", "Robot Sparky"],
    creator: "Family Animation Studio",
    tags: ["Inventive", "Fun"],
    isKids: true,
    seasonCount: 1,
    episodesPerSeason: 9,
  },
  {
    title: "Ashgrove Requiem",
    kind: "movie",
    genres: ["Horror", "Drama"],
    year: 2020,
    maturity: "18+",
    duration: "1h 49m",
    description: "A grief counselor's newest client insists her dead husband keeps visiting.",
    longDescription:
      "Dr. Adaeze Nwosu has heard every form of grief there is — until a new client convinces her that some visits from the dead aren't metaphorical at all.",
    cast: ["Adaeze Nwosu", "Colm Whitfield"],
    creator: "Petra Lindqvist",
    tags: ["Haunting", "Slow-Burn"],
  },
  {
    title: "Backline",
    kind: "series",
    genres: ["Drama", "Sport"],
    year: 2024,
    maturity: "13+",
    duration: "2 Seasons",
    description: "A struggling minor-league team gets one shot at the national finals.",
    longDescription:
      "The Harrow City Foxes haven't made the finals in eleven years. A rookie coach with nothing to lose and a roster full of overlooked talent might be exactly what breaks the streak.",
    cast: ["Coach Iman Osei", "Dez Okonkwo"],
    creator: "Meg O'Callahan",
    tags: ["Underdog", "Inspiring"],
    isNew: true,
    seasonCount: 2,
    episodesPerSeason: 8,
  },
  {
    title: "The Quiet Algorithm",
    kind: "movie",
    genres: ["Sci-Fi", "Drama"],
    year: 2025,
    maturity: "13+",
    duration: "1h 51m",
    description: "An AI trained on a deceased composer's work starts writing something new.",
    longDescription:
      "Commissioned to complete a legendary composer's unfinished final symphony, an AI model trained on decades of his work begins producing pieces he never wrote — and never could have imagined.",
    cast: ["Dr. Emeka Osayande", "Lin Chastain"],
    creator: "Callan Reyes",
    tags: ["Thought-Provoking", "Emotional"],
    isNew: true,
  },
  {
    title: "Vulture Season",
    kind: "movie",
    genres: ["Crime", "Thriller"],
    year: 2019,
    maturity: "18+",
    duration: "2h 11m",
    description: "Two rival bounty hunters chase the same fugitive across a drought-stricken border town.",
    longDescription:
      "The bounty's the same size for either of them, but only one can collect. A cat-and-mouse chase across a border town where the water ran out and the law never really showed up.",
    cast: ["Ruth Calder", "Emeterio Vasquez"],
    creator: "Renny Dubois",
    tags: ["Gritty", "Tense"],
  },
  {
    title: "Paperwhite",
    kind: "series",
    genres: ["Romance", "Drama"],
    year: 2023,
    maturity: "16+",
    duration: "1 Season",
    description: "Two florists on opposite sides of a family feud fall for each other anyway.",
    longDescription:
      "The Hale and Marchetti flower shops have hated each other for three generations. When the two youngest members are forced to co-run a wedding order, old grudges start to wilt.",
    cast: ["Junie Hale", "Theo Marchetti"],
    creator: "Meg O'Callahan",
    tags: ["Charming", "Feel-Good"],
    seasonCount: 1,
    episodesPerSeason: 8,
  },
  {
    title: "Deep Fathom",
    kind: "movie",
    genres: ["Documentary", "Nature"],
    year: 2024,
    maturity: "7+",
    duration: "1h 38m",
    description: "New submersible footage reveals life in the ocean's least explored trenches.",
    longDescription:
      "Using next-generation submersibles, marine biologists descend further than ever before to document ecosystems that have never been seen by human eyes.",
    cast: [],
    creator: "Documentary Collective",
    tags: ["Visually Stunning", "Fascinating"],
    isNew: true,
  },
  {
    title: "Ronin Static",
    kind: "series",
    genres: ["Anime", "Action"],
    year: 2022,
    maturity: "16+",
    duration: "2 Seasons",
    description: "A disgraced synth-swordsman protects a neon city that exiled him.",
    longDescription:
      "Cast out of the city's ruling council for a crime he didn't commit, Kaito wanders the undercity as a blade-for-hire — until a conspiracy forces him to choose between revenge and redemption.",
    cast: ["Kaito", "Renko", "The Broker"],
    creator: "Studio Amaranth",
    tags: ["Stylish", "Action-Packed"],
    seasonCount: 2,
    episodesPerSeason: 12,
  },
  {
    title: "Paper Lantern Society",
    kind: "series",
    genres: ["Anime", "Fantasy"],
    year: 2024,
    maturity: "13+",
    duration: "1 Season",
    description: "Students at a lantern-lit academy learn to bind memories into paper spirits.",
    longDescription:
      "At the Hoshimori Academy, students learn the delicate art of binding memories into paper spirits — a craft that becomes dangerous when one student's spirit refuses to stay bound.",
    cast: ["Aki Hoshimori", "Professor Tanaka"],
    creator: "Studio Amaranth",
    tags: ["Charming", "Beautifully Animated"],
    isNew: true,
    seasonCount: 1,
    episodesPerSeason: 11,
  },
  {
    title: "Fault Line City",
    kind: "movie",
    genres: ["Action", "Thriller"],
    year: 2022,
    maturity: "13+",
    duration: "2h 6m",
    description: "A structural engineer has ninety minutes to stop a city's bridges from falling.",
    longDescription:
      "When a saboteur rigs the city's aging bridge network to collapse in sequence, the one engineer who designed the retrofit has ninety minutes to shut it down block by block.",
    cast: ["Reva Okonjo", "Dispatcher Sam Levy"],
    creator: "Wren Castellan",
    tags: ["High-Stakes", "Adrenaline-Fueled"],
  },
  {
    title: "Low Tide Confessions",
    kind: "movie",
    genres: ["Drama", "Mystery"],
    year: 2021,
    maturity: "16+",
    duration: "1h 55m",
    description: "A washed-up detective takes one final case in his hometown's fishing village.",
    longDescription:
      "Retired and half-forgotten, Detective Cormac Doyle returns to the coastal village he fled twenty years ago when a body washes ashore with ties to the case that ended his career.",
    cast: ["Cormac Doyle", "Mairead Flynn"],
    creator: "Delia Runningwater",
    tags: ["Atmospheric", "Slow-Burn"],
  },
  {
    title: "Echoes of Alacrán",
    kind: "series",
    genres: ["Crime", "Drama"],
    year: 2020,
    maturity: "18+",
    duration: "3 Seasons",
    description: "A cartel accountant flips on her employers to protect her daughter.",
    longDescription:
      "Camila Duarte kept the books clean for the family that ran her city — until they threatened her daughter. Now she's building a case from the inside, one ledger at a time.",
    cast: ["Camila Duarte", "Agent Ruiz"],
    creator: "Renny Dubois",
    tags: ["Intense", "Award-Worthy"],
    seasonCount: 3,
    episodesPerSeason: 9,
  },
  {
    title: "Featherweight",
    kind: "movie",
    genres: ["Comedy", "Sport"],
    year: 2023,
    maturity: "13+",
    duration: "1h 49m",
    description: "A washed-up boxing announcer trains an accidental underdog champion.",
    longDescription:
      "Fired from the only job he's ever loved, boxing announcer Lenny Popper stumbles into training the gym's least likely fighter — and finds his own second wind along the way.",
    cast: ["Lenny Popper", "Dahlia Cruz"],
    creator: "Neil Farrow",
    tags: ["Funny", "Feel-Good"],
  },
  {
    title: "The Glasshouse Letters",
    kind: "series",
    genres: ["Drama", "Romance"],
    year: 2019,
    maturity: "13+",
    duration: "2 Seasons",
    description: "A century-old bundle of letters reshapes a family's understanding of itself.",
    longDescription:
      "When renovation crews find a bundle of unsent letters hidden in a greenhouse wall, three generations of the same family start piecing together a love story that changes everything they thought they knew.",
    cast: ["Eleanor Ashworth", "Present-day: Nora Ashworth"],
    creator: "Sabine Uy",
    tags: ["Emotional", "Beautifully Shot"],
    seasonCount: 2,
    episodesPerSeason: 6,
  },
  {
    title: "Static Horizon",
    kind: "movie",
    genres: ["Sci-Fi", "Adventure"],
    year: 2024,
    maturity: "13+",
    duration: "2h 15m",
    description: "The crew of a generation ship wakes up 40 years off course.",
    longDescription:
      "Woken from cryosleep decades early and light-years off course, the crew of the Halcyon must figure out whether they were betrayed, sabotaged, or simply forgotten — before their air runs out.",
    cast: ["Captain Reyna Voss", "Navigator Amit Rao"],
    creator: "Hoyt Bregman",
    tags: ["Suspenseful", "Visually Stunning"],
  },
  {
    title: "Gravel Road Gospel",
    kind: "series",
    genres: ["Drama", "Documentary"],
    year: 2023,
    maturity: "13+",
    duration: "1 Season",
    description: "A traveling preacher's tent revival tour crosses paths with a county in crisis.",
    longDescription:
      "Part documentary, part drama — this series follows a small-town revival tour through a county gripped by economic collapse, and the unlikely bonds formed along the way.",
    cast: ["Reverend Cole Whitfield"],
    creator: "Documentary Collective",
    tags: ["Heartfelt", "Grounded"],
    seasonCount: 1,
    episodesPerSeason: 6,
  },
  {
    title: "Junction 88",
    kind: "series",
    genres: ["Action", "Crime"],
    year: 2025,
    maturity: "16+",
    duration: "1 Season",
    description: "An undercover transit cop gets in too deep with the crew running the subway underworld.",
    longDescription:
      "Six months undercover in the crew that controls the city's abandoned subway lines, Officer Dana Whitlock is closer to the truth than her handlers know — and closer to the crew than she'd like to admit.",
    cast: ["Dana Whitlock", "Reyes"],
    creator: "Renny Dubois",
    tags: ["Gritty", "Suspenseful"],
    isNew: true,
    seasonCount: 1,
    episodesPerSeason: 10,
  },
  {
    title: "Marrow Deep",
    kind: "movie",
    genres: ["Horror", "Sci-Fi"],
    year: 2022,
    maturity: "18+",
    duration: "1h 47m",
    description: "A deep-sea drilling crew unearths something that shouldn't have a pulse.",
    longDescription:
      "Three kilometers below the seabed, a drilling crew breaks into a cavity that reads as biologically active on every instrument they have. It shouldn't be alive. It is.",
    cast: ["Dr. Sable Renner", "Rig Chief Osei"],
    creator: "Petra Lindqvist",
    tags: ["Terrifying", "Claustrophobic"],
  },
];

export const TITLES: Title[] = raw.map((t) => {
  const slug = slugify(t.title);
  const seasons =
    t.seasonCount && t.episodesPerSeason
      ? generateSeasons(t.title, t.seasonCount, t.episodesPerSeason, t.description)
      : t.seasons;
  return {
    ...t,
    id: slug,
    slug,
    palette: paletteFor(t.title).id,
    match: 78 + (hashString(t.title) % 21),
    seasons,
  };
});

export function getTitleBySlug(slug: string): Title | undefined {
  return TITLES.find((t) => t.slug === slug);
}

export function titlesByGenre(genre: string): Title[] {
  return TITLES.filter((t) => t.genres.includes(genre));
}

export function poolForProfile(isKids: boolean): Title[] {
  return isKids ? TITLES.filter((t) => t.isKids) : TITLES.filter((t) => !t.isKids);
}

const HERO_ROTATION = ["Nightfall Protocol", "Kingdom of Ash & Ember", "Static Horizon", "Salt Circuit"];
export const HERO_TITLES = TITLES.filter((t) => HERO_ROTATION.includes(t.title));

export function buildRows(opts: { isKids: boolean; myList?: string[]; continueWatching?: string[] }): Row[] {
  const pool = opts.isKids ? TITLES.filter((t) => t.isKids) : TITLES.filter((t) => !t.isKids);

  const rows: Row[] = [];

  if (opts.continueWatching && opts.continueWatching.length > 0) {
    const items = opts.continueWatching
      .map((id) => pool.find((t) => t.id === id))
      .filter(Boolean) as Title[];
    if (items.length) rows.push({ id: "continue-watching", title: "Continue Watching", titles: items });
  }

  if (opts.isKids) {
    rows.push({ id: "kids-all", title: "Kids & Family Favorites", titles: pool, size: "large" });
    rows.push({
      id: "kids-new",
      title: "New for Kids",
      titles: pool.filter((t) => t.isNew).length ? pool.filter((t) => t.isNew) : pool.slice(0, 4),
    });
    rows.push({
      id: "kids-top10",
      title: "Top 10 Kids Picks",
      titles: [...pool].sort((a, b) => b.match - a.match).slice(0, 10),
      numbered: true,
    });
    return rows;
  }

  rows.push({
    id: "trending",
    title: "Trending Now",
    titles: [...pool].sort((a, b) => hashString(a.id + "t") - hashString(b.id + "t")).slice(0, 12),
  });

  rows.push({
    id: "top10",
    title: "Top 10 in Your Country Today",
    titles: [...pool].sort((a, b) => b.match - a.match).slice(0, 10),
    numbered: true,
  });

  rows.push({
    id: "new-popular",
    title: "New Releases",
    titles: pool.filter((t) => t.isNew),
  });

  if (opts.myList && opts.myList.length > 0) {
    const items = opts.myList.map((id) => pool.find((t) => t.id === id)).filter(Boolean) as Title[];
    if (items.length) rows.push({ id: "my-list-preview", title: "My List", titles: items });
  }

  const genreRows: [string, string][] = [
    ["Sci-Fi", "Sci-Fi & Fantasy"],
    ["Action", "Action & Adventure"],
    ["Drama", "Bingeworthy Dramas"],
    ["Comedy", "Comedies"],
    ["Thriller", "Mind-Bending Thrillers"],
    ["Crime", "Crime Stories"],
    ["Horror", "Horror Nights"],
    ["Anime", "Anime"],
    ["Documentary", "Documentaries"],
    ["Romance", "Romance"],
  ];

  for (const [genre, label] of genreRows) {
    const items = pool.filter((t) => t.genres.includes(genre));
    if (items.length >= 3) rows.push({ id: `genre-${genre}`, title: label, titles: items });
  }

  return rows;
}

export const ALL_GENRES = Array.from(new Set(TITLES.flatMap((t) => t.genres))).sort();
