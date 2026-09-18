import {
  errorResponse,
  HttpError,
  verifyBearerToken,
} from "@/lib/firebase/verify-request";
import { absoluteUrl } from "@/lib/seo";
import { ensureEcardShareLink, ShareQuotaError } from "@/lib/share-links";

// Creates (or returns the existing) short link for one of the caller's eCard
// presets. Ownership is checked against the preset document itself.

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

    const result = await ensureEcardShareLink(presetId, decoded.uid).catch(
      (error: unknown) => {
        if (error instanceof ShareQuotaError) {
          throw new HttpError(429, "Too many share links.");
        }
        throw error;
      },
    );
    if (!result) {
      throw new HttpError(404, "Preset not found.");
    }

    return Response.json({
      code: result.code,
      url: absoluteUrl(`/c/${result.code}`),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
