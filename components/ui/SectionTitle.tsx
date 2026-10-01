import { SwooshWord } from "@/components/brand/Swoosh";

/**
 * Section headings in the logo's grammar: a thin script lead-in ("let me …")
 * and heavy caps with the red swoosh through the key word.
 */
export function SectionTitle({
  script,
  before,
  swoosh,
  after,
  id,
  as: Tag = "h2",
  size = "lg",
  className = "",
  tone = "ink",
  accent,
}: {
  script?: string;
  before?: string;
  swoosh: string;
  after?: string;
  id?: string;
  as?: "h1" | "h2";
  size?: "md" | "lg" | "xl";
  className?: string;
  tone?: "ink" | "white";
  /** Swoosh + script colour (hex). Defaults to brand red. */
  accent?: string;
}) {
  const sizes = {
    md: "text-[clamp(2rem,4.4vw,3.6rem)]",
    lg: "text-[clamp(2.4rem,6vw,5.4rem)]",
    xl: "text-[clamp(2.8rem,8vw,7.4rem)]",
  };
  return (
    <Tag id={id} className={`${className} ${tone === "white" ? "text-white" : "text-ink"}`}>
      {script && (
        <span className="script block text-[clamp(2rem,3.6vw,3.2rem)] text-red" style={accent ? { color: accent } : undefined}>
          {script}
        </span>
      )}
      <span className={`display-caps block ${sizes[size]}`}>
        {before && <>{before} </>}
        <SwooshWord color={accent ?? (tone === "white" ? "#ffffff" : undefined)}>{swoosh}</SwooshWord>
        {after && <> {after}</>}
      </span>
    </Tag>
  );
}
