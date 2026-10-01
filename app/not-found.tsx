import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-white pt-24">
      <div className="frame">
        <p className="script text-5xl text-red">ojej!</p>
        <p className="mt-1 text-grey">(that&apos;s “oops” in Polish)</p>
        <h1 className="display-caps mt-4 max-w-4xl text-[clamp(2.6rem,7vw,6rem)]">This page took a wrong train.</h1>
        <p className="mt-6 max-w-xl text-[1.15rem] text-ink-2">
          The opportunity may have closed or the link is wrong. The good news: there are plenty of live ones.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/opportunities" className="btn btn-red">
            See all opportunities <Arrow />
          </Link>
          <Link href="/" className="btn btn-ghost text-ink hover:bg-ink hover:text-white">
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
