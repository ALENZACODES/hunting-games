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
        entry.img = kind === 'sprite' ? processSprite(img) : img;
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
  if (opaque) {
    const ref = [px[0], px[1], px[2]];
    const similar = corners.every((i) => Math.abs(px[i] - ref[0]) + Math.abs(px[i + 1] - ref[1]) + Math.abs(px[i + 2] - ref[2]) < 60);
    if (similar) keyOutBackground(px, w, h, ref, 58);
  }

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

function keyOutBackground(px, w, h, ref, tol) {
  const seen = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => { const k = y * w + x; if (!seen[k]) { seen[k] = 1; stack.push(k); } };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const k = stack.pop();
    const i = k * 4;
    const diff = Math.abs(px[i] - ref[0]) + Math.abs(px[i + 1] - ref[1]) + Math.abs(px[i + 2] - ref[2]);
    if (diff > tol) continue;
    px[i + 3] = diff > tol * 0.6 ? Math.min(px[i + 3], Math.round(255 * (diff - tol * 0.6) / (tol * 0.4))) : 0;
    const x = k % w, y = (k / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }
}
