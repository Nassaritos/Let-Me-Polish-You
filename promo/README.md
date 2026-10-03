# Let Me Polish You — launch video

Social launch video for **let-me-polish-you.vercel.app** (AIESEC in Poland), built with Remotion.

| Output | Use |
| --- | --- |
| `output/let-me-polish-you-launch.mp4` | **Master** — 1080×1920, 30 fps, H.264, 29.4 s, with music |
| `output/let-me-polish-you-launch-no-music.mp4` | Same cut with SFX only — for adding a trending sound in Instagram/TikTok |

## Music credit (required — CC BY 3.0)

> Music: "Cow Boy Fest" by Dorine Levy — https://www.jamendo.com/track/1379767 — licensed under CC BY 3.0
> (https://creativecommons.org/licenses/by/3.0/)

Put this line in the post caption or description wherever the version **with music** is published.

## Everything shown is real

- UI = screenshots of the **deployed** site, captured by `scripts/capture.mjs` (no mock screens). The exact
  opportunities and the live count at capture time are recorded in `public/site/manifest.json`.
- Photos = the website's own photography (`public/photos/`); logos = the campaign logo and official AIESEC marks.
- The phone "screen recording" is those captures animated (scroll, tap, scale-through) — no cursor, address bar or loading states.

## Make / re-make it

```bash
npm install
npx playwright install chromium-headless-shell   # once, for capture + rendering
npm run capture        # re-capture the live site (opportunities change daily)
npm run audio          # (re)build the SFX kit
npm run render         # master  → output/let-me-polish-you-launch.mp4
npm run render:nomusic # no-music version
npm run render:network # internal network launch (MC page) → output/let-me-polish-you-network-launch.mp4 — see storyboard-network.md
npm run studio         # preview/edit in Remotion Studio
```

If Remotion can't find a browser, pass one: `npx remotion render … --browser-executable=<path to chrome-headless-shell>`.
`scripts/finalize.mjs` converts Remotion's full-range output to standard `yuv420p` + fast-start for social upload
(the npm render scripts run it automatically).

## Edit structure

- `src/theme.ts` — colours, fonts, easing, **beat grid (100 BPM → 18 frames/beat)**, scene lengths in beats.
- `src/scenes/` — `Opening` (hook, POLAND., montage), `Programs` (Give/Grow/Teach, card fan), `Proof` (cards, dates, map, site flow, CTA).
- `src/Video.tsx` — scene order, overlaps, music + SFX.
- `storyboard.md` — storyboard, review and final cut.

### Swapping the music

Replace the file and update `MUSIC` in `src/theme.ts` (`file`, `startSec` = where the song's drop minus 3.6 s is,
`credit`). If the new track isn't 100 BPM, change `BPM` — every scene length is defined in beats and re-times
automatically. Check the licence allows sync (no "ND"/"NC"; avoid "SA").

## Other formats

`LaunchSquare` (1080×1080) and `LaunchLandscape` (1920×1080) compositions exist and scale from the short side
(`npm run render:square`, `npm run render:landscape`). They are **not yet art-directed** — review before posting.
