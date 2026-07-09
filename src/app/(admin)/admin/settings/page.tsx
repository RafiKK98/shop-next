import { SITE } from "@/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsForm } from "@/components/admin/settings";
import { getStoreSettings } from "@/services/store-settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Settings | Admin | ${SITE.name}`,
};

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Manage global store configuration"
      />
      <SettingsForm settings={settings} />
    </>
  );
}
