import { ImageResponse } from "next/og";
import { getOpportunityById } from "@/lib/gis/opportunities";
import { PROGRAM_INFO } from "@/lib/programs";
import { PROGRAM_STYLE } from "@/lib/program-style";

export const alt = "AIESEC opportunity in Poland";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getOpportunityById(id);
  const o = res.ok ? res.data : null;
  const info = o ? PROGRAM_INFO[o.program] : null;
  const color = o ? PROGRAM_STYLE[o.program].hex : "#037ef3";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a1f44", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ width: 40, background: color, display: "flex" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 30, fontWeight: 700 }}>
            {info && <span style={{ background: color, color: "#0a1f44", padding: "8px 22px", borderRadius: 999 }}>{`${info.verb} · ${info.code}`}</span>}
            <span>Let Me Polish You · AIESEC in Poland</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1 }}>{o?.title ?? "Opportunity in Poland"}</div>
            <div style={{ fontSize: 40, marginTop: 20, color: "#ffc845", fontWeight: 700 }}>{o?.city ? `${o.city}, Poland` : "Poland"}</div>
          </div>
          <div style={{ fontSize: 28, opacity: 0.85 }}>{o?.organisation ?? ""}</div>
        </div>
      </div>
    ),
    size,
  );
}
