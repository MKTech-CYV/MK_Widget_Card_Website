import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function AppStoreBadge({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-block transition duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/app-store-badge.svg"
        alt="Download on the App Store"
        className="h-[40px] w-auto"
      />
    </Link>
  );
}

export function GooglePlayBadge({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-block transition duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/google-play-badge.svg"
        alt="Get it on Google Play"
        className="h-[40px] w-auto"
      />
    </Link>
  );
}

export function GitHubBadge({ href }: { href: string }) {
  const t = useTranslations("hero");
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-[40px] w-[135px] items-center gap-2 rounded-[6px] border border-white/12 bg-black px-3 text-white transition duration-200 hover:border-white/25 hover:bg-zinc-950/80 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.02)] shrink-0"
    >
      <div className="flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-[18px] w-auto text-white fill-white"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      </div>
      <div className="flex flex-col items-start text-left leading-[1.1]">
        <span className="text-[6.5px] font-medium tracking-[0.02em] text-zinc-400 uppercase">
          {t("getOnGithub")}
        </span>
        <span className="text-[11.5px] font-semibold tracking-normal text-white">
          GitHub
        </span>
      </div>
    </Link>
  );
}
