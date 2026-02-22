import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import StarField from "@/components/StarField";
import { Terminal, LogOut, Settings, Code2, FolderOpen, Save, Plus, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

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

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "skills" | "projects">("settings");

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      toast.error("You don't have admin access");
      navigate("/");
      return;
    }

    setIsAdmin(true);
    await loadData();
    setLoading(false);
  };

  const loadData = async () => {
    const [settingsRes, skillsRes, projectsRes] = await Promise.all([
      supabase.from("site_settings").select("*").limit(1).single(),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("projects").select("*").order("sort_order"),
    ]);

    if (settingsRes.data) setSettings(settingsRes.data as SiteSettings);
    if (skillsRes.data) setSkills(skillsRes.data as Skill[]);
    if (projectsRes.data) setProjects(projectsRes.data as Project[]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
      })
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <StarField />
        <div className="relative z-10 text-primary animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const tabs = [
    { key: "settings" as const, label: "Site Settings", icon: Settings },
    { key: "skills" as const, label: "Skills", icon: Code2 },
    { key: "projects" as const, label: "Projects", icon: FolderOpen },
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
                <h3 className="text-xl font-bold text-foreground mb-4">Site Settings</h3>
                {(["name", "title", "bio", "email", "phone", "location", "github_url", "linkedin_url"] as const).map((field) => (
                  <div key={field}>
                    <label className="text-sm text-muted-foreground capitalize mb-1 block">
                      {field.replace("_", " ")}
                    </label>
                    {field === "bio" ? (
                      <textarea
                        value={settings[field] || ""}
                        onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
                        rows={4}
                        className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                      />
                    ) : (
                      <input
                        value={settings[field] || ""}
                        onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
                        className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
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
                        className="flex-1 bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all"
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, { level: parseInt(e.target.value) || 0 })}
                        className="w-20 bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${skill.level}%`,
                          background: "linear-gradient(90deg, hsl(190, 95%, 55%), hsl(260, 60%, 55%))",
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
                      className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground font-medium focus:outline-none focus:border-primary/50 transition-all"
                    />
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, { description: e.target.value })}
                      placeholder="Description"
                      rows={3}
                      className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all resize-none"
                    />
                    <input
                      value={project.tags.join(", ")}
                      onChange={(e) => updateProject(project.id, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                      placeholder="Tags (comma separated)"
                      className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={project.github_url}
                        onChange={(e) => updateProject(project.id, { github_url: e.target.value })}
                        placeholder="GitHub URL"
                        className="bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all"
                      />
                      <input
                        value={project.live_url}
                        onChange={(e) => updateProject(project.id, { live_url: e.target.value })}
                        placeholder="Live URL"
                        className="bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all"
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
