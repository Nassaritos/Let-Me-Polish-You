import Image from "next/image";
import type { Program } from "@/lib/programs";
import gvColor from "@/public/brand/gv-color.png";
import gvWhite from "@/public/brand/gv-white.png";
import gtaColor from "@/public/brand/gta-color.png";
import gtaWhite from "@/public/brand/gta-white.png";
import gteColor from "@/public/brand/gte-color.png";
import gteWhite from "@/public/brand/gte-white.png";

const LOGOS = {
  igv: { color: gvColor, white: gvWhite, name: "Global Volunteer" },
  igta: { color: gtaColor, white: gtaWhite, name: "Global Talent" },
  igte: { color: gteColor, white: gteWhite, name: "Global Teacher" },
} as const;

/** Official AIESEC programme logos (logos.aiesec.org). */
export function ProgramLogo({ program, tone = "color", height = 40, className = "" }: { program: Program; tone?: "color" | "white"; height?: number; className?: string }) {
  const logo = LOGOS[program];
  const src = logo[tone];
  return (
    <Image
      src={src}
      alt={`AIESEC ${logo.name}`}
      height={height}
      width={Math.round((height * src.width) / src.height)}
      className={className}
    />
  );
}
