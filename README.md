# Let Me Polish You

AIESEC in Poland's site for international young people: live **Global Volunteer**, **Global Talent** and
**Global Teacher** opportunities in Poland, straight from AIESEC GIS.

## Pages

| URL | What it is |
| --- | --- |
| `/` | Home: what this is → choose an experience → live picks → map of places → life in Poland → local teams |
| `/global-volunteer`, `/global-talent`, `/global-teacher` | One page per experience, with its live projects and filters |
| `/opportunities` | Every live opportunity, with search, filters and a map |
| `/opportunities/[id]` | One opportunity, its host team, and **Apply on aiesec.org** |
| `/poland`, `/cities/[city]` | Life in Poland and the places with live projects |
| `/about` | What's AIESEC? — the organisation, its three programs, how it works, FAQ, the local teams |

## Live data

Opportunities are fetched server-side from the AIESEC GIS GraphQL API (`lib/gis/`) and cached for
`GIS_REVALIDATE_SECONDS` (default 300). Nothing is hard-coded: counts, cities, dates and openings all come from GIS.
The GIS token never reaches the browser.

## Environment variables

| Name | Required | Notes |
| --- | --- | --- |
| `GIS_TOKEN` | yes | AIESEC GIS access token. **Never** prefix it with `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_SITE_URL` | yes in production | e.g. `https://letmepolishyou.pl` — used for canonical URLs, sitemap, share images |
| `GIS_REVALIDATE_SECONDS` | no | `0` = always fetch fresh |
| `REVALIDATE_SECRET` | no | enables `POST /api/revalidate` to refresh data immediately |

Copy `.env.example` to `.env.local` for local development.

## Develop

```bash
npm install
npm run dev
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`, and against live GIS `npm run gis:check` / `npm run gis:introspect`.

## Deploy

Needs a Node server (not GitHub Pages). Import the GitHub repo into Vercel (or Netlify/Render), add the environment
variables above, deploy. Every push to `main` redeploys; opportunity data refreshes on its own.

## Content you can edit

- `lib/lcs.ts` — local committees, logos, taglines, and the GIS names they match (each logo links to its city page)
- `lib/content/programs.ts` — program descriptions
- `lib/content/stories.ts` — real participant stories (section hidden until you add some)
- `lib/images.ts` — every photo with its licence and credit
