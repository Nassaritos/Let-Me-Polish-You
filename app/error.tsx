"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="flex min-h-[70svh] items-center bg-blue pt-24 text-white">
      <div className="frame">
        <p className="hand text-3xl text-yellow">well, that wasn&apos;t supposed to happen…</p>
        <h1 className="display-tight mt-2 text-[clamp(3rem,8vw,7rem)]">Something went wrong.</h1>
        <p className="mt-4 max-w-lg text-[1.15rem] font-bold">Please try again. If it keeps happening, every opportunity is also on aiesec.org.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-yellow">
            Try again
          </button>
          <Link href="/" className="btn btn-ghost text-white hover:bg-white hover:text-navy">
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
