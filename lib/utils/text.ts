const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
};

/**
 * GIS text fields may contain HTML or Markdown-ish markup. We never render it
 * as HTML; convert to plain text while keeping paragraph and list breaks.
 */
export function toPlainText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\r\n?/g, "\n")
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|ul|ol)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
      if (e[0] === "#") {
        const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : m;
      }
      return ENTITIES[e.toLowerCase()] ?? m;
    })
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function paragraphs(text?: string): string[] {
  return (text ?? "")
    .split(/\n{2,}|\n(?=•)/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function pluralize(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * Re-join lines that were broken mid-sentence (GIS often stores one <p> per
 * visual line of a pasted PDF). Keeps real paragraph and bullet breaks.
 */
export function reflow(text: string): string {
  const out: string[] = [];
  let gap = false;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) {
      gap = true;
      continue;
    }
    const prev = out[out.length - 1];
    const sentenceEnded = prev === undefined || /[.!?:;)"”]$/.test(prev);
    const startsLower = /^[a-ząćęłńóśźż(]/.test(line);
    const continues = prev !== undefined && !line.startsWith("•") && !line.startsWith("-") && (startsLower || !sentenceEnded);
    if (continues) out[out.length - 1] = `${prev} ${line}`;
    else {
      if (gap && out.length) out.push("");
      out.push(line);
    }
    gap = false;
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
