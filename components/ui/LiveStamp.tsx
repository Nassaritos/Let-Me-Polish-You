"use client";

import { useEffect, useState } from "react";
import { relativeTime } from "@/lib/utils/format";

/**
 * "Live from AIESEC · updated 3 min ago". Pages are cached for a few minutes,
 * so the relative time is computed in the browser, not baked into the HTML.
 */
export function LiveStamp({ fetchedAt, stale, className = "" }: { fetchedAt: string; stale?: boolean; className?: string }) {
  const [rel, setRel] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setRel(relativeTime(fetchedAt));
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, [fetchedAt]);
  return (
    <p className={`eyebrow flex items-center gap-2 text-grey ${className}`}>
      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
        {!stale && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60 motion-reduce:hidden" />}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${stale ? "bg-grey" : "bg-green"}`} />
      </span>
      <span>
        {stale ? "Last update received" : "Live opportunities"}
        {rel && (
          <>
            {" "}· <time dateTime={fetchedAt}>updated {rel}</time>
          </>
        )}
      </span>
    </p>
  );
}
