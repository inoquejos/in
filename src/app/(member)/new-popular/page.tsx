import { TITLES } from "@/lib/data";
import TitleGrid from "@/components/browse/TitleGrid";

export default function NewPopularPage() {
  const newAndPopular = TITLES.filter((t) => t.isNew || t.trending || t.isTop10);
  return (
    <div>
      <h1 className="px-4 pt-24 text-2xl font-bold text-white sm:px-8 sm:pt-28 sm:text-4xl">New &amp; Popular</h1>
      <TitleGrid titles={newAndPopular} />
    </div>
  );
}
