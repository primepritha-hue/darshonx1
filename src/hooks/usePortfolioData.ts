import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type SiteSettings = {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  github_url: string;
  linkedin_url: string;
  brand_name: string;
  hero_tagline: string;
  contact_intro: string;
  footer_text: string;
  about_heading: string;
  about_features: { title: string; desc: string }[];
  ai_prompt: string;
  general_chat_daily_limit: number;
  chatbot_name: string;
  chatbot_api_provider: string;
};

export type Skill = {
  id: string;
  name: string;
  level: number;
  sort_order: number;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github_url: string;
  live_url: string;
  sort_order: number;
};

export const useSiteSettings = () =>
  useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).single();
      if (error) throw error;
      return data as unknown as SiteSettings;
    },
  });

export const useSkills = () =>
  useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("sort_order");
      if (error) throw error;
      return data as Skill[];
    },
  });

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order");
      if (error) throw error;
      return data as Project[];
    },
  });
