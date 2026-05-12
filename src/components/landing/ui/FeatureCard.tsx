import { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

export function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="group h-full rounded-[8px] border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]">
        <div className="mb-8 flex size-11 items-center justify-center rounded-[8px] border border-white/10 bg-black text-cyan-300 transition duration-300 group-hover:border-cyan-300/30 group-hover:text-white">
          <Icon className="size-5" />
        </div>
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
      </div>
    </Reveal>
  );
}
