import Image from "next/image";
import Link from "next/link";
import type { LocalCommittee } from "@/lib/lcs";
import { slugify } from "@/lib/cities";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrow";

/**
 * The AIESEC in Poland local teams, with their campaign logos.
 * `counts` = live opportunities each team currently hosts (from GIS).
 */
export function LocalTeams({
  teams,
  counts,
  withAbout = true,
  id = "teams",
}: {
  /** Active local committees only (see getActiveLocalCommittees) */
  teams: LocalCommittee[];
  counts?: Record<string, number>;
  withAbout?: boolean;
  id?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="bg-mist py-20 md:py-28">
      <div className="frame grid gap-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <SectionTitle id={`${id}-title`} script="run by young people" before="Meet your" swoosh="hosts" />
        </Reveal>
        <Reveal className="lg:col-span-5" delay={0.1}>
          <p className="text-[1.08rem] leading-relaxed text-grey">
            Every project here is prepared by a local AIESEC team — students in cities across Poland who find the partners,
            welcome you when you arrive and become your first friends here.
          </p>
        </Reveal>
      </div>

      <ul className="frame mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {teams.map((lc, i) => {
          const n = counts?.[lc.key] ?? 0;
          return (
            <Reveal as="li" key={lc.key} delay={(i % 4) * 0.05}>
              <Link
                href={`/cities/${slugify(lc.city)}`}
                aria-label={`AIESEC ${lc.name} — ${lc.tagline}. See ${lc.city}${n ? ` and ${n} live ${n === 1 ? "project" : "projects"}` : ""}`}
                className="group flex flex-col items-center rounded-xl p-2 text-center"
              >
                <span className="flex h-[clamp(96px,11vw,150px)] w-full items-start justify-center">
                  <Image
                    src={lc.logo}
                    alt=""
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="h-full w-auto max-w-full object-contain object-top transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-105"
                  />
                </span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-grey group-hover:text-red-ink">
                  {counts && n > 0 ? `${n} live ${n === 1 ? "project" : "projects"}` : `Discover ${lc.city}`}
                  <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ul>

      {withAbout && (
        <div className="frame mt-14 flex flex-col gap-5 border-t-2 border-line pt-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-[1.1rem] leading-relaxed">
            <strong>AIESEC</strong> is the world&apos;s largest youth-run organisation, active in 100+ countries and territories
            since 1948. It&apos;s not tourism — you join a team, take on real responsibility and grow as a leader.
          </p>
          <Link href="/about" className="btn btn-ink shrink-0">
            How it works <Arrow />
          </Link>
        </div>
      )}
    </section>
  );
}
