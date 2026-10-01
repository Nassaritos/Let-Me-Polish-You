"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="flex min-h-[70svh] items-center bg-white pt-24">
      <div className="frame">
        <p className="script text-5xl text-red">oops…</p>
        <h1 className="display-caps mt-2 text-[clamp(2.6rem,7vw,6rem)]">Something went wrong.</h1>
        <p className="mt-4 max-w-lg text-[1.15rem] text-ink-2">Please try again. If it keeps happening, every opportunity is also on aiesec.org.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-red">
            Try again
          </button>
          <Link href="/" className="btn btn-ghost text-ink hover:bg-ink hover:text-white">
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
