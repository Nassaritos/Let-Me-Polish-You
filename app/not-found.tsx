import Link from "next/link";
import { Rosette } from "@/components/brand/Rosette";
import { Arrow } from "@/components/ui/Arrow";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-blue pt-24 text-white">
      <Rosette color="#1b8cf6" hole="#037ef3" className="pointer-events-none absolute -right-24 top-10 h-[30rem] w-[30rem]" />
      <div className="frame relative">
        <p className="hand text-3xl text-yellow">ojej! (that&apos;s “oops” in Polish)</p>
        <h1 className="display-tight mt-2 text-[clamp(3.4rem,10vw,9rem)]">This page took a wrong train.</h1>
        <p className="mt-6 max-w-xl text-[1.2rem] font-bold">
          The opportunity may have closed or the link is wrong. The good news: there are plenty of live ones.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/opportunities" className="btn btn-yellow">
            See live opportunities <Arrow />
          </Link>
          <Link href="/" className="btn btn-ghost text-white hover:bg-white hover:text-navy">
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
