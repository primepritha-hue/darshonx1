import { useEffect, useRef, useState, ReactNode } from "react";

interface AuraGlowProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
  as?: "div" | "span" | "p" | "h1" | "h2" | "h3";
}

const AuraGlow = ({ children, className = "", glowColor, glowSize = 200, as: Tag = "div" }: AuraGlowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, []);

  const defaultGlow = "190, 95%, 55%";
  const glow = glowColor || defaultGlow;

  return (
    <Tag
      ref={ref as any}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ isolation: "isolate" }}
    >
      {/* Aura glow that follows cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${glowSize}px circle at ${position.x}px ${position.y}px, hsla(${glow}, 0.15), transparent 60%)`,
        }}
      />
      {/* Border glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${glowSize * 0.8}px circle at ${position.x}px ${position.y}px, hsla(${glow}, 0.3), transparent 60%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </Tag>
  );
};

export default AuraGlow;
