import type { Metadata } from "next";

import { MkLandingPage } from "@/components/mk-landing-page";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mk-widget-card.vercel.app";
const githubUrl = "https://github.com/MKTech-CYV/MK_Widget_Card";

export const metadata: Metadata = {
  title: "MK_Widget - Digital Card & Plugin Widget System",
  description:
    "Landing page chinh thuc cua MK_Widget: he thong eCard, QR, plugin, widget va huong dan su dung cho iOS, Android va developer.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MK_Widget",
    alternateName: "MK_eCard",
    applicationCategory: "BusinessApplication",
    operatingSystem: "iOS, Android, Web",
    url: siteUrl,
    codeRepository: githubUrl,
    creator: {
      "@type": "Person",
      name: "Tran Minh Khoi",
      url: "https://tranminhkhoi.dev",
    },
    description:
      "MK_Widget is a digital card, QR, plugin and widget system for modern personal identity sharing.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
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
