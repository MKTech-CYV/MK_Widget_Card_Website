import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { LAST_UPDATED, languageAlternates, localizedUrl } from "@/lib/seo";

const routes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.75 },
  { path: "/terms", changeFrequency: "monthly" as const, priority: 0.75 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    routes.map((route) => ({
      url: localizedUrl(locale, route.path),
      lastModified: new Date(LAST_UPDATED),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: languageAlternates(route.path),
      },
    })),
  );
}
