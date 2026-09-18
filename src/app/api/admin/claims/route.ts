import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import {
  errorResponse,
  HttpError,
  requireAdmin,
} from "@/lib/firebase/verify-request";

// Grant or revoke the `admin` custom claim for a user (looked up by email).
// Only existing admins can call this. Also mirrors the admin list into the
// admin_users collection so the admin console can list admins.

export async function POST(request: Request) {
  try {
    const caller = await requireAdmin(request);

    const body: unknown = await request.json().catch(() => null);
    const input = (body ?? {}) as { email?: unknown; admin?: unknown };
    const email =
      typeof input.email === "string" ? input.email.trim().toLowerCase() : "";

    if (!email || typeof input.admin !== "boolean") {
      throw new HttpError(400, "Cần có email và admin (true/false).");
    }

    const makeAdmin = input.admin;
    const auth = adminAuth();
    const db = adminDb();

    let target;
    try {
      target = await auth.getUserByEmail(email);
    } catch (error) {
      if ((error as { code?: string }).code === "auth/user-not-found") {
        throw new HttpError(
          404,
          "Email này chưa có tài khoản. Người đó cần đăng nhập app hoặc được tạo tài khoản trước.",
        );
      }
      throw error;
    }

    const claims = { ...(target.customClaims ?? {}) };
    const adminRef = db.collection("admin_users").doc(target.uid);

    if (makeAdmin) {
      // An account created with an unverified email could be squatted by
      // someone else, so admin is only ever granted to verified emails
      // (Google/Apple sign-ins are verified by the provider).
      if (!target.emailVerified) {
        throw new HttpError(
          400,
          "Email này chưa được xác minh. Người đó cần đăng nhập bằng Google/Apple hoặc xác minh email trước khi được cấp quyền admin.",
        );
      }

      claims.admin = true;
      await auth.setCustomUserClaims(target.uid, claims);
      await adminRef.set(
        {
          email: target.email ?? email,
          granted_by: caller.email ?? caller.uid,
          created_at: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    } else {
      const adminCount = (await db.collection("admin_users").count().get()).data()
        .count;
      if (target.customClaims?.admin === true && adminCount <= 1) {
        throw new HttpError(400, "Không thể thu hồi quản trị viên cuối cùng.");
      }

      delete claims.admin;
      await auth.setCustomUserClaims(target.uid, claims);
      await adminRef.delete();
    }

    // Invalidate existing sessions so the new claim state applies right away.
    await auth.revokeRefreshTokens(target.uid);

    return Response.json({ ok: true, uid: target.uid, admin: makeAdmin });
  } catch (error) {
    return errorResponse(error);
  }
}
