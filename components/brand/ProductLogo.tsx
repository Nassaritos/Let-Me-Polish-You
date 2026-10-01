import Image from "next/image";
import type { Program } from "@/lib/programs";
import gvColor from "@/public/brand/products/gv-color.png";
import gvWhite from "@/public/brand/products/gv-white.png";
import gvBlack from "@/public/brand/products/gv-black.png";
import gtaColor from "@/public/brand/products/gta-color.png";
import gtaWhite from "@/public/brand/products/gta-white.png";
import gtaBlack from "@/public/brand/products/gta-black.png";
import gteColor from "@/public/brand/products/gte-color.png";
import gteWhite from "@/public/brand/products/gte-white.png";
import gteBlack from "@/public/brand/products/gte-black.png";

const LOGOS = {
  igv: { color: gvColor, white: gvWhite, black: gvBlack, name: "Global Volunteer" },
  igta: { color: gtaColor, white: gtaWhite, black: gtaBlack, name: "Global Talent" },
  igte: { color: gteColor, white: gteWhite, black: gteBlack, name: "Global Teacher" },
} as const;

/** Official AIESEC product logos (logos.aiesec.org). */
export function ProductLogo({
  program,
  tone = "color",
  height = 40,
  className = "",
  decorative = false,
}: {
  program: Program;
  tone?: "color" | "white" | "black";
  height?: number;
  className?: string;
  /** true when the product name is already written next to it */
  decorative?: boolean;
}) {
  const logo = LOGOS[program];
  const src = logo[tone];
  return (
    <Image
      src={src}
      alt={decorative ? "" : `AIESEC ${logo.name}`}
      height={height}
      width={Math.round((height * src.width) / src.height)}
      className={className}
    />
  );
}
