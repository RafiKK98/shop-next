import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ title: "Search", description: "Search our catalog" });
}

export default function SearchPage() {
  return <div className="flex flex-1 items-center justify-center"><h1 className="text-4xl font-bold">Search</h1></div>;
}