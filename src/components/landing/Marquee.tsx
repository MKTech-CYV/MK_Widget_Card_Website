import { MARQUEE_ITEMS } from "./constants";

export function Marquee() {
  return (
    <section className="overflow-hidden border-y border-white/10 bg-white/[0.02] py-4">
      <div className="mk-marquee-track flex w-max items-center gap-4">
        {[
          ...MARQUEE_ITEMS,
          ...MARQUEE_ITEMS,
          ...MARQUEE_ITEMS,
          ...MARQUEE_ITEMS,
        ].map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-4 whitespace-nowrap font-mono text-xs uppercase tracking-[0.22em] text-zinc-600"
          >
            <span>{item}</span>
            <span className="size-1 rounded-full bg-zinc-800" />
          </div>
        ))}
      </div>
    </section>
  );
}
