import { EXTERNAL } from "@/lib/site";
import { RetryButton } from "./RetryButton";

/**
 * Shown when live data cannot be loaded. No technical details, no invented
 * opportunities — just a way forward.
 */
export function GisNotice({ reason, className = "" }: { reason: "unconfigured" | "unavailable"; className?: string }) {
  const dev = reason === "unconfigured" && process.env.NODE_ENV !== "production";
  return (
    <div role="status" className={`relative overflow-hidden rounded-2xl border-2 border-line bg-white p-8 text-ink md:p-12 ${className}`}>
      <p className="script text-4xl text-red">oops…</p>
      <p className="display mt-2 max-w-2xl text-[clamp(1.8rem,3.6vw,3rem)]">Something went wrong while loading opportunities.</p>
      <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-grey">
        It&apos;s on our side, not yours. Try again in a moment — or browse every AIESEC opportunity on{" "}
        <a className="font-bold text-red-ink link-underline" href={EXTERNAL.aiesecGlobal} target="_blank" rel="noopener noreferrer">
          aiesec.org
        </a>
        .
      </p>
      {dev && (
        <p className="mt-4 max-w-xl rounded-lg bg-mist px-4 py-3 font-mono text-[0.8rem]">
          Developer note: GIS_TOKEN is not set. Add it to .env.local (see .env.example) and restart the dev server.
        </p>
      )}
      <RetryButton className="mt-8" />
    </div>
  );
}
