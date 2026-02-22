import { useEffect, useState } from "react";

const CursorAura = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Outer soft glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          left: pos.x - 200,
          top: pos.y - 200,
          background: "radial-gradient(circle, hsla(190, 95%, 55%, 0.06) 0%, hsla(260, 60%, 55%, 0.03) 40%, transparent 70%)",
          transition: "left 0.15s ease-out, top 0.15s ease-out",
        }}
      />
      {/* Inner bright dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: 8,
          height: 8,
          left: pos.x - 4,
          top: pos.y - 4,
          background: "hsla(190, 95%, 70%, 0.5)",
          boxShadow: "0 0 15px 5px hsla(190, 95%, 55%, 0.3), 0 0 40px 10px hsla(260, 60%, 55%, 0.15)",
          transition: "left 0.05s ease-out, top 0.05s ease-out",
        }}
      />
    </div>
  );
};

export default CursorAura;
