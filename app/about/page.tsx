import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import human from "@/public/brand/human-mark-white.png";
import { PHOTOS } from "@/lib/images";
import { EXTERNAL } from "@/lib/site";
import { AboutAiesec } from "@/components/about/AboutAiesec";
import { Arrow } from "@/components/ui/Arrow";

export const metadata: Metadata = {
  title: "About AIESEC",
  description: "AIESEC is the world's largest youth-run organisation, developing young leaders through international volunteering, internships and teaching.",
  alternates: { canonical: "/about" },
};

const STEPS = [
  { n: "01", t: "Find it", d: "Pick a live opportunity in Poland on this site." },
  { n: "02", t: "Apply", d: "Sign up and apply on aiesec.org. Your local AIESEC office guides you." },
  { n: "03", t: "Get ready", d: "Interviews, preparation and paperwork — with AIESEC people on both ends." },
  { n: "04", t: "Live it", d: "Arrive, join your team, do the work. AIESEC in Poland is there throughout." },
];

export default function AboutPage() {
  return (
    <>
      <header className="relative overflow-hidden bg-blue pb-16 pt-32 text-white md:pt-40">
        <Image src={human} alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-8 right-[6%] h-[105%] w-auto opacity-15" />
        <div className="frame relative max-w-5xl">
          <p className="hand text-[clamp(1.6rem,2.6vw,2.2rem)] text-yellow">since 1948 —</p>
          <h1 className="display-tight text-[clamp(3.4rem,9vw,8.5rem)]">
            Young people. <span className="text-yellow">Everywhere.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[1.25rem] font-bold">
            AIESEC is a global, non-political, independent, not-for-profit organisation run by young people. It exists to
            develop leadership in young people through practical experiences — like a few weeks or months in Poland.
          </p>
        </div>
      </header>

      <section className="on-light frame grid gap-12 py-16 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-blue-ink">AIESEC in Poland</p>
          <h2 className="display mt-2 text-[clamp(2.2rem,4.6vw,4rem)]">Your hosts on the ground.</h2>
          <p className="mt-5 text-[1.1rem] leading-relaxed text-grey">
            AIESEC in Poland is run by students across the country. They find the partners — schools, NGOs, companies — prepare
            the projects you see here, and look after the people who come.
          </p>
          <a href={EXTERNAL.aiesecPoland} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8">
            Visit aiesec.pl <Arrow direction="up-right" />
          </a>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-[1.5rem] bg-mist p-6">
              <p className="display text-4xl text-blue">{s.n}</p>
              <p className="display mt-2 text-2xl">{s.t}</p>
              <p className="mt-2 text-grey">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <AboutAiesec compact />

      <section className="on-light frame grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2">
        <div className="photo relative aspect-[4/3]">
          <Image src={PHOTOS.juwenaliaCrowd.src} alt={PHOTOS.juwenaliaCrowd.alt} fill placeholder="blur" sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <h2 className="display text-[clamp(2.2rem,4.6vw,4rem)]">More than a trip.</h2>
          <p className="mt-5 text-[1.1rem] leading-relaxed text-grey">
            You&apos;ll be part of a team, take on responsibility and live with people from around the world. That&apos;s the
            point: the experience changes how you see the world — and yourself.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/opportunities" className="btn btn-primary">
              Find your opportunity <Arrow />
            </Link>
            <a href={EXTERNAL.aiesecAbout} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-navy hover:bg-navy hover:text-white">
              aiesec.org/about-us <Arrow direction="up-right" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
