import { ImageResponse } from "next/og";

export const alt = "Let Me Polish You — volunteer, intern or teach in Poland with AIESEC";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#037ef3", color: "#fff", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 30, fontWeight: 700, display: "flex" }}>AIESEC in Poland</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 128, fontWeight: 900, lineHeight: 0.9, letterSpacing: -2 }}>
          <span>LET ME</span>
          <span style={{ color: "#ffc845" }}>POLISH</span>
          <span>YOU.</span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 30, fontWeight: 700 }}>
          <span style={{ background: "#f85a40", color: "#0a1f44", padding: "8px 22px", borderRadius: 999 }}>Give · iGV</span>
          <span style={{ background: "#0cb9c1", color: "#0a1f44", padding: "8px 22px", borderRadius: 999 }}>Grow · iGTa</span>
          <span style={{ background: "#f48924", color: "#0a1f44", padding: "8px 22px", borderRadius: 999 }}>Teach · iGTe</span>
        </div>
      </div>
    ),
    size,
  );
}
