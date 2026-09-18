import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { EcardSearchParams } from "@/lib/ecard";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { loadSharedEcard } from "@/lib/share-links";
import { buildEcardMetadata, EcardView } from "../../ecard/ecard-view";

type ShortEcardPageProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<EcardSearchParams>;
};

// generateMetadata and the page both need the data; cache() dedupes the
// Firestore reads within one request.
const loadSharedEcardCached = cache(loadSharedEcard);

async function loadShortEcard({ params, searchParams }: ShortEcardPageProps) {
  const { code } = await params;
  const shared = await loadSharedEcardCached(code);
  if (!shared) {
    return null;
  }

  // Keep ?lang=en so the English page can be shared as-is.
  const { lang } = await searchParams;
  const language = Array.isArray(lang) ? lang[0] : lang;

  return {
    query: { ...shared.query, lang: language },
    shareUrl: `${absoluteUrl(`/c/${code}`)}${language === "en" ? "?lang=en" : ""}`,
  };
}

export async function generateMetadata(
  props: ShortEcardPageProps,
): Promise<Metadata> {
  const result = await loadShortEcard(props);
  if (!result) {
    return {
      title: SITE_NAME,
      robots: { index: false, follow: false },
    };
  }

  return buildEcardMetadata(result.query);
}

export default async function ShortEcardPage(props: ShortEcardPageProps) {
  const result = await loadShortEcard(props);
  if (!result) {
    notFound();
  }

  return <EcardView query={result.query} shareUrl={result.shareUrl} />;
}
