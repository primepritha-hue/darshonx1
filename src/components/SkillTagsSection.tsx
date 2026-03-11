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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {tags.map((tag, i) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                className="neon-card px-4 py-4 text-center cursor-default"
              >
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
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