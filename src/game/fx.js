// Particles in world space (logical px at 1×), so they magnify correctly
// inside a scope: dust kicks, feathers, fur tufts, sparks, smoke and pod trails.

import { project, rand } from './view.js';

export class FX {
  constructor(view) { this.view = view; this.p = []; this.reduce = false; }

  add(x, y, o) { if (this.p.length < 900) this.p.push({ x, y, vx: 0, vy: 0, life: 1, max: 1, size: 3, color: '#fff', grav: 0, drag: 0.9, shape: 'dot', rot: 0, vr: 0, ...o }); }

  at(e, up = 0) { const q = project(this.view, e.x, e.alt + up, e.d); return q; }

  dust(target, scale = 1) {
    const q = target.sx != null ? target : this.at(target);
    const k = Math.max(0.6, (q.ppm || 20) / 20) * scale;
    for (let i = 0; i < 14; i++) this.add(q.sx + rand(-4, 4) * k, q.sy, { vx: rand(-30, 30) * k, vy: rand(-90, -20) * k, life: rand(0.5, 1.1), size: rand(2, 6) * k, color: 'rgba(150,125,95,0.75)', grav: 140 * k, drag: 0.94 });
  }
  feathers(x, y, k = 1) {
    for (let i = 0; i < 12; i++) this.add(x, y, { vx: rand(-60, 60) * k, vy: rand(-60, 30) * k, life: rand(1, 2), size: rand(3, 7) * k, color: ['#e9e2d4', '#7a6a58', '#4a3d30'][i % 3], grav: 25 * k, drag: 0.95, shape: 'leaf', vr: rand(-6, 6) });
  }
  tuft(x, y, k = 1) {
    for (let i = 0; i < 8; i++) this.add(x, y, { vx: rand(-40, 40) * k, vy: rand(-50, 0) * k, life: rand(0.4, 0.8), size: rand(1.5, 3.5) * k, color: 'rgba(110,90,70,0.8)', grav: 60 * k, drag: 0.92 });
  }
  sparks(x, y, color = '#ffd27a', k = 1) {
    for (let i = 0; i < 14; i++) this.add(x, y, { vx: rand(-160, 160) * k, vy: rand(-160, 60) * k, life: rand(0.2, 0.5), size: rand(1, 2.5) * k, color, grav: 200 * k, drag: 0.9 });
  }
  ichor(x, y, k = 1) {
    for (let i = 0; i < 18; i++) this.add(x, y, { vx: rand(-90, 90) * k, vy: rand(-110, 30) * k, life: rand(0.4, 0.9), size: rand(2, 5) * k, color: 'rgba(120,255,200,0.9)', grav: 90 * k, drag: 0.93, glow: true });
  }
  smoke(e) {
    const q = this.at(e, 1.5);
    const k = q.ppm / 10;
    this.add(q.sx + rand(-1, 1) * k, q.sy, { vx: rand(-4, 4) * k, vy: rand(-14, -8) * k, life: rand(1.5, 2.5), size: rand(4, 8) * k, color: 'rgba(40,40,40,0.45)', drag: 0.99, grow: 1.6 });
  }
  trail(e) {
    const q = this.at(e);
    const k = q.ppm / 20;
    this.add(q.sx + rand(-3, 3) * k, q.sy - 10 * k, { vx: rand(-5, 5), vy: rand(-10, 0), life: rand(0.4, 0.8), size: rand(5, 10) * k, color: 'rgba(255,170,80,0.6)', drag: 0.95, grow: 1.4, glow: true });
  }

  spineTrail(e) {
    const q = this.at(e);
    const k = Math.max(0.5, q.ppm / 25);
    this.add(q.sx, q.sy, { vx: 0, vy: 0, life: 0.25, size: 3 * k, color: 'rgba(255,190,90,0.8)', drag: 0.9, grow: 0.6, glow: true });
  }

  update(dt) {
    const arr = this.p;
    for (let i = arr.length - 1; i >= 0; i--) {
      const p = arr[i];
      p.life -= dt;
      if (p.life <= 0) { arr.splice(i, 1); continue; }
      p.vy += p.grav * dt;
      p.vx *= Math.pow(p.drag, dt * 60); p.vy *= Math.pow(p.drag, dt * 60);
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.rot += p.vr * dt;
      if (p.grow) p.size *= 1 + (p.grow - 1) * dt;
    }
  }

  draw(g) {
    for (const p of this.p) {
      g.globalAlpha = Math.min(1, p.life * 2);
      g.fillStyle = p.color;
      if (p.glow) g.globalCompositeOperation = 'lighter';
      if (p.shape === 'leaf') {
        g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.beginPath(); g.ellipse(0, 0, p.size, p.size * 0.35, 0, 0, 6.3); g.fill(); g.restore();
      } else { g.beginPath(); g.arc(p.x, p.y, p.size, 0, 6.3); g.fill(); }
      g.globalCompositeOperation = 'source-over';
    }
    g.globalAlpha = 1;
  }
}
