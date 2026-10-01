import { PLACEHOLDER_STORIES, STORIES } from "@/lib/content/stories";
import { PROGRAM_INFO } from "@/lib/programs";
import { PROGRAM_STYLE } from "@/lib/program-style";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Real participant stories. Renders nothing in production until real stories
 * are added to lib/content/stories.ts — we never publish invented testimonials.
 */
export function Stories() {
  const placeholder = STORIES.length === 0;
  if (placeholder && process.env.NODE_ENV === "production") return null;
  const stories = placeholder ? PLACEHOLDER_STORIES : STORIES;

  return (
    <section aria-labelledby="stories-title" className="on-light bg-white py-24 md:py-32">
      <div className="frame">
        <p className="eyebrow text-purple">Exchange stories</p>
        <h2 id="stories-title" className="display mt-3 text-[clamp(2.6rem,6vw,6rem)]">
          People who actually <span className="text-purple">did it.</span>
        </h2>
        {placeholder && (
          <p role="note" className="mt-4 w-fit rounded-lg border-2 border-dashed border-purple px-4 py-2 font-bold text-purple">
            Development preview — placeholder content. Add real stories in lib/content/stories.ts. Hidden in production until then.
          </p>
        )}
      </div>
      <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-4 md:grid md:grid-cols-3">
        {stories.map((s, i) => (
          <Reveal as="li" key={i} delay={i * 0.08} className="w-[84vw] shrink-0 snap-center md:w-auto">
            <figure className={`flex h-full flex-col rounded-[1.75rem] p-7 ${PROGRAM_STYLE[s.program].soft}`}>
              <span className="display text-7xl leading-[0.5] text-navy/25" aria-hidden="true">“</span>
              <blockquote className="mt-4 flex-1 font-display text-[1.35rem] font-bold leading-snug">{s.quote}</blockquote>
              <figcaption className="mt-6 border-t-2 border-navy/10 pt-4">
                <p className="font-display text-lg font-extrabold">{s.name}</p>
                <p className="font-bold text-grey">
                  From {s.from} · {PROGRAM_INFO[s.program].code} in {s.place}
                  {s.year ? ` · ${s.year}` : ""}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
