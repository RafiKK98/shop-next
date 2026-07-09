export default function AccountLoading() {
  return (
    <div className="animate-pulse p-6">
      <div className="flex gap-8">
        <div className="hidden w-56 space-y-2 md:block">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-base-200" />
          ))}
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-32 rounded-xl bg-base-200" />
          <div className="h-48 rounded-xl bg-base-200" />
        </div>
      </div>
    </div>
  );
}
