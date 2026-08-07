export default function RowSkeleton() {
  return (
    <section className="py-1.5 sm:py-2">
      <div className="mb-1.5 h-5 w-40 animate-shimmer rounded px-4 sm:mx-8 sm:h-6 sm:w-56" />
      <div className="no-scrollbar flex gap-1.5 overflow-x-hidden px-4 sm:gap-2.5 sm:px-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-video w-[42vw] shrink-0 animate-shimmer rounded-md sm:w-[220px]"
          />
        ))}
      </div>
    </section>
  );
}
