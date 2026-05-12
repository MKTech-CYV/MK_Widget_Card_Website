import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Điều khoản sử dụng cho ứng dụng MK Widget Card và các dịch vụ liên quan.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | MK Widget Card",
    description: "Điều khoản sử dụng cho ứng dụng MK Widget Card và các dịch vụ liên quan.",
    url: "/terms",
  },
  twitter: {
    title: "Terms of Service | MK Widget Card",
    description: "Điều khoản sử dụng cho ứng dụng MK Widget Card và các dịch vụ liên quan.",
  },
};

const terms = [
  {
    title: "1. Chấp nhận điều khoản",
    body: "Bằng cách tải xuống, cài đặt hoặc sử dụng ứng dụng MK Widget Card, bạn đồng ý tuân thủ các điều khoản sử dụng này. Nếu bạn không đồng ý, vui lòng không sử dụng ứng dụng.",
  },
  {
    title: "2. Quyền sở hữu trí tuệ",
    body: "Tất cả nội dung, mã nguồn, thiết kế, logo và các tài sản trí tuệ khác liên quan đến MK Widget Card thuộc sở hữu của Trần Minh Khôi. Bạn không được sao chép, sửa đổi hoặc phân phối mà không có sự đồng ý bằng văn bản.",
  },
  {
    title: "3. Nội dung người dùng",
    body: "Bạn chịu trách nhiệm hoàn toàn về các thông tin cá nhân, liên kết và dữ liệu bạn nhập vào ứng dụng để tạo eCard. Bạn cam kết thông tin cung cấp là chính xác và không vi phạm pháp luật hoặc quyền của bên thứ ba.",
  },
  {
    title: "4. Sử dụng dịch vụ",
    body: "Ứng dụng được cung cấp nhằm mục đích tạo danh thiếp kỹ thuật số và quản lý thông tin liên lạc. Bạn không được sử dụng ứng dụng cho bất kỳ mục đích bất hợp pháp hoặc gây hại nào, bao gồm việc spam hoặc giả mạo người khác.",
  },
  {
    title: "5. Miễn trừ trách nhiệm",
    body: "Ứng dụng được cung cấp 'như hiện có'. Chúng tôi không đảm bảo ứng dụng sẽ không có lỗi hoặc luôn sẵn dụng. Chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất dữ liệu hoặc thiệt hại nào phát sinh từ việc sử dụng ứng dụng.",
  },
  {
    title: "6. Thay đổi điều khoản",
    body: "Chúng tôi có quyền cập nhật các điều khoản này bất cứ lúc nào. Việc bạn tiếp tục sử dụng ứng dụng sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.",
  },
];

export default function TermsPage() {
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
              <FileText className="size-3 text-cyan-300" />
              Terms
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-normal text-white sm:text-6xl">
              Terms of Service - MK Widget Card.
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
              Cập nhật lần cuối: 12 tháng 5, 2026. Các điều khoản này quy định việc sử dụng ứng dụng và các dịch vụ đi kèm của chúng tôi.
            </p>
          </div>

          <div className="space-y-4">
            {terms.map((term) => (
              <section key={term.title} className="rounded-[8px] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                <h2 className="text-xl font-medium text-white">{term.title}</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">{term.body}</p>
              </section>
            ))}

            <section className="rounded-[8px] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
              <h2 className="text-xl font-medium text-white">7. Liên hệ</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                Mọi câu hỏi về điều khoản dịch vụ, vui lòng liên hệ qua email:{" "}
                <Link href="mailto:contact@tranminhkhoi.dev" className="text-cyan-300 hover:text-cyan-200">
                  contact@tranminhkhoi.dev
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
