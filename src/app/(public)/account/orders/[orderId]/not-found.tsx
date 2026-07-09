import Link from "next/link";

export default function OrderNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">Order not found</h2>
      <p className="max-w-md text-base-content/70">
        This order does not exist or you do not have permission to view it.
      </p>
      <Link href="/account/orders" className="btn btn-primary">
        My orders
      </Link>
    </div>
  );
}
