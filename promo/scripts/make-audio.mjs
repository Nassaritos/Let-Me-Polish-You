#!/usr/bin/env node
/**
 * Synthesises the SFX kit as 16-bit WAVs (deterministic, royalty-free).
 *   npm run audio
 * (The music is a licensed track — see README.md.)
 */
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../public/audio/", import.meta.url));
fs.mkdirSync(OUT, { recursive: true });
const SR = 44100;
const BPM = 120;
const BEAT = 60 / BPM; // 0.5 s
const LEN = 24.6;

/* ------------------------------ utilities ------------------------------ */
let seed = 1234567;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648) * 2 - 1;
const buf = (sec) => new Float32Array(Math.ceil(sec * SR));
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

function biquad(type, freq, q = 0.707) {
  const w = (2 * Math.PI * freq) / SR, c = Math.cos(w), s = Math.sin(w), a = s / (2 * q);
  let b0, b1, b2, a0, a1, a2;
  if (type === "lp") { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
  else if (type === "hp") { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
  else { b0 = a; b1 = 0; b2 = -a; } // bandpass
  a0 = 1 + a; a1 = -2 * c; a2 = 1 - a;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return (x) => {
    const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    return y;
  };
}

function add(dst, src, at, gain = 1) {
  const o = Math.round(at * SR);
  for (let i = 0; i < src.length && o + i < dst.length; i++) if (o + i >= 0) dst[o + i] += src[i] * gain;
}

function reverb(input, mix = 0.25, size = 1) {
  const combs = [1557, 1617, 1491, 1422].map((d) => ({ d: Math.round(d * size), b: new Float32Array(Math.round(d * size)), i: 0, fb: 0.78 }));
  const aps = [225, 556].map((d) => ({ d, b: new Float32Array(d), i: 0 }));
  const out = new Float32Array(input.length);
  for (let n = 0; n < input.length; n++) {
    let s = 0;
    for (const c of combs) { const y = c.b[c.i]; c.b[c.i] = input[n] + y * c.fb; c.i = (c.i + 1) % c.d; s += y; }
    s *= 0.25;
    for (const a of aps) { const y = a.b[a.i]; const v = s + y * 0.5; a.b[a.i] = v; a.i = (a.i + 1) % a.d; s = y - v * 0.5; }
    out[n] = input[n] * (1 - mix) + s * mix;
  }
  return out;
}

function writeWav(name, L, R = L) {
  const n = L.length, data = Buffer.alloc(44 + n * 4);
  data.write("RIFF", 0); data.writeUInt32LE(36 + n * 4, 4); data.write("WAVE", 8); data.write("fmt ", 12);
  data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(2, 22); data.writeUInt32LE(SR, 24);
  data.writeUInt32LE(SR * 4, 28); data.writeUInt16LE(4, 32); data.writeUInt16LE(16, 34); data.write("data", 36); data.writeUInt32LE(n * 4, 40);
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = peak > 0 ? 0.89 / peak : 1;
  for (let i = 0; i < n; i++) {
    const l = Math.tanh(L[i] * g * 1.1) / Math.tanh(1.1), r = Math.tanh(R[i] * g * 1.1) / Math.tanh(1.1);
    data.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
    data.writeInt16LE(Math.round(r * 32767), 46 + i * 4);
  }
  fs.writeFileSync(OUT + name, data);
  console.log(name, (n / SR).toFixed(2) + "s");
}

/* ------------------------------ instruments ---------------------------- */
function kick(dur = 0.45, punch = 1) {
  const b = buf(dur); let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR, f = 46 + 110 * Math.exp(-t * 30) * punch;
    ph += (2 * Math.PI * f) / SR;
    b[i] = Math.sin(ph) * Math.exp(-t * 7.5) + (t < 0.004 ? rand() * 0.3 * (1 - t / 0.004) : 0);
  }
  return b;
}
function clap() {
  const b = buf(0.3), bp = biquad("bp", 1500, 0.9), hp = biquad("hp", 700);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const env = [0, 0.011, 0.022].reduce((s, o) => s + (t >= o ? Math.exp(-(t - o) * (o === 0.022 ? 14 : 90)) : 0), 0);
    b[i] = hp(bp(rand())) * env * 0.9;
  }
  return b;
}
function hat(open = false) {
  const b = buf(open ? 0.22 : 0.06), hp = biquad("hp", 8000), bp = biquad("bp", 10000, 0.6);
  for (let i = 0; i < b.length; i++) b[i] = bp(hp(rand())) * Math.exp(-(i / SR) * (open ? 14 : 70));
  return b;
}
function shaker() {
  const b = buf(0.08), hp = biquad("hp", 6000);
  for (let i = 0; i < b.length; i++) { const t = i / SR; b[i] = hp(rand()) * Math.min(1, t / 0.01) * Math.exp(-t * 45) * 0.5; }
  return b;
}
function pluck(note, dur = 0.6, bright = 0.5) {
  // Karplus–Strong
  const f = midi(note), p = Math.round(SR / f), line = new Float32Array(p), b = buf(dur);
  for (let i = 0; i < p; i++) line[i] = rand();
  let idx = 0, last = 0;
  for (let i = 0; i < b.length; i++) {
    const cur = line[idx];
    const nv = (cur * bright + last * (1 - bright)) * 0.996;
    last = cur; line[idx] = nv; idx = (idx + 1) % p;
    b[i] = cur * Math.min(1, i / 60);
  }
  return b;
}
function bass(note, dur) {
  const b = buf(dur), f = midi(note), lp = biquad("lp", 420, 0.9);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR; ph += f / SR;
    const saw = 2 * (ph % 1) - 1;
    const env = Math.min(1, t / 0.006) * (t > dur - 0.03 ? Math.max(0, (dur - t) / 0.03) : 1);
    b[i] = (Math.sin(2 * Math.PI * ph) * 0.8 + lp(saw) * 0.45) * env;
  }
  return b;
}
function pad(notes, dur, cutoff = 1800) {
  const b = buf(dur), lp = biquad("lp", cutoff, 0.6);
  const ph = notes.flatMap((n) => [0, 0.004, -0.004].map((d) => ({ f: midi(n) * (1 + d), p: (rand() + 1) / 2 })));
  for (let i = 0; i < b.length; i++) {
    const t = i / SR; let s = 0;
    for (const o of ph) { o.p += o.f / SR; s += 2 * (o.p % 1) - 1; }
    const env = Math.min(1, t / 0.35) * Math.min(1, (dur - t) / 0.6);
    b[i] = lp(s / ph.length) * env;
  }
  return b;
}
function riser(dur, from = 300, to = 6000) {
  const b = buf(dur); let f = from; const filt = { bp: null };
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR, k = t / dur;
    f = from * Math.pow(to / from, k);
    const w = (2 * Math.PI * f) / SR, c = Math.cos(w), s = Math.sin(w), a = s / (2 * 2.5);
    const x = rand();
    const y = ((a * x - a * x2) - (-2 * c) * y1 - (1 - a) * y2) / (1 + a);
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    b[i] = y * Math.pow(k, 1.6) * 1.4;
  }
  void filt;
  return b;
}
function crash(dur = 2) {
  const b = buf(dur), hp = biquad("hp", 4000);
  for (let i = 0; i < b.length; i++) b[i] = hp(rand()) * Math.exp(-(i / SR) * 2.2) * 0.6;
  return b;
}

/* --------------------------------- SFX --------------------------------- */
const tick = buf(0.05); { const bp = biquad("bp", 3200, 3); for (let i = 0; i < tick.length; i++) tick[i] = bp(rand()) * Math.exp(-(i / SR) * 120) * 2; }
writeWav("tick.wav", tick);

const whoosh = buf(0.45); { const bp = biquad("bp", 900, 0.8); for (let i = 0; i < whoosh.length; i++) { const t = i / whoosh.length; whoosh[i] = bp(rand()) * Math.sin(Math.PI * t) ** 2; } }
writeWav("whoosh.wav", reverb(whoosh, 0.2));

const brush = buf(0.5); { const hp = biquad("hp", 1800), bp = biquad("bp", 3500, 0.7); for (let i = 0; i < brush.length; i++) { const t = i / brush.length; brush[i] = bp(hp(rand())) * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.6)), 1.5) * (1 - t * 0.5) * 1.4; } }
writeWav("brush.wav", brush);

const hit = buf(1.2); add(hit, kick(1.2, 1.4), 0, 1); add(hit, crash(1.2), 0.005, 0.25);
writeWav("hit.wav", hit);

const tap = buf(0.12); { let ph = 0; for (let i = 0; i < tap.length; i++) { const t = i / SR; ph += (900 * Math.exp(-t * 25) + 500) / SR; tap[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 45); } }
writeWav("tap.wav", tap);

const flick = buf(0.12); { const bp = biquad("bp", 2400, 1.2); for (let i = 0; i < flick.length; i++) { const t = i / SR; flick[i] = bp(rand()) * Math.min(1, t / 0.004) * Math.exp(-t * 55) * 1.5; } }
writeWav("flick.wav", flick);
