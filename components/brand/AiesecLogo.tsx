import Image from "next/image";
import blue from "@/public/brand/aiesec-blue.png";
import white from "@/public/brand/aiesec-white.png";

/** Official AIESEC logo (logos.aiesec.org). */
export function AiesecLogo({ tone = "white", className = "", width = 116 }: { tone?: "white" | "blue"; className?: string; width?: number }) {
  return (
    <Image
      src={tone === "white" ? white : blue}
      alt="AIESEC"
      width={width}
      height={Math.round((width * 259) / 1265)}
      className={className}
      priority
    />
  );
}
