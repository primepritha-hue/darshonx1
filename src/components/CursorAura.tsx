import { useEffect, useRef } from "react";

const CursorAura = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const outerPos = useRef({ x: 0, y: 0 });
  const visible = useRef(false);

  useEffect(() => {
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) {
        visible.current = true;
        outerPos.current = { x: e.clientX, y: e.clientY };
        if (outerRef.current) outerRef.current.style.opacity = "1";
        if (innerRef.current) innerRef.current.style.opacity = "1";
      }
      // Inner dot moves instantly
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const onLeave = () => {
      visible.current = false;
      if (outerRef.current) outerRef.current.style.opacity = "0";
      if (innerRef.current) innerRef.current.style.opacity = "0";
    };

    const animate = () => {
      // Smooth lerp for outer glow
      outerPos.current.x += (mouse.current.x - outerPos.current.x) * 0.15;
      outerPos.current.y += (mouse.current.y - outerPos.current.y) * 0.15;
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerPos.current.x - 200}px, ${outerPos.current.y - 200}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        ref={outerRef}
        className="absolute rounded-full will-change-transform"
        style={{
          width: 400,
          height: 400,
          opacity: 0,
          background: "radial-gradient(circle, hsla(190, 95%, 55%, 0.06) 0%, hsla(260, 60%, 55%, 0.03) 40%, transparent 70%)",
        }}
      />
      <div
        ref={innerRef}
        className="absolute rounded-full will-change-transform"
        style={{
          width: 8,
          height: 8,
          opacity: 0,
          background: "hsla(190, 95%, 70%, 0.5)",
          boxShadow: "0 0 15px 5px hsla(190, 95%, 55%, 0.3), 0 0 40px 10px hsla(260, 60%, 55%, 0.15)",
        }}
      />
    </div>
  );
};

export default CursorAura;
