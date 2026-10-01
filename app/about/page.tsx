import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PHOTOS } from "@/lib/images";
import { EXTERNAL } from "@/lib/site";
import { PROGRAMS, PROGRAM_INFO, programHref } from "@/lib/programs";
import { PROGRAM_STYLE } from "@/lib/program-style";
import { PROGRAM_CONTENT } from "@/lib/content/programs";
import { computeStats, countByLc, getActiveLocalCommittees, getPolandOpportunities } from "@/lib/gis/opportunities";
import { LocalTeams } from "@/components/about/LocalTeams";
import { AiesecLogo } from "@/components/brand/AiesecLogo";
import { ProductLogo } from "@/components/brand/ProductLogo";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Arrow } from "@/components/ui/Arrow";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "What's AIESEC?",
  description:
    "AIESEC is the world's largest youth-run organisation, developing young leaders through international volunteering, internships and teaching — since 1948.",
  alternates: { canonical: "/about" },
};

const BLUE = "#037ef3";

/** AIESEC's own public descriptions — no invented figures. */
const FACTS = [
  { big: "1948", small: "Founded by students from seven European countries who believed understanding between cultures builds peace." },
  { big: "100+", small: "Countries and territories where AIESEC is active today." },
  { big: "Youth-run", small: "Led entirely by young people — students and recent graduates — for young people." },
];

const STEPS = [
  { n: "1", t: "Choose", d: "Pick an experience — Global Volunteer, Global Talent or Global Teacher — and find a live project on this site." },
  { n: "2", t: "Apply", d: "Create a profile and apply on aiesec.org. The AIESEC office in your country guides you." },
  { n: "3", t: "Get ready", d: "Interviews, preparation and paperwork — with AIESEC people helping on both ends." },
  { n: "4", t: "Live it", d: "Arrive in Poland, join your team and do the work. Your local AIESEC team is there throughout." },
];

const FAQ = [
  {
    q: "Is this just travelling?",
    a: "No. You go to do something — volunteer on a project, work in a company or teach in a school — as part of a team. Growing as a leader is the point; seeing Poland is the bonus.",
  },
  {
    q: "Who can take part?",
    a: "Young people, usually between 18 and 30. Each opportunity lists the languages, skills or backgrounds it asks for.",
  },
  {
    q: "What does it cost, and what's covered?",
    a: "It depends on the program, the project and your home country. Every opportunity here shows what the host provides (food, accommodation, transport, salary), and the AIESEC office in your country explains any fees before you commit.",
  },
  {
    q: 'What does "AIESEC" stand for?',
    a: "It started as a French acronym — Association Internationale des Étudiants en Sciences Économiques et Commerciales. Today it's simply the name, pronounced \"eye-sek\".",
  },
];

export default async function AboutPage() {
  const [result, teams] = await Promise.all([getPolandOpportunities(), getActiveLocalCommittees()]);
  const stats = result.ok ? computeStats(result.data) : null;

  return (
    <>
      {/* Hero */}
      <header className="bg-white pb-14 pt-28 md:pb-20 md:pt-36">
        <div className="frame grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <AiesecLogo tone="blue" width={170} />
            <SectionTitle as="h1" size="xl" className="mt-8" accent={BLUE} script="so…" before="What's" swoosh="AIESEC?" />
            <p className="mt-6 max-w-2xl text-[1.18rem] leading-relaxed text-ink-2">
              AIESEC is the world&apos;s largest youth-run organisation — global, non-political, independent and
              not-for-profit. It develops leadership in young people through practical experiences abroad, like a few weeks or
              months in Poland.
            </p>
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-grey">
              Its vision, in its own words: <strong className="text-aiesec-ink">peace and fulfilment of humankind&apos;s potential</strong>.
            </p>
          </div>
          <figure className="lg:col-span-5">
            <div className="label-box -rotate-1 p-2.5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[0.4rem]">
                <Image src={PHOTOS.juwenaliaCrowd.src} alt={PHOTOS.juwenaliaCrowd.alt} fill priority placeholder="blur" sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
              </div>
            </div>
          </figure>
        </div>
      </header>

      {/* Facts on AIESEC blue */}
      <section aria-label="AIESEC in numbers" className="on-dark bg-aiesec-ink py-14 text-white md:py-16">
        <ul className="frame grid gap-8 md:grid-cols-3">
          {FACTS.map((f) => (
            <li key={f.big} className="border-t-2 border-white/40 pt-5">
              <p className="display-caps text-[clamp(2.4rem,4vw,3.6rem)]">{f.big}</p>
              <p className="mt-2 text-[1.08rem] font-bold leading-snug">{f.small}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* The three products */}
      <section aria-labelledby="products-title" className="bg-white py-16 md:py-24">
        <div className="frame">
          <SectionTitle id="products-title" accent={BLUE} script="what AIESEC offers" before="Three ways to go" swoosh="abroad" />
          <p className="mt-5 max-w-2xl text-[1.08rem] leading-relaxed text-grey">
            AIESEC runs three exchange programs. Here in Poland, each one has its own page with the projects that are open right
            now.
          </p>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {PROGRAMS.map((p) => (
              <li key={p}>
                <Link
                  href={programHref(p)}
                  className={`group flex h-full flex-col rounded-2xl border-t-[6px] ${PROGRAM_STYLE[p].border} bg-mist p-6 transition-transform duration-500 hover:-translate-y-1`}
                >
                  <ProductLogo program={p} height={44} />
                  <p className="mt-4 font-display text-xl font-black">{PROGRAM_CONTENT[p].promise}</p>
                  <p className="mt-2 flex-1 leading-relaxed text-ink-2">{PROGRAM_CONTENT[p].what}</p>
                  <span className={`mt-5 inline-flex items-center gap-2 font-display font-extrabold ${PROGRAM_STYLE[p].ink}`}>
                    {stats ? `${stats.byProgram[p].available} live in Poland` : `Explore ${PROGRAM_INFO[p].name}`}
                    <Arrow className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section id="how" aria-labelledby="how-title" className="bg-aiesec-soft py-16 md:py-24">
        <div className="frame">
          <SectionTitle id="how-title" accent={BLUE} script="four steps" before="How it" swoosh="works" />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-2xl bg-white p-6">
                <p className="display grid h-11 w-11 place-items-center rounded-full bg-aiesec text-xl text-white">{s.n}</p>
                <p className="display mt-4 text-2xl">{s.t}</p>
                <p className="mt-2 leading-relaxed text-grey">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/opportunities" className="btn btn-red">
              Find your opportunity <Arrow />
            </Link>
            <a href={EXTERNAL.aiesecAbout} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-aiesec-ink hover:bg-aiesec hover:text-white">
              More on aiesec.org <Arrow direction="up-right" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="bg-white py-16 md:py-24">
        <div className="frame grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionTitle id="faq-title" accent={BLUE} script="good questions" before="Before you" swoosh="ask" />
          </div>
          <div className="divide-y-2 divide-line border-y-2 border-line lg:col-span-8">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-extrabold">
                  <h3>{f.q}</h3>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-aiesec-soft text-aiesec-ink transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* AIESEC in Poland */}
      <LocalTeams teams={teams} counts={result.ok ? countByLc(result.data) : undefined} withAbout={false} />
      <section className="bg-white py-14">
        <div className="frame flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-[1.1rem] leading-relaxed">
            <strong>AIESEC in Poland</strong> is run by students across the country. They find the partners — schools, NGOs,
            companies — prepare the projects you see here, and look after the people who come.
          </p>
          <a href={EXTERNAL.aiesecPoland} target="_blank" rel="noopener noreferrer" className="btn btn-ink shrink-0">
            Visit aiesec.pl <Arrow direction="up-right" />
          </a>
        </div>
      </section>
    </>
  );
}
