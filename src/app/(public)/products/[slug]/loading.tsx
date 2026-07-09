export default function ProductDetailLoading() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="h-4 w-48 rounded bg-base-200" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square w-full rounded-xl bg-base-200" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-base-200" />
          <div className="h-6 w-1/4 rounded bg-base-200" />
          <div className="h-4 w-full rounded bg-base-200" />
          <div className="h-4 w-full rounded bg-base-200" />
          <div className="h-4 w-2/3 rounded bg-base-200" />
          <div className="h-12 w-48 rounded-lg bg-base-200" />
        </div>
      </div>
    </div>
  );
}
