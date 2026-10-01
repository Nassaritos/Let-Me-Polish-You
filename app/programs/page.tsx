import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { computeStats, getPolandOpportunities } from "@/lib/gis/opportunities";
import { PROGRAMS, PROGRAM_INFO, type Program } from "@/lib/programs";
import { PROGRAM_STYLE } from "@/lib/program-style";
import { PROGRAM_PHOTOS } from "@/lib/images";
import { ProgramLogo } from "@/components/brand/ProgramLogo";
import { Rosette } from "@/components/brand/Rosette";
import { PROGRAM_STORY } from "@/components/programs/ProgramChooser";
import { Arrow } from "@/components/ui/Arrow";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Programs — Global Volunteer, Global Talent, Global Teacher",
  description: "Compare AIESEC's three exchange programs in Poland: volunteer (iGV), intern (iGTa) or teach (iGTe).",
  alternates: { canonical: "/programs" },
};

/** General programme facts, phrased the way AIESEC describes them. */
const DETAILS: Record<Program, { what: string; length: string; you: string; get: string }> = {
  igv: {
    what: "A volunteering project with a local partner — schools, NGOs, foundations — built around one of the UN Sustainable Development Goals.",
    length: "Usually short: a few weeks, often over a summer or a break.",
    you: "Young people 18–30 who want to contribute, meet the world and grow as leaders.",
    get: "What's covered (food, accommodation, transport) depends on the project — every opportunity lists it.",
  },
  igta: {
    what: "A professional internship with a company or organisation in Poland, in a field linked to your studies or experience.",
    length: "Longer: from a few months up to around a year and a half.",
    you: "Students and recent graduates who want international work experience.",
    get: "Many internships list a salary — each opportunity shows exactly what's offered.",
  },
  igte: {
    what: "A teaching placement in a school, kindergarten or learning centre — often language teaching and cultural education.",
    length: "Usually several months.",
    you: "People who love languages, education and working with children or young people.",
    get: "Support and benefits vary by school — each opportunity lists them.",
  },
};

export default async function ProgramsPage() {
  const res = await getPolandOpportunities();
  const stats = res.ok ? computeStats(res.data) : null;

  return (
    <>
      <header className="relative overflow-hidden bg-blue pb-14 pt-32 text-white md:pt-40">
        <Rosette color="#1b8cf6" hole="#037ef3" className="pointer-events-none absolute -right-24 -top-20 h-[30rem] w-[30rem]" />
        <div className="frame relative">
          <p className="hand text-[clamp(1.6rem,2.6vw,2.2rem)] text-yellow">three chapters, one adventure</p>
          <h1 className="display-tight text-[clamp(3.4rem,9vw,8.5rem)]">
            Give. Grow. <span className="text-yellow">Teach.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[1.25rem] font-bold">
            AIESEC has three ways to spend part of your life abroad. Here&apos;s how they compare — and how many are live in
            Poland right now.
          </p>
        </div>
      </header>

      <div className="on-light">
        {PROGRAMS.map((p, i) => {
          const info = PROGRAM_INFO[p];
          const style = PROGRAM_STYLE[p];
          const d = DETAILS[p];
          const photo = PROGRAM_PHOTOS[p].secondary;
          const n = stats?.byProgram[p].available;
          return (
            <section key={p} id={p} aria-labelledby={`${p}-title`} className={`${i % 2 ? "bg-mist" : "bg-white"} py-16 md:py-24`}>
              <div className="frame grid gap-10 lg:grid-cols-12 lg:items-center">
                <div className={`lg:col-span-6 ${i % 2 ? "lg:order-2" : ""}`}>
                  <ProgramLogo program={p} height={44} />
                  <h2 id={`${p}-title`} className="display-tight mt-6 text-[clamp(3.4rem,8vw,7rem)]">
                    <span className={`${style.bg} rounded-xl px-3`}>{info.verb}.</span>
                  </h2>
                  <p className="mt-4 font-display text-3xl font-extrabold">{PROGRAM_STORY[p].promise}</p>
                  <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                    {(
                      [
                        ["What it is", d.what],
                        ["How long", d.length],
                        ["Who it's for", d.you],
                        ["What you get", d.get],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k}>
                        <dt className={`eyebrow ${style.ink}`}>{k}</dt>
                        <dd className="mt-1.5 text-[1.02rem] leading-relaxed">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link href={`/opportunities?program=${p}`} className="btn btn-primary mt-8">
                    {n !== undefined ? `See ${n} live ${info.code} ${n === 1 ? "opportunity" : "opportunities"}` : `Explore ${info.code}`} <Arrow />
                  </Link>
                </div>
                <div className={`lg:col-span-6 ${i % 2 ? "lg:order-1" : ""}`}>
                  <div className={`photo relative aspect-[4/3] ${i % 2 ? "rotate-1" : "-rotate-1"} ring-8 ring-white shadow-[12px_12px_0] ${p === "igv" ? "shadow-gv" : p === "igta" ? "shadow-gta" : "shadow-gte"}`}>
                    <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" style={{ objectPosition: photo.position }} />
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
