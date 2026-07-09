export default function WishlistLoading() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 w-32 rounded bg-base-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl bg-base-100 p-4">
            <div className="aspect-square w-full rounded-lg bg-base-200" />
            <div className="h-4 w-3/4 rounded bg-base-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
