import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mk-widget-card.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MK_Widget | Digital Card & Plugin Widget System",
    template: "%s | MK_Widget",
  },
  description:
    "MK_Widget la he sinh thai eCard, QR, plugins va widget cho iOS, Android va developer.",
  keywords: [
    "MK_Widget",
    "MK_eCard",
    "digital card",
    "eCard",
    "widget",
    "QR",
    "Next.js",
  ],
  authors: [{ name: "Tran Minh Khoi", url: "https://tranminhkhoi.dev" }],
  creator: "Tran Minh Khoi",
  publisher: "Tran Minh Khoi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MK_Widget | Digital Card & Plugin Widget System",
    description:
      "Landing page gioi thieu MK_Widget: eCard, QR, plugins, widget va guide production.",
    url: "/",
    siteName: "MK_Widget",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "MK_Widget",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "MK_Widget | Digital Card & Plugin Widget System",
    description:
      "He sinh thai eCard, QR, plugins va widget voi landing page tone den hien dai.",
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
  applicationName: "MK_Widget",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased dark">
      <body className="min-h-full bg-black text-zinc-50">{children}</body>
    </html>
  );
}
