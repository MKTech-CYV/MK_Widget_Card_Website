import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { GITHUB_URL, CREATOR_URL, CONTACT_EMAIL, TWITTER_URL } from "./constants";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="border-t border-white/10 bg-black px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Image
            src="/white_logo.png"
            alt="MK Widget Card"
            width={177}
            height={40}
            className="h-7 w-auto max-w-[150px] object-contain"
          />
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500">
            {t("tagline")}
          </p>
        </div>
        <div className="grid gap-8 text-sm sm:grid-cols-3">
          <div className="space-y-3">
            <p className="font-medium text-white">{tn("product")}</p>
            <Link
              href="#product"
              className="block text-zinc-500 hover:text-white"
            >
              {t("overview")}
            </Link>
            <Link
              href="#plugins"
              className="block text-zinc-500 hover:text-white"
            >
              {tn("features")}
            </Link>
            <Link
              href="#guide"
              className="block text-zinc-500 hover:text-white"
            >
              {tn("guide")}
            </Link>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-white">{t("legal")}</p>
            <Link
              href="/privacy"
              className="block text-zinc-500 hover:text-white"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="block text-zinc-500 hover:text-white"
            >
              {t("terms")}
            </Link>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-white">{t("connect")}</p>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="block text-zinc-500 hover:text-white"
            >
              GitHub
            </Link>
            <Link
              href={CREATOR_URL}
              target="_blank"
              rel="noreferrer"
              className="block text-zinc-500 hover:text-white"
            >
              Creator
            </Link>
            <Link
              href={TWITTER_URL}
              target="_blank"
              rel="me noreferrer"
              className="block text-zinc-500 hover:text-white"
            >
              X / Twitter
            </Link>
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              className="block text-zinc-500 hover:text-white"
            >
              Email
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
        <p>{t("rights")}</p>
        <p>{t("status")}</p>
      </div>
    </footer>
  );
}
