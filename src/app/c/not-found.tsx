import Image from "next/image";
import Link from "next/link";

export default function ShortLinkNotFound() {
  return (
    <main className="ecard-page ecard-page--empty">
      <section className="ecard-empty" lang="vi">
        <span className="ecard-brand__mark">
          <Image src="/favicon.png" alt="" width={44} height={44} priority />
        </span>
        <h1>Link không tồn tại</h1>
        <p>
          Link eCard này đã bị thu hồi hoặc chưa từng tồn tại. Hãy nhờ người gửi
          chia sẻ lại cho bạn.
        </p>
        <Link href="/">Về trang chủ</Link>
      </section>
    </main>
  );
}
