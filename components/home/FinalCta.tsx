import Image from "next/image";
import Link from "next/link";
import { PHOTOS } from "@/lib/images";
import { SwooshWord } from "@/components/brand/Swoosh";
import { Arrow } from "@/components/ui/Arrow";

export function FinalCta() {
  const photo = PHOTOS.departure;
  return (
    <section aria-labelledby="final-title" className="on-dark relative overflow-hidden bg-ink text-white">
      <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="100vw" className="object-cover grayscale" style={{ objectPosition: photo.position }} />
      <div className="absolute inset-0 bg-red mix-blend-multiply" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden="true" />
      <div className="frame relative flex min-h-[80svh] flex-col justify-end pb-16 pt-32 md:pb-24">
        <p className="script text-[clamp(2.4rem,4vw,3.6rem)]">so…</p>
        <h2 id="final-title" className="display-caps max-w-5xl text-[clamp(3rem,8.6vw,8rem)]">
          Where will <SwooshWord color="#fc3a3a">Poland</SwooshWord> take you?
        </h2>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center">
          <Link href="/opportunities" className="btn btn-white self-start !px-8 !py-5 text-[1.1rem]">
            Find your opportunity <Arrow />
          </Link>
          <p className="max-w-md text-[1.1rem] font-bold">You apply on aiesec.org — this is where you find the project that&apos;s yours.</p>
        </div>
      </div>
    </section>
  );
}
