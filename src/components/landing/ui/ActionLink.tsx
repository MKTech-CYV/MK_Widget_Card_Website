import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function ActionLink({
  href,
  children,
  variant = "primary",
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  external?: boolean;
}) {
  const classes =
    variant === "primary"
      ? "border-cyan-300/35 bg-cyan-300/10 text-cyan-50 shadow-[0_0_28px_rgba(103,232,249,0.12)] hover:border-cyan-200/60 hover:bg-cyan-300/15 hover:text-white"
      : variant === "secondary"
        ? "border-white/12 bg-white/[0.04] text-white hover:border-white/25 hover:bg-white/[0.08]"
        : "border-transparent bg-transparent text-zinc-300 hover:text-white";

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        buttonVariants({ variant: "outline", size: "lg" }),
        "h-12 rounded-full px-5 text-sm transition duration-300 sm:px-6",
        classes,
        className,
      )}
    >
      {children}
    </Link>
  );
}
