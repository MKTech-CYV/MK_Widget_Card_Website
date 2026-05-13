import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/next";
import {
  type AppLocale,
  CREATOR_NAME,
  CREATOR_URL,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
} from "@/lib/seo";
import "./globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const keywords =
    locale === "vi"
      ? [
          "MK Widget Card",
          "danh thiep ky thuat so",
          "danh thiep thong minh",
          "eCard",
          "ma QR vCard",
          "Widget",
          "iOS",
          "Android",
        ]
      : [
          "MK Widget Card",
          "digital business card",
          "smart business card",
          "eCard",
          "vCard QR code",
          "home screen widget",
          "iOS",
          "Android",
        ];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title.default"),
      template: t("title.template"),
    },
    description: t("description"),
    keywords,
    authors: [{ name: CREATOR_NAME, url: CREATOR_URL }],
    creator: CREATOR_NAME,
    publisher: CREATOR_NAME,
    openGraph: {
      title: t("og.title"),
      description: t("og.description"),
      siteName: SITE_NAME,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      alternateLocale: locale === "vi" ? ["en_US"] : ["vi_VN"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("og.title"),
      description: t("og.description"),
      creator: TWITTER_HANDLE,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    applicationName: SITE_NAME,
    category: "technology",
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon.png", type: "image/png" },
      ],
      apple: "/favicon.png",
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full antialiased dark">
      <body className="min-h-full bg-black text-zinc-50">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
