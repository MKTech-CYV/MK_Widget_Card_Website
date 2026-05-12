"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2, Download, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionLink } from "./ui/ActionLink";
import { GITHUB_URL, GOOGLE_PLAY_URL, APP_STORE_URL } from "./constants";
import { Link, usePathname, useRouter } from "@/i18n/routing";

function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "vi" ? "en" : "vi";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="flex items-center gap-2 text-zinc-400 hover:text-white"
    >
      <Languages className="size-4" />
      <span className="text-xs font-medium uppercase">{locale === "vi" ? "EN" : "VI"}</span>
    </Button>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { label: t("product"), href: "#product" },
    { label: t("features"), href: "#plugins" },
    { label: t("guide"), href: "#guide" },
    { label: t("creator"), href: "#creator" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          aria-label="MK Widget Card home"
        >
          <Image
            src="/white_logo.png"
            alt="MK Widget Card"
            width={177}
            height={40}
            loading="eager"
            fetchPriority="high"
            className="h-7 w-auto max-w-[150px] object-contain"
          />
          <span className="hidden text-sm font-medium text-zinc-300 sm:inline">
            MK Widget Card
          </span>
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-500 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <ActionLink
            href={GITHUB_URL}
            variant="secondary"
            external
            className="h-9 px-4"
          >
            <Code2 className="size-4" />
            {t("github")}
          </ActionLink>
          {((GOOGLE_PLAY_URL && GOOGLE_PLAY_URL !== "#") || (APP_STORE_URL && APP_STORE_URL !== "#")) && (
            <ActionLink href="#download" className="h-9 px-4">
              <Download className="size-4" />
              {t("download")}
            </ActionLink>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <Button
            aria-label="Open menu"
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white"
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            {isMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-black lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-[8px] px-3 py-3 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <ActionLink
                  href={GITHUB_URL}
                  variant="secondary"
                  external
                  className="w-full justify-center"
                >
                  <Code2 className="size-4" />
                  {t("github")}
                </ActionLink>
                {((GOOGLE_PLAY_URL && GOOGLE_PLAY_URL !== "#") || (APP_STORE_URL && APP_STORE_URL !== "#")) && (
                  <ActionLink
                    href="#download"
                    className="w-full justify-center"
                  >
                    <Download className="size-4" />
                    {t("download")}
                  </ActionLink>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
