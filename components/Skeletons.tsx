export function CardSkeleton() {
  return <div className="skeleton aspect-video w-full rounded-md" />;
}

export function RowSkeleton({ title }: { title?: string }) {
  return (
    <div className="mb-8">
      {title ? (
        <div className="skeleton mb-3 h-5 w-48 rounded" />
      ) : (
        <div className="skeleton mb-3 h-5 w-48 rounded" />
      )}
      <div className="flex gap-2 overflow-hidden px-4 sm:px-8 md:px-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[45%] shrink-0 sm:w-[30%] md:w-[19%] lg:w-[15%]">
            <CardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return <div className="skeleton h-[56vw] max-h-[640px] min-h-[380px] w-full" />;
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:px-8 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
