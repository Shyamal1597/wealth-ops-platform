import type { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";

export const metadata: Metadata = {
  title: "Search Results",
  description: "Search across Sunidhi Securities' website for pages, tools, and resources.",
};

export default function SearchPage() {
  return <SearchPageClient />;
}
