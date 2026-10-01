import Image from "next/image";
import { MOMENTS, REELS, STORIES } from "@/lib/content/stories";
import { PROGRAM_INFO } from "@/lib/programs";
import { PROGRAM_STYLE } from "@/lib/program-style";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrow";

/** Real exchange stories: Facebook reels, a photo wall and (when added) written quotes. */
export function Stories() {
  return (
    <section id="stories" aria-labelledby="stories-title" className="bg-white py-20 md:py-28">
      <div className="frame grid gap-6 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-8">
          <SectionTitle id="stories-title" script="exchange stories" before="People who actually" swoosh="did it" />
        </Reveal>
        <Reveal className="md:col-span-4" delay={0.1}>
          <p className="text-[1.08rem] leading-relaxed text-grey">
            Real moments from AIESEC exchanges in Poland — classrooms, crafts, goodbye hugs and thank-you letters.
          </p>
        </Reveal>
      </div>

      {STORIES.length > 0 && (
        <ul className="frame mt-12 grid gap-5 md:grid-cols-3">
          {STORIES.map((s, i) => (
            <li key={i} className={`flex flex-col rounded-2xl border-t-[6px] ${PROGRAM_STYLE[s.program].border} bg-mist p-7`}>
              <blockquote className="flex-1 font-display text-[1.25rem] font-bold leading-snug">“{s.quote}”</blockquote>
              <p className="mt-6 font-display text-lg font-extrabold">{s.name}</p>
              <p className="font-bold text-grey">
                From {s.from} · {PROGRAM_INFO[s.program].name} in {s.place}
                {s.year ? ` · ${s.year}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Reels (links, not embeds) */}
      <div className="frame mt-10">
      <div className="flex flex-col gap-4 rounded-2xl bg-mist p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="script text-[2.4rem] leading-none text-red">hear it from them</p>
          <p className="mt-2 text-[1.05rem] text-ink-2">Participants talk about their exchange in Poland in these reels from AIESEC in Poland.</p>
        </div>
        <ul className="flex flex-col gap-3 sm:flex-row">
          {REELS.map((r) => (
            <li key={r.href}>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 whitespace-nowrap rounded-xl bg-white px-5 py-4 font-display font-extrabold transition-colors hover:bg-ink hover:text-white"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-red text-white" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor">
                    <path d="M7 4.5v15l12-7.5z" />
                  </svg>
                </span>
                {r.label}
                <span className="whitespace-nowrap text-sm font-bold opacity-70">
                  Facebook <Arrow direction="up-right" className="inline" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      </div>

      {/* Photo wall */}
      <ul className="frame mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {MOMENTS.map((m, i) => (
          <Reveal as="li" key={m.caption} delay={(i % 4) * 0.05}>
            <figure className="label-box p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[0.4rem] bg-mist">
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="script mt-1 text-center text-[1.6rem] leading-tight">{m.caption}</figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
