import type { Title } from "@/lib/types";
import ContentCard from "./ContentCard";

interface TitleGridProps {
  titles: Title[];
  emptyMessage?: string;
}

export default function TitleGrid({ titles, emptyMessage = "Nothing here yet." }: TitleGridProps) {
  if (titles.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 text-center text-nx-text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-10 px-4 pt-8 sm:grid-cols-3 sm:gap-x-3 sm:px-8 md:grid-cols-4 lg:grid-cols-5">
      {titles.map((title) => (
        <div key={title.id} className="w-full">
          <ContentCard title={title} variant="grid" />
        </div>
      ))}
    </div>
  );
}
