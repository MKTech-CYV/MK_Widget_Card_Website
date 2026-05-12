import { useTranslations } from "next-intl";
import { GitBranch, PlugZap, Rocket } from "lucide-react";
import { Reveal } from "./ui/Reveal";

export function WorkflowSection() {
  const t = useTranslations("steps");
  const tw = useTranslations("workflow");
  
  const steps = [
    { icon: GitBranch, title: t("0.title"), description: t("0.description") },
    { icon: PlugZap, title: t("1.title"), description: t("1.description") },
    { icon: Rocket, title: t("2.title"), description: t("2.description") },
  ];

  return (
    <section className="border-y border-white/10 bg-[#050505] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.05}>
              <div className="rounded-[8px] border border-white/10 bg-black p-5">
                <div className="mb-10 flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-[8px] bg-white/[0.04] text-cyan-300">
                    <step.icon className="size-5" />
                  </div>
                  <span className="font-mono text-xs text-zinc-600">
                    {tw("stepLabel")} {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-medium text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
