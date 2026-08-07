import { Title } from "@/lib/types";
import ContentCard from "./ContentCard";

export default function TitleGrid({ items, showProgress }: { items: Title[]; showProgress?: boolean }) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-8 sm:grid-cols-3 sm:gap-x-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((t) => (
        <ContentCard key={t.id} title={t} fluid showProgress={showProgress} />
      ))}
    </div>
  );
}
