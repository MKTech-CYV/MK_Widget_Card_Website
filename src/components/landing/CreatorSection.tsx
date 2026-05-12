import Image from "next/image";
import { useTranslations } from "next-intl";
import { AtSign, Globe2, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "./ui/Reveal";
import { ActionLink } from "./ui/ActionLink";
import { CREATOR_URL, CONTACT_EMAIL, TWITTER_URL } from "./constants";

export function CreatorSection() {
  const t = useTranslations("creator");
  
  const creatorDetails = [0, 1, 2, 3].map((index) => ({
    label: t(`details.${index}.label`),
    value: t(`details.${index}.value`),
  }));

  return (
    <section
      id="creator"
      className="border-y border-white/10 bg-[#050505] px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-16 lg:gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div className="text-center lg:text-left">
          <Reveal delay={0.05} className="flex justify-center lg:justify-start">
            <Badge
              variant="outline"
              className="border-white/10 bg-white/[0.03] text-zinc-400"
            >
              {t("eyebrow")}
            </Badge>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 text-balance text-4xl font-semibold tracking-normal text-white sm:text-6xl">
              {t("title")}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 mx-auto lg:mx-0 max-w-2xl text-lg leading-8 text-zinc-400">
              {t("desc")}
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-8 flex flex-col items-center lg:items-start gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <ActionLink href={CREATOR_URL} variant="secondary" external className="w-full sm:w-auto">
              <Globe2 className="size-4" />
              {t("website")}
            </ActionLink>
            <ActionLink href={TWITTER_URL} variant="ghost" external className="w-full sm:w-auto">
              <AtSign className="size-4" />
              {t("twitter")}
            </ActionLink>
            <ActionLink href={`mailto:${CONTACT_EMAIL}`} variant="ghost" className="w-full sm:w-auto">
              <Mail className="size-4" />
              {CONTACT_EMAIL}
            </ActionLink>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-black p-6">
            <div className="absolute inset-0 mk-grid-fade opacity-50" />
            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.03]">
                <Image
                  src="/gallery/creator.png"
                  alt="Tran Minh Khoi"
                  fill
                  className="object-cover opacity-90 transition duration-500 hover:scale-105"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {creatorDetails.map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-[8px] border border-white/10 bg-white/[0.025] p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
