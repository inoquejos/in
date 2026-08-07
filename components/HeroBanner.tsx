"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Info, Play, Volume2, VolumeX } from "lucide-react";
import { Title } from "@/lib/types";
import { useTitleModal } from "@/context/TitleModalContext";
import PosterArt from "./PosterArt";

export default function HeroBanner({ titles }: { titles: Title[] }) {
  const router = useRouter();
  const { open } = useTitleModal();
  const [muted, setMuted] = useState(true);

  // Deterministic pick (highest match score) — keeps render pure so the
  // hero stays identical on the server and client, and stable on reload.
  const featured = [...titles].sort((a, b) => b.match - a.match)[0];

  if (!featured) return null;

  return (
    <section className="relative h-[62vw] max-h-[640px] min-h-[420px] w-full overflow-hidden">
      <PosterArt title={featured.title} palette={featured.palette} genres={featured.genres} variant="backdrop" className="h-full w-full">
        <div />
      </PosterArt>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/10 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute bottom-[12%] left-4 max-w-xl sm:left-8 md:left-12"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          {featured.kind === "series" ? "Original Series" : "Featured Film"}
        </p>
        <h1 className="font-display text-shadow text-5xl leading-[0.95] text-white sm:text-6xl md:text-7xl">
          {featured.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/85">
          <span className="font-semibold text-emerald-400">{featured.match}% Match</span>
          <span>{featured.year}</span>
          <span className="rounded border border-white/40 px-1.5 py-0.5 text-xs">{featured.maturity}</span>
          <span>{featured.duration}</span>
        </div>
        <p className="text-shadow mt-3 line-clamp-3 text-sm text-white/90 sm:text-base">
          {featured.description}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push(`/watch/${featured.slug}`)}
            className="flex items-center gap-2 rounded bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-white/85"
          >
            <Play size={20} fill="black" /> Play
          </button>
          <button
            onClick={() => open(featured.id)}
            className="flex items-center gap-2 rounded bg-white/25 px-6 py-2.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/35"
          >
            <Info size={20} /> More Info
          </button>
        </div>
      </motion.div>

      <button
        aria-label="Toggle sound"
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-[12%] right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-black/40 text-white hover:border-white sm:right-8 md:right-12"
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
