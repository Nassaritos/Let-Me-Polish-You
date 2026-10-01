import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compareOpportunities, getOpportunityById, getPolandOpportunities } from "@/lib/gis/opportunities";
import { toSummary } from "@/lib/gis/normalize";
import { PROGRAM_INFO, programHref, type ProgramInfo } from "@/lib/programs";
import { PROGRAM_PHOTOS, cityPhoto } from "@/lib/images";
import { lcByKey } from "@/lib/lcs";
import { SDG_COLORS, sdgName } from "@/lib/sdg";
import type { LogisticsItem, Opportunity, SkillLike } from "@/lib/types";
import { formatDate, formatDuration, formatMonth, formatSalary } from "@/lib/utils/format";
import { paragraphs } from "@/lib/utils/text";
import { ProductLogo } from "@/components/brand/ProductLogo";
import { PROGRAM_STYLE } from "@/lib/program-style";
import { AvailabilityBadge, OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { PolandMap } from "@/components/map/PolandMap";
import { PolandMapBase } from "@/components/map/PolandMapBase";
import { GisNotice } from "@/components/ui/GisNotice";
import { Arrow } from "@/components/ui/Arrow";

export const revalidate = 300;

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const res = await getOpportunityById(id);
  if (!res.ok || !res.data) return { title: "Opportunity", robots: { index: false } };
  const o = res.data;
  const info = PROGRAM_INFO[o.program];
  const where = o.city ?? "Poland";
  const title = `${o.title} — ${info.name} in ${where}`;
  const description =
    (o.description ?? o.projectDescription ?? info.tagline).replace(/\s+/g, " ").slice(0, 155) ||
    `${info.name} opportunity in ${where}, Poland, hosted by AIESEC in Poland.`;
  return {
    title,
    description,
    alternates: { canonical: `/opportunities/${o.id}` },
    openGraph: { title, description, url: `/opportunities/${o.id}`, type: "article" },
    twitter: { card: "summary_large_image", title, description },
    robots: o.availability === "open" ? undefined : { index: false, follow: true },
  };
}

function logisticsText(item?: LogisticsItem): string | undefined {
  if (!item) return undefined;
  if (item.covered) return item.provided === false ? "Covered by the host" : "Provided & covered by the host";
  if (item.provided) return item.covered === false ? "Arranged by the host — cost not covered" : "Provided by the host";
  if (item.provided === false || item.covered === false) return "Not included";
  return undefined;
}

function ApplyButton({ o, info, className = "" }: { o: Opportunity; info: ProgramInfo; className?: string }) {
  const style = PROGRAM_STYLE[o.program];
  return o.availability === "open" ? (
    <a
      href={o.aiesecUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${style.bg} !py-4 text-[1.05rem] text-ink shadow-[0_5px_0_rgba(0,0,0,0.22)] hover:bg-ink hover:text-white ${className}`}
    >
      Apply on aiesec.org <Arrow direction="up-right" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  ) : (
    <Link href={programHref(o.program)} className={`btn btn-ink !py-4 ${className}`}>
      See open {info.name} projects <Arrow />
    </Link>
  );
}

function Section({ title, eyebrow, children, id }: { title: string; eyebrow?: string; children: React.ReactNode; id?: string }) {
  return (
    <section aria-labelledby={id} className="border-t-2 border-line pt-10">
      {eyebrow && <p className="eyebrow text-red-ink">{eyebrow}</p>}
      <h2 id={id} className="display mt-2 text-[clamp(1.8rem,3.2vw,2.6rem)]">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function SkillChips({ items }: { items?: SkillLike[] }) {
  if (!items?.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s.name} className={`chip ${s.option === "required" ? "bg-ink text-white" : "bg-mist text-ink"}`}>
          {s.name}
          {s.option && <span className="text-[0.72rem] font-normal opacity-75">{s.option}</span>}
        </li>
      ))}
    </ul>
  );
}

export default async function OpportunityPage({ params }: { params: Params }) {
  const { id } = await params;
  const res = await getOpportunityById(id);

  if (!res.ok) {
    return (
      <section className="frame pb-20 pt-32">
        <GisNotice reason={res.reason} />
      </section>
    );
  }
  const o = res.data;
  if (!o) notFound();

  const info = PROGRAM_INFO[o.program];
  const lc = lcByKey(o.hostLcKey);
  const style = PROGRAM_STYLE[o.program];
  const photo = cityPhoto(o.citySlug) ?? PROGRAM_PHOTOS[o.program].primary;
  const photoIsCity = Boolean(cityPhoto(o.citySlug));
  const open = o.availability === "open";
  const duration = formatDuration(o.duration);
  const salary = formatSalary(o.salary);
  const startsLabel = formatMonth(o.dates?.earliestStart, true);
  const applyBy = open ? formatDate(o.dates?.applicationClose) : undefined;

  const list = await getPolandOpportunities();
  const related = list.ok
    ? list.data
        .filter((x) => x.id !== o.id && x.availability === "open" && (x.citySlug === o.citySlug || x.program === o.program))
        .sort((a, b) => Number(b.citySlug === o.citySlug) - Number(a.citySlug === o.citySlug) || compareOpportunities(a, b))
        .slice(0, 3)
        .map(toSummary)
    : [];

  const facts: [string, string | undefined][] = [
    ["Experience", info.name],
    ["Host organisation", o.organisation],
    ["Location", o.location ?? o.city],
    ["Duration", duration],
    ["Earliest start", formatDate(o.dates?.earliestStart)],
    ["Latest end", formatDate(o.dates?.latestEnd)],
    ["Spots open", o.openings !== undefined ? String(o.openings) : undefined],
    ["Apply by", applyBy],
    ["Salary", salary],
  ];

  const logistics: [string, string | undefined][] = [
    ["Accommodation", logisticsText(o.logistics?.accommodation)],
    [
      "Food",
      [logisticsText(o.logistics?.food), o.logistics?.food?.meals ? `${o.logistics.food.meals} ${o.logistics.food.meals === 1 ? "meal" : "meals"}` : undefined]
        .filter(Boolean)
        .join(" · ") || undefined,
    ],
    ["Transport", logisticsText(o.logistics?.transportation)],
    ["Computer", logisticsText(o.logistics?.computer)],
  ];
  const hasLogistics = logistics.some(([, v]) => v);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": o.program === "igv" ? "VolunteerAction" : "JobPosting",
    ...(o.program === "igv"
      ? { name: o.title, description: o.description, location: o.city }
      : {
          title: o.title,
          description: o.description ?? o.learningPoints?.join("\n") ?? info.tagline,
          datePosted: o.dates?.opened,
          validThrough: o.dates?.applicationClose,
          employmentType: "INTERN",
          hiringOrganization: o.organisation ? { "@type": "Organization", name: o.organisation } : undefined,
          jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: o.city, addressCountry: "PL" } },
        }),
    url: o.aiesecUrl,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Hero */}
      <header className="bg-white pb-12 pt-28 md:pb-16 md:pt-32">
        <div className="frame grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Link href={programHref(o.program)} className="font-bold text-grey hover:text-red-ink">
              ← All {info.name} projects
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <ProductLogo program={o.program} height={40} />
              <AvailabilityBadge o={o} />
            </div>
            {o.project && o.project !== o.title && <p className={`eyebrow mt-6 ${style.ink}`}>{o.project}</p>}
            <h1 className="display mt-4 text-[clamp(2.4rem,5.6vw,4.8rem)]">{o.title}</h1>
            <p className="mt-4 text-[1.15rem] font-bold text-ink-2">
              {[o.organisation, o.city ? `${o.city}, Poland` : "Poland"].filter(Boolean).join(" · ")}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-mist p-5 sm:grid-cols-4">
              {(
                [
                  ["Duration", duration],
                  ["Starts", startsLabel],
                  ["Spots", o.openings !== undefined ? String(o.openings) : undefined],
                  ["Apply by", applyBy],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow !text-[0.66rem] text-grey">{k}</dt>
                  <dd className="mt-1 font-display text-lg font-extrabold">{v ?? "—"}</dd>
                </div>
              ))}
            </dl>

            {!open && (
              <p role="status" className="mt-6 rounded-2xl bg-red-soft p-4 font-bold text-red-ink">
                {o.availability === "full"
                  ? "This project is fully booked right now — no spots are open."
                  : "Applications for this project are closed."}{" "}
                Have a look at the other live projects instead.
              </p>
            )}
            <div className="mt-8 hidden flex-wrap items-center gap-4 md:flex">
              <ApplyButton o={o} info={info} />
              {open && <p className="max-w-xs text-sm text-grey">You&apos;ll apply on the official AIESEC platform.</p>}
            </div>
          </div>

          <figure className="lg:col-span-5">
            <div className="label-box rotate-1 p-2.5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[0.4rem] bg-mist lg:aspect-[4/5]">
                <Image src={photo.src} alt={photo.alt} fill priority placeholder="blur" sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: photo.position }} />
              </div>
            </div>
            <figcaption className="mt-3 text-sm text-grey">
              {photoIsCity ? `${o.city} — photo of the city, not the project.` : `Illustrative photo — ${info.name}.`}
            </figcaption>
          </figure>
        </div>
      </header>

      {/* Body */}
      <div className="frame grid gap-12 border-t border-line py-14 lg:grid-cols-12 lg:py-20">
        <div className="space-y-14 lg:col-span-8">
          {o.program === "igv" && o.sdg?.goal && (
            <div className="flex flex-col gap-5 rounded-2xl p-7 text-white sm:flex-row sm:items-center" style={{ background: SDG_COLORS[o.sdg.goal] }}>
              <p className="display text-7xl">{o.sdg.goal}</p>
              <div>
                <p className="eyebrow text-white/85">Your impact · UN Sustainable Development Goal {o.sdg.goal}</p>
                <p className="display mt-1 text-3xl">{sdgName(o.sdg.goal)}</p>
                {o.sdg.description && (
                  <p className="mt-2 text-[1.02rem] leading-relaxed text-white/90">
                    {o.sdg.target && <strong>Target {o.sdg.target}: </strong>}
                    {o.sdg.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {(o.description || o.projectDescription) && (
            <Section title="The experience" eyebrow="About the project" id="about">
              <div className="max-w-3xl space-y-4 text-[1.08rem] leading-relaxed text-ink-2">
                {paragraphs(o.description).map((p, i) => (
                  <p key={`d${i}`}>{p}</p>
                ))}
                {o.projectDescription && (
                  <div className="mt-6 rounded-2xl bg-mist p-6">
                    <p className="eyebrow text-grey">The bigger picture</p>
                    {paragraphs(o.projectDescription).map((p, i) => (
                      <p key={`p${i}`} className="mt-2">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </Section>
          )}

          {(o.weeklyPlan?.length || o.learningPoints?.length) && (
            <Section title="What you'll do" eyebrow={o.weeklyPlan?.length ? "Week by week" : "The role"} id="do">
              {o.weeklyPlan?.length ? (
                <ol className="grid gap-4 sm:grid-cols-2">
                  {o.weeklyPlan.map((w) => (
                    <li key={w.week} className="rounded-2xl bg-mist p-5">
                      <p className={`chip ${style.bg} text-ink`}>Week {w.week}</p>
                      <ul className="mt-3 space-y-2 text-[1rem] leading-snug">
                        {w.activities.map((a) => (
                          <li key={a} className="flex gap-2">
                            <span aria-hidden="true" className={style.ink}>—</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="max-w-3xl space-y-3 text-[1.06rem] leading-relaxed text-ink-2">
                  {o.learningPoints!.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}
            </Section>
          )}

          {(o.languages?.length || o.skills?.length || o.backgrounds?.length) && (
            <Section title="What you bring" eyebrow="Requirements" id="bring">
              <div className="grid gap-6 sm:grid-cols-3">
                {o.languages?.length ? (
                  <div>
                    <p className="eyebrow mb-3 text-grey">Languages</p>
                    <SkillChips items={o.languages} />
                  </div>
                ) : null}
                {o.skills?.length ? (
                  <div>
                    <p className="eyebrow mb-3 text-grey">Skills</p>
                    <SkillChips items={o.skills} />
                  </div>
                ) : null}
                {o.backgrounds?.length ? (
                  <div>
                    <p className="eyebrow mb-3 text-grey">Backgrounds</p>
                    <SkillChips items={o.backgrounds} />
                  </div>
                ) : null}
              </div>
              <p className="mt-4 text-sm text-grey">Black = required, grey = nice to have.</p>
            </Section>
          )}

          {o.slots?.length ? (
            <Section title="Start dates" eyebrow="Pick your slot" id="slots">
              <ul className="grid gap-3 sm:grid-cols-2">
                {o.slots.map((s, i) => {
                  const live = !s.status || /^(live|open|active)$/.test(s.status);
                  return (
                    <li key={s.id ?? i} className={`rounded-2xl p-5 ring-2 ring-inset ${live ? "bg-white ring-line" : "bg-mist ring-transparent opacity-70"}`}>
                      <p className="display text-xl">
                        {formatDate(s.start)} → {formatDate(s.end)}
                      </p>
                      <p className="mt-2 font-bold text-grey">
                        {s.openings !== undefined && `${s.openings} ${s.openings === 1 ? "spot" : "spots"}`}
                        {s.closes && ` · apply by ${formatDate(s.closes)}`}
                        {!live && " · not taking applications"}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Section>
          ) : null}

          {o.coordinates && (
            <Section title="Where you'll be" eyebrow={o.city ?? "Poland"} id="where">
              <div className="grid items-center gap-6 rounded-2xl bg-mist p-6 md:grid-cols-2">
                <PolandMap
                  base={<PolandMapBase />}
                  points={[{ id: o.id, label: o.city ?? "Here", lat: o.coordinates.lat, lng: o.coordinates.lng, count: 1, labelled: true }]}
                  title={`Map of Poland showing ${o.city ?? "the project location"}`}
                />
                <div>
                  <p className="display-caps text-3xl">{o.city ?? "Poland"}</p>
                  {o.location && <p className="mt-2 font-bold text-grey">{o.location}</p>}
                  {o.coordinatesApproximate && <p className="mt-2 text-sm text-grey">Approximate location (city centre) — GIS has no exact coordinates for this project.</p>}
                  {o.citySlug && (
                    <Link href={`/cities/${o.citySlug}`} className="btn btn-ghost mt-5 text-ink hover:bg-ink hover:text-white">
                      Life in {o.city} <Arrow />
                    </Link>
                  )}
                </div>
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-2xl bg-white p-6 ring-2 ring-inset ring-line">
              <h2 className="display text-2xl">Your project</h2>
              <dl className="mt-4 divide-y divide-line">
                {facts
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-2.5">
                      <dt className="text-grey">{k}</dt>
                      <dd className="text-right font-bold">{v}</dd>
                    </div>
                  ))}
              </dl>
            </div>

            {hasLogistics && (
              <div className={`rounded-2xl ${style.soft} p-6`}>
                <h2 className="display text-2xl">What&apos;s included</h2>
                <p className="mt-1 text-sm text-grey">As listed by the host on AIESEC.</p>
                <ul className="mt-4 space-y-3">
                  {logistics
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <li key={k} className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-sm font-bold ${v === "Not included" ? "bg-white text-grey" : `${style.bg} text-ink`}`}
                          aria-hidden="true"
                        >
                          {v === "Not included" ? "–" : "✓"}
                        </span>
                        <span>
                          <span className="font-bold">{k}</span>
                          <br />
                          <span className="text-grey">{v}</span>
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {(lc || o.hostLc) && (
              <div className="rounded-2xl bg-white p-6 ring-2 ring-inset ring-line">
                <p className="eyebrow text-grey">Hosted by</p>
                {lc ? (
                  <>
                    <Image src={lc.logo} alt={`AIESEC ${lc.name} — ${lc.tagline}`} className="mt-3 h-auto w-full max-w-[240px]" sizes="240px" />
                    <p className="mt-2 text-sm text-grey">
                      The AIESEC {lc.name} team prepares this project and looks after you while you&apos;re here.
                    </p>
                  </>
                ) : (
                  <p className="mt-2 font-bold">{o.hostLc}</p>
                )}
                <Link href="/about#teams" className="mt-3 inline-block text-sm font-bold text-red-ink link-underline">
                  Meet the local teams
                </Link>
              </div>
            )}

            {o.program !== "igv" && o.sdg?.goal && (
              <div className="flex items-center gap-4 rounded-2xl bg-mist p-5">
                <span className="display grid h-14 w-14 shrink-0 place-items-center rounded-xl text-2xl text-white" style={{ background: SDG_COLORS[o.sdg.goal] }}>
                  {o.sdg.goal}
                </span>
                <p className="font-bold">Contributes to SDG {o.sdg.goal}: {sdgName(o.sdg.goal)}</p>
              </div>
            )}

            <div className="hidden rounded-2xl bg-ink p-6 text-white lg:block">
              <p className={`script text-4xl ${style.text}`}>{open ? "this could be you" : "this one's taken"}</p>
              <ApplyButton o={o} info={info} className="mt-4 w-full" />
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-mist py-16 md:py-20">
          <div className="frame">
            <h2 id="related-title" className="display text-[clamp(1.8rem,3.6vw,3rem)]">
              {related.some((r) => r.citySlug === o.citySlug) && o.city ? `More in and around ${o.city}` : `More ${info.name} projects`}
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <OpportunityCard o={r} hole="#f6f5f3" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Mobile apply bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur md:hidden">
        <ApplyButton o={o} info={info} className="w-full" />
      </div>
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
