import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Server-only (route handlers / server components). Never import from a
// "use client" module: it holds the service account credentials.
//
// FIREBASE_SERVICE_ACCOUNT_JSON accepts either the raw service account JSON
// or that JSON base64-encoded (handy for single-line env var fields).

export class AdminNotConfiguredError extends Error {
  constructor() {
    super("FIREBASE_SERVICE_ACCOUNT_JSON is not configured.");
    this.name = "AdminNotConfiguredError";
  }
}

export function hasAdminCredentials() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim());
}

function readServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    throw new AdminNotConfiguredError();
  }

  const json = raw.startsWith("{")
    ? raw
    : Buffer.from(raw, "base64").toString("utf8");
  const parsed = JSON.parse(json) as {
    project_id: string;
    client_email: string;
    private_key: string;
  };

  return {
    projectId: parsed.project_id,
    clientEmail: parsed.client_email,
    // Env var UIs often store the key's newlines as literal "\n".
    privateKey: parsed.private_key.replace(/\\n/g, "\n"),
  };
}

export function getAdminApp(): App {
  return (
    getApps()[0] ?? initializeApp({ credential: cert(readServiceAccount()) })
  );
}

export function adminAuth() {
  return getAuth(getAdminApp());
}

export function adminDb() {
  return getFirestore(getAdminApp());
}
