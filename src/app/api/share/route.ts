import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import {
  errorResponse,
  HttpError,
  verifyBearerToken,
} from "@/lib/firebase/verify-request";
import { absoluteUrl } from "@/lib/seo";
import { generateShareCode, SHARE_CODE_PATTERN } from "@/lib/share-links";

// Creates (or returns the existing) short link for one of the caller's eCard
// presets. Ownership is checked against the preset document itself.

const MAX_ATTEMPTS = 5;
const FIRESTORE_ALREADY_EXISTS = 6;

export async function POST(request: Request) {
  try {
    const decoded = await verifyBearerToken(request);

    const body: unknown = await request.json().catch(() => null);
    const presetId =
      typeof (body as { preset_id?: unknown } | null)?.preset_id === "string"
        ? (body as { preset_id: string }).preset_id
        : "";
    if (!presetId || presetId.length > 128 || presetId.includes("/")) {
      throw new HttpError(400, "Invalid preset_id.");
    }

    const db = adminDb();
    const presetRef = db.collection("user_ecards").doc(presetId);
    const preset = await presetRef.get();
    if (!preset.exists || preset.get("user_id") !== decoded.uid) {
      throw new HttpError(404, "Preset not found.");
    }

    const existingCode = preset.get("share_code");
    if (typeof existingCode === "string" && SHARE_CODE_PATTERN.test(existingCode)) {
      const link = await db.collection("share_links").doc(existingCode).get();
      if (
        link.exists &&
        link.get("uid") === decoded.uid &&
        link.get("preset_id") === presetId
      ) {
        return Response.json({
          code: existingCode,
          url: absoluteUrl(`/c/${existingCode}`),
        });
      }
    }

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const code = generateShareCode();

      try {
        await db.collection("share_links").doc(code).create({
          uid: decoded.uid,
          type: "ecard",
          preset_id: presetId,
          created_at: FieldValue.serverTimestamp(),
        });
      } catch (error) {
        if ((error as { code?: number }).code === FIRESTORE_ALREADY_EXISTS) {
          continue;
        }
        throw error;
      }

      await presetRef.update({ share_code: code });
      return Response.json({ code, url: absoluteUrl(`/c/${code}`) });
    }

    throw new HttpError(503, "Could not allocate a share code.");
  } catch (error) {
    return errorResponse(error);
  }
}
