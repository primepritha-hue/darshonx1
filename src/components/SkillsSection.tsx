import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skills = [
  { name: "React", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Node.js", level: 80 },
  { name: "Python", level: 75 },
  { name: "Next.js", level: 85 },
  { name: "Tailwind CSS", level: 95 },
  { name: "PostgreSQL", level: 70 },
  { name: "Docker", level: 65 },
];

const SkillBar = ({ name, level, delay }: { name: string; level: number; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="group">
      <div className="flex justify-between mb-2">
        <span className="text-foreground font-medium text-sm">{name}</span>
        <span className="text-primary font-mono text-sm">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, hsl(190, 95%, 55%), hsl(260, 60%, 55%))`,
          }}
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="relative py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm mb-2">02. Skills</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            My <span className="gradient-text">Tech Stack</span>
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto glass rounded-2xl p-8 space-y-6">
          {skills.map((skill, i) => (
            <SkillBar key={skill.name} {...skill} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
