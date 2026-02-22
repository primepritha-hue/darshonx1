import { useEffect, useRef } from "react";

const ParticleBurst = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const colors = [
      "hsla(160, 70%, 45%, ",
      "hsla(40, 90%, 55%, ",
      "hsla(330, 75%, 55%, ",
      "hsla(175, 65%, 40%, ",
      "hsla(45, 100%, 90%, ",
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      maxLife: number;
      decay: number;
    }

    const particles: Particle[] = [];

    // Create burst particles
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80 + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 6 + 2;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        maxLife: 1,
        decay: Math.random() * 0.008 + 0.005,
      });
    }

    // Ring particles
    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i) / 40;
      const speed = Math.random() * 3 + 4;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        maxLife: 1,
        decay: Math.random() * 0.006 + 0.004,
      });
    }

    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach((p) => {
        if (p.life <= 0) return;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.life -= p.decay;

        const alpha = Math.max(0, p.life);

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (alpha * 0.15) + ")";
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha + ")";
        ctx.fill();

        // Trail
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
        ctx.strokeStyle = p.color + (alpha * 0.3) + ")";
        ctx.lineWidth = p.size * 0.5;
        ctx.stroke();
      });

      if (alive) {
        animId = requestAnimationFrame(animate);
      }
    };

    // Delay burst slightly for dramatic effect
    const timeout = setTimeout(() => {
      animId = requestAnimationFrame(animate);
    }, 400);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
    />
  );
};

export default ParticleBurst;
