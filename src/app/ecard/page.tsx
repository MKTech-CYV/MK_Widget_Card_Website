import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
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

type EcardPageProps = {
  searchParams: Promise<EcardSearchParams>;
};

const socialLabels: Record<string, string> = {
  facebook: "Facebook",
  github: "GitHub",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  telegram: "Telegram",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
  x: "X",
  youtube: "YouTube",
  zalo: "Zalo",
};

const ecardCopy: Record<
  EcardLocale,
  {
    actionLabels: {
      copied: string;
      copyLink: string;
      saveContact: string;
      share: string;
      shareText: string;
    };
    articleLabel: string;
    brandLine: string;
    contact: Record<"address" | "company" | "department" | "email" | "phone" | "role" | "website", string>;
    defaultDisplayName: string;
    defaultLabel: string;
    detailsHeading: string;
    emptyDescription: React.ReactNode;
    emptySample: string;
    emptyTitle: string;
    metadataEmptyDescription: string;
    metadataEmptyTitle: string;
    metadataProfileDescription: (name: string) => string;
    qrDescription: string;
    qrHeading: string;
    qrLabel: string;
    socialHeading: string;
  }
> = {
  vi: {
    actionLabels: {
      copied: "Đã sao chép",
      copyLink: "Sao chép link",
      saveContact: "Lưu liên hệ",
      share: "Chia sẻ",
      shareText: "Thông tin eCard",
    },
    articleLabel: "Thông tin eCard",
    brandLine: "Digital eCard",
    contact: {
      address: "Địa chỉ",
      company: "Công ty",
      department: "Bộ phận",
      email: "Email",
      phone: "Điện thoại",
      role: "Vai trò",
      website: "Website",
    },
    defaultDisplayName: "MK eCard",
    defaultLabel: "Digital eCard",
    detailsHeading: "Thông tin",
    emptyDescription: (
      <>
        Mobile app có thể mở route này với query params như <code>full_name</code>,{" "}
        <code>phone</code>, <code>email</code>, <code>website</code>,{" "}
        <code>lang</code> hoặc param <code>data</code> dạng base64url JSON.
      </>
    ),
    emptySample: "Xem mẫu eCard",
    emptyTitle: "Chưa có dữ liệu eCard",
    metadataEmptyDescription: "Trang chia sẻ eCard cho mobile app.",
    metadataEmptyTitle: "Chia sẻ eCard",
    metadataProfileDescription: (name) => `Thông tin eCard của ${name}.`,
    qrDescription: "QR chứa vCard để lưu liên hệ nhanh trên điện thoại.",
    qrHeading: "Quét để lưu eCard",
    qrLabel: "QR eCard",
    socialHeading: "Kết nối",
  },
  en: {
    actionLabels: {
      copied: "Copied",
      copyLink: "Copy link",
      saveContact: "Save contact",
      share: "Share",
      shareText: "eCard contact details",
    },
    articleLabel: "eCard profile",
    brandLine: "Digital eCard",
    contact: {
      address: "Address",
      company: "Company",
      department: "Department",
      email: "Email",
      phone: "Phone",
      role: "Role",
      website: "Website",
    },
    defaultDisplayName: "MK eCard",
    defaultLabel: "Digital eCard",
    detailsHeading: "Details",
    emptyDescription: (
      <>
        The mobile app can open this route with query params such as{" "}
        <code>full_name</code>, <code>phone</code>, <code>email</code>,{" "}
        <code>website</code>, <code>lang</code>, or a base64url JSON{" "}
        <code>data</code> param.
      </>
    ),
    emptySample: "View sample eCard",
    emptyTitle: "No eCard data yet",
    metadataEmptyDescription: "Shareable eCard page for the mobile app.",
    metadataEmptyTitle: "Share eCard",
    metadataProfileDescription: (name) => `eCard contact details for ${name}.`,
    qrDescription: "This QR stores a vCard for quick contact saving.",
    qrHeading: "Scan to save eCard",
    qrLabel: "eCard QR",
    socialHeading: "Connect",
  },
};

export async function generateMetadata({
  searchParams,
}: EcardPageProps): Promise<Metadata> {
  const query = await searchParams;
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

export default async function EcardPage({ searchParams }: EcardPageProps) {
  const query = await searchParams;
  const locale = getEcardLocale(query);
  const copy = ecardCopy[locale];
  const { profile, hasData } = parseEcardProfile(query);
  const sampleParams = new URLSearchParams({
    company: "MK Tech",
    email: "contact@tranminhkhoi.dev",
    full_name: "Tran Minh Khoi",
    job_title: "Founder",
    phone: "0900000000",
    website: "https://mktechvn.com",
  });

  if (locale === "en") {
    sampleParams.set("lang", "en");
  }

  if (!hasData) {
    return (
      <main className="ecard-page ecard-page--empty">
        <section className="ecard-empty" lang={locale}>
          <div className="ecard-brand ecard-brand--empty">
            <span className="ecard-brand__mark">
              <Image src="/favicon.png" alt="" width={44} height={44} priority />
            </span>
            <div className="ecard-brand__text">
              <strong>{SITE_NAME}</strong>
              <span>{copy.brandLine}</span>
            </div>
          </div>
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
    width: 292,
    color: {
      dark: "#111827",
      light: "#ffffff",
    },
  });
  const shareUrl = buildEcardShareUrl(profile, locale);
  const fileName = getVCardFileName(displayName);
  const vcardHref = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
  const socialEntries = Object.entries(profile.social);
  const contactItems = [
    { href: undefined, key: "role", label: copy.contact.role, value: profile.jobTitle },
    { href: undefined, key: "company", label: copy.contact.company, value: profile.company },
    {
      href: undefined,
      key: "department",
      label: copy.contact.department,
      value: profile.department,
    },
    { href: profile.phone ? `tel:${profile.phone}` : undefined, key: "phone", label: copy.contact.phone, value: profile.phone },
    {
      href: profile.email ? `mailto:${profile.email}` : undefined,
      key: "email",
      label: copy.contact.email,
      value: profile.email,
    },
    {
      href: profile.website,
      key: "website",
      label: copy.contact.website,
      value: profile.website?.replace(/^https?:\/\//, ""),
    },
    { href: undefined, key: "address", label: copy.contact.address, value: profile.address },
  ].flatMap((item) => (item.value ? [{ ...item, value: item.value }] : []));

  return (
    <main className="ecard-page">
      <article className="ecard-card" aria-label={copy.articleLabel} lang={locale}>
        <div className="ecard-brand">
          <Link className="ecard-brand__mark" href="/" aria-label={SITE_NAME}>
            <Image src="/favicon.png" alt="" width={44} height={44} priority />
          </Link>
          <div className="ecard-brand__text">
            <strong>{SITE_NAME}</strong>
            <span>{profile.label || copy.defaultLabel}</span>
          </div>
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
            {profile.jobTitle ? <p>{profile.jobTitle}</p> : null}
            {[profile.company, profile.department].filter(Boolean).length > 0 ? (
              <span className="ecard-company">
                {[profile.company, profile.department].filter(Boolean).join(" / ")}
              </span>
            ) : null}
          </div>

          {profile.bio ? <p className="ecard-bio">{profile.bio}</p> : null}
        </header>

        <section className="ecard-qr" aria-label={copy.qrLabel}>
          <div className="ecard-qr__frame" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <div>
            <h2>{copy.qrHeading}</h2>
            <p>{copy.qrDescription}</p>
          </div>
        </section>

        <EcardActions
          fileName={fileName}
          fullName={displayName}
          labels={copy.actionLabels}
          shareUrl={shareUrl}
          vcardHref={vcardHref}
        />

        {contactItems.length > 0 ? (
          <section className="ecard-section" aria-label={copy.detailsHeading}>
            <h2>{copy.detailsHeading}</h2>
            <dl className="ecard-details">
              {contactItems.map((item) => (
                <div key={item.key}>
                  <dt>{item.label}</dt>
                  <dd>
                    {item.href ? (
                      <a
                        href={item.href}
                        rel={item.key === "website" ? "noreferrer" : undefined}
                        target={item.key === "website" ? "_blank" : undefined}
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {socialEntries.length > 0 ? (
          <section className="ecard-section" aria-label="Social links">
            <h2>{copy.socialHeading}</h2>
            <div className="ecard-socials">
              {socialEntries.map(([key, url]) => (
                <a key={key} href={url} rel="noreferrer" target="_blank">
                  {socialLabels[key] ?? key}
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
