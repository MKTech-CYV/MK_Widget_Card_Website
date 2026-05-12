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
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: ["MK_Widget", "MK eCard"],
        description: t("description"),
        inLanguage: locale,
        publisher: {
          "@id": `${CREATOR_URL}/#person`,
        },
        sameAs: [CREATOR_URL, GITHUB_URL, TWITTER_URL],
      },
      {
        "@type": "Person",
        "@id": `${CREATOR_URL}/#person`,
        name: CREATOR_NAME,
        url: CREATOR_URL,
        email: CONTACT_EMAIL,
        sameAs: [GITHUB_URL, TWITTER_URL],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#software`,
        name: SITE_NAME,
        alternateName: ["MK_Widget", "MK_eCard"],
        applicationCategory: "BusinessApplication",
        operatingSystem: "iOS, Android, Web",
        url: localizedUrl(locale),
        codeRepository: GITHUB_URL,
        creator: {
          "@id": `${CREATOR_URL}/#person`,
        },
        description: appDescription,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
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
