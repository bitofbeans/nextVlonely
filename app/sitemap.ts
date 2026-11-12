import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { artistsTable, showsTable } from "@/lib/db/schema";
import { SITE_URL } from "@/lib/site";

// Keep new and removed show and artist pages in sync with the site cache.
export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [shows, artists] = await Promise.all([
    db.select({ slug: showsTable.slug }).from(showsTable),
    db.select({ slug: artistsTable.slug }).from(artistsTable),
  ]);

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/archive` },
    { url: `${SITE_URL}/artists` },
    ...shows.filter(({ slug }) => slug).map(({ slug }) => ({
      url: `${SITE_URL}/show/${encodeURIComponent(slug)}`,
    })),
    ...artists.filter(({ slug }) => slug).map(({ slug }) => ({
      url: `${SITE_URL}/artists/${encodeURIComponent(slug)}`,
    })),
  ];
}
