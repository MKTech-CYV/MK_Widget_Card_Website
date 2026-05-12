import { Terminal, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CodeBlock({
  title,
  command,
  copied,
  copyLabel = "Copy",
  onCopy,
}: {
  title: string;
  command: string;
  copied: boolean;
  copyLabel?: string;
  onCopy: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-white/10 bg-[#070707]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
          <Terminal className="size-4 text-cyan-300" />
          {title}
        </div>
        <Button
          aria-label={`${copyLabel} ${title}`}
          variant="ghost"
          size="icon-sm"
          className="text-zinc-500 hover:text-white"
          onClick={onCopy}
        >
          {copied ? (
            <Check className="size-4 text-emerald-300" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6 text-zinc-400 sm:text-sm">
        <code>{command}</code>
      </pre>
    </div>
  );
}
