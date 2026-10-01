import { Rosette } from "@/components/brand/Rosette";

/** "Poland" in the languages of the people who come here. */
const NAMES = [
  "Polska", "Poland", "Polonia", "Pologne", "Polen", "Польща", "波兰", "بولندا", "Polónia",
  "ポーランド", "Polonya", "पोलैंड", "폴란드", "Lengyelország", "Puola", "Πολωνία", "Polandia", "Ba Lan",
];

export function PolandMarquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-6 pr-6" aria-hidden={hidden || undefined}>
      {NAMES.map((n) => (
        <li key={n} className="flex items-center gap-6">
          <span className="display whitespace-nowrap text-[clamp(1.6rem,3.2vw,2.6rem)]">{n}</span>
          <Rosette color="#0a1f44" hole="#ffc845" variant="star" className="h-6 w-6 shrink-0" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative overflow-hidden bg-yellow py-4 text-navy" role="region" aria-label="Poland, in many languages">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
