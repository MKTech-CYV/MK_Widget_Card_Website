import { ImageResponse } from "next/og";

export const alt = "MK Widget Card - eCard, QR and Widget ecosystem";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 42%, #064e3b 100%)",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: 72,
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: 28,
            display: "flex",
            flexDirection: "column",
            gap: 28,
            height: "100%",
            justifyContent: "center",
            padding: 56,
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#67e8f9",
              fontSize: 28,
              letterSpacing: 8,
              textTransform: "uppercase",
            }}
          >
            Digital Identity 2026
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1,
              maxWidth: 920,
            }}
          >
            MK Widget Card
          </div>
          <div
            style={{
              color: "#cbd5e1",
              fontSize: 34,
              lineHeight: 1.35,
              maxWidth: 900,
            }}
          >
            Modern eCard, smart QR code and home screen widget ecosystem for iOS and Android.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
