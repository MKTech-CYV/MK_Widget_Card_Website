"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Apple,
  BadgeCheck,
  Blocks,
  Check,
  ChevronRight,
  Code2,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  GitBranch,
  Globe2,
  Menu,
  Palette,
  PlugZap,
  Play,
  QrCode,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  WandSparkles,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const GITHUB_URL = "https://github.com/MKTech-CYV/MK_Widget_Card";
// Replace these placeholders with official store URLs when they are ready.
const GOOGLE_PLAY_URL = ""; // Example: "https://play.google.com/store/apps/details?id=com.mktech.widgetcard"
const APP_STORE_URL = "";   // Example: "https://apps.apple.com/app/mk-widget-card/id..."
const CREATOR_URL = "https://tranminhkhoi.dev";
const CONTACT_EMAIL = "contact@tranminhkhoi.dev";
const cloneCommand = `git clone ${GITHUB_URL}.git
cd MK_Widget_Card
npm install`;

const iosCommand = `npx expo prebuild --platform ios
npx expo run:ios`;

const androidCommand = `npx expo prebuild --platform android
npx expo run:android`;

const navLinks = [
  { label: "Sản phẩm", href: "#product" },
  { label: "Tính năng", href: "#plugins" },
  { label: "Hướng dẫn", href: "#guide" },
  { label: "Creator", href: "#creator" },
];

const prerequisites = [
  { item: "Node.js", desc: "Phiên bản 18 trở lên." },
  { item: "Git", desc: "Để clone mã nguồn từ GitHub." },
  { item: "CocoaPods", desc: "Yêu cầu cho iOS build (chạy 'pod --version')." },
  { item: "Android SDK", desc: "Yêu cầu cho Android build." },
];

const metrics = [
  { value: "4+", label: "widget surfaces" },
  { value: "6", label: "plugin-ready modules" },
  { value: "100%", label: "quyền riêng tư & local storage" },
];
const productHighlights = [
  {
    icon: QrCode,
    title: "eCard QR thông minh",
    description:
      "Tạo danh thiếp số và mã QR liên hệ chuẩn vCard để chia sẻ thông tin chuyên nghiệp chỉ trong tích tắc.",
  },
  {
    icon: Smartphone,
    title: "Trải nghiệm Widget",
    description:
      "Đưa profile, mã QR và các lối tắt quan trọng của bạn trực tiếp lên màn hình chính thông qua hệ thống Widget mượt mà.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo mật & Riêng tư",
    description:
      "Dữ liệu được lưu trữ cục bộ và đồng bộ an toàn qua App Groups, đảm bảo bạn luôn làm chủ thông tin cá nhân của mình.",
  },
  {
    icon: WandSparkles,
    title: "Lưu danh bạ nhanh",
    description:
      "Quét mã eCard của người khác và lưu trực tiếp vào danh bạ điện thoại một cách tự động và chính xác.",
  },
];

const pluginModules = [
  {
    icon: BadgeCheck,
    name: "Hồ sơ cá nhân",
    accent: "text-cyan-300",
    description:
      "Hiển thị tên, chức vụ, ảnh đại diện và bio ngắn gọn của bạn một cách chuyên nghiệp.",
  },
  {
    icon: QrCode,
    name: "Contact QR",
    accent: "text-emerald-300",
    description:
      "Mã QR vCard tích hợp giúp người đối diện lưu thông tin liên lạc của bạn chỉ với một cú chạm.",
  },
  {
    icon: CreditCard,
    name: "Thanh toán QR",
    accent: "text-amber-300",
    description:
      "Hỗ trợ các loại mã VietQR, MoMo hoặc số tài khoản ngân hàng để giao dịch thuận tiện hơn.",
  },
  {
    icon: Globe2,
    name: "Liên kết xã hội",
    accent: "text-sky-300",
    description:
      "Tập hợp các đường dẫn Website, Facebook, LinkedIn, GitHub của bạn vào một danh thiếp duy nhất.",
  },
  {
    icon: Palette,
    name: "Giao diện Widget",
    accent: "text-rose-300",
    description:
      "Tùy biến màu sắc, kích thước và kiểu dáng Widget để phù hợp với phong cách màn hình chính của bạn.",
  },
  {
    icon: Blocks,
    name: "Hệ thống Plugin",
    accent: "text-lime-300",
    description:
      "Cấu trúc mô-đun linh hoạt giúp bạn dễ dàng bật/tắt các thành phần thông tin trên eCard.",
  },
];

const gallery = [
  {
    title: "Thiết lập eCard",
    label: "Quản lý hồ sơ",
    image: "/gallery/setup.png", // Đường dẫn ảnh trong thư mục public
    description: "Giao diện cấu hình thông tin cá nhân, ảnh đại diện và các liên kết xã hội.",
  },
  {
    title: "Mã QR vCard",
    label: "Chia sẻ liên hệ",
    image: "/gallery/qr.png",
    description: "Màn hình hiển thị mã QR thông minh giúp lưu danh bạ tức thì không cần nhập tay.",
  },
  {
    title: "Tiện ích màn hình chính",
    label: "Widget iOS & Android",
    image: "/gallery/widget.png",
    description: "Các mẫu Widget đa dạng giúp bạn truy cập eCard ngay từ màn hình khóa hoặc màn hình chính.",
  },
  {
    title: "Quét & Lưu danh bạ",
    label: "Tương tác thông minh",
    image: "/gallery/scan.png",
    description: "Tính năng quét mã eCard từ camera và tự động tích hợp vào danh bạ điện thoại.",
  },
];

const workflowSteps = [
  {
    icon: GitBranch,
    title: "Cài đặt dự án",
    description:
      "Clone repository và cài đặt các thư viện cần thiết để bắt đầu phát triển.",
  },
  {
    icon: PlugZap,
    title: "Cấu hình eCard",
    description:
      "Nhập thông tin cá nhân, chọn các plugin như Social, Payment hoặc Contact QR.",
  },
  {
    icon: Rocket,
    title: "Trải nghiệm Widget",
    description:
      "Thêm MK Widget Card vào màn hình chính để tận hưởng sự tiện lợi.",
  },
];

const usageSteps = [
  "Tạo hồ sơ MK Widget Card với tên, chức danh và các thông tin liên hệ.",
  "Bật các tính năng cần thiết: QR liên hệ, mạng xã hội, thông tin thanh toán.",
  "Quét mã QR của người khác để lưu thông tin vào danh bạ điện thoại.",
  "Thêm Widget vào màn hình chính để chia sẻ thông tin nhanh mà không cần mở app.",
];

const marqueeItems = [
  "MK Widget Card",
  "eCard",
  "QR Code",
  "Widget",
  "Privacy",
  "Local-first",
  "Digital Identity",
  "Networking",
];

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
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
        align === "center" ? "text-center" : "mx-0 text-left",
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

function ActionLink({
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

function FeatureCard({
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

function PluginCard({
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

function GalleryCard({
  item,
  index,
}: {
  item: (typeof gallery)[number];
  index: number;
}) {
  return (
    <Reveal delay={index * 0.05}>
      <div className="group overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.025]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#050505]">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover opacity-50 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          ) : (
            <div className="absolute inset-0 mk-grid-fade opacity-70" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
          
          <div className="absolute inset-x-6 top-6 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-zinc-400">
            <span>{item.label}</span>
            <span>MK_{String(index + 1).padStart(2, "0")}</span>
          </div>
          
          <div className="absolute inset-x-6 bottom-6 rounded-[8px] border border-white/10 bg-black/70 p-4 backdrop-blur-md">
            {!item.image && (
              <div className="mb-8 h-24 rounded-[6px] border border-dashed border-white/15 bg-white/[0.03] mk-scan-line" />
            )}
            <p className="text-sm font-medium text-white">{item.title}</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function CodeBlock({
  title,
  command,
  copied,
  onCopy,
}: {
  title: string;
  command: string;
  copied: boolean;
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
          aria-label={`Copy ${title}`}
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

function HeroPreview({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-16 max-w-6xl"
    >
      <div className="relative overflow-hidden rounded-[8px] border border-white/12 bg-[#070707] shadow-2xl shadow-black">
        <div className="absolute inset-0 mk-grid-fade opacity-50" />
        <div className="relative grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-white/10 p-5 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-rose-400" />
                <span className="size-2 rounded-full bg-amber-300" />
                <span className="size-2 rounded-full bg-emerald-300" />
              </div>
              <span className="font-mono text-xs text-zinc-600">
                LIVE PREVIEW
              </span>
            </div>
            <div className="mx-auto max-w-[280px] rounded-[32px] border border-white/15 bg-black p-3 shadow-2xl shadow-cyan-950/20">
              <div className="relative aspect-[9/18] overflow-hidden rounded-[24px] border border-white/10 bg-[#090909]">
                <div className="absolute inset-x-12 top-3 h-1 rounded-full bg-white/20" />
                <div className="absolute inset-0 mk-grid-fade opacity-60" />
                <div className="relative flex h-full flex-col p-5">
                  <div className="mt-8 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">
                        MK Widget Card
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        Tran Minh Khoi
                      </h3>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.04]">
                      <Code2 className="size-5 text-zinc-300" />
                    </div>
                  </div>
                  <div className="mt-8 rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs text-zinc-500">eCard QR</span>
                      <span className="text-xs text-emerald-300">Ready</span>
                    </div>
                    <div className="grid aspect-square grid-cols-5 gap-1 rounded-[6px] bg-white p-2">
                      {Array.from({ length: 25 }).map((_, index) => (
                        <span
                          key={index}
                          className={cn(
                            "rounded-[2px] bg-black",
                            [1, 4, 5, 7, 10, 12, 13, 16, 18, 19, 22].includes(
                              index,
                            ) && "opacity-25",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    {["GitHub", "Website", "Email", "VietQR"].map((item) => (
                      <div
                        key={item}
                        className="rounded-[8px] border border-white/10 bg-black/60 p-3 text-xs text-zinc-400"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                {!reduceMotion && (
                  <div className="absolute inset-x-0 top-0 h-20 mk-scan-line" />
                )}
              </div>
            </div>
          </div>
          <div className="relative p-5 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
                  Plugin Console
                </p>
                <h3 className="mt-2 text-2xl font-medium text-white">
                  Composable card system
                </h3>
              </div>
              <Badge
                variant="outline"
                className="border-emerald-300/20 bg-emerald-300/5 text-emerald-200"
              >
                Production UI
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {pluginModules.slice(0, 4).map((plugin, index) => {
                const PluginIcon = plugin.icon;

                return (
                  <motion.div
                    key={plugin.name}
                    animate={
                      reduceMotion
                        ? undefined
                        : { y: [0, index % 2 === 0 ? -6 : 6, 0] }
                    }
                    transition={{
                      duration: 4 + index,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="rounded-[8px] border border-white/10 bg-black/50 p-4"
                  >
                    <div
                      className={cn(
                        "mb-8 flex size-9 items-center justify-center rounded-[8px] bg-white/[0.04]",
                        plugin.accent,
                      )}
                    >
                      <PluginIcon className="size-4" />
                    </div>
                    <p className="text-sm font-medium text-white">
                      {plugin.name}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                      {plugin.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-3 rounded-[8px] border border-white/10 bg-black/60 p-4">
              <div className="mb-4 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Deploy readiness</span>
                <span className="text-cyan-300">98%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300"
                  initial={{ width: "36%" }}
                  animate={{ width: "98%" }}
                  transition={{
                    duration: 1.4,
                    delay: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MkLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [copied, setCopied] = React.useState<"clone" | "ios" | "android" | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const copyToClipboard = React.useCallback(
    (value: string, key: "clone" | "ios" | "android") => {
      void navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    },
    [],
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-hidden bg-black text-zinc-100 selection:bg-cyan-300/20 selection:text-cyan-100">
        <div className="fixed inset-0 -z-10 bg-black" />
        <div className="fixed inset-0 -z-10 mk-grid-fade opacity-70" />
        <div className="fixed inset-x-0 top-0 -z-10 h-[520px] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent)]" />

        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-3"
              aria-label="MK Widget Card home"
            >
              <Image
                src="/white_logo.png"
                alt="MK Widget Card"
                width={177}
                height={40}
                loading="eager"
                fetchPriority="high"
                className="h-7 w-auto max-w-[150px] object-contain"
              />
              <span className="hidden text-sm font-medium text-zinc-300 sm:inline">
                MK Widget Card
              </span>
            </Link>

            <nav
              className="hidden items-center gap-7 lg:flex"
              aria-label="Primary navigation"
            >
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-zinc-500 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <ActionLink
                href={GITHUB_URL}
                variant="secondary"
                external
                className="h-9 px-4"
              >
                <Code2 className="size-4" />
                GitHub
              </ActionLink>
              {(GOOGLE_PLAY_URL && GOOGLE_PLAY_URL !== "#") || (APP_STORE_URL && APP_STORE_URL !== "#") ? (
                <ActionLink href="#download" className="h-9 px-4">
                  <Download className="size-4" />
                  Tải app
                </ActionLink>
              ) : null}
            </div>

            <Button
              aria-label="Open menu"
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white lg:hidden"
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              {isMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-white/10 bg-black lg:hidden"
              >
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-[8px] px-3 py-3 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <ActionLink
                      href={GITHUB_URL}
                      variant="secondary"
                      external
                      className="w-full justify-center"
                    >
                      <Code2 className="size-4" />
                      GitHub
                    </ActionLink>
                    {((GOOGLE_PLAY_URL && GOOGLE_PLAY_URL !== "#") || (APP_STORE_URL && APP_STORE_URL !== "#")) && (
                      <ActionLink
                        href="#download"
                        className="w-full justify-center"
                      >
                        <Download className="size-4" />
                        Tải app
                      </ActionLink>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main>
          <section className="relative px-4 pb-20 pt-32 sm:px-6 sm:pb-28 sm:pt-40 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mx-auto max-w-5xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Badge
                    variant="outline"
                    className="border-white/10 bg-white/[0.03] px-3 py-1 text-zinc-400"
                  >
                    <span className="mr-1 size-1.5 rounded-full bg-emerald-300" />
                    MK Widget Card / Digital Identity 2026
                  </Badge>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mt-7 text-balance text-5xl font-semibold tracking-normal text-white sm:text-7xl lg:text-[96px]"
                >
                  Hệ sinh thái eCard & Widget hiện đại.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-8 text-zinc-400 sm:text-xl"
                >
                  MK Widget Card giúp bạn tạo danh thiếp kỹ thuật số chuyên nghiệp,
                  tích hợp mã QR thông minh và đưa thông tin quan trọng lên màn hình
                  chính thông qua hệ thống Widget mượt mà trên iOS và Android.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
                >
                  {GOOGLE_PLAY_URL && GOOGLE_PLAY_URL !== "#" && (
                    <ActionLink
                      href={GOOGLE_PLAY_URL}
                      className="w-full sm:w-auto"
                    >
                      <Play className="size-4" />
                      CH Play
                    </ActionLink>
                  )}
                  {APP_STORE_URL && APP_STORE_URL !== "#" && (
                    <ActionLink
                      href={APP_STORE_URL}
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      <Apple className="size-4" />
                      App Store{" "}
                    </ActionLink>
                  )}
                  <ActionLink
                    href={GITHUB_URL}
                    variant="ghost"
                    external
                    className="w-full sm:w-auto"
                  >
                    <Code2 className="size-4" />
                    Source GitHub
                  </ActionLink>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.42 }}
                  className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10"
                >
                  {metrics.map((metric) => (
                    <div key={metric.label} className="bg-black/80 px-4 py-4">
                      <p className="text-2xl font-semibold text-white">
                        {metric.value}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>

              <HeroPreview reduceMotion={Boolean(shouldReduceMotion)} />
            </div>
          </section>

          <section className="overflow-hidden border-y border-white/10 bg-white/[0.02] py-4">
            <div className="mk-marquee-track flex w-max items-center gap-4">
              {[
                ...marqueeItems,
                ...marqueeItems,
                ...marqueeItems,
                ...marqueeItems,
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

          <section id="product" className="px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Product"
                title="Giải pháp định danh kỹ thuật số toàn diện."
                description="MK Widget Card cung cấp một quy trình khép kín từ việc tạo hồ sơ, quản lý mã QR thông minh đến việc hiển thị thông tin tức thì trên màn hình chính của điện thoại."
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {productHighlights.map((feature, index) => (
                  <FeatureCard
                    key={feature.title}
                    {...feature}
                    delay={index * 0.05}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="border-y border-white/10 bg-[#050505] px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Gallery"
                title="Giao diện ứng dụng trực quan và hiện đại."
                description="Khám phá các màn hình chức năng chính của MK Widget Card, được thiết kế tối ưu cho trải nghiệm người dùng trên cả iOS và Android."
              />

              <div className="grid gap-4 md:grid-cols-2">
                {gallery.map((item, index) => (
                  <GalleryCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </section>

          <section id="plugins" className="px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                <SectionHeading
                  eyebrow="Modules"
                  title="Hệ thống thành phần linh hoạt."
                  description="MK Widget Card được xây dựng trên cấu trúc mô-đun, cho phép bạn tùy biến danh thiếp với nhiều loại thông tin khác nhau tùy theo nhu cầu sử dụng."
                  align="left"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  {pluginModules.map((plugin, index) => (
                    <PluginCard key={plugin.name} {...plugin} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-white/10 bg-[#050505] px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-4 lg:grid-cols-3">
                {workflowSteps.map((step, index) => (
                  <Reveal key={step.title} delay={index * 0.05}>
                    <div className="rounded-[8px] border border-white/10 bg-black p-5">
                      <div className="mb-10 flex items-center justify-between">
                        <div className="flex size-10 items-center justify-center rounded-[8px] bg-white/[0.04] text-cyan-300">
                          <step.icon className="size-5" />
                        </div>
                        <span className="font-mono text-xs text-zinc-600">
                          STEP {index + 1}
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

          <section id="guide" className="px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div>
                  <SectionHeading
                    eyebrow="Guide"
                    title="Hướng dẫn thiết lập và phát triển dự án."
                    description="Các bước để bắt đầu với MK Widget Card, từ cài đặt môi trường đến việc build ứng dụng trên các thiết bị di động."
                    align="left"
                  />

                  <Reveal>
                    <h3 className="mb-6 text-xl font-medium text-white">Yêu cầu hệ thống</h3>
                    <div className="space-y-3">
                      {prerequisites.map((req, index) => (
                        <div
                          key={req.item}
                          className="flex gap-4 rounded-[8px] border border-white/10 bg-white/[0.025] p-4"
                        >
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-semibold text-black">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{req.item}</p>
                            <p className="text-sm leading-6 text-zinc-500">
                              {req.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </div>

                <Reveal delay={0.08}>
                  <div className="space-y-4">
                    <CodeBlock
                      title="1. Clone & install"
                      command={cloneCommand}
                      copied={copied === "clone"}
                      onCopy={() => copyToClipboard(cloneCommand, "clone")}
                    />
                    <CodeBlock
                      title="2. Build cho iOS (Yêu cầu macOS)"
                      command={iosCommand}
                      copied={copied === "ios"}
                      onCopy={() => copyToClipboard(iosCommand, "ios")}
                    />
                    <CodeBlock
                      title="3. Build cho Android"
                      command={androidCommand}
                      copied={copied === "android"}
                      onCopy={() => copyToClipboard(androidCommand, "android")}
                    />
                    <div className="rounded-[8px] border border-cyan-300/15 bg-cyan-300/[0.04] p-4 text-sm leading-6 text-cyan-100/80">
                      Lưu ý: Lệnh `prebuild` sẽ tự động cấu hình các thư viện native và chạy `pod install` cho iOS. Đảm bảo bạn đã cài đặt đủ các công cụ build tương ứng.
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          <section
            id="creator"
            className="border-y border-white/10 bg-[#050505] px-4 py-24 sm:px-6 lg:px-8"
          >
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <Reveal>
                <Badge
                  variant="outline"
                  className="border-white/10 bg-white/[0.03] text-zinc-400"
                >
                  Nhà sáng tạo
                </Badge>
                <h2 className="mt-5 text-balance text-4xl font-semibold tracking-normal text-white sm:text-6xl">
                  Được tạo bởi Tran Minh Khoi, tối ưu cho sản phẩm cá nhân có
                  chiều sâu.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                  MK Widget Card được định vị như một ứng dụng eCard/widget hiện đại: cá
                  nhân hóa, đồng bộ dữ liệu cục bộ, có câu chuyện creator rõ ràng
                  và đủ độ tin cậy để đồng hành cùng bạn trong công việc.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ActionLink href={CREATOR_URL} variant="secondary" external>
                    <Globe2 className="size-4" />
                    Website creator
                  </ActionLink>
                  <ActionLink href={`mailto:${CONTACT_EMAIL}`} variant="ghost">
                    <ExternalLink className="size-4" />
                    {CONTACT_EMAIL}
                  </ActionLink>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-black p-6">
                  <div className="absolute inset-0 mk-grid-fade opacity-50" />
                  <div className="relative">
                    <div className="flex aspect-square items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.03]">
                      <span className="text-[112px] font-semibold tracking-normal text-white/10 sm:text-[160px]">
                        MK
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        ["Role", "Creator"],
                        ["Focus", "Digital Identity"],
                        ["Stack", "React Native"],
                        ["Status", "Shipping"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-[8px] border border-white/10 bg-white/[0.025] p-4"
                        >
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                            {label}
                          </p>
                          <p className="mt-2 text-sm font-medium text-white">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
          {((GOOGLE_PLAY_URL && GOOGLE_PLAY_URL !== "#") || (APP_STORE_URL && APP_STORE_URL !== "#")) && (
            <section id="download" className="px-4 py-24 sm:px-6 lg:px-8">
              <Reveal className="mx-auto max-w-5xl overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.025] p-6 text-center sm:p-10 lg:p-14">
                <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-[8px] border border-white/10 bg-black text-cyan-300">
                  <Zap className="size-6" />
                </div>
                <h2 className="text-balance text-4xl font-semibold tracking-normal text-white sm:text-6xl">
                  Sẵn sàng trải nghiệm MK Widget Card.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                  Tải ngay ứng dụng để bắt đầu tạo eCard chuyên nghiệp và đưa
                  thông tin cá nhân của bạn lên màn hình chính ngay hôm nay.
                </p>
                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                  {GOOGLE_PLAY_URL && GOOGLE_PLAY_URL !== "#" && (
                    <ActionLink href={GOOGLE_PLAY_URL}>
                      <Play className="size-4" />
                      CH Play
                    </ActionLink>
                  )}
                  {APP_STORE_URL && APP_STORE_URL !== "#" && (
                    <ActionLink href={APP_STORE_URL} variant="secondary">
                      <Apple className="size-4" />
                      App Store
                    </ActionLink>
                  )}
                  <ActionLink href={GITHUB_URL} variant="ghost" external>
                    <Code2 className="size-4" />
                    GitHub Repo
                  </ActionLink>
                </div>
              </Reveal>
            </section>
          )}
        </main>

        <footer className="border-t border-white/10 bg-black px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Image
                src="/white_logo.png"
                alt="MK Widget Card"
                width={177}
                height={40}
                className="h-7 w-auto max-w-[150px] object-contain"
              />
              <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500">
                MK Widget Card - Hệ sinh thái eCard và Widget thông minh. 
                Được xây dựng với sự tập trung vào trải nghiệm người dùng và quyền riêng tư.
              </p>
            </div>
            <div className="grid gap-8 text-sm sm:grid-cols-3">
              <div className="space-y-3">
                <p className="font-medium text-white">Product</p>
                <Link
                  href="#product"
                  className="block text-zinc-500 hover:text-white"
                >
                  Tổng quan
                </Link>
                <Link
                  href="#plugins"
                  className="block text-zinc-500 hover:text-white"
                >
                  Tính năng
                </Link>
                <Link
                  href="#guide"
                  className="block text-zinc-500 hover:text-white"
                >
                  Hướng dẫn
                </Link>
              </div>
              <div className="space-y-3">
                <p className="font-medium text-white">Legal</p>
                <Link
                  href="/privacy"
                  className="block text-zinc-500 hover:text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="block text-zinc-500 hover:text-white"
                >
                  Terms
                </Link>
              </div>
              <div className="space-y-3">
                <p className="font-medium text-white">Connect</p>
                <Link
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-zinc-500 hover:text-white"
                >
                  GitHub
                </Link>
                <Link
                  href={CREATOR_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-zinc-500 hover:text-white"
                >
                  Creator
                </Link>
                <Link
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="block text-zinc-500 hover:text-white"
                >
                  Email
                </Link>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Tran Minh Khoi. All rights reserved.</p>
            <p>Production-ready landing for MK Widget Card.</p>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
