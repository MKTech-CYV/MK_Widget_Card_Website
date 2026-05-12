import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mk-widget-card.vercel.app";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MK Widget Card | Hệ sinh thái eCard & Widget thông minh",
    template: "%s | MK Widget Card",
  },
  description:
    "MK Widget Card là hệ sinh thái danh thiếp kỹ thuật số (eCard), mã QR vCard và tiện ích màn hình chính (Widget) cho iOS và Android.",
  keywords: [
    "MK Widget Card",
    "eCard",
    "Digital Card",
    "Danh thiếp thông minh",
    "Widget",
    "QR Code",
    "vCard",
    "Next.js",
  ],
  authors: [{ name: "Tran Minh Khoi", url: "https://tranminhkhoi.dev" }],
  creator: "Tran Minh Khoi",
  publisher: "Tran Minh Khoi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MK Widget Card | Hệ sinh thái eCard & Widget thông minh",
    description:
      "Landing page giới thiệu MK Widget Card: eCard, mã QR thông minh, Widget và hướng dẫn thiết lập cho iOS & Android.",
    url: "/",
    siteName: "MK Widget Card",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "MK Widget Card",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "MK Widget Card | Hệ sinh thái eCard & Widget thông minh",
    description:
      "Hệ sinh thái eCard, mã QR thông minh và Widget với giao diện hiện đại tối ưu trải nghiệm người dùng.",
    images: ["/favicon.png"],
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
  applicationName: "MK Widget Card",
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
  if (!routing.locales.includes(locale as any)) {
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
      </body>
    </html>
  );
}
