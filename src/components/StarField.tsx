import { useEffect, useRef } from "react";

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: { x: number; y: number; size: number; speed: number; twinklePhase: number; twinkleSpeed: number; hue: number }[] = [];
    let shootingStars: { x: number; y: number; length: number; speed: number; opacity: number; angle: number; hue: number }[] = [];
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 2200);
      for (let i = 0; i < count; i++) {
        const hueRoll = Math.random();
        const hue = hueRoll < 0.3 ? 160 : hueRoll < 0.5 ? 40 : hueRoll < 0.65 ? 330 : 0;
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.2 + 0.3,
          speed: Math.random() * 0.2 + 0.03,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.015 + 0.004,
          hue,
        });
      }
    };

    const spawnShootingStar = () => {
      if (Math.random() < 0.004) {
        const hues = [160, 40, 330];
        shootingStars.push({
          x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
          y: Math.random() * canvas.height * 0.3,
          length: Math.random() * 100 + 50,
          speed: Math.random() * 10 + 7,
          opacity: 1,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
          hue: hues[Math.floor(Math.random() * hues.length)],
        });
      }
    };

    const drawNebulae = () => {
      time += 0.001;

      // Emerald nebula - left
      const g1 = ctx.createRadialGradient(
        canvas.width * 0.15 + Math.sin(time * 0.7) * 30,
        canvas.height * 0.45 + Math.cos(time * 0.5) * 20,
        0,
        canvas.width * 0.15, canvas.height * 0.45, canvas.width * 0.4
      );
      g1.addColorStop(0, "hsla(160, 60%, 25%, 0.05)");
      g1.addColorStop(0.5, "hsla(175, 50%, 20%, 0.025)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Magenta nebula - top right
      const g2 = ctx.createRadialGradient(
        canvas.width * 0.85 + Math.cos(time * 0.6) * 25,
        canvas.height * 0.15 + Math.sin(time * 0.8) * 15,
        0,
        canvas.width * 0.85, canvas.height * 0.15, canvas.width * 0.35
      );
      g2.addColorStop(0, "hsla(330, 60%, 30%, 0.04)");
      g2.addColorStop(0.5, "hsla(340, 40%, 20%, 0.02)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gold nebula - bottom
      const g3 = ctx.createRadialGradient(
        canvas.width * 0.5 + Math.sin(time * 0.4) * 40,
        canvas.height * 0.85 + Math.cos(time * 0.3) * 20,
        0,
        canvas.width * 0.5, canvas.height * 0.85, canvas.width * 0.3
      );
      g3.addColorStop(0, "hsla(40, 70%, 25%, 0.03)");
      g3.addColorStop(1, "transparent");
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep void
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, "hsl(250, 30%, 3%)");
      bg.addColorStop(0.5, "hsl(240, 20%, 4%)");
      bg.addColorStop(1, "hsl(260, 25%, 3.5%)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawNebulae();

      // Stars
      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
        const opacity = 0.15 + twinkle * 0.85;

        // Star body
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        const sat = star.hue === 0 ? "0%" : "60%";
        const light = star.hue === 0 ? "92%" : "75%";
        ctx.fillStyle = `hsla(${star.hue}, ${sat}, ${light}, ${opacity})`;
        ctx.fill();

        // Glow for colored/bigger stars
        if (star.size > 1.0 && star.hue !== 0) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${star.hue}, 70%, 60%, ${opacity * 0.08})`;
          ctx.fill();
        }

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = -2;
          star.x = Math.random() * canvas.width;
        }
      });

      // Shooting stars
      spawnShootingStar();
      shootingStars = shootingStars.filter((s) => s.opacity > 0);
      shootingStars.forEach((s) => {
        const dx = Math.cos(s.angle) * s.speed;
        const dy = Math.sin(s.angle) * s.speed;

        const gradient = ctx.createLinearGradient(
          s.x, s.y,
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        );
        gradient.addColorStop(0, `hsla(${s.hue}, 80%, 75%, ${s.opacity})`);
        gradient.addColorStop(0.3, `hsla(${s.hue}, 70%, 60%, ${s.opacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${s.hue}, 60%, 50%, 0)`);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 85%, ${s.opacity})`;
        ctx.fill();

        s.x += dx;
        s.y += dy;
        s.opacity -= 0.012;
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default StarField;
