export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
