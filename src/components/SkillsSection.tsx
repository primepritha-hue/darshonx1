import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSkills } from "@/hooks/usePortfolioData";
import AuraGlow from "@/components/AuraGlow";

const SkillBar = ({ name, level, delay }: { name: string; level: number; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="group">
      <div className="flex justify-between mb-2">
        <span className="text-foreground font-medium text-sm">{name}</span>
        <span className="text-secondary font-mono text-xs">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, hsl(160, 70%, 45%), hsl(40, 90%, 55%))`,
          }}
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: skills } = useSkills();

  return (
    <section id="skills" className="relative py-32" ref={ref}>
      <div className="section-divider max-w-xl mx-auto mb-32" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-xs mb-3 tracking-[0.2em] uppercase">02 — Skills</p>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            My <span className="gradient-text">Tech Stack</span>
          </h2>
        </motion.div>

        <AuraGlow className="max-w-2xl mx-auto glass rounded-2xl p-8" glowSize={300} glowColor="160, 70%, 45%">
          <div className="space-y-5">
            {(skills || []).map((skill, i) => (
              <SkillBar key={skill.id} name={skill.name} level={skill.level} delay={i * 0.08} />
            ))}
          </div>
        </AuraGlow>
      </div>
    </section>
  );
};

export default SkillsSection;
