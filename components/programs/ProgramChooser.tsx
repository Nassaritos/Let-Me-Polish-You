import Image from "next/image";
import Link from "next/link";
import { PROGRAMS, PROGRAM_INFO, type Program } from "@/lib/programs";
import { PROGRAM_PHOTOS } from "@/lib/images";
import { PROGRAM_STYLE } from "@/lib/program-style";
import { ProgramLogo } from "@/components/brand/ProgramLogo";
import { Rosette } from "@/components/brand/Rosette";
import { Squiggle } from "@/components/brand/Squiggle";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";

/** What each experience is about — the same three chapters, different personalities. */
export const PROGRAM_STORY: Record<Program, { promise: string; who: string; themes: string[]; rosette: "flower" | "star" }> = {
  igv: {
    promise: "Make an impact.",
    who: "For anyone 18–30 who wants a summer that matters to someone else.",
    themes: ["Community projects", "UN Global Goals", "Culture swap"],
    rosette: "flower",
  },
  igta: {
    promise: "Build your career.",
    who: "For students and graduates who want real work experience abroad.",
    themes: ["Real work experience", "Polish companies", "Skills for your CV"],
    rosette: "star",
  },
  igte: {
    promise: "Change a classroom.",
    who: "For people who love languages, kids and explaining things well.",
    themes: ["Schools & kindergartens", "Your language", "Daily impact"],
    rosette: "flower",
  },
};

export function ProgramChooser({ counts }: { counts: Record<Program, number> | null }) {
  return (
    <section id="programs" aria-labelledby="programs-title" className="on-light relative bg-white pb-24 pt-16 md:pb-32 md:pt-24">
      <div className="frame grid gap-6 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-8">
          <p className="eyebrow text-blue-ink">Three ways to come to Poland</p>
          <h2 id="programs-title" className="display mt-3 text-[clamp(2.6rem,6.4vw,6rem)]">
            What kind of experience are you{" "}
            <span className="relative inline-block">
              looking for?
              <Squiggle className="absolute -bottom-2 left-0 h-3 w-full" color="#ffc845" />
            </span>
          </h2>
        </Reveal>
        <Reveal className="md:col-span-4" delay={0.1}>
          <p className="text-[1.1rem] leading-relaxed text-grey">
            Every AIESEC exchange is built around leadership: you step out of your comfort zone, live with other young
            people from everywhere, and come back different.
          </p>
        </Reveal>
      </div>

      <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible">
        {PROGRAMS.map((p, i) => {
          const info = PROGRAM_INFO[p];
          const story = PROGRAM_STORY[p];
          const style = PROGRAM_STYLE[p];
          const photo = PROGRAM_PHOTOS[p].primary;
          const n = counts?.[p];
          return (
            <Reveal as="li" key={p} delay={i * 0.08} className="w-[84vw] shrink-0 snap-center sm:w-[60vw] md:w-auto">
              <Link
                href={`/opportunities?program=${p}`}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] ${style.bg} text-navy transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2`}
              >
                <div className="relative m-3 aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-navy">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 33vw, 84vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: photo.position }}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5">
                    <ProgramLogo program={p} height={22} />
                  </span>
                  {n !== undefined && (
                    <span className="chip absolute bottom-3 right-3 bg-navy text-white">
                      <span className="h-2 w-2 rounded-full bg-yellow" aria-hidden="true" /> {n} live
                    </span>
                  )}
                </div>

                <div className="relative flex flex-1 flex-col px-6 pb-6 pt-3">
                  <Rosette
                    variant={story.rosette}
                    color="rgba(255,255,255,0.35)"
                    hole={style.hex}
                    className="pointer-events-none absolute -right-10 -top-6 h-40 w-40 transition-transform duration-700 group-hover:rotate-45"
                  />
                  <p className="display-tight relative text-[clamp(3.6rem,6vw,5.4rem)]">{info.verb}.</p>
                  <p className="relative mt-1 font-display text-2xl font-extrabold">{story.promise}</p>
                  <p className="relative mt-3 text-[1rem] font-bold leading-snug">{story.who}</p>
                  <ul className="relative mt-4 flex flex-wrap gap-2">
                    {story.themes.map((t) => (
                      <li key={t} className="chip bg-white/45 text-[0.8rem]">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <span className="btn mt-auto self-start bg-navy !mt-6 text-white group-hover:bg-white group-hover:text-navy">
                    {n !== undefined ? `See ${n} ${info.code} ${n === 1 ? "project" : "projects"}` : `Explore ${info.code}`} <Arrow />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ul>
      <p className="frame mt-6">
        <Link href="/programs" className="font-bold text-blue-ink link-underline">
          Not sure yet? Compare the three programs →
        </Link>
      </p>
    </section>
  );
}
