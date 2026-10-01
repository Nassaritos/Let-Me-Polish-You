import Image from "next/image";
import Link from "next/link";
import { PROGRAMS, PROGRAM_INFO } from "@/lib/programs";
import { PROGRAM_STYLE } from "@/lib/program-style";
import { EXTERNAL, SOCIAL } from "@/lib/site";
import { AiesecLogo } from "@/components/brand/AiesecLogo";
import { Rosette } from "@/components/brand/Rosette";
import human from "@/public/brand/human-mark-white.png";

export function SiteFooter() {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <Rosette color="#13305f" hole="#0a1f44" className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] opacity-70" />

      <div className="frame relative grid gap-12 pb-12 pt-20 md:grid-cols-12 md:pt-24">
        <div className="md:col-span-5">
          <AiesecLogo tone="white" width={132} />
          <p className="display mt-8 text-[clamp(2.4rem,5vw,4rem)] uppercase">
            Let me <span className="text-yellow">Polish</span> you.
          </p>
          <p className="mt-4 max-w-sm text-[1.05rem] leading-relaxed text-white/80">
            Live volunteering, internship and teaching opportunities hosted by AIESEC in Poland.
          </p>
          <Link href="/opportunities" className="btn btn-yellow mt-8">
            Find your opportunity
          </Link>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
          <div>
            <h2 className="eyebrow text-white/60">Explore</h2>
            <ul className="mt-5 space-y-3 font-bold">
              <li><Link className="hover:text-yellow" href="/opportunities">All opportunities</Link></li>
              {PROGRAMS.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${PROGRAM_STYLE[p].bg}`} aria-hidden="true" />
                  <Link className="hover:text-yellow" href={`/opportunities?program=${p}`}>
                    {PROGRAM_INFO[p].code} · {PROGRAM_INFO[p].verb}
                  </Link>
                </li>
              ))}
              <li><Link className="hover:text-yellow" href="/#poland">Life in Poland</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-white/60">AIESEC</h2>
            <ul className="mt-5 space-y-3 font-bold">
              <li><Link className="hover:text-yellow" href="/about">About AIESEC</Link></li>
              <li><Link className="hover:text-yellow" href="/programs">Programs</Link></li>
              <li><a className="hover:text-yellow" href={EXTERNAL.aiesecPoland} target="_blank" rel="noopener noreferrer">AIESEC in Poland ↗</a></li>
              <li><a className="hover:text-yellow" href={`${EXTERNAL.aiesecPoland}/kontakt`} target="_blank" rel="noopener noreferrer">Contact ↗</a></li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-white/60">Follow</h2>
            <ul className="mt-5 space-y-3 font-bold">
              {SOCIAL.map((s) => (
                <li key={s.href}>
                  <a className="hover:text-yellow" href={s.href} target="_blank" rel="noopener noreferrer">{s.label} ↗</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="frame relative flex flex-col gap-4 border-t border-white/15 py-6 text-[0.88rem] text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-3">
          <Image src={human} alt="" height={22} width={Math.round((22 * human.width) / human.height)} className="opacity-90" />
          Made in Poland. Powered by AIESEC. © {year}
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><Link className="hover:text-white" href="/legal">Privacy & legal</Link></li>
          <li><Link className="hover:text-white" href="/legal#credits">Photo credits</Link></li>
        </ul>
      </div>
    </footer>
  );
}
