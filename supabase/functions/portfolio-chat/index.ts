import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch portfolio data for context
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [settingsRes, skillsRes, projectsRes] = await Promise.all([
      supabase.from("site_settings").select("*").limit(1).single(),
      supabase.from("skills").select("name, level").order("sort_order"),
      supabase.from("projects").select("title, description, tags, github_url, live_url").order("sort_order"),
    ]);

    const settings = settingsRes.data;
    const skills = skillsRes.data || [];
    const projects = projectsRes.data || [];

    const customPrompt = settings?.ai_prompt || "You are a helpful portfolio AI assistant. Answer questions about the developer's skills, projects, and experience. Be concise and friendly.";

    const portfolioContext = `
${customPrompt}

You are ${settings?.name || "a developer"}'s portfolio assistant.

About ${settings?.name || "the developer"}:
- Title: ${settings?.title || "Full-Stack Developer"}
- Bio: ${settings?.bio || "A passionate developer"}
- Location: ${settings?.location || "Not specified"}
- Email: ${settings?.email || "Not specified"}
- GitHub: ${settings?.github_url || "Not specified"}
- LinkedIn: ${settings?.linkedin_url || "Not specified"}

Skills: ${skills.map((s: any) => `${s.name} (${s.level}%)`).join(", ")}

Projects:
${projects.map((p: any) => `- ${p.title}: ${p.description || "No description"} [Tags: ${(p.tags || []).join(", ")}]${p.github_url ? ` GitHub: ${p.github_url}` : ""}${p.live_url ? ` Live: ${p.live_url}` : ""}`).join("\n")}

Additional rules:
- Respond in the same language the user writes in.
- If asked something unrelated to the portfolio, politely redirect.
`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: portfolioContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
