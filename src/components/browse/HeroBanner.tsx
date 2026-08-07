"use client";

import { useRouter } from "next/navigation";
import { Info, Play, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import type { Title } from "@/lib/types";
import TitleArt from "@/components/ui/TitleArt";
import Button from "@/components/ui/Button";
import { useModalStore } from "@/store/useModalStore";
import { formatMinutes } from "@/lib/utils";

interface HeroBannerProps {
  title: Title;
}

export default function HeroBanner({ title }: HeroBannerProps) {
  const router = useRouter();
  const openModal = useModalStore((s) => s.open);
  const [muted, setMuted] = useState(true);

  const meta =
    title.kind === "movie"
      ? title.durationMin
        ? formatMinutes(title.durationMin)
        : ""
      : `${title.seasons?.length ?? 1} Season${(title.seasons?.length ?? 1) > 1 ? "s" : ""}`;

  return (
    <section className="relative h-[62vh] w-full min-h-[420px] sm:h-[85vh]">
      <TitleArt seed={title.colorSeed} genres={title.genres} className="absolute inset-0 h-full w-full" variant="backdrop" />
      <div className="absolute inset-0 bg-gradient-to-t from-nx-bg via-nx-bg/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-nx-bg/90 via-nx-bg/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 px-4 pb-16 sm:px-8 sm:pb-24 md:w-[55%] lg:w-[45%]">
        {title.trending && (
          <p className="text-sm font-semibold text-white">
            <span className="mr-1 text-nx-red">▲</span> #1 in Movies Today
          </p>
        )}
        <h1 className="text-shadow text-4xl font-black leading-none text-white sm:text-6xl">{title.title}</h1>
        <div className="flex items-center gap-2 text-sm font-medium text-nx-text-muted">
          <span className="font-semibold text-green-500">{title.matchScore}% Match</span>
          <span>{title.releaseYear}</span>
          <span className="rounded border border-white/40 px-1.5 text-xs">{title.maturity}</span>
          {meta && <span>{meta}</span>}
        </div>
        <p className="text-shadow line-clamp-3 text-sm text-white/90 sm:text-base">{title.synopsis}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button size="lg" onClick={() => router.push(`/watch/${title.id}`)}>
            <Play size={22} className="fill-black" />
            Play
          </Button>
          <Button variant="secondary" size="lg" onClick={() => openModal(title.id)}>
            <Info size={22} />
            More Info
          </Button>
        </div>
      </div>

      <div className="absolute bottom-16 right-4 flex items-center gap-3 sm:bottom-24 sm:right-8">
        <button
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={() => setMuted((m) => !m)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-white hover:border-white"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <span className="hidden rounded border border-white/40 px-2 py-0.5 text-xs font-semibold text-white sm:inline">
          {title.maturity}
        </span>
      </div>
    </section>
  );
}
