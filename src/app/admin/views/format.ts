import type { Timestamp } from "firebase/firestore";

export function toDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as Timestamp).toDate === "function"
  ) {
    return (value as Timestamp).toDate();
  }

  const date = new Date(value as string | number);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(value: unknown) {
  const date = toDate(value);
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatLocation(
  country?: string | null,
  region?: string | null,
  city?: string | null,
) {
  const parts = [city, region, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

const providerLabels: Record<string, string> = {
  "google.com": "Google",
  "apple.com": "Apple",
  password: "Email",
};

export function providerLabel(provider?: string | null) {
  if (!provider) {
    return "—";
  }

  return providerLabels[provider] ?? provider;
}

export function formatDevice(brand?: string | null, model?: string | null) {
  const parts = [brand, model].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "—";
}

// Value for <input type="datetime-local"> (local time, no timezone suffix).
export function toDateTimeLocalValue(value: unknown) {
  const date = toDate(value);
  if (!date) {
    return "";
  }

  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDateTimeLocalValue(value: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Đã xảy ra lỗi. Vui lòng thử lại.";
}
