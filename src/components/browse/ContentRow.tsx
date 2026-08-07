"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Title } from "@/lib/types";
import ContentCard from "./ContentCard";
import { cn } from "@/lib/utils";

interface ContentRowProps {
  heading: string;
  titles: Title[];
}

export default function ContentRow({ heading, titles }: ContentRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  function scrollByAmount(direction: 1 | -1) {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.9, behavior: "smooth" });
  }

  if (titles.length === 0) return null;

  return (
    <section
      className="relative py-1.5 sm:py-2"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <h2 className="mb-1.5 px-4 text-sm font-semibold text-white sm:px-8 sm:text-lg">{heading}</h2>

      <div className="group/row relative">
        <button
          aria-label="Scroll left"
          onClick={() => scrollByAmount(-1)}
          className={cn(
            "absolute left-0 top-0 z-20 hidden h-full w-8 items-center justify-center bg-black/50 text-white hover:bg-black/70 sm:flex sm:w-12",
            hovering ? "opacity-100" : "opacity-0",
          )}
        >
          <ChevronLeft size={28} />
        </button>

        <div
          ref={scrollerRef}
          className="no-scrollbar flex gap-1.5 overflow-x-auto scroll-smooth px-4 py-6 sm:gap-2.5 sm:px-8"
        >
          {titles.map((title) => (
            <ContentCard key={title.id} title={title} />
          ))}
        </div>

        <button
          aria-label="Scroll right"
          onClick={() => scrollByAmount(1)}
          className={cn(
            "absolute right-0 top-0 z-20 hidden h-full w-8 items-center justify-center bg-black/50 text-white hover:bg-black/70 sm:flex sm:w-12",
            hovering ? "opacity-100" : "opacity-0",
          )}
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  );
}
