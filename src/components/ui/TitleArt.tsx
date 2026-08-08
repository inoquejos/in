import { hashString } from "@/lib/utils";
import { getGradientForSeed } from "@/lib/data";

interface TitleArtProps {
  seed: string;
  genres?: string[];
  className?: string;
  label?: string;
  variant?: "poster" | "backdrop";
}

/**
 * Deterministic, dependency-free "poster art" rendered as a layered gradient with
 * subtle geometric accents. Every title gets a stable look derived from its id/genre
 * so the catalog feels art-directed without shipping any external images.
 */
export default function TitleArt({
  seed,
  genres = [],
  className = "",
  label,
  variant = "poster",
}: TitleArtProps) {
  const [colorA, colorB] = getGradientForSeed(seed, genres);
  const hash = hashString(seed);
  const angle = 120 + (hash % 90);
  const accentX = hash % 100;
  const accentY = (hash >> 3) % 100;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(${angle}deg, ${colorA} 0%, ${colorB} 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at ${accentX}% ${accentY}%, rgba(255,255,255,0.25), transparent 55%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 12px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {label && (
        <div
          className={
            variant === "poster"
              ? "absolute inset-x-0 bottom-0 p-2.5"
              : "absolute inset-x-0 bottom-0 p-6"
          }
        >
          <p
            className={
              variant === "poster"
                ? "text-shadow line-clamp-2 text-xs font-semibold text-white sm:text-sm"
                : "text-shadow text-2xl font-extrabold text-white sm:text-4xl"
            }
          >
            {label}
          </p>
        </div>
      )}
    </div>
  );
}
