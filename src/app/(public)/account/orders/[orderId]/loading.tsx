export default function OrderDetailLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded bg-base-200" />
      <div className="rounded-xl bg-base-100 p-6">
        <div className="space-y-4">
          <div className="h-4 w-1/3 rounded bg-base-200" />
          <div className="h-4 w-1/4 rounded bg-base-200" />
          <div className="h-4 w-1/2 rounded bg-base-200" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-xl bg-base-100 p-4">
            <div className="size-16 rounded-lg bg-base-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded bg-base-200" />
              <div className="h-3 w-1/4 rounded bg-base-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
