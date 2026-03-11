import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

type SkillTag = {
  id: string;
  label: string;
  sort_order: number;
  is_active: boolean;
};

export const useSkillTags = () =>
  useQuery({
    queryKey: ["skill_tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skill_tags" as any)
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data as unknown as SkillTag[];
    },
  });

const SkillTagsSection = () => {
  const { data: tags } = useSkillTags();

  if (!tags || tags.length === 0) return null;

  return (
    <section className="relative -mt-16 pb-16 z-10">
      <div className="container mx-auto px-6">
        <ScrollReveal scale blur>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              ⚡ <span className="gradient-text">My Expertise</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal scale blur delay={0.15}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {tags.map((tag, i) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -6 }}
                className="group relative overflow-hidden rounded-xl border border-border/30 backdrop-blur-md px-5 py-5 text-center cursor-default transition-all duration-300 hover:border-primary/40"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--card) / 0.6), hsl(var(--card) / 0.3))",
                  boxShadow: "0 0 0 0 hsl(var(--primary) / 0)",
                }}
                whileHover={{
                  scale: 1.05,
                  y: -6,
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.15), 0 4px 24px hsl(var(--primary) / 0.1)",
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.08), transparent 70%)" }} />
                <span className="relative text-sm md:text-base font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {tag.label}
                </span>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SkillTagsSection;