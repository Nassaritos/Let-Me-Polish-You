import { EXTERNAL } from "@/lib/site";
import { Rosette } from "@/components/brand/Rosette";
import { RetryButton } from "./RetryButton";

/**
 * Shown when live data cannot be loaded. No technical details, no invented
 * opportunities — just a way forward.
 */
export function GisNotice({ reason, className = "" }: { reason: "unconfigured" | "unavailable"; className?: string }) {
  const dev = reason === "unconfigured" && process.env.NODE_ENV !== "production";
  return (
    <div role="status" className={`on-light relative overflow-hidden rounded-[1.75rem] bg-mist p-8 text-navy md:p-12 ${className}`}>
      <Rosette color="#e6ebf2" hole="#f5f5f5" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64" />
      <p className="eyebrow relative text-gv-ink">Live opportunities are taking a break</p>
      <p className="display relative mt-3 max-w-2xl text-[clamp(2rem,4vw,3.4rem)]">Something went wrong while loading opportunities.</p>
      <p className="relative mt-4 max-w-xl text-[1.05rem] leading-relaxed text-grey">
        It&apos;s on our side, not yours. Try again in a moment — or browse every AIESEC opportunity on{" "}
        <a className="font-bold text-blue-ink link-underline" href={EXTERNAL.aiesecGlobal} target="_blank" rel="noopener noreferrer">
          aiesec.org
        </a>
        .
      </p>
      {dev && (
        <p className="relative mt-4 max-w-xl rounded-lg bg-white px-4 py-3 font-mono text-[0.8rem]">
          Developer note: GIS_TOKEN is not set. Add it to .env.local (see .env.example) and restart the dev server.
        </p>
      )}
      <RetryButton className="relative mt-8" />
    </div>
  );
}
