import type { Metadata, Viewport } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "antd/dist/reset.css";
import "../[locale]/globals.css";
import "./admin.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `Admin | ${SITE_NAME}`,
  description: "Mobile app administration console for MK Tech Vietnam.",
  alternates: {
    canonical: `${SITE_URL}/admin`,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f6f8fb",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="admin-body min-h-full">
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
