import { useTranslations } from "next-intl";
import { BadgeCheck, QrCode, CreditCard, Globe2, Palette, Blocks } from "lucide-react";
import { SectionHeading } from "./ui/SectionHeading";
import { PluginCard } from "./ui/PluginCard";

export function ModulesSection() {
  const t = useTranslations();
  
  const modules = [
    { icon: BadgeCheck, accent: "text-cyan-300", name: t("modules.0.name"), description: t("modules.0.description") },
    { icon: QrCode, accent: "text-emerald-300", name: t("modules.1.name"), description: t("modules.1.description") },
    { icon: CreditCard, accent: "text-amber-300", name: t("modules.2.name"), description: t("modules.2.description") },
    { icon: Globe2, accent: "text-sky-300", name: t("modules.3.name"), description: t("modules.3.description") },
    { icon: Palette, accent: "text-rose-300", name: t("modules.4.name"), description: t("modules.4.description") },
    { icon: Blocks, accent: "text-lime-300", name: t("modules.5.name"), description: t("modules.5.description") },
  ];

  return (
    <section id="plugins" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow={t("modulesSection.eyebrow")}
            title={t("modulesSection.title")}
            description={t("modulesSection.description")}
            align="left"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {modules.map((plugin, index) => (
              <PluginCard key={plugin.name} {...plugin} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
