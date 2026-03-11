import { useState } from "react";
import { Send, MapPin, Mail, Phone, Copy, ChevronRight, ChevronDown, X, MessageSquareText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/usePortfolioData";
import AuraGlow from "@/components/AuraGlow";
import ScrollReveal from "@/components/ScrollReveal";

type ComposerType = "wa" | "mail" | "sms" | null;

const ContactSection = () => {
  const { data: settings } = useSiteSettings();
  const [contactName, setContactName] = useState("");
  const [waMsg, setWaMsg] = useState("");
  const [mailMsg, setMailMsg] = useState("");
  const [smsMsg, setSmsMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [composer, setComposer] = useState<ComposerType>(null);

  const phone = settings?.phone || "+880 1234-567890";
  const email = settings?.email || "hello@example.com";
  const phoneClean = phone.replace(/[\s\-()]/g, "");

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "🌅 Good Morning";
    if (h < 18) return "☀️ Good Afternoon";
    return "🌙 Good Evening";
  };

  const buildMessage = (customBody: string) => {
    const n = contactName.trim();
    const base = `${getGreeting()}`;
    const head = n ? `\nI'm ${n}.` : "";
    const body = customBody?.trim() ? `\n\n${customBody.trim()}` : "\n\nI'd like to get in touch!";
    return `${base}${head}${body}`;
  };

  const openWhatsApp = () => {
    const msg = encodeURIComponent(buildMessage(waMsg));
    window.open(`https://wa.me/${phoneClean}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const openEmail = () => {
    const subject = encodeURIComponent("Contact");
    const body = encodeURIComponent(buildMessage(mailMsg));
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const openSMS = () => {
    const body = encodeURIComponent(buildMessage(smsMsg));
    window.location.href = `sms:${phoneClean}?&body=${body}`;
  };

  const copyContact = async () => {
    try {
      await navigator.clipboard.writeText(`Phone: ${phone}\nEmail: ${email}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const inputClass =
    "w-full rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all font-light"
    + " border focus:ring-1 focus:ring-primary/20"
    + " bg-background border-border/40 focus:border-primary/40";

  return (
    <section id="contact" className="relative py-32">
      <ScrollReveal scale blur>
        <div className="section-divider max-w-xl mx-auto mb-32" />
      </ScrollReveal>
      <div className="container mx-auto px-6">
        <ScrollReveal scale blur>
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-xs mb-3 tracking-[0.2em] uppercase">04 — Contact</p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Get In <span className="gradient-text">Touch</span>
            </h2>
            <div className="section-divider max-w-xs mx-auto mt-4" />
            <p className="text-muted-foreground text-sm mt-4 font-light">
              {settings?.contact_intro || "Send a message via WhatsApp, Email, or SMS in one click ✅"}
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto">
          {/* Contact info cards */}
          <ScrollReveal direction="left" blur delay={0.15}>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {[
                { icon: Mail, label: email, glow: "330, 75%, 55%" },
                { icon: Phone, label: phone, glow: "170, 85%, 50%" },
                { icon: MapPin, label: settings?.location || "Location", glow: "40, 90%, 55%" },
              ].map(({ icon: Icon, label, glow }, i) => (
                <AuraGlow key={i} glowColor={glow} className="neon-card px-5 py-3 flex items-center gap-3 cursor-default">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground text-sm font-light">{label}</span>
                </AuraGlow>
              ))}
            </div>
          </ScrollReveal>

          {/* Composer toggles */}
          <ScrollReveal scale blur delay={0.2}>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={() => setComposer((p) => (p === "wa" ? null : "wa"))}
                className="inline-flex items-center gap-2 px-5 py-3 neon-card text-sm font-medium transition-all hover:border-primary/40 hover:box-glow"
                style={composer === "wa" ? { borderColor: "hsl(var(--neon-emerald) / 0.5)", boxShadow: "0 0 25px hsl(var(--neon-emerald) / 0.2)" } : {}}
              >
                <Send className="w-4 h-4 text-primary" />
                WhatsApp
                {composer === "wa" ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
              <button
                onClick={() => setComposer((p) => (p === "mail" ? null : "mail"))}
                className="inline-flex items-center gap-2 px-5 py-3 neon-card text-sm font-medium transition-all hover:border-secondary/40 hover:box-glow-pink"
                style={composer === "mail" ? { borderColor: "hsl(var(--neon-pink) / 0.5)", boxShadow: "0 0 25px hsl(var(--neon-pink) / 0.2)" } : {}}
              >
                <Mail className="w-4 h-4 text-secondary" />
                Email
                {composer === "mail" ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
              <button
                onClick={() => setComposer((p) => (p === "sms" ? null : "sms"))}
                className="inline-flex items-center gap-2 px-5 py-3 neon-card text-sm font-medium transition-all hover:border-primary/40 hover:box-glow"
                style={composer === "sms" ? { borderColor: "hsl(var(--neon-sky) / 0.5)", boxShadow: "0 0 25px hsl(var(--neon-sky) / 0.2)" } : {}}
              >
                <MessageSquareText className="w-4 h-4 text-primary" />
                SMS
                {composer === "sms" ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            </div>
          </ScrollReveal>

          {/* Expandable Composer Panel */}
          <AnimatePresence>
            {composer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
              >
                <AuraGlow glowColor={composer === "wa" ? "160, 70%, 45%" : composer === "mail" ? "330, 75%, 55%" : "200, 85%, 55%"} glowSize={300} className="neon-card p-6 mb-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-foreground">
                      {composer === "wa" && "🟢 WhatsApp Composer"}
                      {composer === "mail" && "✉️ Email Composer"}
                      {composer === "sms" && "💬 SMS Composer"}
                    </h3>
                    <button onClick={() => setComposer(null)} className="neon-card px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Your Name (optional)</label>
                      <input
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. John"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-muted-foreground mb-2 block">
                        {composer === "wa" ? "WhatsApp Message" : composer === "mail" ? "Email Message" : "SMS Text"}
                      </label>
                      <textarea
                        value={composer === "wa" ? waMsg : composer === "mail" ? mailMsg : smsMsg}
                        onChange={(e) => {
                          if (composer === "wa") setWaMsg(e.target.value);
                          else if (composer === "mail") setMailMsg(e.target.value);
                          else setSmsMsg(e.target.value);
                        }}
                        className={`${inputClass} resize-none min-h-[120px]`}
                        placeholder="Write your message..."
                      />
                    </div>

                    <div className="md:col-span-2 flex flex-wrap gap-3">
                      <button
                        onClick={composer === "wa" ? openWhatsApp : composer === "mail" ? openEmail : openSMS}
                        className="px-6 py-3 rounded-2xl font-bold text-sm text-primary-foreground transition-all hover:scale-[1.02] animate-pulse-glow"
                        style={{
                          background: composer === "wa"
                            ? "linear-gradient(135deg, hsl(var(--neon-emerald)), hsl(var(--neon-cyan)))"
                            : composer === "mail"
                              ? "linear-gradient(135deg, hsl(var(--neon-pink)), hsl(var(--accent)))"
                              : "linear-gradient(135deg, hsl(var(--neon-sky)), hsl(var(--neon-cyan)))",
                        }}
                      >
                        <Send className="w-4 h-4 inline mr-2" />
                        Send {composer === "wa" ? "WhatsApp" : composer === "mail" ? "Email" : "SMS"}
                      </button>
                      <button
                        onClick={copyContact}
                        className="inline-flex items-center gap-2 px-5 py-3 neon-card text-sm hover:border-primary/40 transition-all"
                      >
                        <Copy className="w-4 h-4" /> Copy Contact
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {copied && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="text-sm text-primary mt-4"
                      >
                        ✅ Copied!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </AuraGlow>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;