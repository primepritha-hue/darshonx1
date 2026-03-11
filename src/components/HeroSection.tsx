import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Github, Linkedin, Mail, Globe, Music, Link as LinkIcon, Send } from "lucide-react";
import { FaDiscord, FaTelegram, FaSpotify, FaThreads, FaInstagram, FaYoutube, FaTwitch, FaXTwitter, FaFacebook, FaReddit, FaSteam, FaTiktok } from "react-icons/fa6";
import { useSiteSettings } from "@/hooks/usePortfolioData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ParticleBurst from "./ParticleBurst";
import TypingEffect from "./TypingEffect";

const iconMap: Record<string, React.ElementType> = {
  discord: FaDiscord,
  telegram: FaTelegram,
  spotify: FaSpotify,
  threads: FaThreads,
  github: Github,
  instagram: FaInstagram,
  youtube: FaYoutube,
  twitch: FaTwitch,
  x: FaXTwitter,
  facebook: FaFacebook,
  linkedin: Linkedin,
  reddit: FaReddit,
  steam: FaSteam,
  tiktok: FaTiktok,
  globe: Globe,
  link: LinkIcon,
  music: Music,
  mail: Mail,
  send: Send,
};

const HeroSection = () => {
  const { data: settings } = useSiteSettings();
  const [nameRevealed, setNameRevealed] = useState(false);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBurst />

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Profile Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative group">
            {/* Neon glow ring */}
            <div
              className="absolute -inset-[3px] rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"
              style={{ background: "hsl(var(--primary))" }}
            />
            <div
              className="absolute -inset-[3px] rounded-full opacity-90"
              style={{ background: "hsl(var(--primary))", boxShadow: "0 0 25px hsl(var(--primary) / 0.6), 0 0 50px hsl(var(--primary) / 0.3), inset 0 0 25px hsl(var(--primary) / 0.1)" }}
            />
            {(settings as any)?.profile_image_url ? (
              <img
                src={(settings as any).profile_image_url}
                alt={settings?.name || "Profile"}
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
              />
            ) : (
              <div
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center"
                style={{ background: "hsl(var(--background))" }}
              >
                <span className="text-xl md:text-2xl font-bold text-muted-foreground">
                  {settings?.name || "?"}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="font-mono text-sm md:text-base mb-6 tracking-[0.3em] uppercase text-glow-gold" style={{ color: "hsl(var(--neon-gold))" }}>
            <TypingEffect text={settings?.hero_tagline || "// developer.init()"} speed={60} delay={500} />
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
          <div className="h-[1px] w-12" style={{ background: "hsl(var(--primary) / 0.4)" }} />
          <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide">
            {settings?.title || "Full-Stack Developer"}
          </p>
          <div className="h-[1px] w-12" style={{ background: "hsl(var(--primary) / 0.4)" }} />
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
              className="w-12 h-12 rounded-2xl neon-card flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-500 group"
            >
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
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