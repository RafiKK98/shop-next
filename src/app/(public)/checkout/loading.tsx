export default function CheckoutLoading() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="h-8 w-32 rounded bg-base-200" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-base-200" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-base-200" />
      </div>
    </div>
  );
}
