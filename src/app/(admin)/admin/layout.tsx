import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminContainer } from "@/components/admin/admin-container";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = {
    name: session?.user?.name ?? null,
    email: session?.user?.email ?? null,
    image: session?.user?.image ?? null,
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex min-h-screen flex-col bg-base-50">
        <AdminHeader user={user} />
        <main className="flex-1">
          <AdminContainer>{children}</AdminContainer>
        </main>
      </div>
      <div className="drawer-side z-40">
        <label htmlFor="admin-drawer" className="drawer-overlay" aria-label="Close sidebar" />
        <AdminSidebar />
      </div>
    </div>
  );
}
