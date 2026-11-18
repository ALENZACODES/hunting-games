// Mouse and keyboard state in logical (1920×1080) coordinates.
// Works with and without pointer lock: when the pointer is locked, aiming
// uses relative movement; otherwise the absolute cursor position is used.

import { W, H } from '../game/view.js';

export const input = {
  x: W / 2, y: H / 2, // cursor in logical px
  dx: 0, dy: 0, // movement since last frame, logical px
  locked: false,
  left: false, right: false,
  down: new Set(),
  pressed: new Set(),
  events: [], // { type: 'fire' | 'adsDown' | 'adsUp' | 'wheel', value }
  scale: 1, offX: 0, offY: 0,
};

export function setTransform(scale, offX, offY) {
  input.scale = scale; input.offX = offX; input.offY = offY;
}

export function attachInput(canvas) {
  const toLogical = (e) => {
    const r = canvas.getBoundingClientRect();
    input.x = ((e.clientX - r.left) - input.offX) / input.scale;
    input.y = ((e.clientY - r.top) - input.offY) / input.scale;
  };
  window.addEventListener('mousemove', (e) => {
    if (input.locked) {
      input.dx += e.movementX / input.scale;
      input.dy += e.movementY / input.scale;
    } else {
      const px = input.x, py = input.y;
      toLogical(e);
      input.dx += input.x - px; input.dy += input.y - py;
    }
  });
  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) { input.left = true; input.events.push({ type: 'fire' }); }
    if (e.button === 2) { input.right = true; input.events.push({ type: 'adsDown' }); }
  });
  window.addEventListener('mouseup', (e) => {
    if (e.button === 0) input.left = false;
    if (e.button === 2) { input.right = false; input.events.push({ type: 'adsUp' }); }
  });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); input.events.push({ type: 'wheel', value: Math.sign(e.deltaY) }); }, { passive: false });
  window.addEventListener('keydown', (e) => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace'].includes(e.code) && document.activeElement?.tagName !== 'INPUT') e.preventDefault();
    if (!input.down.has(e.code)) input.pressed.add(e.code);
    input.down.add(e.code);
  });
  window.addEventListener('keyup', (e) => input.down.delete(e.code));
  window.addEventListener('blur', () => { input.down.clear(); input.left = false; input.right = false; });
  document.addEventListener('pointerlockchange', () => {
    input.locked = document.pointerLockElement === canvas;
  });
}

export function requestLock(canvas) {
  try {
    if (document.pointerLockElement !== canvas && canvas.requestPointerLock) {
      const p = canvas.requestPointerLock();
      if (p && p.catch) p.catch(() => {});
    }
  } catch (e) { /* not allowed here (e.g. sandboxed frame) */ }
}

export function releaseLock() {
  try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) { /* ignore */ }
}

export function endFrame() {
  input.dx = 0; input.dy = 0;
  input.pressed.clear();
  input.events.length = 0;
}
