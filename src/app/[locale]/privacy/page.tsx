import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ChevronLeft, LockKeyhole, ShieldCheck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Chính sách quyền riêng tư của MK Widget Card, giải thích cách dữ liệu eCard, QR và quyền truy cập thiết bị được xử lý.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | MK Widget Card",
    description:
      "Chính sách quyền riêng tư của MK Widget Card cho eCard, QR, và đồng bộ Widget.",
    url: "/privacy",
  },
  twitter: {
    title: "Privacy Policy | MK Widget Card",
    description:
      "Chính sách quyền riêng tư của MK Widget Card cho eCard, QR, và đồng bộ Widget.",
  },
};

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  const sectionsKeys = [0, 1, 2, 3, 4, 5, 6];

  return (
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
            {t("backHome")}
          </Link>
        </div>
      </header>

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              <ShieldCheck className="size-3 text-cyan-300" />
              Privacy Policy
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-normal text-white sm:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
              {t("lastUpdated")}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="h-fit rounded-[8px] border border-white/10 bg-white/[0.025] p-5">
              <div className="flex size-11 items-center justify-center rounded-[8px] border border-white/10 bg-black text-cyan-300">
                <LockKeyhole className="size-5" />
              </div>
              <h2 className="mt-6 text-xl font-medium text-white">{t("summaryTitle")}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {t("summaryDesc")}
              </p>
            </aside>

            <div className="space-y-4">
              {sectionsKeys.map((key) => (
                <section key={key} className="rounded-[8px] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                  <h2 className="text-xl font-medium text-white">{t(`sections.${key}.title`)}</h2>
                  <div className="mt-4 space-y-3">
                    <p className="text-sm leading-7 text-zinc-400 sm:text-base whitespace-pre-line">
                      {t(`sections.${key}.body.0`)}
                    </p>
                    <p className="text-sm leading-7 text-zinc-400 sm:text-base whitespace-pre-line">
                      {t(`sections.${key}.body.1`)}
                    </p>
                    {key === 2 && (
                      <p className="text-sm leading-7 text-zinc-400 sm:text-base whitespace-pre-line">
                        {t(`sections.${key}.body.2`)}
                      </p>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
