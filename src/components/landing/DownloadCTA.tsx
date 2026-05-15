import { useTranslations } from "next-intl";
import { Zap, Play, Code2 } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { ActionLink } from "./ui/ActionLink";
import { GITHUB_URL, GOOGLE_PLAY_URL, APP_STORE_URL } from "./constants";
import { AppleLogo } from "./ui/AppleLogo";

export function DownloadCTA() {
  const t = useTranslations("footer");
  const th = useTranslations("hero");

  if (!GOOGLE_PLAY_URL && !APP_STORE_URL) return null;

  return (
    <section id="download" className="px-4 py-24 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-5xl overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.025] p-6 text-center sm:p-10 lg:p-14">
        <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-[8px] border border-white/10 bg-black text-cyan-300">
          <Zap className="size-6" />
        </div>
        <h2 className="text-balance text-4xl font-semibold tracking-normal text-white sm:text-6xl">
          {t("readyTitle")}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
          {t("readyDesc")}
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          {GOOGLE_PLAY_URL && (
            <ActionLink href={GOOGLE_PLAY_URL}>
              <Play className="size-4" />
              {th("chplay")}
            </ActionLink>
          )}
          {APP_STORE_URL && (
            <ActionLink href={APP_STORE_URL} variant="secondary" external>
              <AppleLogo className="size-4" />
              {th("appstore")}
            </ActionLink>
          )}
          <ActionLink href={GITHUB_URL} variant="ghost" external>
            <Code2 className="size-4" />
            GitHub Repo
          </ActionLink>
        </div>
      </Reveal>
    </section>
  );
}
