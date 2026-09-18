import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import {
  errorResponse,
  HttpError,
  verifyBearerToken,
} from "@/lib/firebase/verify-request";
import { SHARE_CODE_PATTERN } from "@/lib/share-links";

// Revokes a short link owned by the caller.

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const decoded = await verifyBearerToken(request);
    const { code } = await params;

    if (!SHARE_CODE_PATTERN.test(code)) {
      throw new HttpError(404, "Link not found.");
    }

    const db = adminDb();
    const linkRef = db.collection("share_links").doc(code);
    const link = await linkRef.get();
    if (!link.exists || link.get("uid") !== decoded.uid) {
      throw new HttpError(404, "Link not found.");
    }

    const presetId = link.get("preset_id") as string | undefined;
    await linkRef.delete();

    // Best effort: the preset may already be gone.
    if (presetId) {
      const presetRef = db.collection("user_ecards").doc(presetId);
      const preset = await presetRef.get();
      if (preset.exists && preset.get("share_code") === code) {
        await presetRef.update({ share_code: FieldValue.delete() });
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
