import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal, Wrench } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSiteSettings } from "@/hooks/usePortfolioData";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (href: string) => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => scrollTo("#home")} className="flex items-center gap-2 group">
          <Terminal className="w-5 h-5 text-primary" />
          <span className="text-lg font-bold gradient-text">{settings?.brand_name || "Dev.folio"}</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.href)}
              className="text-muted-foreground hover:text-primary transition-colors duration-300 text-xs font-medium tracking-[0.15em] uppercase"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { setIsOpen(false); navigate("/tools"); }}
            className={`flex items-center gap-1.5 text-xs font-medium tracking-[0.15em] uppercase transition-colors duration-300 ${
              location.pathname === "/tools" ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Tools
          </button>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/30"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.href)}
                  className="text-muted-foreground hover:text-primary transition-colors text-left py-2 text-sm tracking-wide"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { setIsOpen(false); navigate("/tools"); }}
                className={`flex items-center gap-2 text-left py-2 text-sm tracking-wide transition-colors ${
                  location.pathname === "/tools" ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Wrench className="w-4 h-4" />
                Tools
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
