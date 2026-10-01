import { ImageResponse } from "next/og";
import { logoDataUrl } from "@/lib/og";

export const alt = "Let Me Polish You — volunteer, intern or teach in Poland with AIESEC";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logo = await logoDataUrl("white");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 56, background: "#fc3a3a", color: "#fff", padding: 72, fontFamily: "sans-serif" }}>
        <img src={logo} width={420} height={376} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.02 }}>Volunteer, intern or teach in Poland.</div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>Global Volunteer · Global Talent · Global Teacher</div>
          <div style={{ fontSize: 26, opacity: 0.9 }}>Live opportunities hosted by AIESEC in Poland</div>
        </div>
      </div>
    ),
    size,
  );
}
