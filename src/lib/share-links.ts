import { randomInt } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { EcardSearchParams } from "@/lib/ecard";

// Server-only. Short links (mktechvn.com/c/{code}) point at a live eCard
// preset instead of embedding the card in the URL: share_links/{code} holds
// { uid, preset_id } and the page reads the preset with the Admin SDK on each
// visit, so edits apply immediately and revoking = deleting the link doc.

export const SHARE_CODE_PATTERN = /^[A-Za-z0-9]{8}$/;

// No 0/O/1/l/I so codes stay readable when typed or read aloud.
const CODE_ALPHABET =
  "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

export function generateShareCode() {
  let code = "";
  for (let index = 0; index < 8; index += 1) {
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return code;
}

function text(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function internationalPhone(countryCode: string, phone?: string) {
  const digits = phone?.replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) {
    return undefined;
  }

  return `+${countryCode.replace(/\D/g, "") || "84"}${digits}`;
}

const SOCIAL_KEYS = [
  "linkedin",
  "facebook",
  "zalo",
  "whatsapp",
  "telegram",
  "instagram",
  "tiktok",
  "x",
  "youtube",
  "github",
] as const;

// Maps a user_ecards document to the query-param shape parseEcardProfile()
// already understands, exposing only the fields the long share link exposes.
export function presetToEcardQuery(
  preset: Record<string, unknown>,
): EcardSearchParams {
  const social = (preset.social ?? {}) as Record<string, unknown>;
  const countryCode =
    text(preset.phone_country_code) ?? text(social.countryCode) ?? "84";

  const socialOut: Record<string, string> = {};
  let hasSocial = false;
  for (const key of SOCIAL_KEYS) {
    const value = text(social[key]);
    if (value) {
      socialOut[key] = value;
      hasSocial = true;
    }
  }

  if (hasSocial) {
    socialOut.countryCode = countryCode;
    socialOut.zaloCountryCode = text(social.zaloCountryCode) ?? countryCode;
    socialOut.whatsappCountryCode =
      text(social.whatsappCountryCode) ?? countryCode;
  }

  // Only real hosted images; local base64 data URIs would bloat the page.
  const avatarCandidate =
    text(preset.avatar_url) ?? text(social.avatarUrl) ?? text(social.avatar);
  const avatarUrl =
    avatarCandidate && /^https?:\/\//i.test(avatarCandidate)
      ? avatarCandidate
      : undefined;

  return {
    label: text(preset.label),
    full_name: text(preset.full_name),
    job_title: text(preset.job_title),
    company: text(preset.company),
    department: text(preset.department),
    email: text(preset.email),
    phone: internationalPhone(countryCode, text(preset.phone)),
    website: text(preset.website),
    address: text(preset.address),
    avatar_url: avatarUrl,
    bio: text(social.bio),
    about: text(preset.about),
    social: hasSocial ? JSON.stringify(socialOut) : undefined,
  };
}

export async function loadSharedEcard(code: string) {
  if (!SHARE_CODE_PATTERN.test(code)) {
    return null;
  }

  const db = adminDb();
  const link = await db.collection("share_links").doc(code).get();
  if (!link.exists) {
    return null;
  }

  const presetId = link.get("preset_id") as string | undefined;
  if (!presetId) {
    return null;
  }

  const preset = await db.collection("user_ecards").doc(presetId).get();
  if (!preset.exists || preset.get("user_id") !== link.get("uid")) {
    return null;
  }

  return { query: presetToEcardQuery(preset.data() ?? {}) };
}

class CodeCollisionError extends Error {}

const MAX_CODE_ATTEMPTS = 5;

// Returns the preset's short link, creating it (share_links/{code} plus
// user_ecards/{id}.share_code) if it does not have a valid one yet. Runs in a
// transaction so concurrent callers (save + share) end up with one code.
// Returns null when the preset is missing or, if `expectedUid` is given, not
// owned by that user.
export async function ensureEcardShareLink(
  presetId: string,
  expectedUid?: string,
): Promise<{ code: string; created: boolean } | null> {
  const db = adminDb();
  const presetRef = db.collection("user_ecards").doc(presetId);

  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt += 1) {
    const code = generateShareCode();

    try {
      return await db.runTransaction(async (tx) => {
        const preset = await tx.get(presetRef);
        const uid = preset.get("user_id") as string | undefined;
        if (!preset.exists || !uid || (expectedUid && uid !== expectedUid)) {
          return null;
        }

        const existing = preset.get("share_code");
        if (typeof existing === "string" && SHARE_CODE_PATTERN.test(existing)) {
          const link = await tx.get(db.collection("share_links").doc(existing));
          if (link.exists && link.get("uid") === uid && link.get("preset_id") === presetId) {
            return { code: existing, created: false };
          }
        }

        const linkRef = db.collection("share_links").doc(code);
        if ((await tx.get(linkRef)).exists) {
          throw new CodeCollisionError();
        }

        tx.create(linkRef, {
          uid,
          type: "ecard",
          preset_id: presetId,
          created_at: FieldValue.serverTimestamp(),
        });
        tx.update(presetRef, { share_code: code });
        return { code, created: true };
      });
    } catch (error) {
      if (error instanceof CodeCollisionError) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Could not allocate a share code.");
}
