import { Terminal } from "lucide-react";
import { useSiteSettings } from "@/hooks/usePortfolioData";
import ScrollReveal from "@/components/ScrollReveal";

const Footer = () => {
  const { data: settings } = useSiteSettings();

  return (
    <footer className="relative z-10 py-8">
      <ScrollReveal blur>
        <div className="section-divider max-w-xl mx-auto mb-8" />
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="font-bold gradient-text text-sm">{settings?.brand_name || "Dev.folio"}</span>
          </div>
          <p className="text-muted-foreground text-xs font-light tracking-wide">
            {settings?.footer_text || "© 2026 — Crafted from the cosmos ✦"}
          </p>
        </div>
      </ScrollReveal>
    </footer>
  );
};

export default Footer;
