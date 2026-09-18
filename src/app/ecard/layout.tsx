import type { Viewport } from "next";
import { Inter } from "next/font/google";
import "../[locale]/globals.css";
import "./ecard.css";

const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
  variable: "--font-ecard",
});

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#0b1f4d",
};

export default function EcardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`h-full ${inter.variable}`}>
      <body className="ecard-body min-h-full">{children}</body>
    </html>
  );
}
