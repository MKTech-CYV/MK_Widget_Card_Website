import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ChevronLeft, FileText } from "lucide-react";
import {
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
  languageAlternates,
  localizedUrl,
} from "@/lib/seo";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  const canonical = localizedUrl(locale, "/terms");
  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates("/terms"),
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      alternateLocale: locale === "vi" ? ["en_US"] : ["vi_VN"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      creator: TWITTER_HANDLE,
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");
  const tp = await getTranslations("privacy");

  const termsKeys = [0, 1, 2, 3, 4, 5];

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/terms/#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": localizedUrl(locale),
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": t("metaTitle"),
        "item": localizedUrl(locale, "/terms"),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <main className="min-h-screen bg-black text-zinc-100">
      <div className="fixed inset-0 -z-10 mk-grid-fade opacity-60" />

      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-6">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-2 rounded-full text-zinc-400 hover:text-white"
            )}
          >
            <ChevronLeft className="size-4" />
            {tp("backHome")}
          </Link>
        </div>
      </header>

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              <FileText className="size-3 text-cyan-300" />
              {t("label")}
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-normal text-white sm:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
              {t("lastUpdated")}
            </p>
          </div>

          <div className="space-y-4">
            {termsKeys.map((key) => (
              <section key={key} className="rounded-[8px] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                <h2 className="text-xl font-medium text-white">{t(`sections.${key}.title`)}</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">{t(`sections.${key}.body`)}</p>
              </section>
            ))}

            <section className="rounded-[8px] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
              <h2 className="text-xl font-medium text-white">{t("contactTitle")}</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                {t("contactDesc")}
                <Link href="mailto:contact@tranminhkhoi.dev" className="text-cyan-300 hover:text-cyan-200">
                  contact@tranminhkhoi.dev
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
