import { useState, useEffect } from "react";

interface TypingEffectProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

const TypingEffect = ({ text, className = "", speed = 80, delay = 800, onComplete }: TypingEffectProps) => {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    setShowCursor(true);

    const startTimeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setDone(true);
          onComplete?.();
          // Keep cursor blinking for a bit then hide
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && (
        <span
          className="inline-block w-[3px] ml-1 align-middle"
          style={{
            height: "0.85em",
            background: "hsl(var(--galaxy-emerald))",
            animation: "blink-cursor 0.7s step-end infinite",
          }}
        />
      )}
    </span>
  );
};

export default TypingEffect;

