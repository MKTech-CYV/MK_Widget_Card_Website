import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeading } from "./ui/SectionHeading";

export function ReleaseSection() {
  const t = useTranslations("releaseSection");

  return (
    <section id="release" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="overflow-hidden rounded-[1.75rem] bg-slate-950/95">
              <Image
                src="/gallery/iphone_mockup_banner.png"
                alt={t("bannerAlt")}
                width={1600}
                height={900}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            <div className="mt-6 max-w-xl">
              <span className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.32em] text-cyan-200">
                {t("publishedLabel")}
              </span>
              <h3 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {t("publishedTitle")}
              </h3>
              <p className="mt-4 text-base leading-7 text-zinc-400">
                {t("publishedDescription")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-300">
                  {t("releaseDate")}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-300">
                  {t("platform")}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="overflow-hidden rounded-[2rem] bg-black">
              <div className="aspect-[9/16] w-full overflow-hidden bg-black">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/gallery/iphone_mockup_banner.png"
                  className="h-full w-full object-cover"
                >
                  <source src="/gallery/update-v2.0.0.mp4" type="video/mp4" />
                  {t("videoFallback")}
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
