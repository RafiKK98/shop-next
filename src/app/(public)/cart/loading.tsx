export default function CartLoading() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 w-24 rounded bg-base-200" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-xl bg-base-100 p-4">
          <div className="size-24 rounded-lg bg-base-200" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-1/2 rounded bg-base-200" />
            <div className="h-4 w-1/4 rounded bg-base-200" />
            <div className="h-8 w-24 rounded bg-base-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
