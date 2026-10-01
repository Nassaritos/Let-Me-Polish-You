# Let Me Polish You — design analysis

Research before the redesign: whereitallbegins.aiesec.org.eg (+ its iGV/iGTa/iGTe pages),
aiesec.org.eg, aiesec.it and the official brand kit at logos.aiesec.org.

## What makes something feel like AIESEC

1. **Youth-oriented** — people are the subject, places are the backdrop. Hero images are
   groups of young people laughing, hugging, carrying cameras; the pyramids sit behind them.
   aiesec.it opens with a grid of real exchange group photos behind the walking-human mark.
2. **Serious + energetic** — the information is plain and practical (live opening counts,
   start dates, host LC, FAQ), while the *framing* is energetic: heavy rounded sans,
   uppercase statements, scribble underlines, brush strokes, script accents ("where it all").
3. **International** — multilingual marquees ("Egypt مصر मिस्र Egito …"), testimonials with
   names and programmes, "Exchange every year / Countries" counters.
4. **Photography** — candid, warm, imperfect, group shots; often darkened or tinted so type
   sits on top. Never sterile stock.
5. **Colour** — the official palette is loud and optimistic: Blue `#037EF3` (brand),
   Red `#F85A40` (GV), Teal `#0CB9C1` (GTa), Orange `#F48924` (GTe), plus Purple `#7552CC`,
   Green `#00C16E`, Yellow `#FFC845`, Grey `#52565E`, Light `#F5F5F5`. Program colours are used
   consistently as each program's identity.
6. **Typography** — Lato 900 everywhere: rounded, heavy, friendly. Short punchy headlines
   ("Behind each exchange a STORY", "This is the first step to change the world"), one word
   emphasised with weight or a hand-drawn underline.
7. **"About to have an experience"** — journey language (Why Egypt → My Journey → Programs),
   second-person promises ("Develop your leadership…"), the walking human always moving.
8. **Young people, for young people** — "youth-run", member counts, testimonials from peers,
   "Made with 💛 in Egypt", chat bubble.
9. **Exciting not corporate** — each program gets a local symbol in its colour (a pyramid in
   GV red / GTa teal / GTe orange) and a verb-like name (Volunteer Abroad, Intern Abroad,
   Teach Abroad). Pill buttons, white on colour.

## Translation to Poland

| AIESEC principle | Poland version |
| --- | --- |
| Local symbol in program colours (pyramid) | **Wycinanki** — Polish folk paper-cut rosettes, drawn as a geometric SVG and cut in GV red / GTa teal / GTe orange. Used as program emblems and stickers, sparingly. |
| Multilingual marquee | "Polska · Poland · Polonia · Pologne · Polen · Польша · 波兰 · بولندا …" plus a tiny "Polish 101" (Cześć = hi, Dziękuję = thank you) as playful micro-content. |
| People first | Hero and program sections lead with people (workshops, classrooms, streets, cafés, travellers); mountains and lakes are supporting imagery. |
| Bold rounded sans + script accent | **Bricolage Grotesque** (heavy, contemporary, a little quirky) for display, **Lato** (AIESEC's own web font) for text, **Caveat** for hand-written annotations. |
| Official palette | AIESEC Blue as the brand field (hero, nav, CTAs); program colours for program identity; Yellow for highlighter marks; white and `#F5F5F5` neutrals; deep navy `#0A1F44` for dark sections. No beige, no black-on-beige. |
| Live, practical opportunities | Live count in the first viewport, program chips with live numbers, explorer one click away. |
| Walking human | The official AIESEC logo + human mark in nav/footer and as a quiet motion cue. |

## Rules for this build
- First viewport must say: Poland + AIESEC + real opportunities you can apply to.
- Motion: reveals and scroll-linked drift only; no autoplaying loops except one slow marquee
  (paused for reduced motion).
- No invented content: testimonials render only when real ones are added to
  `lib/content/stories.ts` (development shows clearly labelled placeholders).
