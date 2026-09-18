import { adminDb } from "@/lib/firebase/admin";
import { errorResponse, verifyBearerToken } from "@/lib/firebase/verify-request";

// Called by the app when a user deletes their account, before the Auth user
// is removed: purges the device registry and login history for that uid.
// (login_events also expire on their own via the Firestore TTL policy.)

const COLLECTIONS = ["devices", "login_events"] as const;
const BATCH_SIZE = 400;

export async function DELETE(request: Request) {
  try {
    const decoded = await verifyBearerToken(request);
    const db = adminDb();
    const deleted: Record<(typeof COLLECTIONS)[number], number> = {
      devices: 0,
      login_events: 0,
    };

    for (const name of COLLECTIONS) {
      for (;;) {
        const snap = await db
          .collection(name)
          .where("uid", "==", decoded.uid)
          .limit(BATCH_SIZE)
          .get();

        if (snap.empty) {
          break;
        }

        const batch = db.batch();
        snap.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        deleted[name] += snap.size;
      }
    }

    return Response.json({ ok: true, deleted });
  } catch (error) {
    return errorResponse(error);
  }
}
