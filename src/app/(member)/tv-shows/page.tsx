import { TITLES } from "@/lib/data";
import TitleGrid from "@/components/browse/TitleGrid";

export default function TvShowsPage() {
  const shows = TITLES.filter((t) => t.kind === "series");
  return (
    <div>
      <h1 className="px-4 pt-24 text-2xl font-bold text-white sm:px-8 sm:pt-28 sm:text-4xl">TV Shows</h1>
      <TitleGrid titles={shows} />
    </div>
  );
}
