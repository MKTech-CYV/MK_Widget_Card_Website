import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Public web config, not a secret: access is enforced by Firebase Auth and
// Firestore Security Rules. Values come from Firebase project
// mk-widget-card-84, web app "MK Widget Card - Admin". Each NEXT_PUBLIC_*
// override must be referenced statically so Next.js can inline it at build.
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyBdtF_7T4cSQQ0jNMUKAw1hhqIMc8noUSE",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "mk-widget-card-84.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "mk-widget-card-84",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "mk-widget-card-84.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "896185084209",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:896185084209:web:f861a28bce6e0b290ba810",
};

export function getFirebasePublicConfig() {
  return {
    ...firebaseConfig,
    isConfigured: Boolean(firebaseConfig.apiKey && firebaseConfig.projectId),
  };
}

function getFirebaseApp(): FirebaseApp {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

// Browser-only: the admin console is a client component that is also
// pre-rendered on the server, where there is no auth session to manage.
export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined" || !getFirebasePublicConfig().isConfigured) {
    return null;
  }

  return getAuth(getFirebaseApp());
}

export function getFirebaseDb(): Firestore | null {
  if (typeof window === "undefined" || !getFirebasePublicConfig().isConfigured) {
    return null;
  }

  return getFirestore(getFirebaseApp());
}
