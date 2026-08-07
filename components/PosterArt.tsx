"use client";

import { PALETTES, gradientCss, hashString } from "@/lib/palette";
import { cn } from "@/lib/utils";
import {
  Clapperboard,
  Drama,
  Flame,
  Ghost,
  Heart,
  Rocket,
  Sparkles,
  Swords,
  Tv,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const GENRE_ICONS: Record<string, LucideIcon> = {
  "Sci-Fi": Rocket,
  Fantasy: Wand2,
  Action: Swords,
  Horror: Ghost,
  Thriller: Flame,
  Drama: Drama,
  Comedy: Sparkles,
  Romance: Heart,
  Anime: Sparkles,
  Documentary: Tv,
};

function genreIconEl(genres: string[], size: number, color: string) {
  let Icon: LucideIcon = Clapperboard;
  for (const g of genres) {
    if (GENRE_ICONS[g]) {
      Icon = GENRE_ICONS[g];
      break;
    }
  }
  return <Icon strokeWidth={1.25} size={size} color={color} />;
}

interface PosterArtProps {
  title: string;
  palette: string;
  genres?: string[];
  className?: string;
  variant?: "backdrop" | "card" | "tall";
  children?: React.ReactNode;
}

export default function PosterArt({
  title,
  palette,
  genres = [],
  className,
  variant = "card",
  children,
}: PosterArtProps) {
  const p = PALETTES[palette] ?? Object.values(PALETTES)[0];
  const angle = 120 + (hashString(title) % 90);

  return (
    <div
      className={cn(
        "relative overflow-hidden select-none",
        variant === "tall" && "aspect-2/3",
        variant === "card" && "aspect-video",
        variant === "backdrop" && "aspect-video",
        className
      )}
      style={{ background: gradientCss(p, angle) }}
    >
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 6px)",
        }}
      />
      <div className="absolute -right-6 -bottom-8 opacity-[0.16]">
        {genreIconEl(genres, variant === "backdrop" ? 220 : 88, p.glow)}
      </div>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${p.glow}33, transparent 60%)`,
        }}
      />
      <span
        aria-hidden
        className="font-display absolute -bottom-2 left-2 leading-none tracking-tight text-white/[0.07] select-none"
        style={{ fontSize: variant === "backdrop" ? "9rem" : "3.4rem" }}
      >
        {title.charAt(0)}
      </span>
      {children}
    </div>
  );
}
