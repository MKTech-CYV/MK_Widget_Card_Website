import { routing } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mk-widget-card.vercel.app";
export const SITE_NAME = "MK Widget Card";
export const CREATOR_NAME = "Tran Minh Khoi";
export const CREATOR_URL = "https://tranminhkhoi.dev";
export const CONTACT_EMAIL = "contact@tranminhkhoi.dev";
export const GITHUB_URL = "https://github.com/MKTech-CYV/MK_Widget_Card";
export const TWITTER_URL = "https://x.com/win070802";
export const TWITTER_HANDLE = "@win070802";
export const LAST_UPDATED = "2026-05-12";

export type AppLocale = (typeof routing.locales)[number];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function localizedPath(locale: AppLocale | string, path = "/") {
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
}

export function localizedUrl(locale: AppLocale | string, path = "/") {
  return absoluteUrl(localizedPath(locale, path));
}

export function languageAlternates(path = "/") {
  return {
    en: localizedUrl("en", path),
    vi: localizedUrl("vi", path),
    "x-default": localizedUrl(routing.defaultLocale, path),
  };
}
