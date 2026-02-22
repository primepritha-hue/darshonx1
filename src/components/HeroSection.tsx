import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";
import { useSiteSettings } from "@/hooks/usePortfolioData";
import ParticleBurst from "./ParticleBurst";
import TypingEffect from "./TypingEffect";

const HeroSection = () => {
  const { data: settings } = useSiteSettings();
  const [nameRevealed, setNameRevealed] = useState(false);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBurst />
      {/* Aurora blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.04]"
          style={{
            top: "10%",
            left: "20%",
            background: "hsl(160, 70%, 45%)",
            animation: "aurora 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.03]"
          style={{
            top: "30%",
            right: "15%",
            background: "hsl(330, 75%, 55%)",
            animation: "aurora 25s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-[0.03]"
          style={{
            bottom: "20%",
            left: "40%",
            background: "hsl(40, 90%, 55%)",
            animation: "aurora 18s ease-in-out infinite",
          }}
        />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="font-mono text-sm md:text-base mb-6 tracking-[0.3em] uppercase text-glow-gold" style={{ color: "hsl(40, 90%, 55%)" }}>
            <TypingEffect text="// developer.init()" speed={60} delay={500} />
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-9xl font-black mb-6 leading-[0.9] tracking-tight"
        >
          <span className="text-foreground">I'm </span>
          <span className="gradient-text text-glow-strong">
            <TypingEffect
              text={settings?.name || "Your Name"}
              speed={100}
              delay={2200}
              onComplete={() => setNameRevealed(true)}
            />
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="h-[1px] w-12 bg-primary/40" />
          <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide">
            {settings?.title || "Full-Stack Developer"}
          </p>
          <div className="h-[1px] w-12 bg-primary/40" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex items-center justify-center gap-5 mb-16"
        >
          {[
            { icon: Github, href: settings?.github_url || "#" },
            { icon: Linkedin, href: settings?.linkedin_url || "#" },
            { icon: Mail, href: "#contact" },
          ].map(({ icon: Icon, href }, i) => (
            <a
              key={i}
              href={href}
              className="w-11 h-11 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary hover:box-glow-strong transition-all duration-500 group"
            >
              <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <button
            onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
            className="text-muted-foreground hover:text-primary transition-colors animate-float"
          >
            <ChevronDown className="w-7 h-7" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
