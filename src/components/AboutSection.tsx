import { Code2, Rocket, Sparkles } from "lucide-react";
import { useSiteSettings } from "@/hooks/usePortfolioData";
import AuraGlow from "@/components/AuraGlow";
import ScrollReveal from "@/components/ScrollReveal";

const AboutSection = () => {
  const { data: settings } = useSiteSettings();

  return (
    <section id="about" className="relative py-32">
      <ScrollReveal scale blur>
        <div className="section-divider max-w-xl mx-auto mb-32" />
      </ScrollReveal>
      <div className="container mx-auto px-6">
        <ScrollReveal scale blur>
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-xs mb-3 tracking-[0.2em] uppercase">01 — About</p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Who Am <span className="gradient-text">I?</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <ScrollReveal direction="left" blur delay={0.15}>
            <p className="text-muted-foreground leading-relaxed text-lg font-light">
              {settings?.bio || "I'm a passionate full-stack developer who loves turning ideas into beautiful, functional digital experiences."}
            </p>
          </ScrollReveal>

          <div className="grid gap-4">
            {[
              { icon: Code2, title: "Clean Code", desc: "Writing maintainable, scalable code", glow: "160, 70%, 45%" },
              { icon: Rocket, title: "Performance", desc: "Optimized for speed and efficiency", glow: "40, 90%, 55%" },
              { icon: Sparkles, title: "Modern UI", desc: "Crafting beautiful user experiences", glow: "330, 75%, 55%" },
            ].map(({ icon: Icon, title, desc, glow }, i) => (
              <ScrollReveal key={i} direction="right" delay={0.2 + i * 0.12} scale>
                <AuraGlow
                  glowColor={glow}
                  className="glass rounded-xl p-5 flex items-start gap-4 transition-all duration-300 group cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 text-sm">{title}</h3>
                    <p className="text-muted-foreground text-xs">{desc}</p>
                  </div>
                </AuraGlow>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
