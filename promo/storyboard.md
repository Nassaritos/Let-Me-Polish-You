# LET ME POLISH YOU — launch video storyboard

**Format:** 1080×1920, 30 fps · **Final cut: 29.4 s (882 frames) at 100 BPM → 1 beat = 18 frames** (see "Final cut" at the bottom — v1 below was 24 s at 120 BPM and was judged too fast).
**Story:** CURIOUS → DISCOVER → CHOOSE → PROVE → ACT.
**Rule:** everything shown exists on the live site (`let-me-polish-you.vercel.app`). UI = real screenshots
captured from the deployed site by `scripts/capture.mjs`; photos = the site's own photography; numbers/opportunities
= whatever the live site showed at capture time (see `public/site/manifest.json`). Program names follow the site:
Global Volunteer / Global Talent / Global Teacher (no iGV/iGTa/iGTe — the site never shows those).

## v1 storyboard

| Time | Frames | Visual | Text on screen | Audio | Transition / motion |
| --- | --- | --- | --- | --- | --- |
| 0.0–2.0 | 0–60 | Real Poland photos flicker full-bleed, one per 8th note (Kraków, Tatras, festival, Warsaw, pierogi…), darkened | `you said you wanted to go abroad.` → (beat 3) `so… where are we going?` | Hats + rising noise riser | Hard cuts on 8ths; line 1 slides up and shrinks when line 2 lands |
| 2.0–3.5 | 60–105 | Brand-red frame. Giant white **POLAND.** with the logo's brush swoosh sweeping through it | script `next stop:` · **POLAND.** | Drop: kick + bass hit + brush whoosh | Red panel slams up from bottom on the downbeat; swoosh draws L→R |
| 3.5–6.0 | 105–180 | Polaroid photos (site's label-box style) land in a pile, one per beat, Ken Burns inside | `MEET PEOPLE.` `SEE THIS.` `DO SOMETHING REAL.` `EAT PIEROGI.` `STAY OUT LATE.` (one per beat) | Groove, soft paper-flick per polaroid | Polaroids spring in with rotation from alternating sides; text swaps on each beat |
| 6.0–7.5 | 180–225 | Product colour #F85A40 wipes up; real exchange photo (goodbye hug) in a window; Global Volunteer logo | **GIVE.** · Global Volunteer | Clap accent | Colour wipe from bottom on beat; word scales down from 1.4 |
| 7.5–9.0 | 225–270 | Teal #0CB9C1 wipe; Warsaw skyline; Global Talent logo | **GROW.** · Global Talent | Clap accent | Same wipe, opposite direction (match rhythm) |
| 9.0–10.5 | 270–315 | Orange #F48924 wipe; real classroom photo; Global Teacher logo | **TEACH.** · Global Teacher | Clap accent | Same wipe |
| 10.5–12.0 | 315–360 | The three colours become the coloured tops of the **real "Choose your experience" cards** (site screenshot) | `WHICH ONE IS YOURS?` | Snare roll into 12.0 | Three colour bars shrink into the card borders (match cut) |
| 12.0–14.0 | 360–420 | Real opportunity cards from the live site fan in (Global Classroom · Gorzyce, Junior Sales Business Developer · Wrocław, English teacher · Iława) | `REAL PROJECTS.` | Hit + card "snap" ticks | Cards spring in staggered 15f, stack with tilt |
| 14.0–15.5 | 420–465 | Camera push into the Global Classroom card's DURATION / STARTS / SPOTS row; hand-drawn red circle around "Nov 2026" | `REAL DATES.` | Riser tick | Eased zoom 1→2.3 with pan; circle draws on |
| 15.5–17.5 | 465–525 | Real map section (dark) with live places; slow push-in | `ALL OVER POLAND.` | Groove | Map slides up behind the card stack as cards exit up |
| 17.5–21.0 | 525–630 | Phone-screen flow of the real mobile site: home hero scrolls to "Choose your experience" → tap → Global Volunteer page → projects list → tap → opportunity → tap **Apply on aiesec.org** | `FIND YOUR EXPERIENCE` → `PICK A PROJECT` → `APPLY` | UI taps, soft whooshes on each screen change | Tap ripple → scale-through into the next screen (the tapped thing becomes the next page) |
| 21.0–24.0 | 630–720 | Red frame. Real "let me POLISH you" logo (white) pops; URL in a white label-box; "Powered by AIESEC" | `Find your experience in Poland.` · `let-me-polish-you.vercel.app` · AIESEC in Poland | Final hit + short pad tail | Logo bouncy spring; URL slides up; hold ≥2 s |

## Review of v1

| Question | Verdict | Change |
| --- | --- | --- |
| Hook strong enough? | Mostly. Text-first hooks die if the first frame is static. | Photos flicker **from frame 0**; first word lands by frame 4. |
| Something visual immediately? | Yes (flicker). | Keep flicker fast (every 8th note) but darkened so text stays readable silent. |
| Viewer understands Poland? | Yes by 2.5 s — POLAND. slam + real places. | Tighten POLAND hold to 45 frames (was going to be longer). |
| Understands AIESEC? | Weak — AIESEC only at the end. | Add `AIESEC IN POLAND` small caps under POLAND. and product logos in GIVE/GROW/TEACH (official AIESEC marks). |
| Understands the three programs? | Yes — one beat-synced card each + real chooser. | Keep subtitles to the product name only (no paragraphs). |
| Sees real opportunities? | Yes — real cards, real date circled, real map. | Cards are live captures; manifest records which. Avoid quoting a total count in big type (it changes daily). |
| CTA clear? | Yes. | URL in a white label-box (site's button language); hold 2+ s. |
| Too slow? | Website flow (3.5 s) risks feeling like a demo. | Each screen ≤ 22 frames; captions are actions, not features. |
| Anything unnecessary? | Montage text "EAT PIEROGI" + "STAY OUT LATE" may be one too many. | Keep 4 beats: `MEET PEOPLE.` `SEE THIS.` `MAKE AN IMPACT.` `EAT PIEROGI.` (pierogi = the human/funny beat). |
| Cringe check | No slang, no POV, no emojis. "so… where are we going?" is conversational, not try-hard. | Keep. |

Balance check (v1 revised): experience ≈ 12 s (hook, Poland, montage, Give/Grow/Teach) · website/proof ≈ 9 s (cards, dates, map, flow) · brand ≈ 3 s (end card). Close to 60/30/10 — website is shown *as proof of the experience*, not as the subject.

## Audio

- **Music:** original 120 BPM track synthesised by `scripts/make-audio.mjs` (royalty-free by construction): sparse intro with
  hats + riser (0–2 s), drop on the POLAND. downbeat, warm plucked chords + sub bass + claps, short break before the
  final hit at 21.0 s, pad tail. Swap for a licensed track by replacing `public/audio/music.wav` (keep 120 BPM or
  change `BPM` in `src/theme.ts`).
- **SFX** (same script): tick, whoosh, brush swoosh, bass hit, tap, paper flick — placed 2 frames before visual hits.


## Final cut (v3) — after review

Feedback on v1: *too fast, music weak.* Changes:

- **Music:** the synthesised placeholder was replaced with a real CC BY track — "Cow Boy Fest" by Dorine Levy
  (indie/synth-pop, Jamendo, CC BY 3.0). Chosen by tempo/structure analysis (measured exactly 100 BPM, clean drop at
  25.54 s). The video starts at 21.94 s into the song so the drop lands exactly on **POLAND.** (verified on the encode:
  −21 dB → −11 dB at 3.6 s).
- **Pace:** whole edit re-timed to 100 BPM and 49 beats (≈30 % slower). One hook photo per beat (was per half-beat),
  a polaroid every 1.5 beats, each program a full 3 beats, CTA held 3.6 s.
- **Dead frames fixed:** scenes that land on a downbeat start 6 frames early (overlap), so the hit is *on* the beat.
- **"Which one is yours?"** now fans the three real program cards like a hand of cards (cropped from the live capture).
- **"REAL DATES."** gets a white veil so the zoomed card doesn't fight the headline; the circle sits on the real date.
- **Delivery:** yuv420p (TV range), H.264 High, +faststart; peak −1 dBFS, no clipping.

| Beat | Time | Scene | On screen |
| --- | --- | --- | --- |
| 0–6 | 0.0–3.6 | Hook — real photos, one per beat | `you said you wanted to go abroad.` → `so… WHERE ARE WE GOING?` |
| 6–9 | 3.6–5.4 | Drop — red panel, logo swoosh | `next stop: POLAND.` · AIESEC in Poland |
| 9–15 | 5.4–9.0 | Polaroids (site captions) | `MEET PEOPLE.` `SEE THIS.` `MAKE AN IMPACT.` `EAT PIEROGI.` |
| 15–24 | 9.0–14.4 | Product colours + official logos | `GIVE.` `GROW.` `TEACH.` + site promises |
| 24–27 | 14.4–16.2 | Colour bars → real cards fan | `WHICH ONE IS YOURS?` |
| 27–36 | 16.2–21.6 | Live cards → date push → live map | `REAL PROJECTS.` `REAL DATES.` `ALL OVER POLAND.` |
| 36–43 | 21.6–25.8 | Real mobile site: home → Global Volunteer → project → Apply | `FIND YOUR EXPERIENCE` `PICK A PROJECT` `APPLY.` |
| 43–49 | 25.8–29.4 | End card | logo · `find your experience IN POLAND.` · URL · Powered by AIESEC |

### Self-critique (final)

| Question | Score | Why |
| --- | --- | --- |
| Hook — would I stop? | 4/5 | Direct-address question over moving real photos from frame 0; works muted. Could be stronger with real people-video. |
| AIESEC | 4/5 | AIESEC mark on the drop, official product logos/colours, "Powered by AIESEC"; youth-led tone. |
| Youth | 4/5 | Conversational copy, festival/friends imagery, no slang or POV clichés. |
| Poland | 4/5 | Real places, food, people; POLAND. lands on the musical drop. |
| Product | 5/5 | The three experiences + the real site flow to "Apply on aiesec.org". |
| Proof | 5/5 | Real live cards, a real circled date, the real map — all captured from the deployed site. |
| Emotion | 4/5 | Music now carries it; would be stronger still with real participant video. |
| CTA | 5/5 | URL in the site's button style, held 3.6 s. |
