import { useTranslations } from "next-intl";
import { QrCode, Smartphone, ShieldCheck, WandSparkles } from "lucide-react";
import { SectionHeading } from "./ui/SectionHeading";
import { FeatureCard } from "./ui/FeatureCard";

export function ProductSection() {
  const t = useTranslations();
  
  const highlights = [
    { icon: QrCode, title: t("highlights.ecard.title"), description: t("highlights.ecard.description") },
    { icon: Smartphone, title: t("highlights.widget.title"), description: t("highlights.widget.description") },
    { icon: ShieldCheck, title: t("highlights.privacy.title"), description: t("highlights.privacy.description") },
    { icon: WandSparkles, title: t("highlights.save.title"), description: t("highlights.save.description") },
  ];

  return (
    <section id="product" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t("nav.product")}
          title={t("productSection.title")}
          description={t("productSection.description")}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
