import Image from "next/image";
import Link from "next/link";
import { PHOTOS, type Photo } from "@/lib/images";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrow";

type Tile =
  | { kind: "photo"; photo: Photo; caption: string; note: string; aspect?: string; tilt?: string }
  | { kind: "word"; pl: string; en: string; say: string; tilt?: string; tone: "red" | "ink" | "white" };

/** Poland told as the weeks you would actually live — not a list of attractions. */
const TILES: Tile[] = [
  { kind: "photo", photo: PHOTOS.juwenaliaParade, caption: "May", note: "Juwenalia — student festival season, when cities hand the keys to students.", aspect: "aspect-[3/4]", tilt: "rotate-1" },
  { kind: "word", pl: "Cześć!", en: "hi / bye", say: "cheshch", tilt: "-rotate-2", tone: "red" },
  { kind: "photo", photo: PHOTOS.warsawBoulevards, caption: "Evenings", note: "Everyone ends up by the river in summer.", aspect: "aspect-[16/10]" },
  { kind: "photo", photo: PHOTOS.pierogi, caption: "Food", note: "Someone will insist on teaching you to fold pierogi.", aspect: "aspect-square", tilt: "-rotate-1" },
  { kind: "photo", photo: PHOTOS.pendolino, caption: "Weekends", note: "Kraków → Warsaw in under three hours.", aspect: "aspect-[4/5]" },
  { kind: "word", pl: "Dziękuję", en: "thank you", say: "jen-koo-yeh", tilt: "rotate-2", tone: "white" },
  { kind: "photo", photo: PHOTOS.juwenaliaConcert, caption: "Nights", note: "Concerts and festivals all summer long.", aspect: "aspect-[3/4]", tilt: "rotate-1" },
  { kind: "photo", photo: PHOTOS.morskieOko, caption: "Mountains", note: "The Tatras — one night train away.", aspect: "aspect-[16/9]" },
  { kind: "photo", photo: PHOTOS.masuria, caption: "Summer", note: "Masuria, the land of a thousand lakes.", aspect: "aspect-[4/5]", tilt: "-rotate-1" },
  { kind: "word", pl: "Na zdrowie!", en: "cheers!", say: "na zdro-vyeh", tilt: "-rotate-2", tone: "ink" },
  { kind: "photo", photo: PHOTOS.bison, caption: "Plot twist", note: "Yes, there are bison (Białowieża Forest).", aspect: "aspect-[4/3]" },
  { kind: "photo", photo: PHOTOS.zalipie, caption: "Culture", note: "A village that paints its houses with flowers.", aspect: "aspect-[4/3]", tilt: "rotate-1" },
];

/** Home preview: four photos — evenings, food, nights, mountains. */
const TEASER = [2, 3, 6, 7];

const WORD_TONE = {
  red: "bg-red text-white",
  ink: "bg-ink text-white",
  white: "label-box text-ink",
} as const;

export function PolandLife({ variant = "full" }: { variant?: "teaser" | "full" }) {
  const tiles = variant === "teaser" ? TEASER.map((i) => TILES[i]) : TILES;
  return (
    <section id="poland" aria-labelledby="poland-title" className="bg-white py-20 md:py-28">
      <div className="frame grid gap-6 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-8">
          <SectionTitle id="poland-title" script="not a brochure" before="Poland, through the" swoosh="experience" />
        </Reveal>
        <Reveal className="md:col-span-4" delay={0.1}>
          <p className="text-[1.08rem] leading-relaxed text-grey">
            A preview of the weeks you&apos;d actually live here — the work, the people, the weekends, and the food
            someone&apos;s grandmother insists you try.
          </p>
        </Reveal>
      </div>

      <ul className={`frame mt-12 grid grid-cols-2 gap-4 md:gap-6 ${variant === "teaser" ? "lg:grid-cols-4" : "md:grid-cols-3 lg:grid-cols-4"}`}>
        {tiles.map((t, i) => (
          <Reveal as="li" key={i} delay={(i % 4) * 0.06} className="flex">
            {t.kind === "photo" ? (
              <figure className="group flex w-full flex-col">
                <div className="photo relative aspect-[4/5] bg-mist">
                  <Image
                    src={t.photo.src}
                    alt={t.photo.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: t.photo.position }}
                  />
                  <span className="eyebrow absolute left-3 top-3 rounded-md bg-white px-2.5 py-1.5 text-ink">{t.caption}</span>
                </div>
                <figcaption className="mt-2 text-[0.98rem] font-bold leading-snug text-ink-2">{t.note}</figcaption>
              </figure>
            ) : (
              <div className={`${WORD_TONE[t.tone]} flex aspect-[4/5] w-full flex-col justify-center self-start rounded-xl p-5`}>
                <p className="eyebrow opacity-80">Polish 101</p>
                <p className="display mt-2 text-[clamp(1.7rem,2.4vw,2.3rem)]" lang="pl">
                  {t.pl}
                </p>
                <p className="mt-1 font-bold">{t.en}</p>
                <p className="script mt-1 text-[1.8rem]">say “{t.say}”</p>
              </div>
            )}
          </Reveal>
        ))}
      </ul>

      {variant === "teaser" && (
        <div className="frame mt-4">
          <Link href="/poland" className="btn btn-ink">
            More about life in Poland <Arrow />
          </Link>
        </div>
      )}
    </section>
  );
}
