import { ImageResponse } from "next/og";
import { getOpportunityById } from "@/lib/gis/opportunities";
import { PROGRAM_INFO } from "@/lib/programs";
import { logoDataUrl } from "@/lib/og";
import { PROGRAM_STYLE } from "@/lib/program-style";

export const alt = "AIESEC opportunity in Poland";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [res, logo] = await Promise.all([getOpportunityById(id), logoDataUrl("ink")]);
  const o = res.ok ? res.data : null;
  const info = o ? PROGRAM_INFO[o.program] : null;
  const color = o ? PROGRAM_STYLE[o.program].hex : "#fc3a3a";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", color: "#151515", fontFamily: "sans-serif" }}>
        <div style={{ width: 36, background: color, display: "flex" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {info ? (
              <span style={{ background: color, color: "#151515", padding: "10px 24px", borderRadius: 12, fontSize: 30, fontWeight: 800 }}>{info.name}</span>
            ) : (
              <span />
            )}
            <img src={logo} width={150} height={134} alt="" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 80, fontWeight: 900, lineHeight: 1.02 }}>{o?.title ?? "Opportunity in Poland"}</div>
            <div style={{ fontSize: 40, marginTop: 18, color: "#d92b2b", fontWeight: 800 }}>{o?.city ? `${o.city}, Poland` : "Poland"}</div>
          </div>
          <div style={{ fontSize: 28, color: "#5c5c5c" }}>{o?.organisation ?? "Hosted by AIESEC in Poland"}</div>
        </div>
      </div>
    ),
    size,
  );
}
