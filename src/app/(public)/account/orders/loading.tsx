export default function OrdersLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-32 rounded bg-base-200" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl bg-base-100 p-4">
          <div className="size-16 rounded-lg bg-base-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-base-200" />
            <div className="h-3 w-1/4 rounded bg-base-200" />
          </div>
          <div className="h-6 w-20 rounded-full bg-base-200" />
        </div>
      ))}
    </div>
  );
}
