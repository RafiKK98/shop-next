import { requireAdmin } from "@/lib/auth/guards";
import { type ReactNode } from "react";

interface AdminAuthLayoutProps {
  children: ReactNode;
}

export default async function AdminAuthLayout({
  children,
}: AdminAuthLayoutProps) {
  await requireAdmin();
  return <>{children}</>;
}
