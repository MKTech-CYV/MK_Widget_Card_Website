import { Link } from "@/i18n/routing";

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
