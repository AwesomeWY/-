/**
 * Lightweight canvas confetti particle system.
 * Zero external library dependencies, smooth 60fps rendering.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  decay: number;
}

export function triggerEcoConfetti(originX?: number, originY?: number) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const startX = originX ?? width / 2;
  const startY = originY ?? height * 0.4;

  const colors = ['#347A52', '#A8CEAC', '#F3CF70', '#A9D8EE', '#F59E0B', '#10B981', '#38BDF8'];
  const particles: Particle[] = [];
  const particleCount = 70;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
    const speed = Math.random() * 8 + 4;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4, // upward boost
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      alpha: 1,
      decay: Math.random() * 0.012 + 0.012,
    });
  }

  let animationFrameId: number;

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    let aliveCount = 0;

    for (const p of particles) {
      if (p.alpha <= 0) continue;
      aliveCount++;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      ctx.restore();
    }

    if (aliveCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
    }
  }

  animationFrameId = requestAnimationFrame(render);
}
