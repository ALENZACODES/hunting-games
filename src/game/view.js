// World ↔ screen geometry.
// The game renders at a fixed 1920×1080 logical resolution. The camera sits
// 1.6 m above flat ground looking at the horizon with a 45° horizontal field
// of view, so sizes and distances are physically consistent: a 1 m tall deer
// at 100 m is 23 px tall, and one milliradian is 2.318 px before zoom.

export const W = 1920;
export const H = 1080;
export const F = 2318; // focal length in px (W/2 / tan(22.5°))
export const CAM_H = 1.6;
export const MIL = F / 1000; // px per milliradian at 1×

export function project(view, x, alt, d) {
  const dd = Math.max(0.5, d);
  return {
    sx: W / 2 + (F * (x - view.camX)) / dd,
    sy: view.horizonY + (F * (CAM_H - alt)) / dd,
    ppm: F / dd,
  };
}

// lateral metres for a given screen x at distance d
export function xForScreen(view, sx, d) {
  return ((sx - W / 2) * d) / F + view.camX;
}

// altitude for a given screen y at distance d
export function altForScreen(view, sy, d) {
  return CAM_H - ((sy - view.horizonY) * d) / F;
}

// distance where the ground appears at screen y (Infinity above the horizon)
export function groundDistance(view, sy) {
  const dy = sy - view.horizonY;
  if (dy <= 0.5) return Infinity;
  return (F * CAM_H) / dy;
}

// seeded random
export function rng(seed) {
  let a = typeof seed === 'string' ? [...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7) : seed | 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = (arr) => arr[(Math.random() * arr.length) | 0];
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
