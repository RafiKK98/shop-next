"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSettingsAction } from "@/actions/admin/settings";
import { Button, FormError, Label } from "@/components/ui";
import { ImageUpload } from "@/components/ui";
import type { UploadFolder } from "@/lib/upload";
import { notify } from "@/lib/notifications";
import type { StoreSettings } from "@/services/store-settings";

interface SettingsFormProps {
  settings: StoreSettings;
}

const TABS = [
  { id: "general", label: "General" },
  { id: "branding", label: "Branding" },
  { id: "commerce", label: "Commerce" },
  { id: "seo", label: "SEO" },
  { id: "maintenance", label: "Maintenance" },
] as const;

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isPending, startTransition] = useTransition();
  const [formValues, setFormValues] = useState(() => {
    const obj: Record<string, string> = {};
    for (const [key, value] of Object.entries(settings)) {
      obj[key] = String(value);
    }
    return obj;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    startTransition(async () => {
      const fd = new FormData();
      const tabFields = tabFieldsMap[activeTab];
      for (const field of tabFields) {
        fd.set(field, formValues[field] ?? "");
      }

      const result = await saveSettingsAction(activeTab, fd);
      if (result?.error) {
        notify.error(result.error);
      } else {
        notify.success("Settings saved");
        router.refresh();
      }
    });
  };

  return (
    <div>
      <div className="tabs tabs-box mb-6" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-base-200 bg-base-100 p-5">
        {activeTab === "general" && (
          <GeneralTab values={formValues} onChange={setValue} errors={errors} />
        )}
        {activeTab === "branding" && (
          <BrandingTab values={formValues} onChange={setValue} errors={errors} />
        )}
        {activeTab === "commerce" && (
          <CommerceTab values={formValues} onChange={setValue} errors={errors} />
        )}
        {activeTab === "seo" && (
          <SeoTab values={formValues} onChange={setValue} errors={errors} />
        )}
        {activeTab === "maintenance" && (
          <MaintenanceTab values={formValues} onChange={setValue} errors={errors} />
        )}

        <div className="mt-6 border-t border-base-200 pt-6">
          <Button type="submit" size="lg" loading={isPending}>
            Save {TABS.find((t) => t.id === activeTab)?.label} Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ── Tab field maps ── */

const tabFieldsMap: Record<string, string[]> = {
  general: ["storeName", "storeDescription", "supportEmail", "supportPhone", "businessAddress", "timeZone", "currency", "defaultLanguage"],
  branding: ["storeLogo", "favicon", "primaryColor", "secondaryColor"],
  commerce: ["taxRate", "freeShippingThreshold", "defaultShippingCost", "lowStockThreshold", "currencySymbol"],
  seo: ["metaTitle", "metaDescription", "ogImage", "defaultKeywords"],
  maintenance: ["maintenanceMode", "maintenanceMessage"],
};

/* ── Helpers ── */

function Field({ label, name, value, onChange, error, type = "text", ...props }: {
  label: string;
  name: string;
  value: string;
  onChange: (key: string, value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  step?: string;
  min?: string;
  max?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="input w-full"
        {...props}
      />
      {error && <FormError>{error}</FormError>}
    </div>
  );
}

function Toggle({ label, name, value, onChange }: {
  label: string;
  name: string;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  const checked = value === "true";
  return (
    <label className="label cursor-pointer justify-start gap-3">
      <input
        type="checkbox"
        className="toggle"
        checked={checked}
        onChange={(e) => onChange(name, e.target.checked ? "true" : "false")}
      />
      <span className="label-text">{label}</span>
    </label>
  );
}

function TextArea({ label, name, value, onChange }: {
  label: string;
  name: string;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="textarea textarea-bordered w-full"
        rows={3}
      />
    </div>
  );
}

/* ── Tab components ── */

function GeneralTab({ values, onChange }: { values: Record<string, string>; onChange: (k: string, v: string) => void; errors: Record<string, string> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Store Name" name="storeName" value={values.storeName ?? ""} onChange={onChange} />
      <Field label="Support Email" name="supportEmail" value={values.supportEmail ?? ""} onChange={onChange} type="email" />
      <Field label="Support Phone" name="supportPhone" value={values.supportPhone ?? ""} onChange={onChange} />
      <Field label="Time Zone" name="timeZone" value={values.timeZone ?? ""} onChange={onChange} />
      <Field label="Currency" name="currency" value={values.currency ?? ""} onChange={onChange} />
      <Field label="Default Language" name="defaultLanguage" value={values.defaultLanguage ?? ""} onChange={onChange} />
      <div className="sm:col-span-2">
        <TextArea label="Store Description" name="storeDescription" value={values.storeDescription ?? ""} onChange={onChange} />
      </div>
      <div className="sm:col-span-2">
        <TextArea label="Business Address" name="businessAddress" value={values.businessAddress ?? ""} onChange={onChange} />
      </div>
    </div>
  );
}

function BrandingTab({ values, onChange }: { values: Record<string, string>; onChange: (k: string, v: string) => void; errors: Record<string, string> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label>Store Logo</Label>
        <ImageUpload
          value={values.storeLogo ? [values.storeLogo] : []}
          onChange={(urls) => onChange("storeLogo", urls[0] ?? "")}
          maxFiles={1}
          folder={"branding" as UploadFolder}
        />
      </div>
      <div>
        <Label>Favicon</Label>
        <ImageUpload
          value={values.favicon ? [values.favicon] : []}
          onChange={(urls) => onChange("favicon", urls[0] ?? "")}
          maxFiles={1}
          folder={"branding" as UploadFolder}
        />
      </div>
      <Field label="Primary Color" name="primaryColor" value={values.primaryColor ?? "#570df8"} onChange={onChange} type="text" placeholder="#570df8" />
      <Field label="Secondary Color" name="secondaryColor" value={values.secondaryColor ?? "#f000b8"} onChange={onChange} type="text" placeholder="#f000b8" />
    </div>
  );
}

function CommerceTab({ values, onChange }: { values: Record<string, string>; onChange: (k: string, v: string) => void; errors: Record<string, string> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Tax Rate (%)" name="taxRate" value={values.taxRate ?? "8"} onChange={onChange} type="number" step="0.01" min="0" max="100" />
      <Field label="Free Shipping Threshold ($)" name="freeShippingThreshold" value={values.freeShippingThreshold ?? "100"} onChange={onChange} type="number" step="0.01" min="0" />
      <Field label="Default Shipping Cost ($)" name="defaultShippingCost" value={values.defaultShippingCost ?? "9.99"} onChange={onChange} type="number" step="0.01" min="0" />
      <Field label="Low Stock Threshold" name="lowStockThreshold" value={values.lowStockThreshold ?? "10"} onChange={onChange} type="number" step="1" min="0" />
      <Field label="Currency Symbol" name="currencySymbol" value={values.currencySymbol ?? "$"} onChange={onChange} />
    </div>
  );
}

function SeoTab({ values, onChange }: { values: Record<string, string>; onChange: (k: string, v: string) => void; errors: Record<string, string> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Meta Title" name="metaTitle" value={values.metaTitle ?? ""} onChange={onChange} />
      <Field label="Default Keywords" name="defaultKeywords" value={values.defaultKeywords ?? ""} onChange={onChange} />
      <div className="sm:col-span-2">
        <TextArea label="Meta Description" name="metaDescription" value={values.metaDescription ?? ""} onChange={onChange} />
      </div>
      <div className="sm:col-span-2">
        <Label>Open Graph Image</Label>
        <ImageUpload
          value={values.ogImage ? [values.ogImage] : []}
          onChange={(urls) => onChange("ogImage", urls[0] ?? "")}
          maxFiles={1}
          folder={"branding" as UploadFolder}
        />
      </div>
    </div>
  );
}

function MaintenanceTab({ values, onChange }: { values: Record<string, string>; onChange: (k: string, v: string) => void; errors: Record<string, string> }) {
  return (
    <div className="space-y-4">
      <Toggle label="Enable Maintenance Mode" name="maintenanceMode" value={values.maintenanceMode ?? "false"} onChange={onChange} />
      <TextArea label="Maintenance Message" name="maintenanceMessage" value={values.maintenanceMessage ?? ""} onChange={onChange} />
    </div>
  );
}
