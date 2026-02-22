import { Terminal } from "lucide-react";

const Footer = () => (
  <footer className="relative z-10 border-t border-border/30 py-8">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Terminal className="w-5 h-5 text-primary" />
        <span className="font-bold gradient-text">Dev.folio</span>
      </div>
      <p className="text-muted-foreground text-sm">
        © 2026 All rights reserved. Built with ✨ from the cosmos.
      </p>
    </div>
  </footer>
);

export default Footer;
