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
  const { data: skills } = useSkills();

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

        <AuraGlow className="max-w-2xl mx-auto glass rounded-2xl p-8" glowSize={300}>
          <div className="space-y-6">
            {(skills || []).map((skill, i) => (
              <SkillBar key={skill.id} name={skill.name} level={skill.level} delay={i * 0.1} />
            ))}
          </div>
        </AuraGlow>
      </div>
    </section>
  );
};

export default SkillsSection;
