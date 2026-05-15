import { absoluteUrl } from "@/lib/seo";

export type EcardSearchParams = Record<string, string | string[] | undefined>;

export type EcardLocale = "vi" | "en";

export type EcardSocial = Record<string, string>;

export type EcardProfile = {
  label?: string;
  bio?: string;
  fullName: string;
  jobTitle?: string;
  company?: string;
  department?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  avatarUrl?: string;
  social: EcardSocial;
};

const socialDefinitions = [
  { key: "facebook", keys: ["facebook", "fb"], baseUrl: "https://facebook.com/" },
  { key: "github", keys: ["github"], baseUrl: "https://github.com/" },
  { key: "instagram", keys: ["instagram"], baseUrl: "https://instagram.com/" },
  { key: "linkedin", keys: ["linkedin"], baseUrl: "https://linkedin.com/in/" },
  { key: "telegram", keys: ["telegram"], baseUrl: "https://t.me/" },
  { key: "tiktok", keys: ["tiktok"], baseUrl: "https://tiktok.com/@" },
  { key: "whatsapp", keys: ["whatsapp"], baseUrl: "https://wa.me/" },
  { key: "x", keys: ["x", "twitter"], baseUrl: "https://x.com/" },
  { key: "youtube", keys: ["youtube"], baseUrl: "https://youtube.com/@" },
  { key: "zalo", keys: ["zalo"], baseUrl: "https://zalo.me/" },
];

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function cleanText(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseObject(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith("{")) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(trimmed);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}

function cleanUrl(value: unknown) {
  const text = cleanText(value);
  if (!text) {
    return undefined;
  }

  if (/^(https?:|mailto:|tel:)/i.test(text)) {
    return text;
  }

  return `https://${text}`;
}

function normalizeHandle(value: string) {
  return value.replace(/^@+/, "").replace(/^\/+/, "");
}

function normalizePhone(value: string, countryCode?: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return undefined;
  }

  const code = countryCode?.replace(/\D/g, "");
  if (!code) {
    return digits;
  }

  const withoutLeadingZero = digits.replace(/^0+/, "");
  if (digits.startsWith(code)) {
    return digits;
  }

  return `${code}${withoutLeadingZero}`;
}

function cleanSocialUrl(
  key: string,
  value: unknown,
  data: Record<string, unknown>,
) {
  const text = cleanText(value);
  if (!text) {
    return undefined;
  }

  if (/^https?:\/\//i.test(text)) {
    return text;
  }

  const definition = socialDefinitions.find((item) => item.key === key);
  if (!definition) {
    return cleanUrl(text);
  }

  if (key === "whatsapp" || key === "zalo") {
    const countryCode =
      cleanText(data[`${key}CountryCode`]) ?? cleanText(data.countryCode);
    const phone = normalizePhone(text, countryCode);
    return phone ? `${definition.baseUrl}${phone}` : undefined;
  }

  return `${definition.baseUrl}${normalizeHandle(text)}`;
}

function decodeDataParam(value: string | undefined) {
  if (!value) {
    return {};
  }

  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const decoded = Buffer.from(padded, "base64").toString("utf8");
    const parsed = JSON.parse(decoded);

    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function readValue(
  searchParams: EcardSearchParams,
  data: Record<string, unknown>,
  keys: string[],
) {
  for (const key of keys) {
    const queryValue = firstParam(searchParams[key]);
    const fromQuery = parseObject(queryValue) ? undefined : cleanText(queryValue);
    if (fromQuery) {
      return fromQuery;
    }

    const fromData = cleanText(data[key]);
    if (fromData) {
      return fromData;
    }
  }

  return undefined;
}

function readSocial(searchParams: EcardSearchParams, data: Record<string, unknown>) {
  const social: EcardSocial = {};
  const socialData = getEcardPayload(searchParams);

  for (const definition of socialDefinitions) {
    for (const sourceKey of definition.keys) {
      const value = cleanSocialUrl(
        definition.key,
        firstParam(searchParams[sourceKey]) ?? socialData[sourceKey] ?? data[sourceKey],
        socialData,
      );
      if (value) {
        social[definition.key] = value;
        break;
      }
    }
  }

  return social;
}

function getEcardPayload(searchParams: EcardSearchParams) {
  const data = decodeDataParam(firstParam(searchParams.data));
  const socialData =
    parseObject(firstParam(searchParams.social)) ?? parseObject(data.social) ?? {};
  const bioData =
    parseObject(firstParam(searchParams.bio)) ?? parseObject(data.bio) ?? {};

  return {
    ...data,
    ...socialData,
    ...bioData,
  };
}

export function parseEcardProfile(searchParams: EcardSearchParams) {
  const data = getEcardPayload(searchParams);
  const fullName =
    readValue(searchParams, data, ["full_name", "fullName", "name"]) ?? "";

  const profile: EcardProfile = {
    label: readValue(searchParams, data, ["label"]),
    bio: readValue(searchParams, data, ["bio", "about", "description"]),
    fullName,
    jobTitle: readValue(searchParams, data, ["job_title", "jobTitle", "title"]),
    company: readValue(searchParams, data, ["company"]),
    department: readValue(searchParams, data, ["department"]),
    email: readValue(searchParams, data, ["email"]),
    phone: readValue(searchParams, data, ["phone", "tel"]),
    website: cleanUrl(readValue(searchParams, data, ["website", "url"])),
    address: readValue(searchParams, data, ["address"]),
    avatarUrl: cleanUrl(readValue(searchParams, data, ["avatar_url", "avatarUrl", "avatar"])),
    social: readSocial(searchParams, data),
  };

  const hasData = Boolean(
    profile.fullName ||
      profile.email ||
      profile.phone ||
      profile.website ||
      profile.company ||
      profile.bio ||
      profile.avatarUrl ||
      Object.keys(profile.social).length,
  );

  return {
    profile,
    hasData,
  };
}

export function getEcardLocale(searchParams: EcardSearchParams): EcardLocale {
  const locale =
    firstParam(searchParams.lang) ??
    firstParam(searchParams.locale) ??
    firstParam(searchParams.language);

  return locale?.toLowerCase() === "en" ? "en" : "vi";
}

function escapeVCard(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function vCardLine(name: string, value?: string) {
  return value ? `${name}:${escapeVCard(value)}` : undefined;
}

export function buildVCard(profile: EcardProfile) {
  const org = [profile.company, profile.department]
    .map((value) => (value ? escapeVCard(value) : ""))
    .join(";");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    profile.fullName ? `N:${escapeVCard(profile.fullName)};;;;` : undefined,
    vCardLine("FN", profile.fullName),
    org.replace(/;/g, "") ? `ORG:${org}` : undefined,
    vCardLine("TITLE", profile.jobTitle),
    vCardLine("EMAIL;TYPE=INTERNET", profile.email),
    vCardLine("TEL;TYPE=CELL", profile.phone),
    vCardLine("URL;TYPE=WORK", profile.website),
    profile.avatarUrl ? `PHOTO;VALUE=URI:${escapeVCard(profile.avatarUrl)}` : undefined,
    profile.address ? `ADR;TYPE=WORK:;;${escapeVCard(profile.address)};;;;` : undefined,
    profile.bio ? `NOTE:${escapeVCard(profile.bio)}` : undefined,
    ...Object.entries(profile.social).map(
      ([key, url]) => `URL;TYPE=${escapeVCard(key.toUpperCase())}:${escapeVCard(url)}`,
    ),
    `REV:${new Date().toISOString()}`,
    "END:VCARD",
  ].filter(Boolean);

  return `${lines.join("\r\n")}\r\n`;
}

export function buildEcardShareUrl(profile: EcardProfile, locale: EcardLocale = "vi") {
  const params = new URLSearchParams();

  if (locale === "en") {
    params.set("lang", locale);
  }

  const entries: Array<[string, string | undefined]> = [
    ["label", profile.label],
    ["bio", profile.bio],
    ["full_name", profile.fullName],
    ["job_title", profile.jobTitle],
    ["company", profile.company],
    ["department", profile.department],
    ["email", profile.email],
    ["phone", profile.phone],
    ["website", profile.website],
    ["address", profile.address],
    ["avatar_url", profile.avatarUrl],
  ];

  for (const [key, value] of entries) {
    if (value) {
      params.set(key, value);
    }
  }

  if (Object.keys(profile.social).length > 0) {
    params.set("social", JSON.stringify(profile.social));
  }

  const query = params.toString();
  return absoluteUrl(query ? `/ecard?${query}` : "/ecard");
}

export function getEcardInitials(fullName: string) {
  const initials = fullName
    .split(" ")
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return initials || "MK";
}

export function getVCardFileName(fullName: string) {
  const normalized = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${normalized || "mk-ecard"}.vcf`;
}
