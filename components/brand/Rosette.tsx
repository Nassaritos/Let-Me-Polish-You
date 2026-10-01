/**
 * Wycinanka — a Polish folk paper-cut rosette, redrawn as geometry.
 * Our local symbol, cut in each programme's colour (the way the Egypt site
 * cuts a pyramid in GV red / GTa teal / GTe orange).
 * `hole` is the colour of the paper behind it, used for the cut-outs.
 */
export function Rosette({
  color = "currentColor",
  hole = "#fff",
  variant = "flower",
  className = "",
  title,
}: {
  color?: string;
  hole?: string;
  variant?: "flower" | "star";
  className?: string;
  title?: string;
}) {
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true };
  if (variant === "star") {
    return (
      <svg viewBox="-100 -100 200 200" className={className} {...a11y}>
        {Array.from({ length: 24 }, (_, i) => (
          <circle key={i} r="5.5" cx={0} cy={-86} fill={color} transform={`rotate(${i * 15})`} />
        ))}
        <rect x="-52" y="-52" width="104" height="104" fill={color} />
        <rect x="-52" y="-52" width="104" height="104" fill={color} transform="rotate(45)" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="M0,-30 L9,-50 L0,-62 L-9,-50 Z" fill={hole} transform={`rotate(${i * 45})`} />
        ))}
        <circle r="24" fill={hole} />
        <circle r="15" fill={color} />
        <circle r="5" fill={hole} />
      </svg>
    );
  }
  return (
    <svg viewBox="-100 -100 200 200" className={className} {...a11y}>
      {Array.from({ length: 16 }, (_, i) => (
        <ellipse key={`l${i}`} cx="0" cy="-84" rx="7.5" ry="13" fill={color} transform={`rotate(${i * 22.5 + 11.25})`} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={`p${i}`} transform={`rotate(${i * 45})`}>
          <path d="M0,-16 C26,-34 24,-62 0,-76 C-24,-62 -26,-34 0,-16 Z" fill={color} />
          <ellipse cx="0" cy="-50" rx="5" ry="10" fill={hole} />
          <circle cx="0" cy="-30" r="3.5" fill={hole} />
        </g>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={`d${i}`} d="M0,-36 L7,-46 L0,-56 L-7,-46 Z" fill={color} transform={`rotate(${i * 45 + 22.5})`} />
      ))}
      <circle r="20" fill={color} />
      <circle r="11" fill={hole} />
      <circle r="5" fill={color} />
    </svg>
  );
}
