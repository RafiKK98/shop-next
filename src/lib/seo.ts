import type { Metadata } from "next";
import { getStoreSettings } from "@/services/store-settings";

export type SeoParams = {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
};

export async function createMetadata(params: SeoParams): Promise<Metadata> {
  const settings = await getStoreSettings();

  const title = params.title
    ? `${params.title} | ${settings.storeName}`
    : settings.metaTitle || settings.storeName;

  const description = params.description || settings.metaDescription || "";
  const ogImage = params.ogImage || settings.ogImage || settings.storeLogo || undefined;
  const canonical = params.canonical;

  return {
    title,
    description,
    keywords: params.keywords || settings.defaultKeywords || undefined,
    robots: params.noIndex ? { index: false, follow: false } : undefined,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title,
      description: description || undefined,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
      type: "website",
      siteName: settings.storeName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}