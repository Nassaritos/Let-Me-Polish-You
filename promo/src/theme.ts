// theme.ts — single source of truth (colours, type, easing, springs, beat grid).
// Never inline colours or easings in components.
import { Easing } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadMadi } from "@remotion/google-fonts/MsMadi";
import { loadFont as loadLato } from "@remotion/google-fonts/Lato";

const montserrat = loadMontserrat("normal", { weights: ["800", "900"], subsets: ["latin", "latin-ext"] });
const madi = loadMadi("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const lato = loadLato("normal", { weights: ["700", "900"], subsets: ["latin", "latin-ext"] });

export const theme = {
  // Website brand: white paper, black ink, the logo's red swoosh. Product colours = official AIESEC.
  colors: {
    red: "#FC3A3A", // hero colour (logo swoosh)
    redInk: "#D92B2B",
    ink: "#151515",
    paper: "#FFFFFF",
    mist: "#F6F5F3",
    grey: "#5C5C5C",
    gv: "#F85A40",
    gta: "#0CB9C1",
    gte: "#F48924",
    blue: "#037EF3", // AIESEC blue — only where the site uses it (What's AIESEC?)
  },
  fonts: {
    display: montserrat.fontFamily, // heavy caps — the "POLISH" voice
    script: madi.fontFamily, // thin signature script — the "let me … you" voice
    body: lato.fontFamily,
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    slam: { damping: 18, stiffness: 260, mass: 0.7 },
  },
} as const;

/**
 * Beat grid — locked to the soundtrack: "Cow Boy Fest" by Dorine Levy (CC BY 3.0),
 * measured at exactly 100 BPM → 18 frames per beat at 30 fps.
 */
export const BPM = 100;
export const FPS = 30;
export const BEAT = (FPS * 60) / BPM; // 18
export const BAR = BEAT * 4; // 72

/** Where the video starts inside the song (seconds) — chosen so the song's drop lands on "POLAND.". */
export const MUSIC = {
  file: "audio/cow-boy-fest-dorine-levy.mp3",
  startSec: 21.937, // song beat 36; the drop is song beat 42 = video beat 6
  credit: '"Cow Boy Fest" by Dorine Levy — CC BY 3.0 — jamendo.com/track/1379767',
};

type Slot = { from: number; dur: number };

/** Turn scene lengths (in beats) into frame slots. */
export function timeline<K extends string>(beats: Record<K, number>) {
  let at = 0;
  const out = {} as Record<K, Slot>;
  for (const k of Object.keys(beats) as K[]) {
    out[k] = { from: at * BEAT, dur: beats[k] * BEAT };
    at += beats[k];
  }
  return { ...out, total: at * BEAT };
}

/** Public launch video (storyboard.md). */
export const T = timeline({ hook: 6, poland: 3, montage: 6, programs: 9, choose: 3, projects: 9, flow: 7, cta: 6 });

/** Internal network video (storyboard-network.md). */
export const TN = timeline({ open: 6, live: 5, what: 8, search: 11, products: 6, map: 6, page: 15, content: 12, lcs: 9, ask: 12, end: 7 });
