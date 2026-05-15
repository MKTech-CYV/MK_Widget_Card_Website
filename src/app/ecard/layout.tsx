import type { Viewport } from "next";
import "../[locale]/globals.css";
import "./ecard.css";

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f8fbff",
};

export default function EcardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="ecard-body min-h-full">{children}</body>
    </html>
  );
}
