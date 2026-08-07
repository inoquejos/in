import { TITLES } from "@/lib/data";
import TitleGrid from "@/components/browse/TitleGrid";

export default function MoviesPage() {
  const movies = TITLES.filter((t) => t.kind === "movie");
  return (
    <div>
      <h1 className="px-4 pt-24 text-2xl font-bold text-white sm:px-8 sm:pt-28 sm:text-4xl">Movies</h1>
      <TitleGrid titles={movies} />
    </div>
  );
}
