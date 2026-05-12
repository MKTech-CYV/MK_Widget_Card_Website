import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Home } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-zinc-100">
      <div className="fixed inset-0 -z-10 mk-grid-fade opacity-60" />
      <section className="max-w-xl text-center">
        <p className="font-mono text-sm uppercase tracking-[0.24em] text-cyan-300">404</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-normal text-white sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-5 text-base leading-7 text-zinc-400">
          {t("description")}
        </p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "mt-8 h-12 rounded-full border-white bg-white px-6 text-black hover:bg-zinc-200"
          )}
        >
          <Home className="size-4" />
          {t("backHome")}
        </Link>
      </section>
    </main>
  );
}
