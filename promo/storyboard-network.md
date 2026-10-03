# LET ME POLISH YOU — network launch video (internal)

**Where:** AIESEC in Poland MC page — internal, for AIESECers in other entities.
**Audience:** outgoing exchange teams (oGX), VPs and members who talk to EPs every day.
**Message:** *AIESEC in Poland launched a live search tool for every Polish opportunity. Use it to find the right
project for your EPs, share it with them, and match with us.* It's also a launch moment / milestone for AIESEC Poland.

**Format:** 1080×1920, 30 fps, 45.0 s = 75 beats at 100 BPM (18 frames/beat).
**Music:** "Cow Boy Fest" — Dorine Levy (CC BY 3.0), same cut point: the drop lands on the launch (beat 6).
**Rule:** every screen = live capture of the deployed site (`npm run capture`); every number comes from
`public/site/manifest.json` (captured 2 Oct 2026: 31 open opportunities, 25 places, 9 active host LCs).
AIESEC vocabulary is fine here (EPs, LCs, GIS, matching) — this is an internal audience.

## Storyboard

| Beats | Time | Visual | Text on screen | Audio | Transition |
| --- | --- | --- | --- | --- | --- |
| 0–6 | 0.0–3.6 | Ink stage, AIESEC logo; countdown numerals on beats 3·2·1 | `network, big news from` · AIESEC in Poland → `3` `2` `1` | Song intro | Numerals slam in on each beat |
| 6–10 | 3.6–6.0 | Red slam (on the drop). Campaign logo pops, "NOW LIVE" stamp | Let Me Polish You · `NOW LIVE` · `our new search tool` | Drop + brush | Red rises during the lead, lands on the beat |
| 10–16 | 6.0–9.6 | Real desktop homepage in a floating screen, slow push | `EVERY POLISH OPPORTUNITY.` `ONE SEARCH TOOL.` · Global Volunteer · Global Talent · Global Teacher | Groove | Screen tilts in from below |
| 16–21 | 9.6–12.6 | Ink stage, three live counters | `31 live opportunities` `25 places` `9 host LCs` · `● Synced with GIS · refreshes every 5 min` · `Live numbers as of 2 Oct 2026` | Ticks per counter | Counters count up on consecutive beats |
| 21–28 | 12.6–16.8 | Real explorer screen → push into the real filter panel, each filter group outlined on a beat | `FIND THE RIGHT PROJECT FOR EVERY EP` · `WHERE?` `HOW LONG?` `WHEN?` `WHICH GOAL?` | Flicks | Camera push into filters; outline boxes draw on |
| 28–33 | 16.8–19.8 | Three colour bars → the real product cards fanned | `3 PRODUCTS. 3 PAGES.` | Brush | Colour bars collapse into the cards (match cut) |
| 33–37 | 19.8–22.2 | Live map of Poland | `EVERY PLACE ON ONE MAP` | — | Map rises |
| 37–47 | 22.2–28.2 | Phone: real opportunity page (Global Classroom · Tymbark) scrolls and stops on each section, then taps Apply | `DATES & SPOTS` → `SDG IMPACT` → `WEEK-BY-WEEK PLAN` → `REQUIREMENTS` → `WHAT'S INCLUDED` → `ONE TAP TO aiesec.org` | Soft whooshes, tap | Eased scroll stops on beats; pinned header + apply bar like the real site |
| 47–55 | 28.2–33.0 | Real Life in Poland grid + "How it works" steps | `CONTENT YOUR EPs WILL LOVE` · `Life in Poland · Polish 101 · city guides · What's AIESEC?` | Groove | Grid drifts up; steps card slides over |
| 55–61 | 33.0–36.6 | The 9 active LC logos land on the beat, one by one | `9 HOST LCs. ONE TEAM.` | Flicks | Staggered pop-in (real campaign logos) |
| 61–69 | 36.6–41.4 | Ink stage, three steps | `HOW TO USE IT` · `1 Share the link with your EPs` · `2 Send a filtered link` (`/opportunities?sdg=4` — a real explorer filter) · `3 They apply on aiesec.org — we match` | Ticks | Each step on its own beat pair |
| 69–75 | 41.4–45.0 | Red end card | logo · `LET'S MATCH.` · URL · AIESEC in Poland | Final hit, fade | Logo bouncy; hold 3 s |

## Review

| Question | Answer |
| --- | --- |
| Does the first second earn attention from busy AIESECers? | "network, big news from AIESEC in Poland" + a countdown — reads as an event, not an ad. |
| Is it clearly a launch / milestone? | Countdown → drop → NOW LIVE stamp, on the music's drop. |
| Does it show what the tool *does* (not just looks)? | Live counts, filters, products, map, a full opportunity page, EP content, host LCs. |
| Is the ask clear? | Three concrete steps + "LET'S MATCH." + URL held 3 s. |
| Honesty | Numbers are live captures with their date; no invented features (GIS sync = the site's 5-min refresh; filtered links = real URLs). |
| Too long? | 45 s is fine for an internal page post; each section ≥ 2.4 s so it reads. |

## Build notes

- Composition `NetworkVertical` (`src/NetworkVideo.tsx`, scenes in `src/network/`), rendered with `npm run render:network`
  → `output/let-me-polish-you-network-launch.mp4` (45.0 s, 1080×1920, H.264 yuv420p, audio peak −1.6 dBFS, no clipping).
- Every count, LC name, filter outline position and page section stop is read from `public/site/manifest.json`, so
  `npm run capture && npm run render:network` refreshes the whole video with today's live data.
- Review pass fixes: "LCs/EPs" kept lowercase-s inside caps, SDG stop re-aimed at the top of the goal card, map card kept
  inside the frame, filters pill shortened so it never wraps, "How to use it" block centred vertically.

## Re-cut (v2) — slower, no numbers card

Feedback: drop the live-numbers card; slow down so every frame can be read. Same 100 BPM grid and song cut (drop still on
beat 6), now 97 beats = **58.2 s**: open 6 · live 5 · what 8 · search 11 (a filter every 1.5 beats) · products 6 · map 6 ·
page 15 (a section every 2.5 beats, slower scroll) · content 12 · LCs 9 · how-to 12 · end 7.
