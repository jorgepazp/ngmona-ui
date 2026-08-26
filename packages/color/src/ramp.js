export const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Each step's position toward the light bound (positive) or dark bound (negative), as a FRACTION
// of the headroom actually available between the seed and that bound — not a fixed absolute L
// offset. This is what guarantees the ramp is always strictly monotonic and always spreads across
// whatever range genuinely exists for a given seed.
//
// A fixed-offset-then-clamp design (the previous approach) breaks down for any seed that's
// already close to one bound: e.g. a pale seed at L=0.86 with a +0.42 offset for step 50 wants
// L=1.28, which clamps to 0.99 — and so do steps 100/200/300, whose smaller offsets *also*
// overshoot 0.99. All four collapse onto the same clamped value. Proportional positioning instead
// asks "how far toward white is this step, given only 0.13 of headroom actually exists here?" —
// step 50 still lands at the 0.99 ceiling (it's supposed to be the lightest step), but 100/200/300
// are spread across the remaining fraction of that same 0.13, so they stay visually distinct
// instead of also piling up at the ceiling.
const LIGHTNESS_POSITION = {
  50: 1,
  100: 0.85,
  200: 0.65,
  300: 0.45,
  400: 0.22,
  500: 0,
  600: -0.22,
  700: -0.42,
  800: -0.62,
  900: -0.8,
  950: -0.92,
};

// Multiplied against the seed's own chroma. Tapered toward both ends — sRGB's in-gamut chroma
// shrinks sharply near L≈0/L≈1, so holding chroma constant either blows out or looks muddy.
const CHROMA_FACTOR = {
  50: 0.2,
  100: 0.35,
  200: 0.55,
  300: 0.75,
  400: 0.9,
  500: 1,
  600: 0.97,
  700: 0.9,
  800: 0.78,
  900: 0.65,
  950: 0.5,
};

const MIN_L = 0.06;
const MAX_L = 0.99;

// Below this much headroom on a side, even spreading proportionally can't make steps on that side
// look meaningfully different — there just isn't enough room left between the seed and the bound.
// This is a real perceptual limit (you can't fit 5 distinct lighter swatches above a seed that's
// already almost pure white), not a bug, so it stays a warning with an actionable suggestion
// rather than something the math can paper over.
const MIN_USABLE_HEADROOM = 0.08;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Turns one seed OKLCH color into an 11-step ramp. The seed anchors exactly at step 500; every
 * other step's lightness/chroma is derived from it, hue is held constant. Values are NOT yet
 * gamut-mapped — that happens at format time (see gamut.js), once per consumer of the ramp.
 *
 * @param {{ l: number, c: number, h: number }} seed
 * @returns {Record<number, { l: number, c: number, h: number }>}
 */
export function generateRamp(seed) {
  const seedL = clamp(seed.l, MIN_L, MAX_L);
  const headroomAbove = MAX_L - seedL;
  const headroomBelow = seedL - MIN_L;

  if (headroomAbove < MIN_USABLE_HEADROOM) {
    console.warn(
      `[@ngmona-ui/color] seed lightness ${seedL.toFixed(3)} leaves only ${headroomAbove.toFixed(3)} of ` +
        'headroom above it — steps lighter than 500 will be hard to tell apart no matter how they\'re ' +
        'spread. Pick a seed with a lower lightness (a less pale color) if you need those steps distinct.',
    );
  }
  if (headroomBelow < MIN_USABLE_HEADROOM) {
    console.warn(
      `[@ngmona-ui/color] seed lightness ${seedL.toFixed(3)} leaves only ${headroomBelow.toFixed(3)} of ` +
        'headroom below it — steps darker than 500 will be hard to tell apart no matter how they\'re ' +
        'spread. Pick a seed with a higher lightness (a less dark color) if you need those steps distinct.',
    );
  }

  const ramp = {};
  for (const step of RAMP_STEPS) {
    const position = LIGHTNESS_POSITION[step];
    const l = position >= 0 ? seedL + position * headroomAbove : seedL + position * headroomBelow;
    const c = Math.max(0, seed.c * CHROMA_FACTOR[step]);
    ramp[step] = { l, c, h: seed.h };
  }

  return ramp;
}
