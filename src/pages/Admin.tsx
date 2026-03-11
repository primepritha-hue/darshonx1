import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import StarField from "@/components/StarField";
import { Terminal, LogOut, Settings, Code2, FolderOpen, Save, Plus, Trash2, ArrowLeft, Layout, Wrench, Upload, Download, Eye, EyeOff, Link, User } from "lucide-react";
import { toast } from "sonner";

type AboutFeature = { title: string; desc: string };

type SiteSettings = {
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
  about_features: AboutFeature[];
  ai_prompt: string;
  general_chat_daily_limit: number;
  chatbot_name: string;
  chatbot_api_provider: string;
  discord_username: string;
  discord_avatar_url: string;
  discord_status: string;
  discord_badges: string[];
  show_discord_profile: boolean;
};

type SocialLink = {
  id: string;
  name: string;
  url: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

type SkillTag = {
  id: string;
  label: string;
  sort_order: number;
  is_active: boolean;
};

type Skill = {
  id: string;
  name: string;
  level: number;
  sort_order: number;
};

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github_url: string;
  live_url: string;
  sort_order: number;
};

type Tool = {
  id: string;
  name: string;
  description: string;
  type: "builtin" | "download";
  slug: string | null;
  icon: string;
  file_url: string | null;
  file_name: string | null;
  is_active: boolean;
  allow_download: boolean;
  sort_order: number;
};

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "skills" | "projects" | "content" | "tools" | "social">("settings");

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [uploadingToolId, setUploadingToolId] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = `${window.location.origin}/auth`;
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      toast.error("You don't have admin access");
      window.location.href = window.location.origin;
      return;
    }

    setIsAdmin(true);
    await loadData();
    setLoading(false);
  };

  const loadData = async () => {
    const [settingsRes, skillsRes, projectsRes, toolsRes, socialRes] = await Promise.all([
      supabase.from("site_settings").select("*").limit(1).single(),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("tools").select("*").order("sort_order"),
      supabase.from("social_links").select("*").order("sort_order"),
    ]);

    if (settingsRes.data) setSettings(settingsRes.data as unknown as SiteSettings);
    if (skillsRes.data) setSkills(skillsRes.data as Skill[]);
    if (projectsRes.data) setProjects(projectsRes.data as Project[]);
    if (toolsRes.data) setTools(toolsRes.data as unknown as Tool[]);
    if (socialRes.data) setSocialLinks(socialRes.data as SocialLink[]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = window.location.origin;
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        name: settings.name,
        title: settings.title,
        bio: settings.bio,
        email: settings.email,
        phone: settings.phone,
        location: settings.location,
        github_url: settings.github_url,
        linkedin_url: settings.linkedin_url,
        brand_name: settings.brand_name,
        hero_tagline: settings.hero_tagline,
        contact_intro: settings.contact_intro,
        footer_text: settings.footer_text,
        about_heading: settings.about_heading,
        about_features: JSON.parse(JSON.stringify(settings.about_features)),
        ai_prompt: settings.ai_prompt,
        general_chat_daily_limit: settings.general_chat_daily_limit,
        chatbot_name: settings.chatbot_name,
        chatbot_api_provider: settings.chatbot_api_provider,
        discord_username: settings.discord_username,
        discord_avatar_url: settings.discord_avatar_url,
        discord_status: settings.discord_status,
        discord_badges: settings.discord_badges || [],
        show_discord_profile: settings.show_discord_profile,
      } as any)
      .eq("id", settings.id);

    if (error) toast.error(error.message);
    else toast.success("Settings saved!");
    setSaving(false);
  };

  const addSkill = async () => {
    const { data, error } = await supabase
      .from("skills")
      .insert({ name: "New Skill", level: 50, sort_order: skills.length })
      .select()
      .single();
    if (error) toast.error(error.message);
    else if (data) setSkills([...skills, data as Skill]);
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    setSkills(skills.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const saveSkill = async (skill: Skill) => {
    setSaving(true);
    const { error } = await supabase
      .from("skills")
      .update({ name: skill.name, level: skill.level, sort_order: skill.sort_order })
      .eq("id", skill.id);
    if (error) toast.error(error.message);
    else toast.success("Skill saved!");
    setSaving(false);
  };

  const deleteSkill = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setSkills(skills.filter((s) => s.id !== id));
  };

  const addProject = async () => {
    const { data, error } = await supabase
      .from("projects")
      .insert({ title: "New Project", description: "", tags: [], github_url: "#", live_url: "#", sort_order: projects.length })
      .select()
      .single();
    if (error) toast.error(error.message);
    else if (data) setProjects([...projects, data as Project]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const saveProject = async (project: Project) => {
    setSaving(true);
    const { error } = await supabase
      .from("projects")
      .update({
        title: project.title,
        description: project.description,
        tags: project.tags,
        github_url: project.github_url,
        live_url: project.live_url,
        sort_order: project.sort_order,
      })
      .eq("id", project.id);
    if (error) toast.error(error.message);
    else toast.success("Project saved!");
    setSaving(false);
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setProjects(projects.filter((p) => p.id !== id));
  };

  // About features helpers
  const updateFeature = (index: number, updates: Partial<AboutFeature>) => {
    if (!settings) return;
    const features = [...settings.about_features];
    features[index] = { ...features[index], ...updates };
    setSettings({ ...settings, about_features: features });
  };

  const addFeature = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      about_features: [...settings.about_features, { title: "New Feature", desc: "Description" }],
    });
  };

  const removeFeature = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      about_features: settings.about_features.filter((_, i) => i !== index),
    });
  };

  // ── Tools CRUD ──
  const addTool = async () => {
    const { data, error } = await supabase
      .from("tools")
      .insert({ name: "New Tool", description: "Tool description", type: "download", sort_order: tools.length, is_active: false })
      .select()
      .single();
    if (error) toast.error(error.message);
    else if (data) setTools([...tools, data as unknown as Tool]);
  };

  const updateTool = (id: string, updates: Partial<Tool>) => {
    setTools(tools.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const saveTool = async (tool: Tool) => {
    setSaving(true);
    const { error } = await supabase
      .from("tools")
      .update({
        name: tool.name,
        description: tool.description,
        is_active: tool.is_active,
        allow_download: tool.allow_download,
        sort_order: tool.sort_order,
        file_url: tool.file_url,
        file_name: tool.file_name,
      })
      .eq("id", tool.id);
    if (error) toast.error(error.message);
    else toast.success("Tool saved!");
    setSaving(false);
  };

  const deleteTool = async (tool: Tool) => {
    if (tool.type === "builtin") { toast.error("Built-in tools can't be deleted"); return; }
    if (tool.file_url) {
      const path = tool.file_url.split("/tool-files/")[1];
      if (path) await supabase.storage.from("tool-files").remove([decodeURIComponent(path)]);
    }
    const { error } = await supabase.from("tools").delete().eq("id", tool.id);
    if (error) toast.error(error.message);
    else setTools(tools.filter((t) => t.id !== tool.id));
  };

  const uploadToolFile = async (toolId: string, file: File) => {
    setUploadingToolId(toolId);
    const filePath = `${toolId}/${file.name}`;
    const { error: uploadError } = await supabase.storage.from("tool-files").upload(filePath, file, { upsert: true });
    if (uploadError) { toast.error(uploadError.message); setUploadingToolId(null); return; }
    const { data: urlData } = supabase.storage.from("tool-files").getPublicUrl(filePath);
    const fileUrl = urlData.publicUrl;
    const { error } = await supabase.from("tools").update({ file_url: fileUrl, file_name: file.name }).eq("id", toolId);
    if (error) toast.error(error.message);
    else {
      setTools(tools.map((t) => (t.id === toolId ? { ...t, file_url: fileUrl, file_name: file.name } : t)));
      toast.success("File uploaded!");
    }
    setUploadingToolId(null);
  };

  // ── Social Links CRUD ──
  const addSocialLink = async () => {
    const { data, error } = await supabase
      .from("social_links")
      .insert({ name: "New Link", url: "https://", icon: "link", sort_order: socialLinks.length })
      .select()
      .single();
    if (error) toast.error(error.message);
    else if (data) setSocialLinks([...socialLinks, data as SocialLink]);
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setSocialLinks(socialLinks.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const saveSocialLink = async (link: SocialLink) => {
    setSaving(true);
    const { error } = await supabase
      .from("social_links")
      .update({ name: link.name, url: link.url, icon: link.icon, sort_order: link.sort_order, is_active: link.is_active })
      .eq("id", link.id);
    if (error) toast.error(error.message);
    else toast.success("Link saved!");
    setSaving(false);
  };

  const deleteSocialLink = async (id: string) => {
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setSocialLinks(socialLinks.filter((l) => l.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <StarField />
        <div className="relative z-10 text-primary animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const inputClass = "w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all";
  const inputSmClass = "w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all";

  const tabs = [
    { key: "settings" as const, label: "Site Info", icon: Settings },
    { key: "content" as const, label: "Content", icon: Layout },
    { key: "skills" as const, label: "Skills", icon: Code2 },
    { key: "projects" as const, label: "Projects", icon: FolderOpen },
    { key: "tools" as const, label: "Tools", icon: Wrench },
    { key: "social" as const, label: "Social & Profile", icon: Link },
  ];

  return (
    <div className="relative min-h-screen">
      <StarField />
      <div className="relative z-10">
        {/* Header */}
        <header className="glass border-b border-border/30 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                <span className="font-bold gradient-text">Admin Panel</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === key
                    ? "bg-primary text-primary-foreground"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Settings Tab */}
            {activeTab === "settings" && settings && (
              <div className="glass rounded-2xl p-6 max-w-2xl space-y-5">
                <h3 className="text-xl font-bold text-foreground mb-4">Site Information</h3>
                {/* Profile Picture Upload */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    {(settings as any).profile_image_url ? (
                      <img src={(settings as any).profile_image_url} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-border/50" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-muted/50 border-2 border-border/50 flex items-center justify-center">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border/50 hover:border-primary/40 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{uploadingProfilePic ? "Uploading..." : "Upload Photo"}</span>
                        <input type="file" accept="image/*" className="hidden" disabled={uploadingProfilePic} onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file || !settings) return;
                          setUploadingProfilePic(true);
                          const ext = file.name.split('.').pop();
                          const filePath = `profile.${ext}`;
                          const { error: uploadError } = await supabase.storage.from("profile-images").upload(filePath, file, { upsert: true });
                          if (uploadError) { toast.error(uploadError.message); setUploadingProfilePic(false); return; }
                          const { data: urlData } = supabase.storage.from("profile-images").getPublicUrl(filePath);
                          const profileUrl = urlData.publicUrl + '?t=' + Date.now();
                          await supabase.from("site_settings").update({ profile_image_url: profileUrl } as any).eq("id", settings.id);
                          setSettings({ ...settings, profile_image_url: profileUrl } as any);
                          toast.success("Profile picture uploaded!");
                          setUploadingProfilePic(false);
                        }} />
                      </label>
                      {(settings as any).profile_image_url && (
                        <button onClick={async () => {
                          await supabase.from("site_settings").update({ profile_image_url: null } as any).eq("id", settings.id);
                          setSettings({ ...settings, profile_image_url: null } as any);
                          toast.success("Profile picture removed");
                        }} className="text-xs text-destructive hover:underline">Remove</button>
                      )}
                    </div>
                  </div>
                </div>

                {(["name", "title", "bio", "email", "phone", "location", "github_url", "linkedin_url"] as const).map((field) => (
                  <div key={field}>
                    <label className="text-sm text-muted-foreground capitalize mb-1 block">
                      {field.replace(/_/g, " ")}
                    </label>
                    {field === "bio" ? (
                      <textarea
                        value={settings[field] || ""}
                        onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
                        rows={4}
                        className={`${inputClass} resize-none`}
                      />
                    ) : (
                      <input
                        value={settings[field] || ""}
                        onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
                        className={inputClass}
                      />
                    )}
                  </div>
                ))}
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === "content" && settings && (
              <div className="max-w-2xl space-y-6">
                <div className="glass rounded-2xl p-6 space-y-5">
                  <h3 className="text-xl font-bold text-foreground">Branding & Text</h3>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Brand Name</label>
                    <input value={settings.brand_name || ""} onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Hero Tagline</label>
                    <input value={settings.hero_tagline || ""} onChange={(e) => setSettings({ ...settings, hero_tagline: e.target.value })} className={inputClass} placeholder="// developer.init()" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">About Heading</label>
                    <input value={settings.about_heading || ""} onChange={(e) => setSettings({ ...settings, about_heading: e.target.value })} className={inputClass} placeholder="Who Am I?" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Contact Intro</label>
                    <textarea value={settings.contact_intro || ""} onChange={(e) => setSettings({ ...settings, contact_intro: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Footer Text</label>
                    <input value={settings.footer_text || ""} onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })} className={inputClass} />
                  </div>
                </div>

                {/* About Features */}
                <div className="glass rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">About Features</h3>
                    <button onClick={addFeature} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                  {(settings.about_features || []).map((feature, i) => (
                    <div key={i} className="bg-muted/30 rounded-xl p-4 space-y-3">
                      <input value={feature.title} onChange={(e) => updateFeature(i, { title: e.target.value })} placeholder="Feature title" className={inputSmClass} />
                      <input value={feature.desc} onChange={(e) => updateFeature(i, { desc: e.target.value })} placeholder="Feature description" className={inputSmClass} />
                      <div className="flex justify-end">
                        <button onClick={() => removeFeature(i)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chatbot Settings */}
                <div className="glass rounded-2xl p-6 space-y-4">
                  <h3 className="text-xl font-bold text-foreground">AI Chatbot Settings</h3>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Bot এর নাম</label>
                    <input
                      value={settings.chatbot_name || ""}
                      onChange={(e) => setSettings({ ...settings, chatbot_name: e.target.value })}
                      className={inputClass}
                      placeholder="Portfolio AI"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Visitor যখন bot এর নাম জিজ্ঞেস করবে, এই নামটি বলবে।</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">API Provider</label>
                    <select
                      value={settings.chatbot_api_provider || "lovable"}
                      onChange={(e) => setSettings({ ...settings, chatbot_api_provider: e.target.value })}
                      className={inputClass}
                    >
                      <option value="lovable">Lovable AI (Gemini)</option>
                      <option value="longcat">Longcat.chat</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">Portfolio mode এ কোন AI API ব্যবহার হবে তা নির্বাচন করুন।</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">AI Prompt</label>
                    <textarea
                      value={settings.ai_prompt || ""}
                      onChange={(e) => setSettings({ ...settings, ai_prompt: e.target.value })}
                      rows={6}
                      className={`${inputClass} resize-none font-mono text-xs`}
                      placeholder="You are a helpful portfolio AI assistant..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">Portfolio data স্বয়ংক্রিয়ভাবে যোগ হবে। শুধু behavior/tone instructions দিন।</p>
                  </div>
                </div>

                {/* General Chat Limit */}
                <div className="glass rounded-2xl p-6 space-y-4">
                  <h3 className="text-xl font-bold text-foreground">General Chat Daily Limit</h3>
                  <p className="text-xs text-muted-foreground">প্রতিটি visitor প্রতিদিন কতটি General mode মেসেজ পাঠাতে পারবে সেটি নির্ধারণ করুন।</p>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={settings.general_chat_daily_limit ?? 10}
                    onChange={(e) => setSettings({ ...settings, general_chat_daily_limit: parseInt(e.target.value) || 10 })}
                    className={`${inputClass} w-32`}
                  />
                  <p className="text-xs text-muted-foreground">বর্তমান সীমা: <span className="text-primary font-semibold">{settings.general_chat_daily_limit ?? 10}</span> মেসেজ/দিন/visitor</p>
                </div>

                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save All Content"}
                </button>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === "skills" && (
              <div className="max-w-2xl space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">Skills</h3>
                  <button
                    onClick={addSkill}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                </div>
                {skills.map((skill) => (
                  <div key={skill.id} className="glass rounded-xl p-4 space-y-3">
                    <div className="flex gap-3">
                      <input
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                        placeholder="Skill name"
                        className={`flex-1 ${inputSmClass}`}
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, { level: parseInt(e.target.value) || 0 })}
                        className={`w-20 ${inputSmClass}`}
                      />
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${skill.level}%`,
                          background: "linear-gradient(90deg, hsl(160, 70%, 45%), hsl(40, 90%, 55%))",
                        }}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => saveSkill(skill)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                      >
                        <Save className="w-3 h-3" />
                        Save
                      </button>
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div className="max-w-2xl space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">Projects</h3>
                  <button
                    onClick={addProject}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>
                {projects.map((project) => (
                  <div key={project.id} className="glass rounded-xl p-5 space-y-4">
                    <input
                      value={project.title}
                      onChange={(e) => updateProject(project.id, { title: e.target.value })}
                      placeholder="Project title"
                      className={`${inputSmClass} font-medium`}
                    />
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, { description: e.target.value })}
                      placeholder="Description"
                      rows={3}
                      className={`${inputSmClass} resize-none`}
                    />
                    <input
                      value={project.tags.join(", ")}
                      onChange={(e) => updateProject(project.id, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                      placeholder="Tags (comma separated)"
                      className={inputSmClass}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={project.github_url}
                        onChange={(e) => updateProject(project.id, { github_url: e.target.value })}
                        placeholder="GitHub URL"
                        className={inputSmClass}
                      />
                      <input
                        value={project.live_url}
                        onChange={(e) => updateProject(project.id, { live_url: e.target.value })}
                        placeholder="Live URL"
                        className={inputSmClass}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => saveProject(project)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                      >
                        <Save className="w-3 h-3" />
                        Save
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tools Tab */}
            {activeTab === "tools" && (
              <div className="max-w-2xl space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">Tools Management</h3>
                  <button
                    onClick={addTool}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                    Add Download Tool
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Built-in tools শুধু on/off করা যাবে। নতুন downloadable tool যোগ করে file upload করুন।</p>

                {tools.map((tool) => (
                  <div key={tool.id} className="glass rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          tool.type === "builtin" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                        }`}>
                          {tool.type === "builtin" ? "Built-in" : "Download"}
                        </span>
                        <span className="text-sm font-medium text-foreground">{tool.name}</span>
                      </div>
                      <button
                        onClick={() => { updateTool(tool.id, { is_active: !tool.is_active }); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          tool.is_active ? "bg-green-500/10 text-green-400" : "bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        {tool.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {tool.is_active ? "Active" : "Hidden"}
                      </button>
                    </div>

                    <input value={tool.name} onChange={(e) => updateTool(tool.id, { name: e.target.value })} placeholder="Tool name" className={inputSmClass} />
                    <input value={tool.description} onChange={(e) => updateTool(tool.id, { description: e.target.value })} placeholder="Description" className={inputSmClass} />

                    {tool.type === "download" && (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <input type="checkbox" checked={tool.allow_download} onChange={(e) => updateTool(tool.id, { allow_download: e.target.checked })} className="accent-primary" />
                          Allow user download
                        </label>
                        {tool.file_name && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 rounded-lg px-3 py-2">
                            <Download className="w-3 h-3" />
                            <span>{tool.file_name}</span>
                          </div>
                        )}
                        <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border/50 hover:border-primary/40 transition-colors cursor-pointer">
                          <Upload className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{uploadingToolId === tool.id ? "Uploading..." : "Upload file"}</span>
                          <input type="file" className="hidden" disabled={uploadingToolId === tool.id} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadToolFile(tool.id, f); }} />
                        </label>
                      </div>
                    )}

                    <div className="flex gap-2 justify-end">
                      <button onClick={() => saveTool(tool)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                        <Save className="w-3 h-3" /> Save
                      </button>
                      {tool.type !== "builtin" && (
                        <button onClick={() => deleteTool(tool)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Social & Profile Tab */}
            {activeTab === "social" && (
              <div className="max-w-2xl space-y-6">
                {/* Discord Profile Settings */}
                {settings && (
                  <div className="glass rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-foreground">Discord Profile Card</h3>
                      <button
                        onClick={() => setSettings({ ...settings, show_discord_profile: !settings.show_discord_profile })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          settings.show_discord_profile ? "bg-green-500/10 text-green-400" : "bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        {settings.show_discord_profile ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {settings.show_discord_profile ? "Visible" : "Hidden"}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Homepage এ Discord-style profile card দেখাবে।</p>

                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Username</label>
                      <input value={settings.discord_username || ""} onChange={(e) => setSettings({ ...settings, discord_username: e.target.value })} className={inputClass} placeholder="darshon27" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Avatar URL</label>
                      <input value={settings.discord_avatar_url || ""} onChange={(e) => setSettings({ ...settings, discord_avatar_url: e.target.value })} className={inputClass} placeholder="https://..." />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Status</label>
                      <input value={settings.discord_status || ""} onChange={(e) => setSettings({ ...settings, discord_status: e.target.value })} className={inputClass} placeholder="Love ✕ Chut() ✅" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Badges (comma separated)</label>
                      <input
                        value={(settings.discord_badges || []).join(", ")}
                        onChange={(e) => setSettings({ ...settings, discord_badges: e.target.value.split(",").map((b) => b.trim()).filter(Boolean) })}
                        className={inputClass}
                        placeholder="🔥 বাবা, 🧿, ✅"
                      />
                    </div>

                    <button
                      onClick={saveSettings}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                )}

                {/* Social Links */}
                <div className="glass rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">Social Links</h3>
                    <button
                      onClick={addSocialLink}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-4 h-4" />
                      Add Link
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Homepage এ social link icons দেখাবে। Icon names: discord, telegram, spotify, threads, github, instagram, youtube, twitch, x, facebook, linkedin, reddit, steam, tiktok, globe, link, music, mail</p>

                  {socialLinks.map((link) => (
                    <div key={link.id} className="bg-muted/30 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{link.name}</span>
                        <button
                          onClick={() => { updateSocialLink(link.id, { is_active: !link.is_active }); }}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                            link.is_active ? "bg-green-500/10 text-green-400" : "bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          {link.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input value={link.name} onChange={(e) => updateSocialLink(link.id, { name: e.target.value })} placeholder="Name" className={inputSmClass} />
                        <input value={link.icon} onChange={(e) => updateSocialLink(link.id, { icon: e.target.value })} placeholder="Icon" className={inputSmClass} />
                        <input type="number" value={link.sort_order} onChange={(e) => updateSocialLink(link.id, { sort_order: parseInt(e.target.value) || 0 })} placeholder="Order" className={inputSmClass} />
                      </div>
                      <input value={link.url} onChange={(e) => updateSocialLink(link.id, { url: e.target.value })} placeholder="URL" className={inputSmClass} />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => saveSocialLink(link)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                          <Save className="w-3 h-3" /> Save
                        </button>
                        <button onClick={() => deleteSocialLink(link.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
