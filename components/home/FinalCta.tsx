import Image from "next/image";
import Link from "next/link";
import { PHOTOS } from "@/lib/images";
import { Arrow } from "@/components/ui/Arrow";

export function FinalCta() {
  const photo = PHOTOS.departure;
  return (
    <section aria-labelledby="final-title" className="relative overflow-hidden bg-navy text-white">
      <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="100vw" className="object-cover" style={{ objectPosition: photo.position }} />
      <div className="absolute inset-0 bg-blue mix-blend-multiply" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" aria-hidden="true" />
      <div className="frame relative flex min-h-[86svh] flex-col justify-end pb-16 pt-32 md:pb-24">
        <p className="hand text-[clamp(1.8rem,3vw,2.6rem)] text-yellow">so…</p>
        <h2 id="final-title" className="display-tight max-w-5xl text-[clamp(3.4rem,10vw,9.5rem)]">
          Where will Poland take <span className="text-yellow">you?</span>
        </h2>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center">
          <Link href="/opportunities" className="btn btn-yellow self-start !px-8 !py-5 text-[1.15rem]">
            Find your opportunity <Arrow />
          </Link>
          <p className="max-w-md text-[1.1rem] font-bold">
            Applications happen on aiesec.org — this is where you find the one that&apos;s yours.
          </p>
        </div>
      </div>
    </section>
  );
}
