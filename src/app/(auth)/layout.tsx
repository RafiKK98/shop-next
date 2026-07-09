import { ROUTES } from "@/constants";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-200 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href={ROUTES.home as any}
          className="mb-8 block text-center text-2xl font-bold tracking-tight hover:text-primary transition-colors"
        >
          ShopNext
        </Link>
        <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
