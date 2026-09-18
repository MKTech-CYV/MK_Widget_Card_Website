import type { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth, AdminNotConfiguredError } from "./admin";

// Server-only helpers shared by the /api route handlers.

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

function isFirebaseAuthError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string" &&
    (error as { code: string }).code.startsWith("auth/")
  );
}

// Verifies the Firebase ID token in "Authorization: Bearer <token>". The
// caller's identity (uid/email/provider) must always come from the returned
// token, never from the request body.
export async function verifyBearerToken(
  request: Request,
  options: { checkRevoked?: boolean } = {},
): Promise<DecodedIdToken> {
  const match = (request.headers.get("authorization") ?? "").match(
    /^Bearer\s+(.+)$/i,
  );
  if (!match) {
    throw new HttpError(401, "Missing bearer token.");
  }

  try {
    return await adminAuth().verifyIdToken(match[1], options.checkRevoked);
  } catch (error) {
    // Anything that is not a token problem (bad service account, network) is
    // a server error, not a 401.
    if (isFirebaseAuthError(error)) {
      throw new HttpError(401, "Invalid or expired token.");
    }
    throw error;
  }
}

// Admin routes also check revocation so a revoked admin loses access
// immediately instead of when their ID token expires (up to 1 hour).
export async function requireAdmin(request: Request) {
  const decoded = await verifyBearerToken(request, { checkRevoked: true });
  if (decoded.admin !== true) {
    throw new HttpError(403, "Admin permission required.");
  }
  return decoded;
}

export function errorResponse(error: unknown) {
  if (error instanceof HttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof AdminNotConfiguredError) {
    return Response.json({ error: "Server is not configured." }, { status: 503 });
  }

  console.error(error);
  return Response.json({ error: "Internal error." }, { status: 500 });
}
