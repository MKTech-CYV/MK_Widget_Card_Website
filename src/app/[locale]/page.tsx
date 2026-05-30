import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MkLandingPage } from "@/components/mk-landing-page";
import {
  CONTACT_EMAIL,
  CREATOR_NAME,
  CREATOR_URL,
  GITHUB_URL,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
  TWITTER_URL,
  languageAlternates,
  localizedUrl,
} from "@/lib/seo";
import { GOOGLE_PLAY_URL, APP_STORE_URL } from "@/components/landing/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const canonical = localizedUrl(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      absolute: t("title.default"),
    },
    description: t("description"),
    alternates: {
      canonical,
      languages: languageAlternates(),
    },
    openGraph: {
      title: t("og.title"),
      description: t("og.description"),
      url: canonical,
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
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });
  const appDescription = t("description");

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": SITE_NAME,
        "alternateName": ["MK_Widget", "MK eCard"],
        "description": t("description"),
        "inLanguage": locale,
        "publisher": {
          "@id": `${SITE_URL}/#organization`,
        },
        "sameAs": [CREATOR_URL, GITHUB_URL, TWITTER_URL],
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": "MKTech",
        "url": SITE_URL,
        "logo": `${SITE_URL}/favicon.png`,
        "sameAs": [GITHUB_URL, TWITTER_URL],
        "founder": {
          "@id": `${CREATOR_URL}/#person`,
        },
      },
      {
        "@type": "Person",
        "@id": `${CREATOR_URL}/#person`,
        "name": CREATOR_NAME,
        "url": CREATOR_URL,
        "email": CONTACT_EMAIL,
        "sameAs": [GITHUB_URL, TWITTER_URL],
      },
      {
        "@type": "MobileApplication",
        "@id": `${SITE_URL}/#ios-app`,
        "name": SITE_NAME,
        "alternateName": ["MK_Widget", "MK_eCard"],
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "iOS",
        "downloadUrl": APP_STORE_URL,
        "url": localizedUrl(locale),
        "codeRepository": GITHUB_URL,
        "author": {
          "@id": `${CREATOR_URL}/#person`,
        },
        "publisher": {
          "@id": `${SITE_URL}/#organization`,
        },
        "description": appDescription,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
      },
      {
        "@type": "MobileApplication",
        "@id": `${SITE_URL}/#android-app`,
        "name": SITE_NAME,
        "alternateName": ["MK_Widget", "MK_eCard"],
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Android",
        "downloadUrl": GOOGLE_PLAY_URL,
        "url": localizedUrl(locale),
        "codeRepository": GITHUB_URL,
        "author": {
          "@id": `${CREATOR_URL}/#person`,
        },
        "publisher": {
          "@id": `${SITE_URL}/#organization`,
        },
        "description": appDescription,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": localizedUrl(locale),
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <MkLandingPage />
    </>
  );
}
