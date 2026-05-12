import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function PluginCard({
  icon: Icon,
  name,
  accent,
  description,
  index,
}: {
  icon: LucideIcon;
  name: string;
  accent: string;
  description: string;
  index: number;
}) {
  return (
    <Reveal delay={index * 0.04}>
      <div className="group relative h-full overflow-hidden rounded-[8px] border border-white/10 bg-[#080808] p-5 transition duration-300 hover:border-white/25">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition group-hover:opacity-100" />
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-[8px] bg-white/[0.04]",
              accent,
            )}
          >
            <Icon className="size-5" />
          </div>
          <span className="font-mono text-xs text-zinc-600">0{index + 1}</span>
        </div>
        <h3 className="mt-8 text-xl font-medium text-white">{name}</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
        <div className="mt-6 flex items-center gap-2 text-xs font-medium text-zinc-500 transition group-hover:text-zinc-300">
          Plugin-ready
          <ChevronRight className="size-3 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Reveal>
  );
}
