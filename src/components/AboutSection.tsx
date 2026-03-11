import { Code2, Rocket, Sparkles } from "lucide-react";
import { useSiteSettings } from "@/hooks/usePortfolioData";
import AuraGlow from "@/components/AuraGlow";
import ScrollReveal from "@/components/ScrollReveal";

const iconMap: Record<number, typeof Code2> = {
  0: Code2,
  1: Rocket,
  2: Sparkles,
};

const glowMap = ["170, 85%, 50%", "40, 90%, 55%", "330, 75%, 55%"];

const AboutSection = () => {
  const { data: settings } = useSiteSettings();

  const features = settings?.about_features || [
    { title: "Clean Code", desc: "Writing maintainable, scalable code" },
    { title: "Performance", desc: "Optimized for speed and efficiency" },
    { title: "Modern UI", desc: "Crafting beautiful user experiences" },
  ];

  const headingText = settings?.about_heading || "Who Am I?";
  const headingParts = headingText.split(" ");
  const lastWord = headingParts.pop();
  const firstWords = headingParts.join(" ");

  return (
    <section id="about" className="relative py-16">
      <ScrollReveal scale blur>
        <div className="section-divider max-w-xl mx-auto mb-16" />
      </ScrollReveal>
      <div className="container mx-auto px-6">
        <ScrollReveal scale blur>
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-xs mb-3 tracking-[0.2em] uppercase">01 — About</p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              {firstWords} <span className="gradient-text">{lastWord}</span>
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
            {features.map((feature, i) => {
              const Icon = iconMap[i] || Code2;
              return (
                <ScrollReveal key={i} direction="right" delay={0.2 + i * 0.12} scale>
                  <AuraGlow
                    glowColor={glowMap[i % glowMap.length]}
                    className="neon-card p-5 flex items-start gap-4 group cursor-default"
                  >
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300"
                      style={{ background: "hsl(var(--primary) / 0.08)" }}
                    >
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-sm">{feature.title}</h3>
                      <p className="text-muted-foreground text-xs">{feature.desc}</p>
                    </div>
                  </AuraGlow>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;