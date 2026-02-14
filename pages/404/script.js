// Particles background + subtle parallax + random glitches
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let w, h, dpr;

const PARTICLE_COUNT = 140; // Tune for performance
const particles = [];

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = canvas.width = Math.floor(innerWidth * dpr);
  h = canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
}
window.addEventListener('resize', resize);
resize();

function rand(min, max) { return Math.random() * (max - min) + min; }

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(1.2, 2.6) * dpr,
    vx: rand(-0.2, 0.2) * dpr,
    vy: rand(-0.15, 0.15) * dpr,
    c: `hsla(${rand(170, 210)}, 100%, ${rand(60, 80)}%, ${rand(0.12, 0.28)})`
  });
}

function step() {
  ctx.clearRect(0, 0, w, h);

  // Gradient glow background
  const g = ctx.createRadialGradient(w * 0.65, h * 0.05, 50, w * 0.65, h * 0.05, Math.max(w, h));
  g.addColorStop(0, 'rgba(10, 180, 255, 0.08)');
  g.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Particle draw
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
    if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;

    ctx.beginPath();
    ctx.fillStyle = p.c;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Connect near particles for a subtle net
  ctx.lineWidth = 0.8 * dpr;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < (120 * dpr) ** 2) {
        const alpha = 0.06 * (1 - dist2 / (120 * dpr) ** 2);
        ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
  }

  requestAnimationFrame(step);
}
requestAnimationFrame(step);

// Soft parallax on mouse move
const wrap = document.querySelector('.wrap');
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / innerWidth - 0.5) * 10;
  const y = (e.clientY / innerHeight - 0.5) * 10;
  wrap.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
});

// Occasional glitch burst on the "glitch" element
const glitchEl = document.querySelector('.glitch');
setInterval(() => {
  glitchEl.style.animationDuration = Math.random() > 0.6 ? '0.6s' : '2.4s';
}, 1500);