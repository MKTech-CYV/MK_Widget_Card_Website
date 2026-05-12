import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={cn(
        "mx-auto mb-12 max-w-3xl",
        align === "center" 
          ? "text-center" 
          : "text-center lg:mx-0 lg:text-left",
      )}
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
        <Sparkles className="size-3 text-cyan-300" />
        {eyebrow}
      </div>
      <h2 className="text-balance text-3xl font-semibold tracking-normal text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-pretty text-base leading-7 text-zinc-400 sm:text-lg">
        {description}
      </p>
    </Reveal>
  );
}
