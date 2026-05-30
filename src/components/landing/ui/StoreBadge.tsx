import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { AppleLogo } from "./AppleLogo";
import { GooglePlayLogo } from "./GooglePlayLogo";

export function AppStoreBadge({ href }: { href: string }) {
  const t = useTranslations("hero");
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-[48px] w-full sm:w-[156px] items-center gap-2.5 rounded-[7px] border border-white/12 bg-black px-3.5 text-white transition duration-200 hover:border-white/25 hover:bg-zinc-950/80 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.02)]"
    >
      <div className="flex items-center justify-center shrink-0">
        <AppleLogo className="h-[21px] w-auto fill-white text-white" />
      </div>
      <div className="flex flex-col items-start text-left leading-[1.15]">
        <span className="text-[8px] font-medium tracking-[0.02em] text-zinc-400 uppercase">
          {t("downloadOn")}
        </span>
        <span className="text-[13px] font-semibold tracking-normal text-white">
          App Store
        </span>
      </div>
    </Link>
  );
}

export function GooglePlayBadge({ href }: { href: string }) {
  const t = useTranslations("hero");
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-[48px] w-full sm:w-[156px] items-center gap-2.5 rounded-[7px] border border-white/12 bg-black px-3.5 text-white transition duration-200 hover:border-white/25 hover:bg-zinc-950/80 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.02)]"
    >
      <div className="flex items-center justify-center shrink-0">
        <GooglePlayLogo className="h-[20px] w-auto" />
      </div>
      <div className="flex flex-col items-start text-left leading-[1.15]">
        <span className="text-[7.5px] font-medium tracking-[0.02em] text-zinc-400 uppercase">
          {t("getItOn")}
        </span>
        <span className="text-[13px] font-semibold tracking-normal text-white">
          {t("chplay")}
        </span>
      </div>
    </Link>
  );
}
