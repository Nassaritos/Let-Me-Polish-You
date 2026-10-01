import Image from "next/image";
import Link from "next/link";
import human from "@/public/brand/human-mark-white.png";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrow";

/** AIESEC in one breath. Facts are AIESEC's own public descriptions. */
export const AIESEC_POINTS = [
  { big: "Youth-led", small: "Run by young people, for young people — since 1948." },
  { big: "100+", small: "countries and territories where AIESEC is active." },
  { big: "Leadership", small: "built through real experiences, not lectures." },
];

export function AboutAiesec({ compact = false }: { compact?: boolean }) {
  return (
    <section aria-labelledby="aiesec-title" className="relative overflow-hidden bg-blue py-24 text-white md:py-32">
      <Image
        src={human}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 right-[4%] h-[110%] w-auto opacity-[0.12]"
        sizes="600px"
      />
      <div className="frame relative grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-6">
          <p className="eyebrow text-yellow">Wait, what&apos;s AIESEC?</p>
          <h2 id="aiesec-title" className="display mt-3 text-[clamp(2.6rem,6vw,5.6rem)]">
            The world&apos;s largest youth-run organisation.
          </h2>
          <p className="mt-6 max-w-xl text-[1.2rem] font-bold leading-snug">
            AIESEC sends young people abroad to volunteer, intern and teach — and supports them before, during and after.
            It&apos;s not tourism: you join a team, take on real responsibility and grow into a leader.
          </p>
          {!compact && (
            <Link href="/about" className="btn btn-white mt-8">
              More about AIESEC <Arrow />
            </Link>
          )}
        </Reveal>
        <ul className="grid gap-4 self-end md:col-span-5 md:col-start-8">
          {AIESEC_POINTS.map((p, i) => (
            <Reveal as="li" key={p.big} delay={i * 0.08} className="flex flex-col gap-1 border-t-2 border-white/30 pt-4 sm:flex-row sm:items-baseline sm:gap-5">
              <span className="display min-w-[7ch] text-[clamp(2rem,3.4vw,3rem)] text-yellow">{p.big}</span>
              <span className="text-[1.1rem] font-bold leading-snug">{p.small}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
