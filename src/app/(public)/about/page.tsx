import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ title: "About", description: "Learn more about our store" });
}

export default function AboutPage() {
  return <div className="flex flex-1 items-center justify-center"><h1 className="text-4xl font-bold">About</h1></div>;
}