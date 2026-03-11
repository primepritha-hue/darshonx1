import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/usePortfolioData";
import ScrollReveal from "@/components/ScrollReveal";
import AuraGlow from "@/components/AuraGlow";
import { MapPin } from "lucide-react";
import {
  SiDiscord, SiTelegram, SiSpotify, SiThreads, SiGithub, SiInstagram,
  SiYoutube, SiTwitch, SiX, SiFacebook, SiLinkedin, SiReddit, SiSteam, SiTiktok
} from "react-icons/si";
import { HiGlobeAlt, HiLink, HiMusicalNote, HiEnvelope } from "react-icons/hi2";

type SocialLink = {
  id: string;
  name: string;
  url: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  discord: SiDiscord, telegram: SiTelegram, spotify: SiSpotify, threads: SiThreads,
  github: SiGithub, instagram: SiInstagram, youtube: SiYoutube, twitch: SiTwitch,
  x: SiX, twitter: SiX, facebook: SiFacebook, linkedin: SiLinkedin, reddit: SiReddit,
  steam: SiSteam, tiktok: SiTiktok, globe: HiGlobeAlt, link: HiLink, music: HiMusicalNote,
  send: SiTelegram, mail: HiEnvelope,
};

const useSocialLinks = () =>
  useQuery({
    queryKey: ["social_links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data as SocialLink[];
    },
  });

const ProfileSection = () => {
  const { data: settings } = useSiteSettings();
  const { data: socialLinks } = useSocialLinks();

  const s = settings as any;
  const profileImageUrl = s?.profile_image_url;
  const displayName = s?.name || "Username";
  const username = s?.discord_username;
  const avatarUrl = profileImageUrl || s?.discord_avatar_url;
  const badges = s?.discord_badges || [];
  const status = s?.discord_status;

  return (
    <section id="profile" className="relative py-16">
      <ScrollReveal scale blur>
        <div className="section-divider max-w-xl mx-auto mb-16" />
      </ScrollReveal>

      <div className="container mx-auto px-6">
        <ScrollReveal scale blur>
          <div className="text-center mb-12">
            <p className="text-primary font-mono text-xs mb-3 tracking-[0.2em] uppercase">05 — Connect</p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Find <span className="gradient-text">Me</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="max-w-lg mx-auto">
          <ScrollReveal scale blur delay={0.1}>
            <AuraGlow glowColor="330, 75%, 55%" className="neon-card overflow-hidden mb-8">
              <div
                className="h-28 relative"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--neon-pink) / 0.6), hsl(var(--primary) / 0.4), hsl(var(--neon-gold) / 0.3))",
                }}
              />

              <div className="px-5 pb-5">
                <div className="relative -mt-12 mb-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 object-cover"
                      style={{ borderColor: "hsl(var(--card))" }}
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-black gradient-text"
                      style={{ borderColor: "hsl(var(--card))", background: "hsl(var(--muted))" }}
                    >
                      {displayName?.[0] || "?"}
                    </div>
                  )}
                  <div
                    className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-[3px]"
                    style={{ borderColor: "hsl(var(--card))", background: "hsl(var(--neon-emerald))" }}
                  />
                </div>

                <h3 className="text-lg font-bold text-foreground">{displayName}</h3>
                {username && <p className="text-sm text-muted-foreground font-mono">@{username}</p>}

                {status && (
                  <div className="mt-2 text-sm text-muted-foreground rounded-xl px-3 py-2" style={{ background: "hsl(var(--muted) / 0.3)" }}>
                    {status}
                  </div>
                )}

                {settings?.location && (
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="uppercase tracking-wider">{settings.location}</span>
                  </div>
                )}

                {badges.length > 0 && (
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {badges.map((badge: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded-full font-medium tag-glow text-primary"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </AuraGlow>
          </ScrollReveal>

          {socialLinks && socialLinks.length > 0 && (
            <ScrollReveal scale blur delay={0.2}>
              <div className="flex flex-wrap justify-center gap-4">
                {socialLinks.map((link) => {
                  const IconComponent = iconMap[link.icon.toLowerCase()] || HiLink;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-14 h-14 rounded-2xl neon-card flex items-center justify-center text-muted-foreground hover:text-primary hover:box-glow-strong transition-all duration-500"
                      title={link.name}
                    >
                      <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {link.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;