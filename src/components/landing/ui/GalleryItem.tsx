import Image from "next/image";
import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export interface GalleryItemData {
  title: string;
  label: string;
  image?: string;
  description: string;
}

export function GalleryItem({
  item,
  index,
}: {
  item: GalleryItemData;
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <Reveal delay={index * 0.1}>
      <div className="group relative grid gap-8 lg:grid-cols-2 lg:items-center">
        {/* Text content swaps position by index on desktop. */}
        <div className={cn("order-2 lg:p-8", isEven ? "lg:order-2" : "lg:order-1")}>
          <div className="mb-5 inline-flex items-center gap-3">
            <span className="font-mono text-xs font-medium tracking-[0.2em] text-cyan-300/60">
              MK_{String(index + 1).padStart(2, "0")}
            </span>
            <div className="h-px w-8 bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              {item.label}
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-white sm:text-3xl">
            {item.title}
          </h3>
          <p className="mt-5 text-base leading-8 text-zinc-400 sm:text-lg">
            {item.description}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="size-1.5 rounded-full bg-cyan-300" />
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
        </div>

        {/* Mockup image frame. */}
        <div className={cn("order-1 lg:order-none", isEven ? "lg:order-1" : "lg:order-2")}>
          <div className="relative mx-auto max-w-[320px] lg:max-w-none">
            {/* Soft glow behind the image. */}
            <div className="absolute -inset-10 bg-cyan-300/[0.07] blur-[100px] opacity-0 transition duration-700 group-hover:opacity-100" />
            
            <div className="relative w-full transition duration-500 group-hover:scale-[1.02]">
              <div className="relative aspect-[9/16] w-full">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                    priority={index === 0}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center rounded-[12px] border border-dashed border-white/10 bg-white/[0.02]">
                    <div className="text-center">
                      <Smartphone className="mb-4 mx-auto size-8 text-zinc-800" />
                      <p className="text-[10px] uppercase tracking-widest text-zinc-700">Mockup Placeholder</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
