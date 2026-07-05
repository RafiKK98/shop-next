import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="max-w-md text-base-content/70">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}
