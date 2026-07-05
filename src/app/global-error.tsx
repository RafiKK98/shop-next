"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-4xl font-bold">Critical Error</h1>
          <p className="max-w-md text-base-content/70">
            {error.message || "A critical error occurred. Please refresh the page."}
          </p>
          <button
            className="btn btn-primary"
            onClick={reset}
          >
            Refresh
          </button>
        </div>
      </body>
    </html>
  );
}
