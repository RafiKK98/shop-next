import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ title: "FAQ", description: "Frequently asked questions" });
}

export default function FaqPage() {
  return <div className="flex flex-1 items-center justify-center"><h1 className="text-4xl font-bold">FAQ</h1></div>;
}