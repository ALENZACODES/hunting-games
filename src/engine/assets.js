// Image loader with clean-up for generated art.
//
// Sprites (anything that is not a background) are processed once on load:
//   1. If the picture has a plain, opaque background (white, grey, green…),
//      that background is removed by flood-filling from the edges.
//   2. Empty margins are trimmed so the sprite's width is the animal itself.
// The result is cached as a canvas. Missing files resolve to null and the
// caller draws its stand-in instead.

const BASE = 'assets/';
const cache = new Map(); // path -> { state: 'loading' | 'ok' | 'missing', img }

export function getImage(path, kind = 'sprite') {
  let entry = cache.get(path);
  if (!entry) {
    entry = { state: 'loading', img: null };
    cache.set(path, entry);
    const img = new Image();
    img.onload = () => {
      try {
        entry.img = kind === 'sprite' ? processSprite(img) : kind === 'overlay' ? processOverlay(img) : img;
      } catch (e) {
        entry.img = img; // tainted canvas (file://) – use as is
      }
      entry.state = 'ok';
    };
    img.onerror = () => { entry.state = 'missing'; };
    img.src = BASE + path;
  }
  return entry.state === 'ok' ? entry.img : null;
}

// First available frame list for a set of paths (all frames must load)
export function getFrames(paths, kind = 'sprite') {
  if (!paths || !paths.length) return null;
  const frames = [];
  for (const p of paths) {
    const im = getImage(p, kind);
    if (im) frames.push(im);
  }
  return frames.length ? frames : null;
}

export function isMissing(path) {
  const e = cache.get(path);
  return !!e && e.state === 'missing';
}

export function preload(paths, kind = 'sprite') {
  for (const p of paths) getImage(p, kind);
}

// Full-frame foreground overlays keep their size and position. If one comes
// with a plain backdrop instead of transparency, the backdrop is keyed out
// from the top edge down (never from the bottom, where the cover object sits).
function processOverlay(img) {
  const w = img.naturalWidth, h = img.naturalHeight;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const data = g.getImageData(0, 0, w, h);
  const px = data.data;
  if (px[3] < 250 || px[(w - 1) * 4 + 3] < 250) return c; // already transparent
  let r = 0, gg = 0, b = 0;
  for (let x = 0; x < w; x++) { r += px[x * 4]; gg += px[x * 4 + 1]; b += px[x * 4 + 2]; }
  r /= w; gg /= w; b /= w;
  const near = (i) => Math.abs(px[i] - r) + Math.abs(px[i + 1] - gg) + Math.abs(px[i + 2] - b) < 90;
  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x);
  for (let y = 0; y < h * 0.6; y++) { stack.push(y * w); stack.push(y * w + w - 1); }
  let cleared = 0;
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    if (!near(p * 4)) continue;
    px[p * 4 + 3] = 0; cleared++;
    const x = p % w, y = (p / w) | 0;
    if (x > 0) stack.push(p - 1); if (x < w - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - w); if (y < h - 1) stack.push(p + w);
  }
  if (cleared > w * h * 0.97) return img; // it was not a backdrop
  g.putImageData(data, 0, 0);
  return c;
}

function processSprite(img) {
  const w = img.naturalWidth, h = img.naturalHeight;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const data = g.getImageData(0, 0, w, h);
  const px = data.data;

  // Is there a plain opaque background? Sample the four corners.
  const corners = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + w - 1) * 4];
  const opaque = corners.every((i) => px[i + 3] > 250);
  if (opaque) keyOutBackground(px, w, h);

  // Trim to the visible bounding box
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * 4 + 3] > 20) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return c;
  g.putImageData(data, 0, 0);
  const tw = maxX - minX + 1, th = maxY - minY + 1;
  const out = document.createElement('canvas');
  out.width = tw; out.height = th;
  out.getContext('2d').drawImage(c, minX, minY, tw, th, 0, 0, tw, th);
  return out;
}

function keyOutBackground(px, w, h) {
  // Grow from the image border through low-saturation pixels whose colour
  // changes smoothly from one pixel to the next. This removes plain
  // backdrops, lighter panels and soft drop shadows, and stops at the
  // subject's sharp outline.
  const n = w * h;
  const gone = new Uint8Array(n);
  const sat = (i) => Math.max(px[i], px[i + 1], px[i + 2]) - Math.min(px[i], px[i + 1], px[i + 2]);
  const lum = (i) => (px[i] + px[i + 1] + px[i + 2]) / 3;
  // only pixels near the backdrop's brightness can be removed, so darker
  // metal (thin barrels, scopes) is never eaten even where its edge is soft
  const corners = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + w - 1) * 4];
  const floor = corners.reduce((a, i) => a + lum(i), 0) / 4 - 50;
  const bg = (i) => sat(i) < 28 && lum(i) > floor;
  const stack = [];
  const seed = (x, y) => { const k = y * w + x; if (!gone[k] && bg(k * 4)) { gone[k] = 1; stack.push(k); } };
  for (let x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
  for (let y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }
  while (stack.length) {
    const k = stack.pop();
    const i = k * 4;
    const x = k % w, y = (k / w) | 0;
    const nb = [x > 0 ? k - 1 : -1, x < w - 1 ? k + 1 : -1, y > 0 ? k - w : -1, y < h - 1 ? k + w : -1];
    for (const q of nb) {
      if (q < 0 || gone[q]) continue;
      const j = q * 4;
      const d = Math.abs(px[j] - px[i]) + Math.abs(px[j + 1] - px[i + 1]) + Math.abs(px[j + 2] - px[i + 2]);
      if (d < 18 && bg(j)) { gone[q] = 1; stack.push(q); }
    }
  }
  let count = 0;
  for (let k = 0; k < n; k++) count += gone[k];
  if (count > n * 0.985) return; // would erase the subject: leave the image alone
  for (let k = 0; k < n; k++) if (gone[k]) px[k * 4 + 3] = 0;
  // soften the one-pixel fringe left around the subject
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const k = y * w + x;
      if (gone[k]) continue;
      if (gone[k - 1] || gone[k + 1] || gone[k - w] || gone[k + w]) {
        const i = k * 4;
        if (bg(i)) px[i + 3] = Math.min(px[i + 3], 110);
      }
    }
  }
}
