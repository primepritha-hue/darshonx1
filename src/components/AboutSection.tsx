import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Rocket, Sparkles } from "lucide-react";
import { useSiteSettings } from "@/hooks/usePortfolioData";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: settings } = useSiteSettings();

  return (
    <section id="about" className="relative py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm mb-2">01. About</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Who Am <span className="gradient-text">I?</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-muted-foreground leading-relaxed text-lg">
              {settings?.bio || "I'm a passionate full-stack developer who loves turning ideas into beautiful, functional digital experiences."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid gap-4"
          >
            {[
              { icon: Code2, title: "Clean Code", desc: "Writing maintainable, scalable code" },
              { icon: Rocket, title: "Performance", desc: "Optimized for speed and efficiency" },
              { icon: Sparkles, title: "Modern UI", desc: "Crafting beautiful user experiences" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="glass rounded-lg p-5 flex items-start gap-4 hover:box-glow transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
