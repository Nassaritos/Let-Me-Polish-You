"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { PHOTOS, type Photo } from "@/lib/images";
import { PROGRAMS, PROGRAM_INFO, type Program } from "@/lib/programs";
import { PROGRAM_STYLE } from "@/lib/program-style";
import { Rosette } from "@/components/brand/Rosette";
import { Squiggle } from "@/components/brand/Squiggle";
import { Arrow } from "@/components/ui/Arrow";

export interface HeroLive {
  available: number;
  places: number;
  byProgram: Record<Program, number>;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function PhotoPill({ photo, className = "", delay = 0 }: { photo: Photo; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={`relative inline-block h-[0.78em] overflow-hidden rounded-full align-[-0.02em] ring-4 ring-white/25 ${className}`}
      initial={reduce ? { opacity: 0 } : { width: 0, opacity: 0 }}
      animate={reduce ? { opacity: 1 } : { width: "1.9em", opacity: 1 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      aria-hidden="true"
    >
      <Image src={photo.src} alt="" fill sizes="240px" className="object-cover" style={{ objectPosition: photo.position }} priority />
    </motion.span>
  );
}

const STRIP: { photo: Photo; caption: string; tilt: number }[] = [
  { photo: PHOTOS.juwenaliaParade, caption: "Juwenalia: student festival season", tilt: -4 },
  { photo: PHOTOS.warsawBoulevards, caption: "Warsaw, Vistula boulevards", tilt: 3 },
  { photo: PHOTOS.pierogi, caption: "pierogi, obviously", tilt: -2 },
  { photo: PHOTOS.morskieOko, caption: "Tatras at sunrise", tilt: 4 },
  { photo: PHOTOS.krakowNight, caption: "Kraków after dark", tilt: -3 },
];

export function Hero({ live }: { live: HeroLive | null }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const stripX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-8%"]);
  const rosetteRotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 60]);

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative overflow-hidden bg-blue pt-28 text-white md:pt-32">
      <motion.div className="pointer-events-none absolute -right-40 -top-32 h-[46rem] w-[46rem] opacity-60 md:-right-24" style={{ rotate: rosetteRotate }}>
        <Rosette color="#1b8cf6" hole="#037ef3" className="h-full w-full" />
      </motion.div>

      <div className="frame relative grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 lg:col-span-8">
          <motion.p
            className="chip bg-white/15 text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-yellow" />
            </span>
            AIESEC in Poland · Volunteer · Intern · Teach
          </motion.p>

          <h1 id="hero-title" aria-label="Let me Polish you." className="display-tight mt-6 text-[clamp(3.6rem,12.2vw,11.5rem)]">
            <motion.span className="block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              Let me <PhotoPill photo={PHOTOS.juwenaliaCrowd} delay={0.5} />
            </motion.span>
            <motion.span
              className="relative block text-yellow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            >
              <span className="relative inline-block">
                Polish
                <Squiggle className="absolute -bottom-[0.06em] left-0 h-[0.16em] w-full" color="#ffffff" delay={0.9} />
              </span>
              <motion.span
                className="ml-[0.12em] inline-block h-[0.62em] w-[0.62em] align-[0.02em]"
                whileHover={reduce ? undefined : { rotate: 90, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
              >
                <Rosette color="#f85a40" hole="#037ef3" className="h-full w-full" />
              </motion.span>
            </motion.span>
            <motion.span className="block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}>
              you. <PhotoPill photo={PHOTOS.morskieOko} delay={0.7} />
            </motion.span>
          </h1>
        </div>

        <motion.div
          className="col-span-12 flex flex-col justify-end lg:col-span-4 lg:pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
        >
          <div className="mb-8 hidden w-fit -rotate-2 rounded-2xl bg-white p-5 text-navy shadow-[8px_8px_0_#0a1f44] lg:block">
            <p className="font-display text-lg font-extrabold">pol·ish <span className="font-sans text-sm font-normal text-grey">verb</span></p>
            <p className="text-[0.95rem]">to make better, brighter, more you.</p>
            <p className="mt-2 font-display text-lg font-extrabold">Pol·ish <span className="font-sans text-sm font-normal text-grey">adjective</span></p>
            <p className="text-[0.95rem]">from Poland.</p>
            <p className="hand mt-2 text-2xl text-blue-ink">→ both apply.</p>
          </div>

          <p className="text-[1.25rem] font-bold leading-snug">
            Come to Poland with AIESEC. Volunteer, intern or teach — and meet people you&apos;ll never forget.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/opportunities" className="btn btn-yellow text-[1.05rem]">
              Find your opportunity <Arrow />
            </Link>
            <Link href="/about" className="btn btn-ghost text-white hover:bg-white hover:text-navy">
              What&apos;s AIESEC?
            </Link>
          </div>

          {live && (
            <div className="mt-8 border-t-2 border-white/25 pt-5">
              <p className="flex items-baseline gap-3">
                <span className="display text-6xl tabular-nums">{live.available}</span>
                <span className="font-bold leading-tight">
                  live {live.available === 1 ? "opportunity" : "opportunities"}
                  <br />
                  in {live.places} {live.places === 1 ? "place" : "places"} across Poland
                </span>
              </p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Live opportunities by program">
                {PROGRAMS.map((p) => (
                  <li key={p}>
                    <Link
                      href={`/opportunities?program=${p}`}
                      className={`chip ${PROGRAM_STYLE[p].bg} text-navy transition-transform hover:-translate-y-0.5`}
                    >
                      {PROGRAM_INFO[p].verb} · {PROGRAM_INFO[p].code}
                      <span className="rounded-full bg-white/70 px-2 py-0.5 tabular-nums">{live.byProgram[p]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>

      {/* Polaroid strip — Poland through the experience */}
      <div className="relative mt-14 md:mt-20">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white" aria-hidden="true" />
        <motion.ul
          className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-6 pt-4 md:gap-6 md:overflow-visible"
          style={{ x: stripX }}
          aria-label="Snapshots of life in Poland"
        >
          {STRIP.map((s, i) => (
            <motion.li
              key={s.caption}
              className="w-[68vw] shrink-0 snap-center sm:w-[42vw] md:w-[calc((100%-6rem)/5)]"
              initial={{ opacity: 0, y: 60, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: s.tilt }}
              whileHover={reduce ? undefined : { rotate: 0, y: -10, scale: 1.03 }}
              transition={{ duration: 0.9, delay: 0.5 + i * 0.08, ease: EASE }}
            >
              <figure className="rounded-lg bg-white p-2.5 pb-3 text-navy shadow-[0_18px_40px_-18px_rgba(10,31,68,0.55)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-mist">
                  <Image
                    src={s.photo.src}
                    alt={s.photo.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 20vw, 68vw"
                    className="object-cover"
                    style={{ objectPosition: s.photo.position }}
                  />
                </div>
                <figcaption className="hand mt-2 text-center text-[1.35rem]">{s.caption}</figcaption>
              </figure>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
