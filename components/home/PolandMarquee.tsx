/** "Poland" in the languages of the people who come here. */
const NAMES = [
  "Polska", "Poland", "Polonia", "Pologne", "Polen", "Польща", "波兰", "بولندا", "Polónia",
  "ポーランド", "Polonya", "पोलैंड", "폴란드", "Lengyelország", "Puola", "Πολωνία", "Polandia", "Ba Lan",
];

export function PolandMarquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden || undefined}>
      {NAMES.map((n) => (
        <li key={n} className="flex items-center gap-8">
          <span className="display-caps whitespace-nowrap text-[clamp(1.5rem,3vw,2.4rem)]">{n}</span>
          <span className="h-2 w-2 shrink-0 rounded-full bg-white/70" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative overflow-hidden bg-red py-4 text-white" role="region" aria-label="Poland, in many languages">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
