import Link from "next/link";
import { PROGRAMS, PROGRAM_INFO, programHref } from "@/lib/programs";
import { PROGRAM_STYLE } from "@/lib/program-style";
import { EXTERNAL, SOCIAL } from "@/lib/site";
import { AiesecLogo } from "@/components/brand/AiesecLogo";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function SiteFooter() {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-white">
      <div className="frame grid gap-12 pb-12 pt-20 md:grid-cols-12 md:pt-24">
        <div className="md:col-span-4">
          <BrandLogo tone="white" width={180} />
          <p className="mt-6 max-w-xs text-[1.02rem] leading-relaxed text-white/80">
            Live volunteering, internship and teaching opportunities hosted by AIESEC in Poland.
          </p>
          <p className="mt-6 flex items-center gap-3 text-sm text-white/70">
            Powered by <AiesecLogo tone="white" width={88} />
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-8">
          <div>
            <h2 className="eyebrow text-red">Experiences</h2>
            <ul className="mt-5 space-y-3 font-bold">
              {PROGRAMS.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${PROGRAM_STYLE[p].bg}`} aria-hidden="true" />
                  <Link className="hover:text-red" href={programHref(p)}>
                    {PROGRAM_INFO[p].name}
                  </Link>
                </li>
              ))}
              <li><Link className="hover:text-red" href="/opportunities">All opportunities</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-red">Discover</h2>
            <ul className="mt-5 space-y-3 font-bold">
              <li><Link className="hover:text-red" href="/poland">Life in Poland</Link></li>
              <li><Link className="hover:text-red" href="/about">What&apos;s AIESEC?</Link></li>
              <li><Link className="hover:text-red" href="/about#teams">Our local teams</Link></li>
              <li><a className="hover:text-red" href={`${EXTERNAL.aiesecPoland}/kontakt`} target="_blank" rel="noopener noreferrer">Contact ↗</a></li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-red">Follow AIESEC in Poland</h2>
            <ul className="mt-5 space-y-3 font-bold">
              {SOCIAL.map((s) => (
                <li key={s.href}>
                  <a className="hover:text-red" href={s.href} target="_blank" rel="noopener noreferrer">{s.label} ↗</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="frame flex flex-col gap-3 border-t border-white/15 py-6 text-[0.88rem] text-white/65 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} AIESEC in Poland · Developed with ❤️ by Ibraheem Nassar & Muhammed Essam</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><Link className="hover:text-white" href="/legal">Privacy & legal</Link></li>
          <li><Link className="hover:text-white" href="/legal#credits">Photo credits</Link></li>
        </ul>
      </div>
    </footer>
  );
}
