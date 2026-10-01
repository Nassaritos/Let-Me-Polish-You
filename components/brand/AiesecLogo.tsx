import Image from "next/image";
import black from "@/public/brand/aiesec-black.png";
import blue from "@/public/brand/aiesec-blue.png";
import white from "@/public/brand/aiesec-white.png";

/** Official AIESEC logo (logos.aiesec.org). Blue only on the "What's AIESEC?" page. */
export function AiesecLogo({ tone = "black", className = "", width = 96 }: { tone?: "black" | "white" | "blue"; className?: string; width?: number }) {
  return (
    <Image
      src={tone === "white" ? white : tone === "blue" ? blue : black}
      alt="AIESEC"
      width={width}
      height={Math.round((width * 259) / 1265)}
      className={className}
    />
  );
}
