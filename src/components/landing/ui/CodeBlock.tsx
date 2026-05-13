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
    <div className="min-w-0 overflow-hidden rounded-[8px] border border-white/10 bg-[#070707]">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 px-3 py-3 sm:items-center sm:px-4">
        <div className="flex min-w-0 flex-1 items-start gap-2 text-sm font-medium leading-5 text-zinc-300 sm:items-center">
          <Terminal className="mt-0.5 size-4 shrink-0 text-cyan-300 sm:mt-0" />
          <span className="min-w-0 text-wrap break-words">{title}</span>
        </div>
        <Button
          aria-label={`${copyLabel} ${title}`}
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-zinc-500 hover:text-white"
          onClick={onCopy}
        >
          {copied ? (
            <Check className="size-4 text-emerald-300" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </div>
      <pre className="max-w-full overflow-x-auto p-3 text-xs leading-6 text-zinc-400 sm:p-4 sm:text-sm">
        <code>{command}</code>
      </pre>
    </div>
  );
}
