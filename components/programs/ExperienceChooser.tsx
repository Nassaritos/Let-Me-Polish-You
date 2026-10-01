import Image from "next/image";
import Link from "next/link";
import { PROGRAMS, PROGRAM_INFO, programHref, type Program } from "@/lib/programs";
import { PROGRAM_PHOTOS } from "@/lib/images";
import { PROGRAM_CONTENT } from "@/lib/content/programs";
import { ProductLogo } from "@/components/brand/ProductLogo";
import { PROGRAM_STYLE } from "@/lib/program-style";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrow";

/** Step 1 of the journey: choose an experience. */
export function ExperienceChooser({ counts }: { counts: Record<Program, number> | null }) {
  return (
    <section id="experiences" aria-labelledby="experiences-title" className="bg-mist py-20 md:py-28">
      <div className="frame grid gap-6 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-8">
          <SectionTitle id="experiences-title" script="three ways to come" before="Choose your" swoosh="experience" />
        </Reveal>
        <Reveal className="md:col-span-4" delay={0.1}>
          <p className="text-[1.08rem] leading-relaxed text-grey">
            Every AIESEC exchange is about stepping out of your comfort zone with other young people from everywhere. The
            difference is what you do while you&apos;re here.
          </p>
        </Reveal>
      </div>

      <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
        {PROGRAMS.map((p, i) => {
          const info = PROGRAM_INFO[p];
          const c = PROGRAM_CONTENT[p];
          const photo = PROGRAM_PHOTOS[p].primary;
          const n = counts?.[p];
          const style = PROGRAM_STYLE[p];
          return (
            <Reveal as="li" key={p} delay={i * 0.08} className="w-[84vw] shrink-0 snap-center sm:w-[60vw] md:w-auto">
              <Link
                href={programHref(p)}
                className={`group flex h-full flex-col overflow-hidden rounded-2xl border-t-[6px] ${style.border} bg-white shadow-[0_2px_0_rgba(0,0,0,0.05),0_20px_40px_-28px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 33vw, 84vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: photo.position }}
                  />
                  {n !== undefined && (
                    <span className="chip absolute right-3 top-3 bg-white text-ink">
                      <span className={`h-2 w-2 rounded-full ${style.bg}`} aria-hidden="true" /> {n} live
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <ProductLogo program={p} height={42} decorative />
                  <h3 className="sr-only">{info.name}</h3>
                  <p className="mt-4 font-display text-2xl font-black">
                    <span className={style.ink}>{info.verb}.</span> {c.promise}
                  </p>
                  <p className="mt-3 leading-relaxed text-grey">{c.who}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {c.themes.map((t) => (
                      <li key={t} className={`chip ${style.soft} text-[0.8rem] text-ink-2`}>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <span className={`mt-auto inline-flex items-center gap-2 pt-6 font-display font-extrabold ${style.ink}`}>
                    Explore {info.name}
                    <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
