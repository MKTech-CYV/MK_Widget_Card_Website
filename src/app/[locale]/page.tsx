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
      images: [
        {
          url: `${SITE_URL}/gallery/iphone_mockup_banner.png`,
          width: 1600,
          height: 900,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("og.title"),
      description: t("og.description"),
      creator: TWITTER_HANDLE,
      images: [`${SITE_URL}/gallery/iphone_mockup_banner.png`],
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
  const features = locale === "vi"
    ? [
        "Tạo danh thiếp kỹ thuật số (eCard) chuyên nghiệp",
        "Quản lý mã QR liên hệ thông minh chuẩn vCard",
        "Đưa thông tin eCard lên màn hình chính qua Widget iOS và Android",
        "Hỗ trợ tích hợp mã thanh toán QR ngân hàng (VietQR, MoMo)",
        "Lưu trữ dữ liệu cục bộ an toàn, bảo mật quyền riêng tư tối đa",
        "Tự động quét mã eCard bằng camera và lưu nhanh vào danh bạ điện thoại"
      ]
    : [
        "Create professional digital business cards (eCards)",
        "Manage smart contact QR codes in standard vCard format",
        "Bring eCard info directly to the home screen using iOS and Android widgets",
        "Integrate bank payment QR codes (VietQR, MoMo)",
        "Store data locally with maximum privacy and security",
        "Automatically scan eCard QR codes via camera and save to contacts"
      ];

  const screenshots = [
    `${SITE_URL}/gallery/setup.png`,
    `${SITE_URL}/gallery/qr.png`,
    `${SITE_URL}/gallery/widget.png`,
    `${SITE_URL}/gallery/scan.png`
  ];

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
        "featureList": features,
        "screenshot": screenshots,
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
        "featureList": features,
        "screenshot": screenshots,
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
