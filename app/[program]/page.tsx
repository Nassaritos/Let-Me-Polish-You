import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOpportunitySummaries } from "@/lib/gis/opportunities";
import { parseFilters } from "@/lib/filters";
import { PROGRAMS, PROGRAM_INFO, programHref, type Program } from "@/lib/programs";
import { PROGRAM_PHOTOS } from "@/lib/images";
import { PROGRAM_CONTENT } from "@/lib/content/programs";
import { Explorer } from "@/components/opportunities/Explorer";
import { PolandMapBase } from "@/components/map/PolandMapBase";
import { ProductLogo } from "@/components/brand/ProductLogo";
import { PROGRAM_STYLE } from "@/lib/program-style";
import { SwooshWord } from "@/components/brand/Swoosh";
import { GisNotice } from "@/components/ui/GisNotice";
import { LiveStamp } from "@/components/ui/LiveStamp";
import { Arrow } from "@/components/ui/Arrow";

export const dynamicParams = false;

type Params = Promise<{ program: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ program: PROGRAM_INFO[p].slug }));
}

function programForSlug(slug: string): Program | undefined {
  return PROGRAMS.find((p) => PROGRAM_INFO[p].slug === slug);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = programForSlug((await params).program);
  if (!p) return {};
  const info = PROGRAM_INFO[p];
  const title = `${info.name} in Poland`;
  const description = `${info.tagline} ${PROGRAM_CONTENT[p].what} Browse live ${info.name} opportunities hosted by AIESEC in Poland.`;
  return { title, description, alternates: { canonical: programHref(p) }, openGraph: { title, description, url: programHref(p) } };
}

export default async function ProgramPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const program = programForSlug((await params).program);
  if (!program) notFound();
  const [query, result] = await Promise.all([searchParams, getOpportunitySummaries()]);
  const info = PROGRAM_INFO[program];
  const content = PROGRAM_CONTENT[program];
  const photo = PROGRAM_PHOTOS[program].primary;
  const mine = result.ok ? result.data.filter((o) => o.program === program) : [];
  const live = mine.filter((o) => o.availability === "open").length;
  const others = PROGRAMS.filter((p) => p !== program);
  const style = PROGRAM_STYLE[program];

  return (
    <>
      <header className="bg-white pb-14 pt-28 md:pb-20 md:pt-36">
        <div className="frame grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <ProductLogo program={program} height={56} />
            <p className={`eyebrow mt-6 ${style.ink}`}>{info.action} in Poland</p>
            <h1 className="display-caps mt-2 text-[clamp(3rem,7.4vw,6.6rem)]">
              Global <SwooshWord color={style.hex}>{info.name.replace("Global ", "")}</SwooshWord>
            </h1>
            <p className="mt-5 font-display text-[clamp(1.4rem,2.4vw,2rem)] font-extrabold">{content.promise}</p>
            <p className="mt-3 max-w-lg text-[1.12rem] leading-relaxed text-ink-2">{info.tagline} {content.who}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#projects" className={`btn ${style.bg} text-ink shadow-[0_5px_0_rgba(0,0,0,0.22)] hover:bg-ink hover:text-white`}>
                {result.ok ? `See ${live} live ${live === 1 ? "project" : "projects"}` : "See projects"} <Arrow direction="down" />
              </a>
              {result.ok && <LiveStamp fetchedAt={result.fetchedAt} stale={result.stale} />}
            </div>
          </div>
          <figure className="lg:col-span-6">
            <div className="label-box rotate-1 p-2.5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[0.4rem] bg-mist">
                <Image src={photo.src} alt={photo.alt} fill priority placeholder="blur" sizes="(min-width:1024px) 48vw, 100vw" className="object-cover" style={{ objectPosition: photo.position }} />
              </div>
            </div>
          </figure>
        </div>

        <dl className="frame mt-14 grid gap-6 border-t-2 border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["What it is", content.what],
              ["How long", content.length],
              ["Who it's for", content.you],
              ["What you get", content.get],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <dt className={`eyebrow ${style.ink}`}>{k}</dt>
              <dd className="mt-2 leading-relaxed text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section id="projects" aria-label={`Live ${info.name} opportunities`} className="scroll-mt-20 border-t border-line">
        <div className="frame bg-white pb-2 pt-10">
          <h2 className="display-caps text-[clamp(2rem,4.4vw,3.4rem)]">
            {info.name} <SwooshWord color={style.hex}>projects</SwooshWord>
          </h2>
        </div>
        {result.ok ? (
          <Explorer all={mine} initial={parseFilters(query)} mapBase={<PolandMapBase />} lockedProgram={program} />
        ) : (
          <div className="frame py-12">
            <GisNotice reason={result.reason} />
          </div>
        )}
      </section>

      <section aria-labelledby="others-title" className="bg-white py-16 md:py-20">
        <div className="frame">
          <h2 id="others-title" className="script text-[clamp(2.2rem,4vw,3.4rem)] text-ink">
            not quite you?
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {others.map((p) => (
              <li key={p}>
                <Link
                  href={programHref(p)}
                  aria-label={`${PROGRAM_INFO[p].name}: ${PROGRAM_CONTENT[p].promise}`}
                  className={`group flex items-center justify-between gap-6 rounded-2xl border-l-[6px] ${PROGRAM_STYLE[p].border} bg-mist p-6 transition-colors hover:bg-line`}
                >
                  <span>
                    <ProductLogo program={p} height={38} decorative />
                    <span className="mt-2 block font-bold text-grey">{PROGRAM_CONTENT[p].promise}</span>
                  </span>
                  <Arrow className={`h-6 w-6 ${PROGRAM_STYLE[p].ink} transition-transform group-hover:translate-x-1`} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
