import { motion } from "framer-motion";
import { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  scale?: boolean;
  blur?: boolean;
  distance?: number;
}

const getInitial = (direction: Direction, distance: number, scale: boolean, blur: boolean) => {
  const base: Record<string, number | string> = { opacity: 0 };
  if (direction === "up") base.y = distance;
  if (direction === "down") base.y = -distance;
  if (direction === "left") base.x = distance;
  if (direction === "right") base.x = -distance;
  if (scale) base.scale = 0.92;
  if (blur) base.filter = "blur(8px)";
  return base;
};

const getAnimate = (scale: boolean, blur: boolean) => {
  const base: Record<string, number | string> = { opacity: 1, x: 0, y: 0 };
  if (scale) base.scale = 1;
  if (blur) base.filter = "blur(0px)";
  return base;
};

const ScrollReveal = ({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.7,
  scale = false,
  blur = false,
  distance = 50,
}: ScrollRevealProps) => (
  <motion.div
    initial={getInitial(direction, distance, scale, blur)}
    whileInView={getAnimate(scale, blur)}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default ScrollReveal;
