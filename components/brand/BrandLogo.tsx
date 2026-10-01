import Image from "next/image";
import ink from "@/public/brand/lmpy-ink.png";
import white from "@/public/brand/lmpy-white.png";

/** The campaign logo: Poland outline, "let me POLISH you", red swoosh. */
export function BrandLogo({
  tone = "ink",
  width = 120,
  className = "",
  priority = false,
}: {
  tone?: "ink" | "white";
  width?: number;
  className?: string;
  priority?: boolean;
}) {
  const src = tone === "white" ? white : ink;
  return (
    <Image
      src={src}
      alt="Let Me Polish You"
      width={width}
      height={Math.round((width * src.height) / src.width)}
      className={className}
      priority={priority}
    />
  );
}
