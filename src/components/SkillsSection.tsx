import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSkills } from "@/hooks/usePortfolioData";
import AuraGlow from "@/components/AuraGlow";
import ScrollReveal from "@/components/ScrollReveal";

const SkillBar = ({ name, level, delay }: { name: string; level: number; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="group">
      <div className="flex justify-between mb-2">
        <span className="text-foreground font-medium text-sm">{name}</span>
        <span className="text-primary font-mono text-xs">{level}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted) / 0.6)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, hsl(var(--neon-cyan)), hsl(var(--neon-pink)))`,
            boxShadow: "0 0 12px hsl(var(--primary) / 0.4)",
          }}
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const { data: skills } = useSkills();

  return (
    <section id="skills" className="relative py-32">
      <ScrollReveal scale blur>
        <div className="section-divider max-w-xl mx-auto mb-32" />
      </ScrollReveal>
      <div className="container mx-auto px-6">
        <ScrollReveal scale blur>
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-xs mb-3 tracking-[0.2em] uppercase">02 — Skills</p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              My <span className="gradient-text">Tech Stack</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal scale blur delay={0.2}>
          <AuraGlow className="max-w-2xl mx-auto neon-card p-8" glowSize={300} glowColor="170, 85%, 50%">
            <div className="space-y-5">
              {(skills || []).map((skill, i) => (
                <SkillBar key={skill.id} name={skill.name} level={skill.level} delay={i * 0.08} />
              ))}
            </div>
          </AuraGlow>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SkillsSection;