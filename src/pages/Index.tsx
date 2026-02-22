import StarField from "@/components/StarField";
import CursorAura from "@/components/CursorAura";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AIChatBubble from "@/components/AIChatBubble";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <StarField />
      <CursorAura />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
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
