import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">Product not found</h2>
      <p className="max-w-md text-base-content/70">
        The product you are looking for does not exist or has been removed.
      </p>
      <Link href="/products" className="btn btn-primary">
        Browse products
      </Link>
    </div>
  );
}
