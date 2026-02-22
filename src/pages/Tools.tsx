import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, QrCode, KeyRound, MapPin, Download, Copy, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import StarField from "@/components/StarField";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

// ─── PDF Generator ───
const PdfGenerator = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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

  const inputClass = "w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all";

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

// ─── QR Code Generator ───
const QrGenerator = () => {
  const [text, setText] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

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

  const inputClass = "w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all";

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

// ─── Password Generator ───
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

// ─── Location Tracker ───
const LocationTracker = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation is not supported"); return; }
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
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
          <a
            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-xs text-primary hover:underline"
          >
            Open in Google Maps →
          </a>
        </div>
      )}
    </div>
  );
};

// ─── Tools Page ───
const tools = [
  { id: "pdf", label: "PDF Generator", icon: FileText, desc: "Create and download PDF documents", component: PdfGenerator },
  { id: "qr", label: "QR Code", icon: QrCode, desc: "Generate QR codes from any text or URL", component: QrGenerator },
  { id: "password", label: "Password", icon: KeyRound, desc: "Generate secure random passwords", component: PasswordGenerator },
  { id: "location", label: "Location", icon: MapPin, desc: "Find your current coordinates", component: LocationTracker },
];

const Tools = () => {
  const [activeTool, setActiveTool] = useState("pdf");
  const navigate = useNavigate();
  const ActiveComponent = tools.find((t) => t.id === activeTool)!.component;

  return (
    <div className="relative min-h-screen">
      <StarField />
      <Navbar />
      <div className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Developer Tools</h1>
            <p className="text-muted-foreground text-sm">Free online utilities to boost your productivity</p>
          </motion.div>

          {/* Tool selector */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {tools.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTool(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTool === id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Active tool */}
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-6 md:p-8 max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              {(() => {
                const tool = tools.find((t) => t.id === activeTool)!;
                const Icon = tool.icon;
                return (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{tool.label}</h2>
                      <p className="text-xs text-muted-foreground">{tool.desc}</p>
                    </div>
                  </>
                );
              })()}
            </div>
            <ActiveComponent />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
