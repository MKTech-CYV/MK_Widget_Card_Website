import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, LockKeyhole, ShieldCheck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Chính sách quyền riêng tư của MK Widget Card, giải thích cách dữ liệu eCard, QR và quyền truy cập thiết bị được xử lý.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | MK Widget Card",
    description:
      "Chính sách quyền riêng tư của MK Widget Card cho eCard, QR, và đồng bộ Widget.",
    url: "/privacy",
  },
  twitter: {
    title: "Privacy Policy | MK Widget Card",
    description:
      "Chính sách quyền riêng tư của MK Widget Card cho eCard, QR, và đồng bộ Widget.",
  },
};

const sections = [
  {
    title: "1. Nguyên tắc chung",
    body: [
      "MK Widget Card được thiết kế theo hướng privacy-first và local-first. Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo vệ dữ liệu cá nhân của người dùng.",
      "Ứng dụng hoạt động chủ yếu bằng cách lưu trữ dữ liệu trực tiếp trên thiết bị của bạn. Chúng tôi không thu thập dữ liệu nhạy cảm trên máy chủ trừ khi cần thiết cho các chức năng cụ thể như thông báo đẩy.",
    ],
  },
  {
    title: "2. Dữ liệu bạn cung cấp",
    body: [
      "Thông tin eCard: Tên, chức vụ, email, số điện thoại, mạng xã hội và các liên kết mà bạn chủ động nhập để tạo danh thiếp kỹ thuật số.",
      "Dữ liệu QR: Thông tin chứa trong mã QR mà bạn tạo hoặc quét thông qua ứng dụng.",
      "Cấu hình Widget: Các tùy chọn hiển thị mà bạn thiết lập để đưa thông tin lên màn hình chính.",
    ],
  },
  {
    title: "3. Quyền truy cập thiết bị",
    body: [
      "Camera: Được sử dụng để quét mã QR danh thiếp từ người dùng khác. Chúng tôi không lưu trữ hình ảnh hoặc video từ camera ngoài nội dung mã QR được giải mã.",
      "Danh bạ (Contacts): Cho phép bạn lưu trực tiếp thông tin từ eCard đã quét vào danh bạ điện thoại. Ứng dụng chỉ ghi thông tin mới và không đọc hoặc tải danh bạ hiện có của bạn lên máy chủ.",
      "Thông báo (Notifications): Được sử dụng để gửi các cập nhật quan trọng hoặc nhắc nhở. Chúng tôi sử dụng Expo Push Tokens để định danh thiết bị nhận thông báo một cách ẩn danh.",
    ],
  },
  {
    title: "4. Lưu trữ và Đồng bộ",
    body: [
      "Lưu trữ cục bộ: Tất cả thông tin cá nhân và eCard của bạn được lưu trữ an toàn trên bộ nhớ của thiết bị (Sử dụng App Groups trên iOS để chia sẻ dữ liệu giữa App và Widget).",
      "Đồng bộ Widget: Dữ liệu được chia sẻ nội bộ giữa ứng dụng chính và tiện ích màn hình chính (Widget) để hiển thị thông tin nhanh chóng mà không cần mở ứng dụng.",
    ],
  },
  {
    title: "5. Dịch vụ bên thứ ba",
    body: [
      "Expo: Chúng tôi sử dụng hạ tầng của Expo để xử lý thông báo đẩy (Push Notifications).",
      "App Store & Google Play: Việc tải xuống và thanh toán (nếu có) được xử lý bởi nền tảng của Apple và Google theo chính sách riêng của họ.",
    ],
  },
  {
    title: "6. Bảo mật dữ liệu",
    body: [
      "Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn để bảo vệ dữ liệu của bạn trên thiết bị. Vì dữ liệu nằm trên máy của bạn, chúng tôi khuyến khích bạn sử dụng các tính năng bảo mật của hệ điều hành (như FaceID, vân tay hoặc mật khẩu thiết bị).",
      "Chúng tôi không bán, trao đổi hoặc chuyển giao dữ liệu cá nhân của bạn cho bên thứ ba.",
    ],
  },
  {
    title: "7. Cập nhật và Liên hệ",
    body: [
      "Chính sách này có thể được cập nhật để phù hợp với các tính năng mới của ứng dụng. Mọi thay đổi sẽ được cập nhật tại trang này.",
      "Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ qua email: contact@tranminhkhoi.dev",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <div className="fixed inset-0 -z-10 mk-grid-fade opacity-60" />

      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-6">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-2 rounded-full text-zinc-400 hover:text-white"
            )}
          >
            <ChevronLeft className="size-4" />
            Về trang chủ
          </Link>
        </div>
      </header>

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              <ShieldCheck className="size-3 text-cyan-300" />
              Privacy Policy
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-normal text-white sm:text-6xl">
              Privacy Policy - MK Widget Card.
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
              Cập nhật lần cuối: 12 tháng 5, 2026. Chính sách này mô tả cách ứng dụng
              MK Widget Card thu thập, sử dụng và bảo vệ thông tin của bạn.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="h-fit rounded-[8px] border border-white/10 bg-white/[0.025] p-5">
              <div className="flex size-11 items-center justify-center rounded-[8px] border border-white/10 bg-black text-cyan-300">
                <LockKeyhole className="size-5" />
              </div>
              <h2 className="mt-6 text-xl font-medium text-white">Tóm tắt</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Ứng dụng ưu tiên lưu trữ cục bộ. Quyền Camera và Danh bạ chỉ được sử dụng
                cho mục đích quét và lưu eCard. Chúng tôi không thu thập dữ liệu cá nhân của bạn lên máy chủ.
              </p>
            </aside>

            <div className="space-y-4">
              {sections.map((section) => (
                <section key={section.title} className="rounded-[8px] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                  <h2 className="text-xl font-medium text-white">{section.title}</h2>
                  <div className="mt-4 space-y-3">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-zinc-400 sm:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
