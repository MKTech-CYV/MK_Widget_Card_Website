"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "./ui/SectionHeading";
import { Reveal } from "./ui/Reveal";
import { CodeBlock } from "./ui/CodeBlock";
import { CLONE_COMMAND, IOS_COMMAND, ANDROID_COMMAND } from "./constants";

export function GuideSection() {
  const t = useTranslations("guide");
  const [copied, setCopied] = React.useState<"clone" | "ios" | "android" | null>(null);
  const prerequisites = [0, 1, 2, 3].map((index) => ({
    item: t(`prerequisites.${index}.item`),
    desc: t(`prerequisites.${index}.desc`),
  }));

  const copyToClipboard = React.useCallback(
    (value: string, key: "clone" | "ios" | "android") => {
      void navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    },
    [],
  );

  return (
    <section id="guide" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid min-w-0 gap-12 lg:grid-cols-[0.95fr_minmax(0,1.05fr)] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <SectionHeading
              eyebrow={t("eyebrow")}
              title={t("title")}
              description={t("description")}
              align="left"
            />

            <Reveal className="text-center lg:text-left">
              <h3 className="mb-6 text-xl font-medium text-white">{t("prereqTitle")}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {prerequisites.map((req, index) => (
                  <div
                    key={req.item}
                    className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 rounded-[8px] border border-white/10 bg-white/[0.025] p-4"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-semibold text-black">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{req.item}</p>
                      <p className="text-sm leading-6 text-zinc-500">
                        {req.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="min-w-0">
            <div className="min-w-0 space-y-4">
              <CodeBlock
                title={t("commands.clone")}
                command={CLONE_COMMAND}
                copied={copied === "clone"}
                copyLabel={t("copyCommand")}
                onCopy={() => copyToClipboard(CLONE_COMMAND, "clone")}
              />
              <CodeBlock
                title={t("commands.ios")}
                command={IOS_COMMAND}
                copied={copied === "ios"}
                copyLabel={t("copyCommand")}
                onCopy={() => copyToClipboard(IOS_COMMAND, "ios")}
              />
              <CodeBlock
                title={t("commands.android")}
                command={ANDROID_COMMAND}
                copied={copied === "android"}
                copyLabel={t("copyCommand")}
                onCopy={() => copyToClipboard(ANDROID_COMMAND, "android")}
              />
              <div className="rounded-[8px] border border-cyan-300/15 bg-cyan-300/[0.04] p-4 text-sm leading-6 text-cyan-100/80">
                {t("note")}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
