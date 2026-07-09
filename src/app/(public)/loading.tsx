export default function PublicLoading() {
  return (
    <div className="animate-pulse space-y-6 p-6" role="status" aria-label="Loading page content">
      <div className="h-8 w-48 rounded bg-base-200" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl bg-base-100 p-4">
            <div className="aspect-square w-full rounded-lg bg-base-200" />
            <div className="h-4 w-3/4 rounded bg-base-200" />
            <div className="h-3 w-1/2 rounded bg-base-200" />
            <div className="h-4 w-1/4 rounded bg-base-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
