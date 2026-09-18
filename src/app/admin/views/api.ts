import { getFirebaseAuth } from "@/lib/firebase/client";

// Calls an /api route on this site with the signed-in admin's ID token.
export async function adminFetch(
  path: string,
  init: { method: string; body?: unknown },
) {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) {
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }

  const token = await user.getIdToken();
  const response = await fetch(path, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  const data: { error?: unknown } = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Yêu cầu thất bại.",
    );
  }

  return data;
}
