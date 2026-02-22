import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, MapPin, Mail, Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/usePortfolioData";
import AuraGlow from "@/components/AuraGlow";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: settings } = useSiteSettings();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! (Connect backend for real functionality)");
    setFormData({ name: "", email: "", message: "" });
  };

  const inputClass = "w-full bg-muted/30 border border-border/40 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/15 transition-all font-light";

  return (
    <section id="contact" className="relative py-32" ref={ref}>
      <div className="section-divider max-w-xl mx-auto mb-32" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-xs mb-3 tracking-[0.2em] uppercase">04 — Contact</p>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Get In <span className="gradient-text">Touch</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Have a project in mind or just want to say hi? Feel free to reach out.
            </p>

            {[
              { icon: Mail, label: settings?.email || "hello@example.com", glow: "160, 70%, 45%" },
              { icon: Phone, label: settings?.phone || "+880 1234-567890", glow: "40, 90%, 55%" },
              { icon: MapPin, label: settings?.location || "Dhaka, Bangladesh", glow: "330, 75%, 55%" },
            ].map(({ icon: Icon, label, glow }, i) => (
              <AuraGlow key={i} glowColor={glow} className="flex items-center gap-4 rounded-lg p-3 cursor-default">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-muted-foreground text-sm font-light">{label}</span>
              </AuraGlow>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <AuraGlow glowColor="160, 70%, 45%" glowSize={300} className="glass rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={inputClass} />
                <input type="email" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className={inputClass} />
                <textarea placeholder="Your Message" rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className={`${inputClass} resize-none`} />
                <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity animate-pulse-glow text-sm">
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </AuraGlow>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
