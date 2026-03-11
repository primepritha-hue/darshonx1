import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import StarField from "@/components/StarField";
import CursorAura from "@/components/CursorAura";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillTagsSection from "@/components/SkillTagsSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ProfileSection from "@/components/ProfileSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AIChatBubble from "@/components/AIChatBubble";

const Index = () => {
  const [entered, setEntered] = useState(false);
  const [showEnter, setShowEnter] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const t = setTimeout(() => setShowEnter(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.07]"
          style={{
            top: "10%",
            left: "15%",
            background: "hsl(var(--neon-cyan))",
            animation: "blob-float 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.05]"
          style={{
            top: "40%",
            right: "10%",
            background: "hsl(var(--neon-pink))",
            animation: "blob-float 25s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.04]"
          style={{
            bottom: "15%",
            left: "40%",
            background: "hsl(var(--neon-gold))",
            animation: "blob-float 18s ease-in-out infinite",
          }}
        />
      </div>

      {/* Scroll progress bar */}
      <motion.div className="scroll-progress" style={{ scaleX }} />

      {/* Entry splash */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
            style={{ background: "hsl(var(--background))" }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-black gradient-text text-center mb-8"
            >
              🔥 Welcome 🔥
            </motion.h1>
            {showEnter && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEntered(true)}
                className="px-10 py-4 rounded-2xl font-bold text-lg text-primary-foreground animate-pulse-glow transition-all"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--neon-cyan)), hsl(var(--neon-pink)))",
                }}
              >
                ENTER
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <StarField />
      <CursorAura />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ProfileSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
        <Footer />
      </div>
      <AIChatBubble />
    </div>
  );
};

export default Index;