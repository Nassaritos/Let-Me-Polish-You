import type { Metadata } from "next";
import { ALL_PHOTOS } from "@/lib/images";
import { EXTERNAL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy, legal & photo credits",
  description: "How this site handles data, where opportunity data comes from, and credits for the photography.",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return (
    <>
      <header className="bg-blue pb-12 pt-32 text-white md:pt-40">
        <div className="frame">
          <h1 className="display-tight text-[clamp(3rem,7vw,6rem)]">The small print</h1>
        </div>
      </header>
      <div className="on-light frame max-w-4xl space-y-14 py-16">
        <section>
          <h2 className="display text-3xl">Privacy</h2>
          <div className="mt-4 space-y-3 text-[1.05rem] leading-relaxed text-grey">
            <p>This site does not ask you for personal data, does not use accounts, and sets no tracking or advertising cookies.</p>
            <p>
              Applications are made on the official AIESEC platform at{" "}
              <a className="font-bold text-blue-ink link-underline" href={EXTERNAL.aiesecGlobal}>aiesec.org</a>, under AIESEC&apos;s own privacy policy.
            </p>
          </div>
        </section>
        <section>
          <h2 className="display text-3xl">Where the opportunities come from</h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-grey">
            Every opportunity is loaded live from AIESEC&apos;s opportunity system (GIS) and refreshed automatically every few
            minutes. Details such as openings, dates and benefits are exactly what the host has listed — if something is
            missing, it is not shown. Always check the final details on aiesec.org before applying.
          </p>
        </section>
        <section>
          <h2 className="display text-3xl">Brand</h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-grey">
            AIESEC, Global Volunteer, Global Talent and Global Teacher names and logos are trademarks of AIESEC International,
            used from the official brand kit at logos.aiesec.org.
          </p>
        </section>
        <section id="credits">
          <h2 className="display text-3xl">Photo credits</h2>
          <p className="mt-4 text-grey">All photographs are from Wikimedia Commons, used under the licences below. Some are cropped.</p>
          <ul className="mt-6 divide-y divide-line">
            {ALL_PHOTOS.map((p) => (
              <li key={p.credit.source} className="py-3 text-[0.95rem]">
                <span className="font-bold">{p.alt}</span>
                <br />
                <span className="text-grey">
                  by {p.credit.author} ·{" "}
                  {p.credit.licenseUrl ? (
                    <a className="link-underline" href={p.credit.licenseUrl} rel="license noopener noreferrer" target="_blank">{p.credit.license}</a>
                  ) : (
                    p.credit.license
                  )}{" "}
                  · <a className="link-underline" href={p.credit.source} target="_blank" rel="noopener noreferrer">source</a>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
