import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, QrCode, KeyRound, MapPin, Download, Copy, RefreshCw, ArrowLeft, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import StarField from "@/components/StarField";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// ─── Built-in Tool Components ───

const PdfGenerator = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const inputClass = "w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all";

  const generate = () => {
    if (!content.trim()) { toast.error("Content is required"); return; }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(title || "Untitled", 20, 25);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(content, 170);
    doc.text(lines, 20, 40);
    doc.save(`${title || "document"}.pdf`);
    toast.success("PDF downloaded!");
  };

  return (
    <div className="space-y-4">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" className={inputClass} />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter your content here..." rows={6} className={`${inputClass} resize-none`} />
      <button onClick={generate} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
        <Download className="w-4 h-4" /> Generate PDF
      </button>
    </div>
  );
};

const QrGenerator = () => {
  const [text, setText] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);
  const inputClass = "w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all";

  const download = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "qrcode.svg"; a.click();
    URL.revokeObjectURL(url);
    toast.success("QR Code downloaded!");
  };

  return (
    <div className="space-y-4">
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter URL or text..." className={inputClass} />
      {text.trim() && (
        <div className="flex flex-col items-center gap-4">
          <div ref={qrRef} className="bg-white p-4 rounded-xl">
            <QRCodeSVG value={text} size={180} />
          </div>
          <button onClick={download} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" /> Download SVG
          </button>
        </div>
      )}
    </div>
  );
};

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = () => {
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    let pw = "";
    for (let i = 0; i < length; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    setPassword(pw);
  };

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast.success("Copied to clipboard!");
  };

  const strength = password.length >= 20 ? "Strong" : password.length >= 12 ? "Good" : password.length >= 8 ? "Fair" : "Weak";
  const strengthColor = strength === "Strong" ? "text-green-400" : strength === "Good" ? "text-primary" : strength === "Fair" ? "text-yellow-400" : "text-red-400";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-muted-foreground whitespace-nowrap">Length: {length}</label>
        <input type="range" min={6} max={64} value={length} onChange={(e) => setLength(+e.target.value)} className="flex-1 accent-primary" />
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input type="checkbox" checked={includeUpper} onChange={(e) => setIncludeUpper(e.target.checked)} className="accent-primary" /> Uppercase
        </label>
        <label className="flex items-center gap-2 text-muted-foreground">
          <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="accent-primary" /> Numbers
        </label>
        <label className="flex items-center gap-2 text-muted-foreground">
          <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="accent-primary" /> Symbols
        </label>
      </div>
      <button onClick={generate} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
        <RefreshCw className="w-4 h-4" /> Generate
      </button>
      {password && (
        <div className="bg-muted/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm text-foreground break-all font-mono">{password}</code>
            <button onClick={copy} className="shrink-0 p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-primary">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs">Strength: <span className={`font-semibold ${strengthColor}`}>{strength}</span></p>
        </div>
      )}
    </div>
  );
};

const LocationTracker = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation is not supported"); return; }
    setLoading(true); setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLoading(false); },
      (err) => { setError(err.message); setLoading(false); }
    );
  };

  const copy = () => {
    if (!location) return;
    navigator.clipboard.writeText(`${location.lat}, ${location.lng}`);
    toast.success("Coordinates copied!");
  };

  return (
    <div className="space-y-4">
      <button onClick={getLocation} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
        <MapPin className="w-4 h-4" /> {loading ? "Detecting..." : "Get My Location"}
      </button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {location && (
        <div className="bg-muted/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Latitude</p>
              <p className="text-sm font-mono text-foreground">{location.lat.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Longitude</p>
              <p className="text-sm font-mono text-foreground">{location.lng.toFixed(6)}</p>
            </div>
            <button onClick={copy} className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-primary">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <a href={`https://www.google.com/maps?q=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer" className="block text-center text-xs text-primary hover:underline">
            Open in Google Maps →
          </a>
        </div>
      )}
    </div>
  );
};

// ─── Download Tool Component ───
const DownloadTool = ({ fileUrl, fileName, allowDownload }: { fileUrl: string; fileName: string; allowDownload: boolean }) => {
  if (!allowDownload) {
    return <p className="text-sm text-muted-foreground">এই tool টি শুধুমাত্র দেখার জন্য। Download বন্ধ করা আছে।</p>;
  }
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Download className="w-8 h-8 text-primary" />
      </div>
      <p className="text-sm text-muted-foreground">{fileName}</p>
      <a
        href={fileUrl}
        download={fileName}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <Download className="w-4 h-4" /> Download File
      </a>
    </div>
  );
};

// ─── Icon map for builtin tools ───
const builtinIcons: Record<string, React.ComponentType<any>> = {
  "file-text": FileText,
  "qr-code": QrCode,
  "key-round": KeyRound,
  "map-pin": MapPin,
};

const builtinComponents: Record<string, React.ComponentType> = {
  pdf: PdfGenerator,
  qr: QrGenerator,
  password: PasswordGenerator,
  location: LocationTracker,
};

// ─── Tools Page ───
type ToolData = {
  id: string;
  name: string;
  description: string;
  type: string;
  slug: string | null;
  icon: string;
  file_url: string | null;
  file_name: string | null;
  is_active: boolean;
  allow_download: boolean;
  sort_order: number;
};

const Tools = () => {
  const navigate = useNavigate();

  const { data: toolsData = [], isLoading } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tools").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data as unknown as ToolData[];
    },
  });

  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  useEffect(() => {
    if (toolsData.length > 0 && !activeToolId) {
      setActiveToolId(toolsData[0].id);
    }
  }, [toolsData, activeToolId]);

  const activeTool = toolsData.find((t) => t.id === activeToolId);

  const renderToolContent = () => {
    if (!activeTool) return null;

    if (activeTool.type === "builtin" && activeTool.slug) {
      const Component = builtinComponents[activeTool.slug];
      return Component ? <Component /> : <p className="text-muted-foreground text-sm">Tool not found.</p>;
    }

    if (activeTool.type === "download" && activeTool.file_url) {
      return <DownloadTool fileUrl={activeTool.file_url} fileName={activeTool.file_name || "file"} allowDownload={activeTool.allow_download} />;
    }

    return <p className="text-muted-foreground text-sm">No file uploaded yet.</p>;
  };

  const getIcon = (tool: ToolData) => {
    if (tool.type === "builtin" && builtinIcons[tool.icon]) {
      const Icon = builtinIcons[tool.icon];
      return <Icon className="w-4 h-4" />;
    }
    if (tool.type === "download") return <Download className="w-4 h-4" />;
    return <Wrench className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        <StarField />
        <Navbar />
        <div className="relative z-10 pt-24 flex items-center justify-center">
          <div className="text-primary animate-pulse">Loading tools...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <StarField />
      <Navbar />
      <div className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Developer Tools</h1>
            <p className="text-muted-foreground text-sm">Free online utilities to boost your productivity</p>
          </motion.div>

          {toolsData.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Wrench className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">No tools available right now.</p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-8 flex-wrap">
                {toolsData.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveToolId(tool.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeToolId === tool.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "glass text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {getIcon(tool)}
                    {tool.name}
                  </button>
                ))}
              </div>

              {activeTool && (
                <motion.div
                  key={activeTool.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-2xl p-6 md:p-8 max-w-2xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      {getIcon(activeTool)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{activeTool.name}</h2>
                      <p className="text-xs text-muted-foreground">{activeTool.description}</p>
                    </div>
                  </div>
                  {renderToolContent()}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tools;
