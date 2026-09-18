import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import type { CSSProperties, ReactNode } from "react";
import {
  Building2,
  ChevronRight,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  Send,
} from "lucide-react";
import {
  buildEcardShareUrl,
  buildVCard,
  getEcardLocale,
  getEcardInitials,
  getVCardFileName,
  parseEcardProfile,
  type EcardLocale,
  type EcardSearchParams,
} from "@/lib/ecard";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { EcardActions } from "./ecard-actions";

type SocialMeta = { label: string; color: string; mark: ReactNode };

const socialMeta: Record<string, SocialMeta> = {
  facebook: { label: "Facebook", color: "#1877f2", mark: "f" },
  github: { label: "GitHub", color: "#24292f", mark: "GH" },
  instagram: { label: "Instagram", color: "#d6249f", mark: "Ig" },
  linkedin: { label: "LinkedIn", color: "#0a66c2", mark: "in" },
  telegram: { label: "Telegram", color: "#229ed9", mark: <Send size={16} strokeWidth={2.4} /> },
  tiktok: { label: "TikTok", color: "#111827", mark: "Tk" },
  whatsapp: { label: "WhatsApp", color: "#1fa855", mark: <MessageCircle size={16} strokeWidth={2.4} /> },
  x: { label: "X", color: "#111827", mark: "X" },
  youtube: { label: "YouTube", color: "#e11d1d", mark: <Play size={15} strokeWidth={2.6} fill="currentColor" /> },
  zalo: { label: "Zalo", color: "#0068ff", mark: "Z" },
};

const messagingOrder = ["zalo", "whatsapp", "telegram"] as const;

const ecardCopy: Record<
  EcardLocale,
  {
    aboutHeading: string;
    actionLabels: {
      copied: string;
      copyLink: string;
      saveContact: string;
      share: string;
      shareText: string;
    };
    articleLabel: string;
    brandLine: string;
    contact: Record<"address" | "email" | "phone" | "website", string>;
    contactHeading: string;
    createOwn: string;
    defaultDisplayName: string;
    emptyDescription: string;
    emptySample: string;
    emptyTitle: string;
    madeWith: string;
    metadataEmptyDescription: string;
    metadataEmptyTitle: string;
    metadataProfileDescription: (name: string) => string;
    qrDescription: string;
    qrHeading: string;
    qrLabel: string;
    quick: Record<"call" | "email" | "message" | "website", string>;
    socialHeading: string;
  }
> = {
  vi: {
    aboutHeading: "Giới thiệu",
    actionLabels: {
      copied: "Đã sao chép",
      copyLink: "Sao chép link",
      saveContact: "Lưu vào danh bạ",
      share: "Chia sẻ",
      shareText: "Thông tin eCard",
    },
    articleLabel: "Thông tin eCard",
    brandLine: "Danh thiếp số",
    contact: {
      address: "Địa chỉ",
      email: "Email",
      phone: "Điện thoại",
      website: "Website",
    },
    contactHeading: "Thông tin liên hệ",
    createOwn: "Tạo eCard của bạn",
    defaultDisplayName: "MK eCard",
    emptyDescription:
      "Link này chưa có thông tin eCard. Hãy tạo eCard trong ứng dụng MK Widget Card rồi chia sẻ lại link.",
    emptySample: "Xem eCard mẫu",
    emptyTitle: "Chưa có dữ liệu eCard",
    madeWith: "Tạo bằng",
    metadataEmptyDescription: "Trang chia sẻ eCard cho mobile app.",
    metadataEmptyTitle: "Chia sẻ eCard",
    metadataProfileDescription: (name) => `Thông tin eCard của ${name}.`,
    qrDescription: "Quét bằng camera điện thoại để lưu thông tin liên hệ.",
    qrHeading: "Quét để lưu liên hệ",
    qrLabel: "QR eCard",
    quick: { call: "Gọi", email: "Email", message: "Nhắn tin", website: "Website" },
    socialHeading: "Kết nối",
  },
  en: {
    aboutHeading: "About",
    actionLabels: {
      copied: "Copied",
      copyLink: "Copy link",
      saveContact: "Save to contacts",
      share: "Share",
      shareText: "eCard contact details",
    },
    articleLabel: "eCard profile",
    brandLine: "Digital business card",
    contact: {
      address: "Address",
      email: "Email",
      phone: "Phone",
      website: "Website",
    },
    contactHeading: "Contact information",
    createOwn: "Create your own eCard",
    defaultDisplayName: "MK eCard",
    emptyDescription:
      "This link has no eCard details yet. Create an eCard in the MK Widget Card app, then share the link again.",
    emptySample: "View sample eCard",
    emptyTitle: "No eCard data yet",
    madeWith: "Made with",
    metadataEmptyDescription: "Shareable eCard page for the mobile app.",
    metadataEmptyTitle: "Share eCard",
    metadataProfileDescription: (name) => `eCard contact details for ${name}.`,
    qrDescription: "Scan with your phone camera to save the contact details.",
    qrHeading: "Scan to save contact",
    qrLabel: "eCard QR",
    quick: { call: "Call", email: "Email", message: "Message", website: "Website" },
    socialHeading: "Connect",
  },
};

export async function buildEcardMetadata(
  query: EcardSearchParams,
): Promise<Metadata> {
  const locale = getEcardLocale(query);
  const copy = ecardCopy[locale];
  const { profile, hasData } = parseEcardProfile(query);
  const displayName = profile.fullName || copy.defaultDisplayName;
  const title = hasData
    ? `${displayName} | ${SITE_NAME}`
    : `${copy.metadataEmptyTitle} | ${SITE_NAME}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: hasData
      ? copy.metadataProfileDescription(displayName)
      : copy.metadataEmptyDescription,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

function BrandMark({ href }: { href?: string }) {
  const image = <Image src="/favicon.png" alt="" width={28} height={28} priority />;
  return href ? (
    <Link className="ecard-brand__mark" href={href} aria-label={SITE_NAME}>
      {image}
    </Link>
  ) : (
    <span className="ecard-brand__mark">{image}</span>
  );
}

// Shared by /ecard (data in query params) and /c/[code] (data loaded from the
// shared preset). `shareUrl` overrides the long query-string link used by the
// page's Share / Copy buttons.
export async function EcardView({
  query,
  shareUrl: shareUrlOverride,
}: {
  query: EcardSearchParams;
  shareUrl?: string;
}) {
  const locale = getEcardLocale(query);
  const copy = ecardCopy[locale];
  const { profile, hasData } = parseEcardProfile(query);

  if (!hasData) {
    const sampleParams = new URLSearchParams({
      about:
        locale === "en"
          ? "Building products that make everyday work simpler."
          : "Xây dựng những sản phẩm giúp công việc mỗi ngày trở nên đơn giản hơn.",
      company: "MK Tech",
      email: "contact@tranminhkhoi.dev",
      full_name: "Tran Minh Khoi",
      job_title: "Founder",
      phone: "+84900000000",
      website: "https://mktechvn.com",
    });
    if (locale === "en") {
      sampleParams.set("lang", "en");
    }

    return (
      <main className="ecard-page ecard-page--empty">
        <section className="ecard-empty" lang={locale}>
          <BrandMark />
          <h1>{copy.emptyTitle}</h1>
          <p>{copy.emptyDescription}</p>
          <Link href={`/ecard?${sampleParams.toString()}`}>{copy.emptySample}</Link>
        </section>
      </main>
    );
  }

  const displayName = profile.fullName || copy.defaultDisplayName;
  const vcard = buildVCard(profile);
  const qrSvg = await QRCode.toString(vcard, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 240,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });
  const shareUrl = shareUrlOverride ?? buildEcardShareUrl(profile, locale);
  const fileName = getVCardFileName(displayName);
  const vcardHref = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
  const socialEntries = Object.entries(profile.social);
  const organization = [profile.company, profile.department].filter(Boolean).join(" · ");
  const messageKey = messagingOrder.find((key) => profile.social[key]);
  const websiteLabel = profile.website?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  const quickActions = [
    profile.phone
      ? { key: "call", label: copy.quick.call, href: `tel:${profile.phone}`, icon: <Phone size={20} strokeWidth={2.2} /> }
      : undefined,
    profile.email
      ? { key: "email", label: copy.quick.email, href: `mailto:${profile.email}`, icon: <Mail size={20} strokeWidth={2.2} /> }
      : undefined,
    messageKey
      ? {
          key: "message",
          label: socialMeta[messageKey]?.label ?? copy.quick.message,
          href: profile.social[messageKey],
          icon: <MessageCircle size={20} strokeWidth={2.2} />,
          external: true,
        }
      : undefined,
    profile.website
      ? { key: "website", label: copy.quick.website, href: profile.website, icon: <Globe size={20} strokeWidth={2.2} />, external: true }
      : undefined,
  ].flatMap((item) => (item ? [item] : []));

  const contactItems = [
    profile.phone
      ? { key: "phone", label: copy.contact.phone, value: profile.phoneDisplay ?? profile.phone, href: `tel:${profile.phone}`, icon: <Phone size={18} strokeWidth={2.2} /> }
      : undefined,
    profile.email
      ? { key: "email", label: copy.contact.email, value: profile.email, href: `mailto:${profile.email}`, icon: <Mail size={18} strokeWidth={2.2} /> }
      : undefined,
    profile.website
      ? { key: "website", label: copy.contact.website, value: websiteLabel ?? profile.website, href: profile.website, icon: <Globe size={18} strokeWidth={2.2} />, external: true }
      : undefined,
    profile.address
      ? {
          key: "address",
          label: copy.contact.address,
          value: profile.address,
          href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`,
          icon: <MapPin size={18} strokeWidth={2.2} />,
          external: true,
        }
      : undefined,
  ].flatMap((item) => (item ? [item] : []));

  return (
    <main className="ecard-page">
      <article className="ecard-card" aria-label={copy.articleLabel} lang={locale}>
        <div className="ecard-cover">
          <div className="ecard-brand">
            <BrandMark href="/" />
            <strong>{SITE_NAME}</strong>
          </div>
          <span className="ecard-badge">{copy.brandLine}</span>
        </div>

        <header className="ecard-hero">
          <div className="ecard-avatar" aria-label={displayName}>
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt={displayName} />
            ) : (
              <span>{getEcardInitials(displayName)}</span>
            )}
          </div>

          <div className="ecard-identity">
            <h1>{displayName}</h1>
            {profile.jobTitle ? <p className="ecard-role">{profile.jobTitle}</p> : null}
            {organization ? (
              <p className="ecard-company">
                <Building2 aria-hidden="true" size={15} strokeWidth={2.2} />
                <span>{organization}</span>
              </p>
            ) : null}
          </div>

          {profile.bio ? <p className="ecard-bio">{profile.bio}</p> : null}
        </header>

        <div className="ecard-body-content">
          <EcardActions
            fileName={fileName}
            fullName={displayName}
            labels={copy.actionLabels}
            shareUrl={shareUrl}
            vcardHref={vcardHref}
          />

          {quickActions.length > 0 ? (
            <nav
              className="ecard-quick"
              style={{ "--count": quickActions.length } as CSSProperties}
            >
              {quickActions.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  rel={item.external ? "noreferrer" : undefined}
                  target={item.external ? "_blank" : undefined}
                >
                  <span className="ecard-quick__icon">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          ) : null}

          {profile.about ? (
            <section className="ecard-section" aria-label={copy.aboutHeading}>
              <h2>{copy.aboutHeading}</h2>
              <p className="ecard-about">{profile.about}</p>
            </section>
          ) : null}

          {contactItems.length > 0 ? (
            <section className="ecard-section" aria-label={copy.contactHeading}>
              <h2>{copy.contactHeading}</h2>
              <ul className="ecard-contacts">
                {contactItems.map((item) => (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      rel={item.external ? "noreferrer" : undefined}
                      target={item.external ? "_blank" : undefined}
                    >
                      <span className="ecard-contacts__icon">{item.icon}</span>
                      <span className="ecard-contacts__text">
                        <small>{item.label}</small>
                        <strong>{item.value}</strong>
                      </span>
                      <ChevronRight aria-hidden="true" size={18} strokeWidth={2} />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {socialEntries.length > 0 ? (
            <section className="ecard-section" aria-label={copy.socialHeading}>
              <h2>{copy.socialHeading}</h2>
              <div className="ecard-socials">
                {socialEntries.map(([key, url]) => {
                  const meta = socialMeta[key];
                  return (
                    <a
                      key={key}
                      href={url}
                      rel="noreferrer"
                      style={{ "--brand": meta?.color ?? "#2563eb" } as CSSProperties}
                      target="_blank"
                    >
                      <span className="ecard-socials__mark">{meta?.mark ?? key[0]?.toUpperCase()}</span>
                      <span>{meta?.label ?? key}</span>
                    </a>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section className="ecard-qr" aria-label={copy.qrLabel}>
            <div className="ecard-qr__frame" dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <div>
              <h2>{copy.qrHeading}</h2>
              <p>{copy.qrDescription}</p>
            </div>
          </section>
        </div>

        <footer className="ecard-footer">
          <span>{copy.madeWith}</span>
          <Link href="/">{SITE_NAME}</Link>
          <span aria-hidden="true">·</span>
          <Link href="/">{copy.createOwn}</Link>
        </footer>
      </article>
    </main>
  );
}
