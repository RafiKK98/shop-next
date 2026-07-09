import { SITE } from "@/constants";
import type { Metadata } from "next";
import { SearchContent } from "./search-content";

export const metadata: Metadata = {
  title: `Search | ${SITE.name}`,
  description: "Search our catalog",
};

export default function SearchPage() {
  return <SearchContent />;
}
