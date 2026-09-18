import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { errorResponse, requireAdmin } from "@/lib/firebase/verify-request";
import { absoluteUrl } from "@/lib/seo";
import { ensureEcardShareLink, SHARE_CODE_PATTERN } from "@/lib/share-links";

// Admin view of every short link, plus a backfill that gives each eCard
// preset without a link one (presets created by app versions that predate
// short links). Only admins (custom claim, revocation checked) may call it.

const MAX_LISTED = 300;
const MAX_SCANNED_PRESETS = 3000;
const BACKFILL_BATCH = 200;
const CONCURRENCY = 10;

async function findPresetsMissingLink() {
  const db = adminDb();
  const presets = await db
    .collection("user_ecards")
    .select("share_code")
    .limit(MAX_SCANNED_PRESETS)
    .get();

  const missing: string[] = [];
  const refs = presets.docs.map((doc) => {
    const code = doc.get("share_code");
    return {
      id: doc.id,
      code:
        typeof code === "string" && SHARE_CODE_PATTERN.test(code) ? code : null,
    };
  });

  const withCode = refs.filter((ref) => ref.code);
  const links = withCode.length
    ? await db.getAll(
        ...withCode.map((ref) => db.collection("share_links").doc(ref.code!)),
      )
    : [];
  const validCodes = new Set(
    links.filter((link) => link.exists).map((link) => link.id),
  );

  for (const ref of refs) {
    if (!ref.code || !validCodes.has(ref.code)) {
      missing.push(ref.id);
    }
  }

  return { total: refs.length, missing };
}

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const db = adminDb();

    const [linksSnap, scan] = await Promise.all([
      db
        .collection("share_links")
        .orderBy("created_at", "desc")
        .limit(MAX_LISTED)
        .get(),
      findPresetsMissingLink(),
    ]);

    const presetRefs = linksSnap.docs.map((doc) =>
      db.collection("user_ecards").doc(doc.get("preset_id") as string),
    );
    const presets = presetRefs.length ? await db.getAll(...presetRefs) : [];

    const uids = [...new Set(linksSnap.docs.map((doc) => doc.get("uid") as string))];
    const emails = new Map<string, string>();
    for (let index = 0; index < uids.length; index += 100) {
      const result = await adminAuth().getUsers(
        uids.slice(index, index + 100).map((uid) => ({ uid })),
      );
      for (const user of result.users) {
        emails.set(user.uid, user.email ?? "");
      }
    }

    const links = linksSnap.docs.map((doc, index) => {
      const preset = presets[index];
      const createdAt = doc.get("created_at") as { toDate?: () => Date } | undefined;
      return {
        code: doc.id,
        url: absoluteUrl(`/c/${doc.id}`),
        preset_id: doc.get("preset_id") as string,
        uid: doc.get("uid") as string,
        owner_email: emails.get(doc.get("uid") as string) ?? "",
        full_name: preset?.exists ? (preset.get("full_name") as string) ?? "" : "",
        label: preset?.exists ? (preset.get("label") as string) ?? "" : "",
        preset_missing: !preset?.exists,
        created_at: createdAt?.toDate?.().toISOString() ?? null,
      };
    });

    return Response.json({
      links,
      presets_total: scan.total,
      presets_missing_link: scan.missing.length,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);

    const { missing } = await findPresetsMissingLink();
    const batch = missing.slice(0, BACKFILL_BATCH);

    let created = 0;
    for (let index = 0; index < batch.length; index += CONCURRENCY) {
      const results = await Promise.all(
        batch.slice(index, index + CONCURRENCY).map((id) => ensureEcardShareLink(id)),
      );
      created += results.filter((result) => result?.created).length;
    }

    return Response.json({
      created,
      remaining: Math.max(missing.length - batch.length, 0),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
