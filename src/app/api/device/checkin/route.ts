import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import {
  errorResponse,
  HttpError,
  verifyBearerToken,
} from "@/lib/firebase/verify-request";
import { getRequestGeo } from "@/lib/request-meta";

// Called by the mobile app after a sign-in ("login") and when a saved
// session is restored ("seen"). Identity comes from the verified ID token;
// IP and location come from the request headers. Clients never write the
// devices / login_events collections directly (Firestore rules deny it).

const RETENTION_DAYS = 180;
const DAY_MS = 24 * 60 * 60 * 1000;
const SEEN_MIN_INTERVAL_MS = 60 * 60 * 1000;
const LOGIN_DEDUPE_MS = 30 * 1000;
const INSTALL_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

function text(value: unknown, max: number) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(request: Request) {
  try {
    const decoded = await verifyBearerToken(request);

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      throw new HttpError(400, "Invalid JSON body.");
    }
    const input = body as Record<string, unknown>;

    const event =
      input.event === "login" || input.event === "seen" ? input.event : null;
    if (!event) {
      throw new HttpError(400, "Invalid event.");
    }

    const installId =
      typeof input.install_id === "string" ? input.install_id : "";
    if (!INSTALL_ID_PATTERN.test(installId)) {
      throw new HttpError(400, "Invalid install_id.");
    }

    const device = {
      platform: text(input.platform, 16),
      device_model: text(input.device_model, 80),
      device_brand: text(input.device_brand, 40),
      os_name: text(input.os_name, 24),
      os_version: text(input.os_version, 24),
      app_runtime_version: text(input.app_runtime_version, 24),
      update_id: text(input.update_id, 64),
      language: text(input.language, 16),
      timezone: text(input.timezone, 64),
    };

    const uid = decoded.uid;
    const email = decoded.email ?? null;
    const provider = decoded.firebase?.sign_in_provider ?? null;
    const geo = getRequestGeo(request);

    const db = adminDb();
    const deviceRef = db.collection("devices").doc(`${uid}_${installId}`);
    const snap = await deviceRef.get();

    const nowMs = Date.now();
    const lastSeenMs =
      (snap.get("last_seen_at") as Timestamp | undefined)?.toMillis() ?? 0;
    const lastLoginMs =
      (snap.get("last_login_at") as Timestamp | undefined)?.toMillis() ?? 0;

    if (event === "seen" && nowMs - lastSeenMs < SEEN_MIN_INTERVAL_MS) {
      return Response.json({ ok: true, skipped: true });
    }

    // A burst of explicit logins from one device inside 30s is recorded once.
    const isNewLogin = event === "login" && nowMs - lastLoginMs > LOGIN_DEDUPE_MS;

    const update: Record<string, unknown> = {
      uid,
      email,
      ...device,
      last_seen_at: FieldValue.serverTimestamp(),
      last_ip: geo.ip,
      last_country: geo.country,
      last_region: geo.region,
      last_city: geo.city,
    };

    if (!snap.exists) {
      update.install_id = installId;
      update.first_seen_at = FieldValue.serverTimestamp();
      update.login_count = 0;
    }

    if (isNewLogin) {
      update.last_login_at = FieldValue.serverTimestamp();
      update.login_count = FieldValue.increment(1);
    }

    const batch = db.batch();
    batch.set(deviceRef, update, { merge: true });

    if (isNewLogin) {
      batch.create(db.collection("login_events").doc(), {
        uid,
        email,
        provider,
        install_id: installId,
        platform: device.platform,
        device_model: device.device_model,
        os_version: device.os_version,
        app_runtime_version: device.app_runtime_version,
        ip: geo.ip,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        created_at: FieldValue.serverTimestamp(),
        expire_at: Timestamp.fromMillis(nowMs + RETENTION_DAYS * DAY_MS),
      });
    }

    await batch.commit();

    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
