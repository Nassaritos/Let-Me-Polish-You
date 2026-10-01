import Image from "next/image";
import { PHOTOS, type Photo } from "@/lib/images";
import { Rosette } from "@/components/brand/Rosette";
import { Squiggle } from "@/components/brand/Squiggle";
import { Reveal } from "@/components/ui/Reveal";

type Tile =
  | { kind: "photo"; photo: Photo; caption: string; note?: string; aspect: string; tilt?: string }
  | { kind: "word"; pl: string; en: string; say: string; tilt?: string; color: string };

/** Poland told as the weeks you would actually live — not a list of attractions. */
const TILES: Tile[] = [
  { kind: "photo", photo: PHOTOS.workshopOrigami, caption: "Weekdays", note: "your project, your team, kids who will remember you", aspect: "aspect-[4/3]" },
  { kind: "photo", photo: PHOTOS.juwenaliaParade, caption: "May", note: "Juwenalia — cities hand the keys to students", aspect: "aspect-[3/4]", tilt: "rotate-2" },
  { kind: "word", pl: "Cześć!", en: "hi / bye", say: "cheshch", tilt: "-rotate-3", color: "bg-yellow" },
  { kind: "photo", photo: PHOTOS.warsawBoulevards, caption: "Evenings", note: "everyone ends up by the Vistula", aspect: "aspect-[16/10]" },
  { kind: "photo", photo: PHOTOS.pierogi, caption: "Food", note: "someone will teach you to fold pierogi", aspect: "aspect-square", tilt: "-rotate-2" },
  { kind: "photo", photo: PHOTOS.pendolino, caption: "Weekends", note: "Kraków → Warsaw in under three hours", aspect: "aspect-[4/5]" },
  { kind: "word", pl: "Dziękuję", en: "thank you", say: "jen-koo-yeh", tilt: "rotate-2", color: "bg-gta" },
  { kind: "photo", photo: PHOTOS.juwenaliaConcert, caption: "Nights", note: "festival season is real", aspect: "aspect-[3/4]", tilt: "rotate-1" },
  { kind: "photo", photo: PHOTOS.morskieOko, caption: "Mountains", note: "the Tatras, one night-train away", aspect: "aspect-[16/9]" },
  { kind: "photo", photo: PHOTOS.masuria, caption: "Summer", note: "Masuria: the land of a thousand lakes", aspect: "aspect-[4/5]", tilt: "-rotate-2" },
  { kind: "word", pl: "Na zdrowie!", en: "cheers!", say: "na zdro-vyeh", tilt: "-rotate-2", color: "bg-gv" },
  { kind: "photo", photo: PHOTOS.bison, caption: "Plot twist", note: "yes, there are bison (Białowieża Forest)", aspect: "aspect-[4/3]" },
  { kind: "photo", photo: PHOTOS.zalipie, caption: "Culture", note: "a village that paints its houses with flowers", aspect: "aspect-[4/3]", tilt: "rotate-1" },
];

export function PolandLife() {
  return (
    <section id="poland" aria-labelledby="poland-title" className="on-light relative overflow-hidden bg-mist py-24 md:py-32">
      <Rosette color="#e6ebf2" hole="#f5f5f5" className="pointer-events-none absolute -left-40 top-10 h-[36rem] w-[36rem]" />
      <div className="frame relative grid gap-6 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-8">
          <p className="eyebrow text-gv-ink">Life in Poland</p>
          <h2 id="poland-title" className="display mt-3 text-[clamp(2.8rem,7vw,6.8rem)]">
            Poland,{" "}
            <span className="relative inline-block">
              through the
              <Squiggle className="absolute -bottom-2 left-0 h-3 w-full" color="#f85a40" />
            </span>{" "}
            experience.
          </h2>
        </Reveal>
        <Reveal className="md:col-span-4" delay={0.1}>
          <p className="text-[1.1rem] leading-relaxed text-grey">
            Not a brochure. A preview of the weeks you&apos;d actually live here — the work, the people, the weekends, the
            food someone&apos;s grandmother insists you try.
          </p>
        </Reveal>
      </div>

      <ul className="frame relative mt-14 columns-2 gap-4 md:gap-6 lg:columns-3 [&>li]:mb-6 md:[&>li]:mb-10">
        {TILES.map((t, i) => (
          <Reveal as="li" key={i} delay={(i % 3) * 0.06} className="break-inside-avoid">
            {t.kind === "photo" ? (
              <figure className={`group transition-transform duration-500 hover:rotate-0 ${t.tilt ?? ""}`}>
                <div className={`photo relative ${t.aspect} bg-line`}>
                  <Image
                    src={t.photo.src}
                    alt={t.photo.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: t.photo.position }}
                  />
                  <span className="eyebrow absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-navy">{t.caption}</span>
                </div>
                {t.note && <figcaption className="hand mt-2 text-[1.45rem] text-navy">{t.note}</figcaption>}
              </figure>
            ) : (
              <div className={`${t.color} ${t.tilt ?? ""} rounded-2xl p-5 text-navy shadow-[6px_6px_0_#0a1f44] transition-transform duration-500 hover:rotate-0`}>
                <p className="eyebrow">Polish 101</p>
                <p className="display mt-2 text-[clamp(1.8rem,2.6vw,2.4rem)]" lang="pl">{t.pl}</p>
                <p className="mt-1 font-bold">{t.en}</p>
                <p className="hand mt-1 text-xl">say: “{t.say}”</p>
              </div>
            )}
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
