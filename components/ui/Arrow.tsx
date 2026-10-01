export function Arrow({ className = "", direction = "right" }: { className?: string; direction?: "right" | "up-right" | "down" | "left" }) {
  const rotate = { right: 0, "up-right": -45, down: 90, left: 180 }[direction];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`inline-block h-[1.05em] w-[1.05em] shrink-0 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
