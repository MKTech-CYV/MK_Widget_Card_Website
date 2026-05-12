"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Apple, Code2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { ActionLink } from "./ui/ActionLink";
import { GITHUB_URL, GOOGLE_PLAY_URL, APP_STORE_URL } from "./constants";
import { cn } from "@/lib/utils";
import { BadgeCheck, CreditCard, Globe2, QrCode } from "lucide-react";

function HeroPreview({ reduceMotion }: { reduceMotion: boolean }) {
  const t = useTranslations("hero");
  const tm = useTranslations("modules");
  
  const demoModules = [
    { icon: BadgeCheck, accent: "text-cyan-300", name: tm("0.name"), description: tm("0.description") },
    { icon: QrCode, accent: "text-emerald-300", name: tm("1.name"), description: tm("1.description") },
    { icon: CreditCard, accent: "text-amber-300", name: tm("2.name"), description: tm("2.description") },
    { icon: Globe2, accent: "text-sky-300", name: tm("3.name"), description: tm("3.description") },
  ];
  const quickLinks = [0, 1, 2, 3].map((index) => t(`preview.links.${index}`));

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-16 max-w-6xl"
    >
      <div className="relative overflow-hidden rounded-[8px] border border-white/12 bg-[#070707] shadow-2xl shadow-black">
        <div className="absolute inset-0 mk-grid-fade opacity-50" />
        <div className="relative grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-white/10 p-5 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-rose-400" />
                <span className="size-2 rounded-full bg-amber-300" />
                <span className="size-2 rounded-full bg-emerald-300" />
              </div>
              <span className="font-mono text-xs text-zinc-600">
                {t("preview.live")}
              </span>
            </div>
            <div className="mx-auto max-w-[280px] rounded-[32px] border border-white/15 bg-black p-3 shadow-2xl shadow-cyan-950/20">
              <div className="relative aspect-[9/18] overflow-hidden rounded-[24px] border border-white/10 bg-[#090909]">
                <div className="absolute inset-x-12 top-3 h-1 rounded-full bg-white/20" />
                <div className="absolute inset-0 mk-grid-fade opacity-60" />
                <div className="relative flex h-full flex-col p-5">
                  <div className="mt-8 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">
                        MK Widget Card
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        Tran Minh Khoi
                      </h3>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.04]">
                      <Code2 className="size-5 text-zinc-300" />
                    </div>
                  </div>
                  <div className="mt-8 rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs text-zinc-500">eCard QR</span>
                      <span className="text-xs text-emerald-300">{t("preview.ready")}</span>
                    </div>
                    <div className="grid aspect-square grid-cols-5 gap-1 rounded-[6px] bg-white p-2">
                      {Array.from({ length: 25 }).map((_, index) => (
                        <span
                          key={index}
                          className={cn(
                            "rounded-[2px] bg-black",
                            [1, 4, 5, 7, 10, 12, 13, 16, 18, 19, 22].includes(
                              index,
                            ) && "opacity-25",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    {quickLinks.map((item) => (
                      <div
                        key={item}
                        className="rounded-[8px] border border-white/10 bg-black/60 p-3 text-xs text-zinc-400"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                {!reduceMotion && (
                  <div className="absolute inset-x-0 top-0 h-20 mk-scan-line" />
                )}
              </div>
            </div>
          </div>
          <div className="relative p-5 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
                  {t("preview.console")}
                </p>
                <h3 className="mt-2 text-2xl font-medium text-white">
                  {t("preview.composable")}
                </h3>
              </div>
              <Badge
                variant="outline"
                className="border-emerald-300/20 bg-emerald-300/5 text-emerald-200"
              >
                {t("preview.status")}
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {demoModules.map((plugin, index) => {
                const PluginIcon = plugin.icon;

                return (
                  <motion.div
                    key={plugin.name}
                    animate={
                      reduceMotion
                        ? undefined
                        : { y: [0, index % 2 === 0 ? -6 : 6, 0] }
                    }
                    transition={{
                      duration: 4 + index,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="rounded-[8px] border border-white/10 bg-black/50 p-4"
                  >
                    <div
                      className={cn(
                        "mb-8 flex size-9 items-center justify-center rounded-[8px] bg-white/[0.04]",
                        plugin.accent,
                      )}
                    >
                      <PluginIcon className="size-4" />
                    </div>
                    <p className="text-sm font-medium text-white">
                      {plugin.name}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                      {plugin.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-3 rounded-[8px] border border-white/10 bg-black/60 p-4">
              <div className="mb-4 flex items-center justify-between text-xs">
                <span className="text-zinc-500">{t("preview.readiness")}</span>
                <span className="text-cyan-300">98%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300"
                  initial={{ width: "36%" }}
                  animate={{ width: "98%" }}
                  transition={{
                    duration: 1.4,
                    delay: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const tm = useTranslations("metrics");
  const shouldReduceMotion = useReducedMotion();

  const metrics = [
    { value: "4+", label: tm("surfaces") },
    { value: "6", label: tm("modules") },
    { value: "100%", label: tm("privacy") },
  ];

  return (
    <section className="relative px-4 pb-20 pt-32 sm:px-6 sm:pb-28 sm:pt-40 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="border-white/10 bg-white/[0.03] px-3 py-1 text-zinc-400"
            >
              <span className="mr-1 size-1.5 rounded-full bg-emerald-300" />
              {t("badge")}
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-7 text-balance text-5xl font-semibold tracking-normal text-white sm:text-7xl lg:text-[96px]"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-8 text-zinc-400 sm:text-xl"
          >
            {t("desc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            {GOOGLE_PLAY_URL && GOOGLE_PLAY_URL !== "#" && (
              <ActionLink
                href={GOOGLE_PLAY_URL}
                className="w-full sm:w-auto"
              >
                <Play className="size-4" />
                {t("chplay")}
              </ActionLink>
            )}
            {APP_STORE_URL && APP_STORE_URL !== "#" && (
              <ActionLink
                href={APP_STORE_URL}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Apple className="size-4" />
                {t("appstore")}
              </ActionLink>
            )}
            <ActionLink
              href={GITHUB_URL}
              variant="ghost"
              external
              className="w-full sm:w-auto"
            >
              <Code2 className="size-4" />
              {t("source")}
            </ActionLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.42 }}
            className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10"
          >
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-black/80 px-4 py-4">
                <p className="text-2xl font-semibold text-white">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {metric.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <HeroPreview reduceMotion={Boolean(shouldReduceMotion)} />
      </div>
    </section>
  );
}
