// Client IP and approximate location for a request handled on Vercel.
// Vercel overwrites x-forwarded-for / x-real-ip with the real client address
// (clients cannot spoof them) and adds the x-vercel-ip-* geo headers. All
// values are null when running locally.

function decode(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getRequestGeo(request: Request) {
  const headers = request.headers;
  const ip =
    headers.get("x-real-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null;

  return {
    ip,
    country: headers.get("x-vercel-ip-country"),
    region: headers.get("x-vercel-ip-country-region"),
    city: decode(headers.get("x-vercel-ip-city")),
    ipTimezone: headers.get("x-vercel-ip-timezone"),
  };
}
