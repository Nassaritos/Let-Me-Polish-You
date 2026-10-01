"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { PHOTOS, type Photo } from "@/lib/images";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Arrow } from "@/components/ui/Arrow";

export interface HeroLive {
  available: number;
  places: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const COLLAGE: { photo: Photo; caption: string; className: string; tilt: number; y: number }[] = [
  { photo: PHOTOS.juwenaliaCrowd, caption: "new friends", className: "left-[4%] top-[2%] w-[58%]", tilt: -4, y: -30 },
  { photo: PHOTOS.exchangeThankYou, caption: "real impact", className: "right-[2%] top-[22%] w-[46%]", tilt: 5, y: 20 },
  { photo: PHOTOS.morskieOko, caption: "weekends like this", className: "left-[2%] bottom-[0%] w-[48%]", tilt: 2, y: -10 },
];

export function Hero({ live }: { live: HeroLive | null }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative overflow-hidden bg-white pb-16 pt-24 md:pb-20 md:pt-28">
      <div className="frame grid items-center gap-12 lg:grid-cols-12">
        <motion.div
          className="lg:col-span-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <BrandLogo width={260} priority className="h-auto w-[min(260px,60vw)]" />

          <h1 id="hero-title" className="display mt-6 text-[clamp(2.2rem,4.2vw,3.7rem)] leading-[1.02]">
            Volunteer, intern or teach <span className="text-red-ink">in Poland.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[1.15rem] leading-relaxed text-ink-2">
            Real projects hosted by AIESEC in Poland — run by young people, for young people. Pick an experience, find your
            project, apply on aiesec.org.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/opportunities" className="btn btn-red text-[1.02rem]">
              Find your opportunity <Arrow />
            </Link>
            <Link href="#experiences" className="btn btn-ghost text-ink hover:bg-ink hover:text-white">
              Which one is for me?
            </Link>
          </div>

          {live && (
            <p className="mt-8 flex items-center gap-3 font-bold text-ink-2" aria-live="polite">
              <span className="relative flex h-3 w-3" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red" />
              </span>
              <span>
                <span className="display text-2xl">{live.available}</span> live {live.available === 1 ? "opportunity" : "opportunities"} in{" "}
                {live.places} {live.places === 1 ? "place" : "places"} across Poland
              </span>
            </p>
          )}
        </motion.div>

        <div className="relative aspect-[1/1] w-full lg:col-span-6" aria-hidden="true">
          {COLLAGE.map((c, i) => (
            <Collage key={c.caption} item={c} index={i} progress={scrollYProgress} reduce={Boolean(reduce)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Collage({
  item,
  index,
  progress,
  reduce,
}: {
  item: (typeof COLLAGE)[number];
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduce: boolean;
}) {
  const y = useTransform(progress, [0, 1], reduce ? [0, 0] : [0, item.y * 3]);
  return (
    <motion.figure
      className={`absolute ${item.className}`}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.92, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, rotate: item.tilt }}
      whileHover={reduce ? undefined : { rotate: 0, scale: 1.03 }}
      transition={{ duration: 0.9, delay: 0.2 + index * 0.12, ease: EASE }}
    >
      <div className="label-box p-2 pb-2.5">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[0.35rem] bg-mist">
          <Image
            src={item.photo.src}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 28vw, 60vw"
            className="object-cover"
            style={{ objectPosition: item.photo.position }}
          />
        </div>
        <figcaption className="script mt-1 text-center text-[clamp(1.4rem,2.2vw,2rem)] text-ink">{item.caption}</figcaption>
      </div>
    </motion.figure>
  );
}
