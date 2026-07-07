import { requireAdmin } from "@/lib/auth/guards";
import { ReactNode } from "react";

export default async function AdminAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();
  return <>{children}</>;
}
